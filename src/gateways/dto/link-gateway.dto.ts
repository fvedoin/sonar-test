import { ApiProperty } from '@nestjs/swagger';

export class LinkGatewayDto {
  @ApiProperty()
  clientId: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  latitude: string;
}
