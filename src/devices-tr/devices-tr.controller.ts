import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsService } from 'src/clients/clients.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { DevicesTrService } from './devices-tr.service';
import { FindDevicesTrDto } from './dto/find-devices-tr.dto';
import { FindDeviceTrAnalyticsDto } from './dto/find-device-tr-analytcs.dto';

@ApiTags('Medidores de transformadores')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
@UseGuards(RolesGuard)
@Injectable()
@Controller('devices-tr')
export class DevicesTrController {
  constructor(
    private readonly devicesTrService: DevicesTrService,
    private readonly clientsService: ClientsService,
    private readonly mqttAccessesService: MqttAccessService,
  ) {}

  @Get()
  async findAll(
    @Query() { clientId }: FindDevicesTrDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    let whereClause = {};

    if (clientId) {
      whereClause = { clientId };
    } else {
      if (user.accessLevel === Role.ADMIN) {
        const clients = await this.clientsService.findWhere({
          parentId: user.clientId,
        });

        whereClause = {
          clientId: {
            $in: [user.clientId, ...clients.map((client) => client._id)],
          },
        };
      } else if (
        user.accessLevel !== Role.SUPER_ADMIN &&
        user.accessLevel !== Role.SUPPORT
      ) {
        whereClause = { clientId: user.clientId };
      }
    }
    return this.devicesTrService.findWhere(whereClause);
  }

  @Get('devices')
  findFilteredDevicesTr(@CurrentUser() user: UserFromJwt) {
    return this.devicesTrService.findFilteredDevicesTr(user);
  }

  @Get('filter-telik-trafo-lite')
  findFilteredTransformerTelikTrafoLite(
    @CurrentUser() user: UserFromJwt,
    @Query('clientId') clientId: string,
  ) {
    return this.devicesTrService.findFilteredTransformerTelikTrafoLite(
      user,
      clientId,
    );
  }

  @Get('filter-devices')
  findFilteredTransformerDevices(
    @CurrentUser() user: UserFromJwt,
    @Query('clientId') clientId: string,
  ) {
    return this.devicesTrService.findFilteredTransformerDevices(user, clientId);
  }

  @Get('telik-trafo-lite')
  getTelikTrafoLiteDevices(@CurrentUser() user: UserFromJwt) {
    return this.devicesTrService.findTelikTrafoLiteDevices(user);
  }

  @Get('analytics')
  getAnalytics(@Query() query: FindDeviceTrAnalyticsDto) {
    try {
      return this.devicesTrService.getAnalytics(query);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          message: 'Não foi possível buscar a análise de tr!',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const device = await this.devicesTrService.findOne(id);
    const broker = await this.mqttAccessesService.findOneWhere({
      devId: device.devId,
    });
    return { device, broker };
  }

  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    return this.devicesTrService.remove(ids.split(','));
  }
}
