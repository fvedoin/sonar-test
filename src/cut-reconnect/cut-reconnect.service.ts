import { Injectable } from '@nestjs/common';
import { CutConnectRepository } from './cut-reconnect.repository';
import { CutReconnect } from './entities/cut-reconnect.entity';
import { FilterQuery } from 'mongoose';

@Injectable()
export class CutReconnectService {
  constructor(private readonly cutConnectRepository: CutConnectRepository) {}

  async findWhere(where: FilterQuery<CutReconnect>) {
    return await this.cutConnectRepository.findWhere(where);
  }
}
