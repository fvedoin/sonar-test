import {
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utmObj = require('utm-latlng');
import { find as findGeoTz } from 'geo-tz';
import { CreateUcDto } from './dto/create-uc.dto';
import { UpdateUcDto } from './dto/update-uc.dto';
import { UcsRepository } from './ucs.repository';
import { parse } from 'papaparse';
import { Uc } from './entities/uc.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CsvDto } from './dto/csv.dto';
import { TransformersService } from 'src/transformers/transformers.service';
import { ProcessUcsDto } from './dto/processUcs.dto';
import { ClientsService } from 'src/clients/clients.service';
import {
  QueryFindAllDto,
  QueryFindAllPaginateDto,
} from './dto/queryFindAll.dto';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { Role } from 'src/auth/models/Role';
import mongoose, { FilterQuery, ProjectionFields, Types } from 'mongoose';
import { DevicesGbService } from 'src/devices-gb/devices-gb.service';
import { CreateDevicesGbDto } from 'src/devices-gb/dto/create-devices-gb.dto';
import { NotificationService } from 'src/notification/notification.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { UsersService } from 'src/users/users.service';
import DynamicObject from 'src/common/models/dynamicObject';
import { convertPropertiesToInt } from 'src/utils/utils';
import { handleFilters } from 'src/utils/filterHandler';
import { UcdisabledHistoryService } from 'src/ucdisabled-history/ucdisabled-history.service';
import { CreateUcdisabledHistoryDto } from 'src/ucdisabled-history/dto/create-ucdisabled-history.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';
import { Application } from 'src/applications/entities/application.entity';
import { TtnService } from 'src/common/services/ttn.service';
import { AxiosResponse } from 'axios';

const fields = [
  'clientId.name',
  'transformerId.it',
  'ucCode',
  'ucNumber',
  'phases',
  'routeCode',
];

@Injectable()
export class UcsService {
  constructor(
    private readonly ucRepository: UcsRepository,
    private readonly usersService: UsersService,
    private readonly transformersService: TransformersService,
    private readonly clientsService: ClientsService,
    private readonly devicesGbService: DevicesGbService,
    private readonly ucDisabledHistoryService: UcdisabledHistoryService,
    private readonly influxBucketsService: InfluxBucketsService,
    private readonly notificationService: NotificationService,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  //Débitos técnicos:
  // - Atualizar o dashboard para receber a nova UC
  async create(createUcDto: CreateUcDto, currentUser: UserFromJwt) {
    const countDevice = createUcDto.deviceId
      ? await this.ucRepository.countByDeviceId(createUcDto.deviceId.toString())
      : 0;

    if (countDevice) {
      throw new ConflictException('O dispositivo já está em uma UC.');
    }

    if (!createUcDto.deviceId) {
      delete createUcDto.deviceId;
    }

    const location =
      createUcDto.longitude !== undefined && createUcDto.latitude !== undefined
        ? {
            type: 'Point',
            coordinates: [createUcDto.longitude, createUcDto.latitude],
          }
        : null;

    const clientId = createUcDto.clientId || currentUser.clientId;

    return await this.ucRepository.create({
      ...createUcDto,
      location,
      clientId,
      timeZone: findGeoTz(createUcDto.latitude, createUcDto.longitude)[0],
      isCutted: false,
    });
  }

  async _extractUcs(file: Express.Multer.File): Promise<any[]> {
    return parse(file.buffer.toString(), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => results.data,
    }).data;
  }

  async _convertUtmToLatLng(lat: string, long: string, fuso: string) {
    const utm = new utmObj();
    const fusoSplit = fuso.split(/([0-9]+)/);
    const coordinates = await utm.convertUtmToLatLng(
      Number(lat.replace(',', '.')),
      Number(long.replace(',', '.')),
      fusoSplit[1],
      fusoSplit[2],
    );
    return coordinates || null;
  }

  async processCSV(
    file: Express.Multer.File,
    clientId: string,
  ): Promise<ProcessUcsDto[]> {
    const csvData: CsvDto[] = await this._extractUcs(file);

    return await Promise.all(
      csvData.map(async (data) => {
        let coordinates;

        try {
          coordinates = await this._convertUtmToLatLng(
            data.COORDENADAX,
            data.COORDENADAY,
            data.FUSO,
          );
        } catch (err) {
          throw Error(
            `Error ao processar Latitude e Longitude. COORDENADAX: ${data.COORDENADAX}  COORDENADAY: ${data.COORDENADAY}`,
          );
        }

        if (!coordinates.lat) {
          throw Error(
            `Latitude incorreta: ${data.COORDENADAX}, IDUC: ${data.IDUC}`,
          );
        }

        if (!coordinates.lng) {
          throw Error(
            `Longitude incorreta: ${data.COORDENADAY}, IDUC: ${data.IDUC}`,
          );
        }

        const uc = await this.ucRepository.findOneByUcCode(data.IDUC);

        const location = coordinates
          ? {
              type: 'Point',
              coordinates: [coordinates.lng, coordinates.lat],
            }
          : null;

        let transformer;

        try {
          transformer = await this.transformersService.findByIt(data.TR);
        } catch (err) {
          throw Error(`transformer não encontrado, TR: ${data.TR}`);
        }

        return {
          operation: uc ? 'Editar' : 'Inserir',
          clientId,
          transformerId: transformer?._id.toString() || null,
          ucCode: data.IDUC,
          transformer: data.TR,
          location,
          ucNumber: data.NR_MEDIDOR_KWH,
          ucClass: data.CLASSE,
          subClass: data.SUBCLASSE,
          billingGroup: Number(data.IDGRUPOFAT),
          group: data.GRUPO,
          routeCode: Number(data.IDROTA),
          timeZone: coordinates
            ? findGeoTz(coordinates.lat, coordinates.lng)[0]
            : null,
          sequence: data.SEQUENCIA_LEIT,
          phases: data.FASE,
          circuitBreaker: Number(data.DISJUNTOR),
          microgeneration: data.MICRO_GERACAO !== 'N',
          district: data.BAIRRO,
          city: data.CIDADE,
          subGroup: data.SUBGRUPO_FAT,
        };
      }),
    );
  }

  private async findClientsIds(
    currentUser: UserFromJwt,
    query: QueryFindAllDto,
  ): Promise<string[]> {
    const { clientId } = query;

    if (
      currentUser.accessLevel === Role.SUPER_ADMIN ||
      currentUser.accessLevel === Role.SUPPORT
    ) {
      if (clientId) {
        return [clientId];
      } else {
        const clients = await this.clientsService.findWhere({
          active: true,
        });

        return clients.map((client) => client._id.toString());
      }
    } else {
      return [currentUser.clientId];
    }
  }

  private async findDevices(
    accessLevel: string,
    query: QueryFindAllDto,
    clientsIds: string[],
  ): Promise<DeviceGb[]> {
    let devices: DeviceGb[];
    const { deviceType } = query;

    if (deviceType) {
      if (accessLevel === Role.SUPER_ADMIN || accessLevel === Role.SUPPORT) {
        devices = await this.devicesGbService.findWhere({
          type: deviceType,
        });
      } else {
        devices = await this.devicesGbService.findWhere({
          clientId: { $in: clientsIds },
          type: deviceType,
        });
      }
    } else {
      if (accessLevel === Role.SUPER_ADMIN || accessLevel === Role.SUPPORT) {
        devices = await this.devicesGbService.findWhere({});
      } else {
        devices = await this.devicesGbService.findWhere({
          clientId: { $in: clientsIds },
        });
      }
    }

    return devices;
  }

  applyPaginationClientFilterByRole = ({ currentUser }) => {
    const isAdminOrSupport = [Role.SUPER_ADMIN, Role.SUPPORT].includes(
      currentUser.accessLevel,
    );

    if (isAdminOrSupport) {
      return {};
    }

    if (currentUser.accessLevel === Role.ADMIN) {
      return {
        $or: [
          {
            'clientId._id': new mongoose.Types.ObjectId(currentUser.clientId),
          },
          {
            'clientId.parentId': new mongoose.Types.ObjectId(
              currentUser.clientId,
            ),
          },
        ],
      };
    }

    return {
      'clientId._id': new mongoose.Types.ObjectId(currentUser.clientId),
    };
  };

  async findPaginated(
    currentUser: UserFromJwt,
    query: QueryFindAllPaginateDto,
  ) {
    const { clientId, searchText, skip, limit, sort, filter = [] } = query;

    const generalWhereClause: DynamicObject = {};

    const convertedSort = sort ? convertPropertiesToInt(sort) : { it: 1 };

    const data: Array<DynamicObject> = [{ $sort: convertedSort }];

    if (skip) {
      data.push({ $skip: Number(skip) });
    }

    if (limit) {
      data.push({ $limit: Number(limit) });
    }

    if (searchText) {
      generalWhereClause.$and = [
        {
          $or: [
            ...fields.map((item) => {
              return { [item]: { $regex: searchText, $options: 'i' } };
            }),
          ],
        },
      ];
    }

    const findDeviceIdIndex = (filter || []).findIndex(
      (filter) => filter['deviceId.devId'],
    );

    let deviceSituation;

    if (findDeviceIdIndex > -1) {
      deviceSituation = filter[findDeviceIdIndex]['deviceId.devId'][0];

      if (deviceSituation === 'Ativada') {
        filter[findDeviceIdIndex]['deviceId.devId'] = '^(?!ucd)';
      }

      if (deviceSituation === 'Desativada') {
        filter[findDeviceIdIndex]['deviceId.devId'] = '^ucd';
      }
    }

    const generalFilters = handleFilters(filter);

    const findDeviceIdInFilterIndex = (generalFilters || []).findIndex(
      (filter) => filter['deviceId.devId'],
    );

    if (findDeviceIdInFilterIndex > -1 && deviceSituation === 'Ativada') {
      generalFilters[findDeviceIdInFilterIndex] = {
        $or: [
          generalFilters[findDeviceIdInFilterIndex],
          {
            deviceId: null,
          },
        ],
      };
    }

    const filterByRoleAccess = this.applyPaginationClientFilterByRole({
      currentUser,
    });

    generalFilters.push(filterByRoleAccess);

    if (generalFilters.length > 0) {
      if (generalWhereClause.$and) {
        generalWhereClause.$and.push({
          $and: generalFilters,
        });
      } else {
        generalWhereClause.$and = [
          {
            $and: generalFilters,
          },
        ];
      }
    }

    return await this.ucRepository.findPaginated(generalWhereClause, data);
  }

  async findAll(currentUser: UserFromJwt, query: QueryFindAllDto) {
    let clientsIds = [];

    const { clientId, deviceType, allows, transformerId } = query;
    // Define clients according to the user

    const isAdminOrSupport =
      currentUser.accessLevel === 'admin' ||
      currentUser.accessLevel === 'support';

    const isCommercial = currentUser.accessLevel === Role.ADMIN;

    if (isAdminOrSupport) {
      if (clientId) {
        clientsIds = [new Types.ObjectId(clientId)];
      } else {
        const clients = await this.clientsService.findWhere({
          active: true,
        });
        clientsIds = clients.map((client) => client._id);
      }
    } else if (isCommercial) {
      const clients = await this.clientsService.findWhere({
        active: true,
        $or: [
          { _id: new Types.ObjectId(currentUser.clientId) },
          { parentId: new Types.ObjectId(currentUser.clientId) },
        ],
      });
      clientsIds = clients.map((client) => client._id);
    } else {
      clientsIds = [new Types.ObjectId(currentUser.clientId)];
    }

    if (deviceType || allows) {
      const deviceWhere = {};

      if (deviceType) deviceWhere['type'] = deviceType;
      if (allows) deviceWhere['allows'] = allows;

      let devices: DeviceGb[];

      if (Object.keys(deviceWhere).length) {
        devices = await this.devicesGbService.findWhere({
          ...deviceWhere,
          clientId: { $in: clientsIds },
        });
      }

      return await this.ucRepository.findPopulatedAndSortLastReceivedByPort({
        deviceId: { $in: devices.map((device) => device._id) },
      });
    }

    if (transformerId) {
      let transformerIds = [];

      if (typeof transformerId === 'object') {
        transformerIds = transformerId;
      } else {
        transformerIds.push(new Types.ObjectId(transformerId));
      }

      return await this.ucRepository.findPopulatedAndSortLastReceivedByPort({
        deviceId: { $ne: null },
        clientId: { $in: clientsIds },
        transformerId: { $in: transformerIds },
      });
    }

    return await this.ucRepository.findPopulatedAndSortLastReceivedByPort({
      clientId: { $in: clientsIds },
    });
  }

  async findById(_id: string) {
    return await this.ucRepository.findOne({ _id });
  }

  findByIdPopulate(
    id: string,
    populate: string[] = ['deviceId', 'lastReceived', 'settings'],
  ) {
    return this.ucRepository.findByIdWithPopulate({ _id: id }, populate);
  }

  findWhere(where: FilterQuery<Uc>, projection?: ProjectionFields<Uc>) {
    return this.ucRepository.findWithPopulate(where, projection);
  }

  findWhereDetails(where: FilterQuery<Uc>, projection?: ProjectionFields<Uc>) {
    return this.ucRepository.findWithOnePopulate(where, projection);
  }

  findByUcCode(ucCode: string) {
    return this.ucRepository.findOne({ ucCode });
  }

  // Débitos técnicos:
  // - Atualizar o dashboard para receber a nova UC
  // - Atualizar o redis com o dispositivo
  async update(id: string, updateUcDto: UpdateUcDto, currentUser: UserFromJwt) {
    const numberOfDevices = updateUcDto.deviceId
      ? await this.ucRepository.countByUcByDeviceId(
          updateUcDto.deviceId.toString(),
          id,
        )
      : 0;

    if (numberOfDevices) {
      throw new ConflictException('O dispositivo já está em uma UC.');
    }

    const location =
      updateUcDto.longitude !== undefined && updateUcDto.latitude !== undefined
        ? {
            type: 'Point',
            coordinates: [updateUcDto.longitude, updateUcDto.latitude],
          }
        : null;

    const clientId = updateUcDto.clientId || new Types.ObjectId(currentUser.id);

    const uc = await this.ucRepository.findOne({ _id: id });

    const updated = await this.ucRepository.findOneAndUpdate(
      { _id: id },
      {
        ...updateUcDto,
        location,
        clientId,
        timeZone: findGeoTz(updateUcDto.latitude, updateUcDto.longitude)[0],
      },
    );

    if (uc.deviceId) {
      const device = await this.devicesGbService.findOne(uc.deviceId as string);
      await this.cacheService.del(`remota:${device.devId}`);
    }

    if (updated.deviceId) {
      const device = await this.devicesGbService.findOne(
        updated.deviceId as string,
      );
      await this.cacheService.del(`remota:${device.devId}`);
    }

    return updated;
  }

  async changeDevice({
    id,
    deviceId,
    deleteData = false,
    user,
  }: {
    id: string;
    deviceId: string;
    deleteData: boolean;
    user: UserFromJwt;
  }) {
    const uc = await this.ucRepository.findWithOnePopulate({
      _id: id,
    });

    if (uc.deviceId._id == deviceId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Não foi possível alterar. Dispositivos precisam ser diferentes.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newDevice = await this.devicesGbService.findByIdPopulate(deviceId, [
      'bucketId',
      'applicationId',
    ]);

    const application = newDevice.applicationId as Application;

    let newDevEui: AxiosResponse<any, any>;
    try {
      newDevEui =
        newDevice.type === 'LoRa'
          ? await TtnService.get(
              `applications/${application.appId}/devices/${newDevice.devId}`,
            )
          : null;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Ocorreu um erro durante a troca de dispositivos. Entre em contato com o suporte',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }

    const oldDevice = await this.devicesGbService.findByIdPopulate(
      uc.deviceId._id,
      ['bucketId', 'applicationId'],
    );

    if (!newDevice) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Não foi possível alterar. Novo dispositivo não foi encontrado.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!oldDevice) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Não foi possível alterar. Antigo dispositivo não foi encontrado.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try {
      await this.devicesGbService.migrateDevice({
        oldDevice,
        newDevice,
        hardwareSerial:
          newDevEui && newDevEui.data ? newDevEui.data.ids.dev_eui : null,
        deleteOldData: deleteData,
        uc,
        transactionSession,
      });
    } catch (err) {
      const oldClientId = oldDevice.clientId.toString();

      const message = uc
        ? `Ocorreu um erro durante a troca de dispositivos da UC ${uc.ucCode}. Entre em contato com o suporte`
        : `Ocorreu um erro durante a troca de dispositivos ${oldDevice.devId} e ${newDevice.devId}. Entre em contato com o suporte`;

      await this.notificationService.create({
        clientId: oldClientId,
        title: `Erro ao trocar dispositivos!`,
        message,
        createdAt: new Date(),
      });

      await transactionSession.abortTransaction();
      await transactionSession.endSession();

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro ao migrar UC',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }

    const message = `A troca de dispositivos da UC ${uc.ucCode} foi finalizada com sucesso!`;

    await this.notificationService.create({
      clientId: oldDevice.clientId.toString(),
      title: `Troca de dispositivos bem sucedida!`,
      message,
      createdAt: new Date(),
    });

    await transactionSession.commitTransaction();
    transactionSession.endSession();
  }

  async disable(id: string, deleteData = false, user: UserFromJwt) {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    const uc = await this.ucRepository.findWithOnePopulate({
      _id: id,
    });

    const oldDevice = await this.devicesGbService.findByIdPopulate(
      uc.deviceId._id,
      ['bucketId', 'applicationId'],
    );

    if (!oldDevice || !oldDevice.clientId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível desabilitar. Dispositivo não encontrado.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldClientId = oldDevice.clientId.toString();

    const createUcDisabledHistoryDto: CreateUcdisabledHistoryDto = {
      clientId: new Types.ObjectId(uc.clientId?.id),
      ucId: new Types.ObjectId(uc.id),
      deviceId: new Types.ObjectId(uc.deviceId._id),
      userId: new Types.ObjectId(user.id),
      dataDeleted: deleteData,
      date: new Date(),
    };

    try {
      if (!uc.deviceId) {
        const bucket = await this.influxBucketsService.findOneWhere({
          clientId: uc.clientId,
        });

        if (!bucket) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Bucket não encontrado',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const bucketId = bucket._id.toString();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const device: CreateDevicesGbDto = {
          clientId: uc.clientId,
          devId: `ucd-${uc.ucCode}`,
          name: `UC ${uc.ucCode} desativada`,
          allows: [],
          bucketId,
        };
        await this.devicesGbService
          .create(device, transactionSession)
          .then(async (response) => {
            await this.ucRepository.findByIdAndUpdate(uc._id, {
              deviceId: response._id,
            });
          })
          .catch((error) => {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                message: 'Erro ao criar device',
              },
              HttpStatus.BAD_REQUEST,
              {
                cause: error,
              },
            );
          });
        return;
      }

      if (uc.deviceId.devId === `ucd-${uc.ucCode}`) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message:
              'Não foi possível desabilitar. Dispositivo já está desativado.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const oldBucketId = (oldDevice.bucketId as InfluxBucket)._id.toString();

      const device: CreateDevicesGbDto = {
        clientId: oldClientId,
        devId: `ucd-${uc.ucCode}`,
        bucketId: oldBucketId,
        name: `UC ${uc.ucCode} desativada`,
        allows: oldDevice.allows,
        communication: 'PIMA',
        type: 'LoRa',
        databaseId: new Types.ObjectId().toString(),
      };

      const newDevice = await this.devicesGbService.create(
        device,
        transactionSession,
      );

      await this.devicesGbService.migrateDevice({
        oldDevice,
        newDevice,
        hardwareSerial: null,
        deleteOldData: deleteData,
        uc,
        transactionSession,
      });
    } catch (err) {
      const message = uc
        ? `Ocorreu um erro durante a troca de dispositivos da UC ${uc.ucCode}.Entre em contato com o suporte`
        : `Ocorreu um erro durante a troca de dados entre os dispositivos ${oldDevice.devId}. Entre em contato com o suporte`;

      await this.notificationService.create({
        clientId: oldClientId,
        title: `Erro ao trocar dispositivos!`,
        message,
        createdAt: new Date(),
      });

      await transactionSession.abortTransaction();
      await transactionSession.endSession();

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro ao migrar UC',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }

    const message = `A troca de dispositivos da UC ${uc.ucCode} foi finalizada com sucesso!`;

    await this.notificationService.create({
      clientId: oldDevice.clientId.toString(),
      title: `Troca de dispositivos bem sucedida!`,
      message,
      createdAt: new Date(),
    });

    await this.ucDisabledHistoryService.create(
      createUcDisabledHistoryDto,
      transactionSession,
    );

    await transactionSession.commitTransaction();
    transactionSession.endSession();
  }

  findByUcCodesPopulate(ucCodes: string[]) {
    return this.ucRepository.findWithPopulate({ ucCode: { $in: ucCodes } });
  }

  updateByUcCodeOrInsert(ucs: ProcessUcsDto[]) {
    return Promise.all(
      ucs.map(async (uc) =>
        this.ucRepository.upsert({ ucCode: uc.ucCode }, uc),
      ),
    );
  }

  async removeOne(id: string) {
    return this.ucRepository.delete(id);
  }

  async removeMany(ids: string[]) {
    return this.ucRepository.deleteMany(ids);
  }
}
