import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/clients/clients.module';

import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RabbitMQModule } from 'src/rabbit-mq/rabbit-mq.module';
import { AwsS3ManagerModule } from 'src/aws-s3-manager/aws-s3-manager.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    RabbitMQModule,
    AwsS3ManagerModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
