import { Types } from 'mongoose';
import { CreateInfluxBucketDto } from 'src/influx-buckets/dto/create-influx-bucket.dto';
import { CreateInfluxConnectionDto } from 'src/influx-connections/dto/create-influx-connection.dto';
import { InfluxConnectionDocument } from 'src/influx-connections/entities/influx-connection.entity';

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
