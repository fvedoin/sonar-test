import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/clients/clients.module';
import { Transformer, TransformerSchema } from './entities/transformer.entity';
import { TransformersController } from './transformers.controller';
import { TransformersService } from './transformers.service';
import { TransformersRepository } from './transformers.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transformer.name, schema: TransformerSchema },
    ]),
    ClientsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [TransformersController],
  providers: [TransformersService, TransformersRepository],
  exports: [TransformersService],
})
export class TransformersModule {}
