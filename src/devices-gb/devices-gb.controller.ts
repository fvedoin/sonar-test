import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as mongoose from 'mongoose';
import { ApplicationsService } from 'src/applications/applications.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { TtnService } from 'src/common/services/ttn.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { CreateMqttAccessDto } from 'src/mqtt-access/dto/create-mqtt-access.dto';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';

import { DevicesGbService } from './devices-gb.service';
import { CreateDevicesGbDto } from './dto/create-devices-gb.dto';
import { FindDevicesGbDto } from './dto/find-devices-gb.dto';
import { UpdateDevicesGbDto } from './dto/update-devices-gb.dto';

@ApiTags('Dispositivos Grupo B')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
@UseGuards(RolesGuard)
@Injectable()
@Controller('devices-gb')
export class DevicesGbController {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly devicesGbService: DevicesGbService,
    private readonly influxBucketsService: InfluxBucketsService,
    private readonly applicationsService: ApplicationsService,
    private readonly mqttAccessesService: MqttAccessService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Post()
  async create(@Body() createDevicesGbDto: CreateDevicesGbDto) {
    const {
      clientId,
      applicationId,
      allows,
      devId,
      databaseId,
      communication,
      type,
      devEui,
      appEui,
      name,
      description,
      lorawanVersion,
      lorawanPhyVersion,
      frequencyPlanId,
      supportsJoin,
      appKey,
      username,
      password,
      topics,
    } = createDevicesGbDto;

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    // let operations = 0;
    let application;
    const bucket = await this.influxBucketsService.findOneWhere({
      clientId,
      influxConnectionId: databaseId,
      product: 'telemedicao-b',
    });

    const aux = devId.split(':');
    const ucCode = aux[1] ? aux[1] : null;

    const device: any = {
      clientId: clientId,
      devId: aux[0],
      type: type,
      bucketId: bucket._id,
      name: name,
      description: description,
      allows: allows,
      communication: communication,
    };

    if (type === 'GSM') {
      const hash = await bcrypt.hash(password, 10);
      const broker: CreateMqttAccessDto = {
        devId: aux[0],
        name: `Cliente do dispositivo ${aux[0]}`,
        topics,
        username,
        encryptedPassword: hash,
        type: 'client',
      };
      await this.mqttAccessesService.create(broker, transactionSession);
    } else if (type === 'LoRa') {
      application = await this.applicationsService.findOne(applicationId);

      if (!application) {
        throw {
          name: 'ValidationError',
          message: 'A aplicação selecionada não existe',
        };
      }
      device.applicationId = new mongoose.Types.ObjectId(applicationId);
    }

    if (type === 'LoRa') {
      await TtnService.post(`applications/${application.appId}/devices`, {
        end_device: {
          ids: {
            device_id: aux[0],
            dev_eui: devEui,
            join_eui: appEui,
          },
          name: name,
          description: description,
          join_server_address: 'eu1.cloud.thethings.network',
          application_server_address: 'eu1.cloud.thethings.network',
          network_server_address: 'eu1.cloud.thethings.network',
        },
        field_mask: {
          paths: [
            'name',
            'description',
            'join_server_address',
            'application_server_address',
            'network_server_address',
          ],
        },
      });
      // operations++;
      await TtnService.put(
        `ns/applications/${application.appId}/devices/${aux[0]}`,
        {
          end_device: {
            lorawan_version: lorawanVersion,
            lorawan_phy_version: lorawanPhyVersion,
            frequency_plan_id: frequencyPlanId,
            supports_join: supportsJoin,
            ids: {
              device_id: aux[0],
              dev_eui: devEui,
              join_eui: appEui,
            },
          },
          field_mask: {
            paths: [
              'lorawan_version',
              'lorawan_phy_version',
              'frequency_plan_id',
              'supports_join',
              'ids.device_id',
              'ids.dev_eui',
              'ids.join_eui',
            ],
          },
        },
      );

      await TtnService.put(
        `as/applications/${application.appId}/devices/${aux[0]}`,
        {
          end_device: {
            ids: {
              device_id: aux[0],
              dev_eui: devEui,
              join_eui: appEui,
            },
          },
          field_mask: {
            paths: ['ids.device_id', 'ids.dev_eui', 'ids.join_eui'],
          },
        },
      );

      await TtnService.put(
        `js/applications/${application.appId}/devices/${aux[0]}`,
        {
          end_device: {
            ids: {
              device_id: aux[0],
              application_ids: {},
              dev_eui: devEui,
              join_eui: appEui,
            },
            root_keys: {
              app_key: {
                key: appKey,
              },
            },
            application_server_address: 'eu1.cloud.thethings.network',
            network_server_address: 'eu1.cloud.thethings.network',
          },
          field_mask: {
            paths: [
              'root_keys.app_key.key',
              'ids.device_id',
              'ids.dev_eui',
              'ids.join_eui',
              'application_server_address',
              'network_server_address',
            ],
          },
        },
      );
    }

    const newInfos = await this.devicesGbService.findRedisDataByDevId(
      device.devId,
    );
    await this.cacheService.set(`remota:${device.devId}`, newInfos);

    await transactionSession.commitTransaction();
    transactionSession.endSession();
  }

