import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DeviceTrDocument } from './entities/devices-tr.entity';
import { DevicesTrRepository } from './devices-tr.repository';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { TransformersService } from 'src/transformers/transformers.service';
import { FindDeviceTrAnalyticsDto } from './dto/find-device-tr-analytcs.dto';
import { measurements } from 'src/utils/CSVfields-map';
import { InfluxService } from 'src/influx/influx.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { HttpError } from '@influxdata/influxdb-client';

@Injectable()
export class DevicesTrService {
  constructor(
    private readonly deviceTrRepository: DevicesTrRepository,
    private readonly transformerService: TransformersService,
    private readonly influxService: InfluxService,
    private readonly influxBucketService: InfluxBucketsService,
    private readonly influxConnectionService: InfluxConnectionsService,
  ) {}

  async getAnalytics(query: FindDeviceTrAnalyticsDto) {
    const { trsIds, dateRange, fields } = query;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    const transformers = await this.transformerService.findWhereAndPopulate(
      { _id: { $in: trsIds } },
      ['smartTrafoDeviceId'],
    );

    const header = ['Tempo', 'IT'].concat(fields);
    const response = [['Data', 'Hora'].concat(header)];

    if (!transformers.length) return response;
    if (!transformers[0].smartTrafoDeviceId) return response;

    const smartTrafoDevice = transformers[0]
      .smartTrafoDeviceId as DeviceTrDocument;

    if (!smartTrafoDevice.bucketId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não há bucket vinculado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const bucket = await this.influxBucketService.findOne(
      smartTrafoDevice.bucketId as string,
    );

    if (!bucket) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não há bucket cadastrado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const influxConnection = await this.influxConnectionService.findOne(
      bucket.influxConnectionId,
    );

    const devsIds = transformers.map(
      (item) =>
        `r["dev_id"] == "${
          (item.smartTrafoDeviceId as DeviceTrDocument).devId
        }"`,
    );

    const queryFields = fields.map((item) => `r["_field"] == "${item}"`);

    const data = await this.influxService.findAnalyticsFieldData({
      fields: queryFields.join(' or '),
      devsIds: devsIds.join(' or '),
      begin: Math.round(new Date(start).getTime() / 1000),
      end:
        new Date(end).getTime() <= new Date().getTime()
          ? Math.round(new Date(end).getTime() / 1000)
          : Math.round(new Date().getTime() / 1000),
      host: influxConnection.host,
      apiToken: influxConnection.apiToken,
      bucket: bucket.name,
    });

    header.shift();

    for await (const item of data) {
      const newLine = [
        new Date(item._time).toLocaleDateString('pt-Br', {
          dateStyle: 'short',
          timeZone: 'America/Sao_Paulo',
        }),
        new Date(item._time).toLocaleTimeString('pt-Br', {
          timeStyle: 'medium',
          timeZone: 'America/Sao_Paulo',
        }),
        null,
      ];

      fields.forEach((field) => {
        if (item[field] || typeof item[field] === 'number') {
          if (typeof item[field] === 'number') {
            newLine.push(
              new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })
                .format(item[field])
                .replace('.', ','),
            );
          } else {
            newLine.push(item[field]);
          }
        } else {
          newLine.push(null);
        }
      });

      response.push(newLine);
    }

    response[0] = response[0].map((item) =>
      measurements.find((measurement) => measurement.value === item)
        ? measurements.find((measurement) => measurement.value === item).label
        : item,
    );

