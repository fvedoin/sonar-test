import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDevicesGbDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  devId: string;

  @ApiPropertyOptional()
  databaseId?: string;

  @ApiPropertyOptional()
  devEui?: string;

  @ApiPropertyOptional()
  appEui?: string;

  @ApiPropertyOptional()
  lorawanVersion?: string;

  @ApiPropertyOptional()
  lorawanPhyVersion?: string;

  @ApiPropertyOptional()
  frequencyPlanId?: string;

  @ApiPropertyOptional()
  supportsJoin?: string;

  @ApiPropertyOptional()
  appKey?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  topics?: string[];

  @ApiPropertyOptional()
  username?: string;

  @ApiProperty({ enum: ['LoRa', 'GSM'] })
  type: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    enum: ['ABNT NBR 14522', 'PIMA', 'Saída de usuário', 'DLMS'],
  })
  communication: string;

  @ApiPropertyOptional()
  allows: Array<string>;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  bucketId: string;

  @ApiPropertyOptional()
  applicationId?: string;

  @ApiPropertyOptional()
  brokerAttributeId?: string;
}
