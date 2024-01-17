import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './setting.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { FindUcDisableHistoryDto } from 'src/ucdisabled-history/dto/find-ucdisabled-history.dto';

@ApiTags('Configurações')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiBody({ type: CreateSettingDto })
  async create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }
  @Get()
  @Roles(Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll(
    @Query() query: FindUcDisableHistoryDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.settingsService.findAll(query, user);
  }

  @Get('voltages')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async findCriticalAndPrecariousVoltages(
    @CurrentUser() user: UserFromJwt,
    @Query('clientId') clientId: string,
  ) {
    return this.settingsService.findCriticalAndPrecariousVoltages(
      user,
      clientId,
    );
  }

  @Get(':id')
  @Roles(Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.settingsService.find({ _id: id });
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    const ids: string[] = id.split(',');
    return this.settingsService.remove(ids);
  }
}