  @Put(':id/migrate')
  async migrate(
    @Param('id') oldDeviceId: string,
    @Body() { deleteData, deviceId: newDeviceId },
  ) {
    try {
      return this.devicesGbService.migrate(
        oldDeviceId,
        newDeviceId,
        deleteData,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro ao desativar dispositivo dispositivo.',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  async findAll(
    @Query() query: FindDevicesGbDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.devicesGbService.findAll(query, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const device = await this.devicesGbService.findOne(id);
    let response = {};

    if (device instanceof mongoose.Document) {
      if (device.type !== 'GSM') {
        const application = await this.applicationsService.findOne(
          device.applicationId.toString(),
        );

        if (application) {
          const ttnDevice1 = await TtnService.get(
            `applications/${application.appId}/devices/${device.devId}?field_mask=name,description,version_ids,network_server_address,application_server_address,join_server_address,locations,attributes`,
          );
          const ttnDevice2 = await TtnService.get(
            `ns/applications/${application.appId}/devices/${device.devId}?field_mask=version_ids,frequency_plan_id,mac_settings,supports_class_b,supports_class_c,supports_join,lorawan_version,lorawan_phy_version,multicast,mac_state.recent_uplinks,pending_mac_state.recent_uplinks,session,pending_session`,
          );
          const ttnDevice3 = await TtnService.get(
            `js/applications/${application.appId}/devices/${device.devId}?field_mask=resets_join_nonces,network_server_address,application_server_address,net_id,application_server_id,application_server_kek_label,network_server_kek_label,claim_authentication_code,root_keys`,
          );
          response = {
            ...device.toObject(),
            ttnSync: ttnDevice1.data.ids.device_id === device.devId,
            devEui: ttnDevice1.data.ids.dev_eui,
            lorawanVersion: ttnDevice2.data.lorawan_version,
            lorawanPhyVersion: ttnDevice2.data.lorawan_phy_version,
            frequencyPlanId: ttnDevice2.data.frequency_plan_id,
            appKey: ttnDevice3.data.root_keys.app_key.key,
            joinEui: ttnDevice1.data.ids.join_eui,
            name: ttnDevice1.data.name,
            description: ttnDevice1.data.description,
            appId: application.appId,
          };
        }
      } else {
        const broker = await this.mqttAccessesService.findOneWhere({
          devId: device.devId,
        });
        response = {
          ...device.toObject(),
          broker,
        };
      }
    }

    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDevicesGbDto: UpdateDevicesGbDto,
  ) {
    const {
      clientId,
      applicationId,
      allows,
      databaseId,
      communication,
      type,
      devEui,
      appEui,
      username,
      name,
      description,
      lorawanVersion,
      lorawanPhyVersion,
      frequencyPlanId,
      supportsJoin,
      appKey,
      devId,
      password,
      topics,
    } = updateDevicesGbDto;

    const bucket = await this.influxBucketsService.findOneWhere({
      clientId,
      influxConnectionId: databaseId,
      product: 'telemedicao-b',
    });

    const device: UpdateDevicesGbDto = {
      clientId,
      devId,
      type,
      username,
      name,
      description,
      bucketId: bucket._id.toString(),
      applicationId,
      allows,
      communication,
    };

    const hash = await bcrypt.hash(password, 10);

    const broker = password
      ? { devId, topics, username, encryptedPassword: hash }
      : { topics, username, devId };

    let updated;

    if (type === 'LoRa') {
      const application = await this.applicationsService.findOne(applicationId);

      if (!application) {
        throw {
          name: 'ValidationError',
          message: 'A aplicação selecionada não existe',
        };
      }

      updated = await this.devicesGbService.update(id, device);

      const ttnDevice = await TtnService.get(
        `/applications/${application.appId}/devices`,
      );

      const index = ttnDevice.data.end_devices.findIndex(
        (item) => item.ids.device_id === devId,
      );

      if (index >= 0) {
        await TtnService.put(
          `applications/${application.appId}/devices/${devId}`,
          {
            end_device: {
              ids: {
                device_id: devId,
                dev_eui: devEui,
                join_eui: appEui,
              },
              name,
              description,
              join_server_address: 'eu1.cloud.thethings.network',
              application_server_address: 'eu1.cloud.thethings.network',
              network_server_address: 'eu1.cloud.thethings.network',
            },
            field_mask: {
              paths: [
                'name',
                'description',
                'join_server_address',
                'application_server_address',
                'network_server_address',
              ],
            },
          },
        );
      } else {
        await TtnService.post(`applications/${application.appId}/devices`, {
          end_device: {
            ids: {
              device_id: devId,
              dev_eui: devEui,
              join_eui: appEui,
            },
            name,
            description,
            join_server_address: 'eu1.cloud.thethings.network',
            application_server_address: 'eu1.cloud.thethings.network',
            network_server_address: 'eu1.cloud.thethings.network',
          },
          field_mask: {
            paths: [
              'name',
              'description',
              'join_server_address',
              'application_server_address',
              'network_server_address',
            ],
          },
        });
      }
      await TtnService.put(
        `ns/applications/${application.appId}/devices/${devId}`,
        {
          end_device: {
            lorawan_version: lorawanVersion,
            lorawan_phy_version: lorawanPhyVersion,
            frequency_plan_id: frequencyPlanId,
            supports_join: supportsJoin,
            ids: {
              device_id: devId,
              dev_eui: devEui,
              join_eui: appEui,
            },
          },
          field_mask: {
            paths: [
              'lorawan_version',
              'lorawan_phy_version',
              'frequency_plan_id',
              'supports_join',
              'ids.device_id',
              'ids.dev_eui',
              'ids.join_eui',
            ],
          },
        },
      );

      await TtnService.put(
        `as/applications/${application.appId}/devices/${devId}`,
        {
          end_device: {
            ids: {
              device_id: devId,
              dev_eui: devEui,
              join_eui: appEui,
            },
          },
          field_mask: {
            paths: ['ids.device_id', 'ids.dev_eui', 'ids.join_eui'],
          },
        },
      );

      await TtnService.put(
        `js/applications/${application.appId}/devices/${devId}`,
        {
          end_device: {
            ids: {
              device_id: devId,
              application_ids: {},
              dev_eui: devEui,
              join_eui: appEui,
            },
            root_keys: {
              app_key: {
                key: appKey,
              },
            },
            application_server_address: 'eu1.cloud.thethings.network',
            network_server_address: 'eu1.cloud.thethings.network',
          },
          field_mask: {
            paths: [
              'root_keys.app_key.key',
              'ids.device_id',
              'ids.dev_eui',
              'ids.join_eui',
              'application_server_address',
              'network_server_address',
            ],
          },
        },
      );
    } else {
      await this.mqttAccessesService.updateOneWhere({ devId }, broker);
      updated = await this.devicesGbService.update(id, device);
    }

    const newInfos = await this.devicesGbService.findRedisDataByDevId(
      device.devId,
    );
    await this.cacheService.set(
      `remota:${device.devId}`,
      JSON.stringify(newInfos),
    );

    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const device = await this.devicesGbService.findOne(id);
    const application = await this.applicationsService.findOne(
      device.applicationId.toString(),
    );

    await this.devicesGbService.remove(id);

    //se tiver aplicação, exclui do TTN também
    if (application && device.type === 'LoRa') {
      await TtnService.delete(
        `applications/${application.appId}/devices/${device.devId}`,
      );
    }

    await this.cacheService.set(`remota:${device.devId}`, '');
    return;
  }
}
