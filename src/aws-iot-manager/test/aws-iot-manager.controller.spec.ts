import { Test, TestingModule } from '@nestjs/testing';
import { AwsIotManagerController } from '../aws-iot-manager.controller';
import { AwsIotManagerService } from '../aws-iot-manager.service';
import { createAwsIotResultStub } from '../stub/aws-iot.stub';

describe('AwsIotManagerController', () => {
  let controller: AwsIotManagerController;
  let service: AwsIotManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsIotManagerController],
      providers: [
        {
          provide: AwsIotManagerService,
          useValue: {
            create: jest.fn().mockResolvedValue(createAwsIotResultStub()),
          },
        },
        {
          provide: 'AWS_SDK_V3_MODULE#IoTClient#',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AwsIotManagerService>(AwsIotManagerService);
    controller = module.get<AwsIotManagerController>(AwsIotManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should be call service.create', async () => {
      await controller.create({
        thingName: 'test',
      });

      expect(service.create).toHaveBeenCalledWith({
        thingName: 'test',
      });
    });

    it('should be get result', async () => {
      const result = await controller.create({
        thingName: 'test',
      });

      expect(result).toMatchObject(createAwsIotResultStub());
    });
  });
});
