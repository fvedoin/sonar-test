import { ApiProperty } from '@nestjs/swagger';

export class DeleteDataDto {
  @ApiProperty()
  deleteData: boolean;
}
