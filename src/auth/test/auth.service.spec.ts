import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/token/token.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { TokenRepository } from 'src/token/token.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: TokenService,
          useValue: {},
        },
        {
          provide: RabbitMQService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });
});
