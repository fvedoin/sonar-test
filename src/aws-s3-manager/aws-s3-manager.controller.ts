import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AwsS3ManagerService } from './aws-s3-manager.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

@Controller('s3')
export class AwsS3ManagerController {
  constructor(private readonly s3Service: AwsS3ManagerService) {}

  @Get('file/:key')
  async getFile(@Param('key') key: string) {
    try {
      return await this.s3Service.getUrlFile(key);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível buscar o arquivo!',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Get('file')
  async getFiles(@CurrentUser() user: UserFromJwt) {
    try {
      const prefix = `${user.username}`;
      return await this.s3Service.getListFiles(prefix);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível buscar os arquivos!',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }
}
