import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AlertGateway } from './entities/alert-gateway.entity';

@Injectable()
export class AlertGatewayRepository extends AbstractRepository<AlertGateway> {
  constructor(
    @InjectModel(AlertGateway.name)
    private alertModel: Model<AlertGateway>,
    @InjectConnection() connection: Connection,
  ) {
    super(alertModel, connection);
  }

  async deleteMany(where): Promise<void> {
    await this.alertModel.deleteMany(where);
  }
}
