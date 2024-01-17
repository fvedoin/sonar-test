import {
  Controller,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AlertGatewayService } from './alert-gateway.service';
import { Role } from 'src/auth/models/Role';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('alert-gateway')
export class AlertGatewayController {
  constructor(private readonly alertGatewayService: AlertGatewayService) {}

  @Delete(':id')
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    try {
      const ids: string[] = id.split(',');
      await this.alertGatewayService.remove(ids);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível deletar os alertas de gateways!',
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
