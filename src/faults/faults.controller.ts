import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FaultsService } from './faults.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('faults')
export class FaultsController {
  constructor(private readonly faultsService: FaultsService) {}

  @Get('export-csv')
  async exportCSV(
    @Query() { ucs, dateRange }: any,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      const userId = user.id;

      if (!ucs.length) {
        throw {
          message: `Nenhuma uc selecionada.`,
        };
      }

      if (!dateRange) {
        throw {
          message: `DateRange é obrigatório.`,
        };
      }

      return await this.faultsService.exportCSV({ ucs, dateRange, userId });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Ocorreu um erro ao exportar o CSV das faltas.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
