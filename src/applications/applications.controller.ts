import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { TtnService } from 'src/common/services/ttn.service';

import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';

@ApiTags('Aplicações')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    const { appId, name, description } = createApplicationDto;

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    const token = Buffer.from(appId + ':' + name).toString('hex');

    const ttnApplication = await TtnService.get(
      `/users/${process.env.TTN_USER}/applications`,
    );

    const foundIndex = ttnApplication.data.applications.findIndex(
      (item) => item.ids.application_id === appId,
    );

    const createdApplication = this.applicationsService.create(
      createApplicationDto,
      token,
      transactionSession,
    );

    if (foundIndex < 0) {
      await TtnService.post(`/users/${process.env.TTN_USER}/applications`, {
        application: {
          name,
          description,
          ids: {
            application_id: appId,
          },
        },
      });
    } else {
      await TtnService.put(`/applications/${appId}`, {
        application: {
          name,
          description,
        },
        field_mask: {
          paths: ['description', 'name'],
        },
      });
    }

    await transactionSession.commitTransaction();
    transactionSession.endSession();

    return createdApplication;
  }

  @Get()
  async findAll(@Query() clientId) {
    let applications: Application[];
    const parsedData = { synchronized: [], unsynchronized: [] };
    if (clientId) {
      applications = await this.applicationsService.findWhere(clientId);
      parsedData.synchronized = applications;
    } else {
      applications = await this.applicationsService.findAll();
      //Busca as aplicações do TTN
      const ttnResponse = await TtnService.get(
        'applications?field_mask=name,description',
      );
      const ttnApplications = ttnResponse.data.applications;
      //Verifica quais aplicações estão no TTN e não estão no MongoDB
      ttnApplications.map((item) => {
        const index = applications.findIndex(
          (application) => item.ids.application_id === application.appId,
        );
        if (index >= 0) {
          parsedData.synchronized.push(applications[index]);
        } else {
          parsedData.unsynchronized.push({
            appId: item.ids.application_id,
            name: item.name,
          });
        }
      });
    }

    return parsedData;
  }

  @Get(':appId')
  async findOne(@Param('appId') appId: string) {
    const application = await this.applicationsService.findOneWhere({
      appId,
    });
    const ttnApplication = await TtnService.get(`applications/${appId}`);

    return {
      ...application.toObject(),
      ttnSync: ttnApplication.data.ids.application_id === application.appId,
    };
  }

  @Patch(':appId')
  async update(
    @Param('appId') appId: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    const updated = await this.applicationsService.update(
      appId,
      updateApplicationDto,
      transactionSession,
    );

    await TtnService.put(`/applications/${appId}`, {
      application: {
        name: updateApplicationDto.name,
        description: updateApplicationDto.description,
      },
      field_mask: {
        paths: ['description', 'name'],
      },
    });

    await transactionSession.commitTransaction();
    transactionSession.endSession();

    return updated;
  }

  @Delete(':appIds')
  async remove(@Param('appIds') appIds: string) {
    const ids = appIds.split(',');

    for await (const appId of ids) {
      await this.applicationsService.remove(appId);
      await TtnService.delete(`/applications/${appId}`);
    }
    return {
      deleted: true,
    };
  }
}
