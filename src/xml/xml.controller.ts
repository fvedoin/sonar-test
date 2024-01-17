import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { XmlService } from './xml.service';
import { GenerateCSVQuality } from './dto/generate-csv-quality.dto';
import { GenerateCSV } from './dto/generate-csv.dto';
import { ValidateDataExportCSV } from 'src/common/interceptors/validateDataExportCSV.interceptor';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

@ApiTags('Xml')
@Controller('xml')
@ApiBearerAuth()
export class XmlController {
  constructor(private readonly xmlService: XmlService) {}

  @Post('export-csv-quality')
  @UseInterceptors(ValidateDataExportCSV)
  async generateCSVQuality(
    @Body() data: GenerateCSVQuality,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      return await this.xmlService.generateCSVQuality({
        ...data,
        fields: data.fields.sort(),
        user,
      });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível exportar o arquivo CSV de qualidade!',
          stacktrace: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Post('export-csv')
  @UseInterceptors(ValidateDataExportCSV)
  async generateCSV(
    @Body() data: GenerateCSV,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      return await this.xmlService.generateCSV({
        ...data,
        fields: data.fields.sort(),
        user,
      });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message:
            'Não foi possível exportar o arquivo CSV de faturamento ou medidas instântaneas!',
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
