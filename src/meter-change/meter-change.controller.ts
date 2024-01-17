import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateMeterChangeDto } from './dto/create-meter-change.dto';
import { UpdateMeterChangeDto } from './dto/update-meter-change.dto';
import { MeterChangeService } from './meter-change.service';

@ApiTags('Troca de medidor')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('meter-changes')
export class MeterChangeController {
  constructor(private readonly meterChangeService: MeterChangeService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  async create(@Body() CreateMeterChangeDto: CreateMeterChangeDto) {
    try {
      return await this.meterChangeService.create(CreateMeterChangeDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao cadastrar uma troca de medidor.',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@CurrentUser() user: UserFromJwt) {
    try {
      return this.meterChangeService.findAll(user);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao buscar todas as trocas de medidores.',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  findOne(@Param('id') id: string) {
    try {
      return this.meterChangeService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao buscar troca de medidor.',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateMeterChangeDto: UpdateMeterChangeDto,
  ) {
    try {
      return this.meterChangeService.update(id, updateMeterChangeDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao atualizar a troca de medidor.',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':ids')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  remove(@Param('ids') ids: string) {
    const idsForDelete = ids.split(',');
    try {
      return this.meterChangeService.remove(idsForDelete);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao excluir troca(s) de medidor(es).',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
