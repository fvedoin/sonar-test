import { Test, TestingModule } from '@nestjs/testing';
import { DevicesGaController } from '../devices-ga.controller';
import { DevicesGaService } from '../devices-ga.service';
import { userStub } from '../stub/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { createDevicesGaDtoStub } from '../stub/createDevicesGaDto.stub';
import { AwsIotManagerService } from 'src/aws-iot-manager/aws-iot-manager.service';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { createAwsIotResultStub } from '../stub/aws-iot.stub';

describe('DevicesGaController', () => {
  let controller: DevicesGaController;
  let service: DevicesGaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesGaController],
      providers: [
        {
          provide: DevicesGaService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: AwsIotManagerService,
          useValue: {
            create: jest.fn().mockResolvedValue(createAwsIotResultStub()),
          },
        },
        {
          provide: AwsS3ManagerService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<DevicesGaController>(DevicesGaController);
    service = module.get<DevicesGaService>(DevicesGaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Access with access level ADMIN', () => {
    const user: UserFromJwt = userStub();
    const createDevicesGaDto = createDevicesGaDtoStub();

    describe('create', () => {
      it('Should be to call service.create', async () => {
        await controller.create(createDevicesGaDto);

        expect(service.create).toHaveBeenCalledWith({
          clientId: createDevicesGaDto.clientId,
          description: createDevicesGaDto.description,
          devId: createDevicesGaDto.devId,
          name: createDevicesGaDto.name,
          provider: createDevicesGaDto.provider,
        });
      });
    });
  });
});
