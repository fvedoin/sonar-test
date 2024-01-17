import { Test, TestingModule } from '@nestjs/testing';
import { AwsIotManagerService } from '../aws-iot-manager.service';
import { AwsIoTManagerRepository } from '../aws-iot-manager.repository';
import { certsStub } from '../stub/certificates.stub';
import { thingStub } from '../stub/thing.stub';

describe('AwsIotManagerService', () => {
  let service: AwsIotManagerService;
  let repository: AwsIoTManagerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsIotManagerService,
        {
          provide: AwsIoTManagerRepository,
          useValue: {
            createThing: jest.fn().mockResolvedValue(thingStub()),
            createCertificate: jest.fn().mockResolvedValue(certsStub()),
            attachCertificate: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: 'AWS_SDK_V3_MODULE#IoTClient#',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AwsIotManagerService>(AwsIotManagerService);
    repository = module.get<AwsIoTManagerRepository>(AwsIoTManagerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should be call repository.create', async () => {
      await service.create({
        thingName: thingStub().thingName,
      });

      expect(repository.createThing).toHaveBeenCalledWith({
        thingName: thingStub().thingName,
      });
    });

    it('should be call repository.attachCertificate', async () => {
      await service.create({
        thingName: thingStub().thingName,
      });

      expect(repository.attachCertificate).toHaveBeenCalledWith({
        thingName: thingStub().thingName,
        certificateArn: certsStub().certificateArn,
      });
    });

    it('should be get result', async () => {
      const result = await service.create({
        thingName: thingStub().thingName,
      });

      expect(result).toMatchObject({
        certs: certsStub(),
        thing: thingStub(),
      });
    });
  });
});
