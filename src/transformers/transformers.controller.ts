import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsService } from 'src/clients/clients.service';
import DynamicObject from 'src/common/models/dynamicObject';

import { CreateTransformerDto } from './dto/create-transformer.dto';
import { FindTransformersDto } from './dto/find-transformers.dto';
import { ProcessFileDto } from './dto/process-file.dto';
import { UpdateTransformerDto } from './dto/update-transformer.dto';
import { TransformersService } from './transformers.service';
import { UsersService } from 'src/users/users.service';
import mongoose from 'mongoose';
import { convertPropertiesToInt } from 'src/utils/utils';
import { handleFilters } from 'src/utils/filterHandler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const utmObj = require('utm-latlng');

const utm = new utmObj();

@ApiTags('Transformadores')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
@UseGuards(RolesGuard)
@Controller('transformers')
export class TransformersController {
  constructor(
    private readonly transformersService: TransformersService,
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('many')
  async postMany(@Body() data: CreateTransformerDto[]) {
    for await (const item of data) {
      this.transformersService.updateOrInsert(item);
    }
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        clientId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async processTxt(
    @Body() { clientId }: ProcessFileDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserFromJwt,
  ) {
    const response = [];
    let aux = 0;

    let client: string;

    if (
      user.accessLevel !== Role.SUPER_ADMIN &&
      user.accessLevel !== Role.ADMIN &&
      user.accessLevel !== Role.SUPPORT
    ) {
      client = clientId;
    } else {
      client = user.clientId;
    }

    const csvData: string = file.buffer.toString();
    const parsedData = csvData.split('\n').slice(1);

    for await (let line of parsedData) {
      if (aux !== 0 && line.length !== 0) {
        line = line.replace('\r', '');
        const parsedLine = line.split(';');
        const transformer = await this.transformersService.findByIt(
          parsedLine[0],
        );

        const fuso = parsedLine[9].split(/([0-9]+)/);
        const coordinates = await utm.convertUtmToLatLng(
          Number(parsedLine[6].replace(',', '.')),
          Number(parsedLine[7].replace(',', '.')),
          fuso[1],
          fuso[2],
        );
        const location = {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat],
        };

        if (transformer == null) {
          response.push({
            clientId: client,
            it: parsedLine[0],
            serieNumber: parsedLine[1],
            tapLevel: Number(parsedLine[2]),
            tap: Number(parsedLine[3].replace(',', '.')),
            feeder: parsedLine[4],
            city: parsedLine[5],
            location: location,
            operation: 'Inserir',
          });
        } else {
          response.push({
            id: transformer._id,
            clientId: client,
            it: parsedLine[0],
            serieNumber: parsedLine[1],
            tapLevel: Number(parsedLine[2]),
            tap: Number(parsedLine[3].replace(',', '.')),
            feeder: parsedLine[4],
            city: parsedLine[5],
            location: location,
            operation: 'Editar',
          });
        }
      }
      aux++;
    }

    return response;
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.MANAGER, Role.VIEWER)
  async findAll(
    @Query() query: FindTransformersDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      const {
        clientId,
        sort,
        skip,
        limit,
        searchText,
        filter = [],
        fieldMask,
      } = query;

      const convertedSort = sort ? convertPropertiesToInt(sort) : { it: 1 };

      const convertedFieldMask = fieldMask
        ? convertPropertiesToInt(fieldMask)
        : null;

      const handledFilters = handleFilters(filter);

      if (clientId) {
        handledFilters.push({
          'clientId._id': new mongoose.Types.ObjectId(clientId),
        });
      }

      const edges: Array<DynamicObject> = [{ $sort: convertedSort }];

      if (skip) {
        edges.push({ $skip: Number(skip) });
      }

      if (limit) {
        edges.push({ $limit: Number(limit) });
      }

      const searchOpts: DynamicObject = {
        edges,
        searchText,
        filter: handledFilters,
        fieldMask: convertedFieldMask,
      };

      const currentUser = user;

      if (
        currentUser.accessLevel === Role.SUPER_ADMIN ||
        currentUser.accessLevel === Role.SUPPORT
      ) {
        return await this.transformersService.findAllPopulate(searchOpts);
      }

      if (currentUser.accessLevel === Role.ADMIN) {
        searchOpts.filter.push({
          $or: [
            {
              'clientId._id': new mongoose.Types.ObjectId(user.clientId),
            },
            {
              'clientId.parentId': new mongoose.Types.ObjectId(user.clientId),
            },
          ],
        });

        return await this.transformersService.findAllPopulate(searchOpts);
      }

      searchOpts.filter.push({
        'clientId._id': new mongoose.Types.ObjectId(user.clientId),
      });

      return await this.transformersService.findAllPopulate(searchOpts);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro ao buscar transformadores.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get('devices')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.MANAGER, Role.VIEWER)
  async filterTransformersDevice(@Query('clientId') clientId: string) {
    return await this.transformersService.filterTransformersDevice(clientId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.MANAGER, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.transformersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransformerDto: UpdateTransformerDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    if (
      user.accessLevel !== Role.SUPER_ADMIN &&
      user.accessLevel !== Role.ADMIN &&
      user.accessLevel !== Role.SUPPORT
    ) {
      updateTransformerDto.clientId = user.clientId;
    }
    return this.transformersService.update(id, updateTransformerDto);
  }

  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    return this.transformersService.remove(ids.split(','));
  }
}
