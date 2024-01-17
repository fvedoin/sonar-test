import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { ClientsService } from 'src/clients/clients.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    const { modules } = createUserDto;
    if (
      modules.findIndex((item) => item.includes('Telemedição')) < 0 &&
      modules.findIndex((item) => item === 'Faltas') >= 0
    ) {
      throw {
        name: 'NotAllowedError',
        message:
          'Para selecionar o módulo "Faltas", selecione também "Telemedição LoRa" ou "Telemedição GSM"!',
      };
    }

    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get()
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: User) {
    if (user.accessLevel === Role.ADMIN) {
      const clients = await this.clientsService.findWhere({
        parentId: user.clientId,
      });
      const whereClause = {
        $or: [
          { clientId: user.clientId },
          {
            clientId: {
              $in: clients.map((client) => client._id),
            },
          },
        ],
      };
      return this.usersService.findWhere(whereClause);
    }

    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/generate-code')
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
        _id: { type: 'string' },
        accessLevel: { type: 'string' },
        active: { type: 'boolean' },
        blocked: { type: 'boolean' },
        clientId: { type: 'string' },
        createdAt: { type: 'string' },
        modules: { type: 'array' },
      },
    },
  })
  async generateChangeCode(@Param('id') userId: string) {
    try {
      return await this.usersService.generateCode(userId);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message || 'Não possível gerar um codígo.',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Put(':id/verify-code')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
        _id: { type: 'string' },
        accessLevel: { type: 'string' },
        active: { type: 'boolean' },
        blocked: { type: 'boolean' },
        clientId: { type: 'string' },
        createdAt: { type: 'string' },
        modules: { type: 'array' },
      },
    },
  })
  async verifyCode(
    @Param('id') userId: string,
    @Body() { code }: { code: number },
  ) {
    try {
      return await this.usersService.verifyCode(Number(code), userId);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message || 'Não foi possível verificar o código!',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Put(':id/profile')
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'email' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
        _id: { type: 'string' },
        accessLevel: { type: 'string' },
        active: { type: 'boolean' },
        blocked: { type: 'boolean' },
        clientId: { type: 'string' },
        createdAt: { type: 'string' },
        modules: { type: 'array' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateProfile(
    @Body()
    {
      name,
      phone,
      oldImage,
      username,
    }: {
      name: string;
      phone: string;
      oldImage: string;
      username: string;
    },
    @Param('id') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (!username)
        throw new BadRequestException('Username deve ser informado.');

      return await this.usersService.updateProfile({
        name,
        userId,
        phone,
        oldImage,
        username,
        newImage: image,
      });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message || 'Não possível atualizar o perfil.',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Get(':id/profile')
  @ApiBearerAuth()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SUPPORT, Role.VIEWER)
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
        _id: { type: 'string' },
        accessLevel: { type: 'string' },
        active: { type: 'boolean' },
        blocked: { type: 'boolean' },
        clientId: { type: 'string' },
        createdAt: { type: 'string' },
        modules: { type: 'array' },
      },
    },
  })
  async getProfile(@Param('id') userId: string) {
    try {
      return await this.usersService.getProfile(userId);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: err.message || 'Não foi possível obter o perfil do usuário.',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
