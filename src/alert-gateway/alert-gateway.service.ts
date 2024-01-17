import { Injectable } from '@nestjs/common';
import { AlertGatewayRepository } from './alert-gateway.repository';

@Injectable()
export class AlertGatewayService {
  constructor(
    private readonly alertGatewayRepository: AlertGatewayRepository,
  ) {}

  async remove(id: string[]) {
    await this.alertGatewayRepository.deleteMany({ _id: { $in: id } });
  }
}
