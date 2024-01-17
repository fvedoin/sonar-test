import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':clientId')
  async lastHour(@Param('clientId') clientId: string) {
    try {
      return await this.dashboardService.lastHour(clientId);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
