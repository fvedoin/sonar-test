import { Controller } from '@nestjs/common';
import { CutReconnectService } from './cut-reconnect.service';

@Controller('cut-reconnect')
export class CutReconnectController {
  constructor(private readonly cutReconnect: CutReconnectService) {}
}