    return response;
  }

  findWhere(whereClause: FilterQuery<DeviceTrDocument>) {
    return this.deviceTrRepository.aggregate([
      {
        $match: whereClause,
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: {
          path: '$client',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'transformers',
          localField: '_id',
          foreignField: 'smartTrafoDeviceId',
          as: 'transformers',
        },
      },
      {
        $unwind: {
          path: '$transformers',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'lastreceivedssmarttrafos',
          localField: '_id',
          foreignField: 'deviceId',
          as: 'lastreceivedssmarttrafos',
        },
      },
      {
        $unwind: {
          path: '$lastreceivedssmarttrafos',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'settings',
          localField: 'clientId',
          foreignField: 'clientId',
          as: 'settings',
        },
      },
      {
        $unwind: {
          path: '$settings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'brokerattributes',
          localField: 'devId',
          foreignField: 'devId',
          pipeline: [
            {
              $match: {
                devId: { $exists: true, $ne: null },
              },
            },
          ],
          as: 'mqttAccess',
        },
      },
      {
        $unwind: {
          path: '$mqttAccess',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          client: { $first: '$client' },
          lastReceiveds: { $push: '$lastreceivedssmarttrafos' },
          transformers: { $first: '$transformers' },
          settings: { $first: '$settings' },
          devId: { $first: '$devId' },
          type: { $first: '$type' },
          online: { $first: '$online' },
          name: { $first: '$name' },
          city: { $first: '$city' },
          district: { $first: '$district' },
          location: { $first: '$location' },
          mqttAccess: { $first: '$mqttAccess' },
        },
      },
      {
        $project: {
          _id: 1,
          client: 1,
          lastReceiveds: 1,
          transformers: 1,
          settings: 1,
          devId: 1,
          type: 1,
          online: 1,
          name: 1,
          city: 1,
          district: 1,
          location: 1,
          mqttAccess: 1,
        },
      },
    ]);
  }

  findFilteredDevicesTr(user: UserFromJwt) {
    const isAdmin = user.accessLevel === 'admin';
    const isOrgAdmin = user.accessLevel === 'commercial';

    if (isAdmin) {
      return this.handleAdminRoute();
    } else if (isOrgAdmin) {
      return this.handleOrgAdminRoute(user);
    }
    return this.handleNonAdminRoute(user);
  }

  private handleAdminRoute() {
    const whereClause: FilterQuery<DeviceTrDocument> = {};
    return this.findWhere(whereClause);
  }

  private handleNonAdminRoute(user: UserFromJwt) {
    const clientId = new Types.ObjectId(user.clientId);
    return this.findWhere({ clientId });
  }

  private async handleOrgAdminRoute(user: UserFromJwt) {
    const { clientId } = user;
    const childClients = await this.deviceTrRepository.findChildClients(
      clientId,
    );
    const clientIdsToSearch = [
      clientId,
      ...childClients.map((item) => item._id),
    ];
    const devices = await this.findWhere({
      clientId: { $in: clientIdsToSearch },
    });

    return devices;
  }

  findTelikTrafoLiteDevices(user: UserFromJwt) {
    const isAdmin = user.accessLevel === 'admin';
    const isOrgAdmin = user.accessLevel === 'commercial';

    if (isAdmin) {
      return this.handleAdminRouteForTelikTrafoLite();
    } else if (isOrgAdmin) {
      return this.handleOrgAdminRouteForTelikTrafoLite(user);
    }
    return this.handleNonAdminRouteForTelikTrafoLite(user);
  }

  private handleAdminRouteForTelikTrafoLite() {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      type: 'Telik Trafo Lite',
    };
    return this.findWhere(whereClause);
  }

  private handleNonAdminRouteForTelikTrafoLite(user: UserFromJwt) {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      type: 'Telik Trafo Lite',
      clientId: new Types.ObjectId(user.clientId),
    };
    return this.findWhere(whereClause);
  }

  private async handleOrgAdminRouteForTelikTrafoLite(user: UserFromJwt) {
    const { clientId } = user;
    const childClients = await this.deviceTrRepository.findChildClients(
      clientId,
    );
    const clientIdsToSearch = [
      clientId,
      ...childClients.map((item) => item._id),
    ];

    const whereClause: FilterQuery<DeviceTrDocument> = {
      clientId: { $in: clientIdsToSearch },
      type: 'Telik Trafo Lite',
    };
    const devices = await this.findWhere(whereClause);

    return devices;
  }

  findFilteredTransformerTelikTrafoLite(user: UserFromJwt, clientId: string) {
    const isAdmin = user.accessLevel === 'admin';
    const isOrgAdmin = user.accessLevel === 'orgadmin';

    if (isAdmin) {
      return this.handleAdminRouteForFiltered(clientId);
    } else if (isOrgAdmin) {
      return this.handleOrgAdminRouteForFiltered(clientId);
    }
    return this.handleNonAdminRouteForFiltered(user);
  }

  private handleAdminRouteForFiltered(clientId: string) {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      type: 'Telik Trafo Lite',
      clientId: new Types.ObjectId(clientId),
    };
    return this.findWhere(whereClause);
  }

  private async handleOrgAdminRouteForFiltered(clientId: string) {
    const childClients = await this.deviceTrRepository.findChildClients(
      clientId,
    );
    const clientIdsToSearch = [
      clientId,
      ...childClients.map((item) => item._id),
    ];

    const whereClause: FilterQuery<DeviceTrDocument> = {
      clientId: { $in: clientIdsToSearch },
      type: 'Telik Trafo Lite',
    };
    const devices = await this.findWhere(whereClause);

    return devices;
  }

  private handleNonAdminRouteForFiltered(user: UserFromJwt) {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      type: 'Telik Trafo Lite',
      clientId: new Types.ObjectId(user.clientId),
    };
    return this.findWhere(whereClause);
  }

  findFilteredTransformerDevices(user: UserFromJwt, clientId: string) {
    const isAdmin = user.accessLevel === 'admin';
    const isOrgAdmin = user.accessLevel === 'orgadmin';

    if (isAdmin) {
      return this.handleAdminRouteForFilteredDevices(clientId);
    } else if (isOrgAdmin) {
      return this.handleOrgAdminRouteForFilteredDevices(clientId);
    }
    return this.handleNonAdminRouteForFilteredDevices(user);
  }

  private handleAdminRouteForFilteredDevices(clientId: string) {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      clientId: new Types.ObjectId(clientId),
    };
    return this.findWhere(whereClause);
  }

  private async handleOrgAdminRouteForFilteredDevices(clientId: string) {
    const childClients = await this.deviceTrRepository.findChildClients(
      clientId,
    );
    const clientIdsToSearch = [
      clientId,
      ...childClients.map((item) => item._id),
    ];

    const whereClause: FilterQuery<DeviceTrDocument> = {
      clientId: { $in: clientIdsToSearch },
    };
    const devices = await this.findWhere(whereClause);

    return devices;
  }

  private handleNonAdminRouteForFilteredDevices(user: UserFromJwt) {
    const whereClause: FilterQuery<DeviceTrDocument> = {
      clientId: new Types.ObjectId(user.clientId),
    };
    return this.findWhere(whereClause);
  }

  findOne(id: string) {
    return this.deviceTrRepository.findOne({ _id: id });
  }

  remove(ids: string[]) {
    return this.deviceTrRepository.deleteMany({ _id: { $in: ids } });
  }
}
