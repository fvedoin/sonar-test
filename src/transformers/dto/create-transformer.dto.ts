import { ApiProperty } from '@nestjs/swagger';

export class CreateTransformerDto {
  @ApiProperty()
  clientId: string;

  @ApiProperty()
  it: string;

  @ApiProperty()
  serieNumber: string;

  @ApiProperty()
  tap: number;

  @ApiProperty()
  tapLevel: number;

  @ApiProperty()
  feeder: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  smartTrafoDeviceId: string;

  @ApiProperty()
  secondaryDeviceId: string;

  @ApiProperty()
  loadLimit: number;

  @ApiProperty()
  overloadTimeLimit: number;

  @ApiProperty()
  nominalValue_i: number;
}
