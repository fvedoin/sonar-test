import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@UseGuards(RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.clientsService.create(createClientDto, user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
  async findAll(@CurrentUser() user: UserFromJwt) {
    let whereClause = {};

    if (user.accessLevel === Role.ADMIN) {
      whereClause = {
        $or: [{ parentId: user.clientId }, { _id: user.clientId }],
      };
    }

    if (user.accessLevel === Role.MANAGER || user.accessLevel === Role.VIEWER) {
      whereClause = {
        _id: user.clientId,
      };
    }

    if (
      user.accessLevel === Role.SUPER_ADMIN ||
      user.accessLevel === Role.SUPPORT
    ) {
      return this.clientsService.findAll();
    }

    return this.clientsService.findWhere(whereClause);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    if (user.accessLevel === Role.SUPER_ADMIN) {
      return this.clientsService.update(id, updateClientDto);
    }

    return this.clientsService.update(id, {
      ...updateClientDto,
      parentId: user.clientId,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
