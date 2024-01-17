import { PartialType } from '@nestjs/swagger';

import { CreateInfluxBucketDto } from './create-influx-bucket.dto';

export class UpdateInfluxBucketDto extends PartialType(CreateInfluxBucketDto) {}
