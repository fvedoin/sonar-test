import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('rabbit-mq-module') private readonly client: ClientProxy,
  ) {}
  public send(pattern: string, data: any) {
    Logger.debug(pattern, data);
    Logger.debug(this.client);
    return this.client.send(pattern, data).subscribe((observer) => {
      Logger.debug(observer);
    });
  }
}
