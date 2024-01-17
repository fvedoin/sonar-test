import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Injectable,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DevicesGaService } from './devices-ga.service';
import { CreateDevicesGaDto } from './dto/create-devices-ga.dto';
import { UpdateDevicesGaDto } from './dto/update-devices-ga.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/models/Role';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DeviceGAResponse, errorSchema } from './swagger/response';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { FindDevicesGaDto } from './dto/find-devices-ga.dto';

@ApiTags('Dispositivos Grupo A')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Injectable()
@Controller('devices-ga')
export class DevicesGaController {
  constructor(private readonly devicesGaService: DevicesGaService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiBody({ type: CreateDevicesGaDto })
  @ApiResponse({
    schema: errorSchema,
    status: 400,
  })
  @ApiResponse({
    status: 200,
  })
  async create(@Body() createDevicesGaDto: CreateDevicesGaDto) {
    try {
      if (!createDevicesGaDto.provider)
        throw new Error('provider é obrigatório.');
      if (!createDevicesGaDto.devId) throw new Error('devId é obrigatório.');
      if (!createDevicesGaDto.name) throw new Error('name é obrigatório.');
      if (!createDevicesGaDto.clientId)
        throw new Error('clientId é obrigatório.');

      return await this.devicesGaService.create(createDevicesGaDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível criar o dispositivo!',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
  @ApiBody({ type: CreateDevicesGaDto })
  @ApiResponse({
    schema: {
      type: 'array',
      items: DeviceGAResponse,
      examples: DeviceGAResponse,
    },
    status: 200,
  })
  @ApiResponse({
    schema: errorSchema,
    status: 400,
  })
  findAll(@Query() query: FindDevicesGaDto, @CurrentUser() user: UserFromJwt) {
    return this.devicesGaService.findAllPaginated(query, user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
  @ApiBody({ type: CreateDevicesGaDto })
  @ApiResponse({
    schema: DeviceGAResponse,
    status: 200,
  })
  @ApiResponse({
    schema: errorSchema,
    status: 400,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesGaService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.ADMIN)
  @ApiBody({ type: UpdateDevicesGaDto })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    schema: errorSchema,
    status: 400,
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDevicesGaDto: UpdateDevicesGaDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      return this.devicesGaService.update(id, updateDevicesGaDto, user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Não foi possível atualizar o dispositivo!',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiBody({ type: UpdateDevicesGaDto })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    schema: errorSchema,
    status: 400,
  })
  async remove(@Param('id') id: string) {
    try {
      const ids: string[] = id.split(',');
      await this.devicesGaService.remove(ids);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Não foi possível deletar o dispositivo!',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
