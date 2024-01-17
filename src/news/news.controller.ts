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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { Role } from '../auth/models/Role';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@ApiTags('Notícias')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        url: { type: 'string' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<News> {
    try {
      return await this.newsService.create(
        {
          ...createNewsDto,
          image: image.filename,
        },
        image,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Não foi possível salvar a notícia!',
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
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.newsService.findOne(id);
  }

  //Rota só funciona dentro da plataforma
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        url: { type: 'string' },
        description: { type: 'string' },
        oldImage: { type: 'string' },
        image: {
          //Nova
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateNewsDto | { oldImage: string },
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      return await this.newsService.update(id, body, image);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Não foi possível atualizar a notícia!',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':ids')
  async remove(@Param('ids') ids: string) {
    const idArray: string[] = ids.split(',');
    return await this.newsService.remove(idArray);
  }
}
