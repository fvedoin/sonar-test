import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  FileValidator,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateUcDto } from './dto/create-uc.dto';
import { UpdateUcDto } from './dto/update-uc.dto';
import { UcsService } from './ucs.service';
import { ProcessUcsDto } from './dto/processUcs.dto';
import {
  QueryFindAllDto,
  QueryFindAllPaginateDto,
} from './dto/queryFindAll.dto';

@ApiTags('Ucs')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('ucs')
export class UcsController {
  constructor(private readonly ucsService: UcsService) {}

  @Post()
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async create(
    @Body() createUcDto: CreateUcDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    try {
      return await this.ucsService.create(createUcDto, currentUser);
    } catch (error) {
      throw new HttpException(
        error.message || 'Não foi possível inserir uc!',
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Post('many')
  async createMany(@Body() data: ProcessUcsDto[]) {
    try {
      return await this.ucsService.updateByUcCodeOrInsert(data);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Não foi possível inserir ucs!',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Post('/upload')
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
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
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        clientId: { type: 'string' },
        transformerId: { type: 'string' },
        transformer: { type: 'string' },
        ucCode: { type: 'string' },
        timeZone: { type: 'string' },
        location: { type: 'boolean' },
        ucNumber: { type: 'boolean' },
        ucClass: { type: 'string' },
        subclass: { type: 'string' },
        billingGroup: { type: 'string' },
        group: { type: 'string' },
        routeCode: { type: 'string' },
        sequence: { type: 'string' },
        phases: { type: 'string' },
        circuitBreaker: { type: 'string' },
        microgeneration: { type: 'string' },
        district: { type: 'string' },
        city: { type: 'string' },
        subGroup: { type: 'string' },
        operation: { type: 'string' },
      },
    },
  })
  async processCsv(
    @Body() body: { clientId: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .build({
          exceptionFactory: (validationError) => {
            return new BadRequestException({
              message: 'O arquivo deve ter uma extensão válida: csv.',
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: validationError,
            });
          },
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    try {
      let clientId = body?.clientId;

      if (currentUser.accessLevel === Role.MANAGER) {
        clientId = currentUser.clientId;
      }

      if (!clientId) {
        throw Error(`ClientId é obrigatório.`);
      }

      return await this.ucsService.processCSV(file, clientId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Não foi possível ler o arquivo!',
          stacktrace: error.stacktrace,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll(
    @Query()
    query: QueryFindAllDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.ucsService.findAll(currentUser, query);
  }

  @Get('paginate')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAllPaginated(
    @Query()
    query: QueryFindAllPaginateDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.ucsService.findPaginated(currentUser, query);
  }

  @Get('/:id')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.ucsService.findByIdPopulate(id);
  }

  @Get('/ucCode/:ucCode')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findOneByCode(@Param('ucCode') ucCode: string) {
    return this.ucsService.findWhere({ ucCode });
  }

  @Get('/details/ucCode/:ucCode')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findOneBy(@Param('ucCode') ucCode: string) {
    return this.ucsService.findWhereDetails({ ucCode });
  }

  @Get('/client/:clientId')
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAllByClientId(@Param('clientId') clientId: string) {
    return this.ucsService.findWhere({
      clientId,
      deviceId: { $exists: true, $ne: null },
    });
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateUcDto: UpdateUcDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.ucsService.update(id, updateUcDto, currentUser);
  }

  //Débito técnico
  // //Falta ainda o Resource de Devices para fazer o populate no "findByIdPopulate";
  @Put('disable/:id')
  async disable(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() { deleteData },
  ) {
    try {
      return this.ucsService.disable(id, deleteData, user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro ao desativar dispositivo da UC.',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Put('change-device/:udId')
  async changeDevice(
    @CurrentUser() user: UserFromJwt,
    @Param('udId') id: string,
    @Body() { deleteData, deviceId },
  ) {
    try {
      if (!deviceId) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'DeviceId é obrigatório.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.ucsService.changeDevice({ id, deviceId, deleteData, user });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro ao trocar dispositivo da UC.',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.ucsService.removeOne(id);
  }

  @Delete('/many/:ids')
  removeMany(@Param('ids') id: string) {
    try {
      const ids = id.split(',');
      return this.ucsService.removeMany(ids);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Não foi possível remover as ucs!',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
