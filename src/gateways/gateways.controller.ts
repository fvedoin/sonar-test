import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { LinkGatewayDto } from './dto/link-gateway.dto';
import { GatewaysService } from './gateways.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@ApiTags('Gateways')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
@UseGuards(RolesGuard)
@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@CurrentUser() user: UserFromJwt) {
    try {
      return await this.gatewaysService.findAll(user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ocorreu um erro ao buscar os gateways.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get('filterByClients')
  filterByClients(
    @CurrentUser() user: UserFromJwt,
    @Query('clientId') clientId: string,
  ) {
    try {
      return this.gatewaysService.filterByClients(user, clientId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ocorreu um erro ao buscar os gateways para o cliente.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Get('ttn/:ttnId')
  async findOne(@Param('ttnId') ttnId: string) {
    try {
      return await this.gatewaysService.findOne(ttnId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ocorreu um erro ao buscar o gateway por ID.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  @Post(':ttnId/link')
  async update(
    @Param('ttnId') ttnId: string,
    @Body() linkGatewayDto: LinkGatewayDto,
  ) {
    try {
      return await this.gatewaysService.link(ttnId, linkGatewayDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ocorreu um erro ao atualizar o gateway.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
