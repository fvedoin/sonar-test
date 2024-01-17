import { Types } from 'mongoose';
import { CreateInfluxConnectionDto } from 'src/influx-connections/dto/create-influx-connection.dto';

export const influxConnectionStub = (
  _id: Types.ObjectId,
  dto: Partial<CreateInfluxConnectionDto>,
) => ({
  _id,
  name: 'fox-iot-telemedicao-b',
  ...dto,
});

export const influxConnectionStubDtoStubs = (
  dto?: Partial<CreateInfluxConnectionDto>,
): CreateInfluxConnectionDto => {
  return {
    apiToken: '',
    alias: '',
    host: '',
    orgId: 'fox-iot',
    ...dto,
  };
};
