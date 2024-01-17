import { Types } from 'mongoose';
import { influxConnectionStub } from '../stubs/influxConnection.stub';

export const InfluxConnectionsService = jest.fn().mockReturnValue({
  findOne: jest
    .fn()
    .mockResolvedValue(
      influxConnectionStub(new Types.ObjectId('6401fdaf1224add8ade50026'), {}),
    ),
});
