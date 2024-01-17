import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AlertsHistoryService } from './alerts-history.service';
import { FindAlertsHistoryDto } from './dto/find-alerts-history';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('alertsHistory')
export class AlertsHistoryController {
  constructor(private readonly alertsHistoryService: AlertsHistoryService) {}

  @Get()
  async findAll(
    @Query() query: FindAlertsHistoryDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    try {
      return this.alertsHistoryService.findAll(query, user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro ao buscar histórico de alertas.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
