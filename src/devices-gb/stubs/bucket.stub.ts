import { Types } from 'mongoose';
import { CreateInfluxBucketDto } from 'src/influx-buckets/dto/create-influx-bucket.dto';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';

export const bucketStub = (
  id = new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
  bucket?: Partial<CreateInfluxBucketDto>,
) => {
  return {
    _id: id,
    name: 'device-gb',
    alias: 'Autogenerated device-gb',
    product: 'smart-trafo',
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    influxConnectionId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    ...bucket,
  };
};

export const bucketDtoStubs = (
  dto?: Partial<CreateInfluxBucketDto>,
): CreateInfluxBucketDto => {
  return {
    name: 'fox-iot-telemedicao-b',
    influxConnectionId: new Types.ObjectId().toString(),
    clientId: new Types.ObjectId().toString(),
    alias: 'Bucket Smart Trafo',
    product: 'smart-trafo',
    ...dto,
  };
};
