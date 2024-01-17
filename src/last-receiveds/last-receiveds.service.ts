import { Injectable } from '@nestjs/common';
import { LastReceivedsRepository } from './last-receiveds.repository';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { LastReceived } from './entities/last-received.entity';

@Injectable()
export class LastReceivedsService {
  constructor(
    private readonly lastReceivedsRepository: LastReceivedsRepository,
  ) {}

  async find(
    query: FilterQuery<LastReceived>,
    projection?: ProjectionFields<LastReceived>,
  ): Promise<Partial<LastReceived[]>> {
    return await this.lastReceivedsRepository.find(query, projection);
  }
}
