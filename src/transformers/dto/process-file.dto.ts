import { ApiProperty } from '@nestjs/swagger';

export class ProcessFileDto {
  @ApiProperty()
  clientId: string;
}
