import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/models/Role';
import { ChangelogsService } from './changelog.service';
import { CreateChangelogDto } from './dto/create-changelogs.dto';
import { UpdateChangelogDto } from './dto/update-changelogs.dto';
import { Changelog } from './entities/changelogs.entity';

@ApiTags('Novidades')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('changelogs')
export class ChangelogsController {
  constructor(private readonly ChangelogService: ChangelogsService) {}

  @Post()
  create(@Body() createChangelogDto: CreateChangelogDto): Promise<Changelog> {
    return this.ChangelogService.create(createChangelogDto);
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.ChangelogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ChangelogService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateChangelogDto: UpdateChangelogDto,
  ) {
    return this.ChangelogService.update(id, updateChangelogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ChangelogService.remove(id);
  }
}
