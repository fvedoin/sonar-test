import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { userDTOStub } from '../stubs/userDTO.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { userStub } from '../stubs/user.stub';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(userStub()),
            findByIdAndUpdate: jest.fn().mockResolvedValue(userStub()),
            findById: jest.fn().mockResolvedValue(userStub()),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: AwsS3ManagerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('generateCode', () => {
    let userCreated;
    let result;
    let dto: CreateUserDto;

    beforeEach(async () => {
      dto = userDTOStub();
      userCreated = await service.create(dto);

      result = await service.generateCode(userCreated._id);
    });

    it('should be able to return user', () => {
      expect(result).toEqual({
        ...userCreated,
        createdAt: expect.any(Date),
        _id: expect.any(String),
        clientId: expect.any(String),
      });
    });

    it('shouldnt be able to return generate Code', () => {
      expect(result.generateCode).toEqual(undefined);
    });
  });

  describe('verifyCode', () => {
    let userCreated;
    let result;
    let dto: CreateUserDto;

    beforeEach(async () => {
      dto = userDTOStub();
      userCreated = await service.create(dto);

      result = await service.verifyCode(
        userStub().generatedCode,
        userCreated._id,
      );
    });

    it('should be able to return code', () => {
      expect(result).toEqual({ code: userStub().generatedCode });
    });
  });
});
