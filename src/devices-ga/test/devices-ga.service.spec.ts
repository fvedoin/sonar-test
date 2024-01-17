import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { DevicesGaService } from '../devices-ga.service';
import { DevicesGaRepository } from '../devices-ga.repository';
import { DevicesGaController } from '../devices-ga.controller';
import { AwsIotManagerService } from 'src/aws-iot-manager/aws-iot-manager.service';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { createDevicesGaDtoStub } from '../stub/createDevicesGaDto.stub';
import { createAwsIotResultStub } from '../stub/aws-iot.stub';
import { deviceGAStub } from '../stub/deviceGA.stub';

jest.mock('../devices-ga.repository');

describe('DevicesGaService', () => {
  let service: DevicesGaService;
  let repository: DevicesGaRepository;
  let awsIotManagerService: AwsIotManagerService;
  let awsS3ManagerService: AwsS3ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesGaController],
      providers: [
        DevicesGaService,
        DevicesGaRepository,
        {
          provide: AwsIotManagerService,
          useValue: {
            create: jest.fn().mockResolvedValue(createAwsIotResultStub()),
            remove: jest.fn(),
          },
        },
        {
          provide: AwsS3ManagerService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DevicesGaService>(DevicesGaService);
    repository = module.get<DevicesGaRepository>(DevicesGaRepository);

    awsIotManagerService =
      module.get<AwsIotManagerService>(AwsIotManagerService);

    awsS3ManagerService = module.get<AwsS3ManagerService>(AwsS3ManagerService);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  describe('Access with access level ADMIN', () => {
    const createDevicesGaDto = createDevicesGaDtoStub();

    describe('create', () => {
      it('Should be to call awsIotManagerService.create', async () => {
        await service.create(createDevicesGaDto);

        expect(awsIotManagerService.create).toHaveBeenCalledWith({
          thingName: 'tele-' + createDevicesGaDto.devId,
        });
      });

      it('Should be to call awsS3ManagerService.create', async () => {
        await service.create(createDevicesGaDto);

        const bucketName = process.env.AWS_BUCKET_IOT_CERTS;

        expect(awsS3ManagerService.uploadFile).toHaveBeenNthCalledWith(1, {
          Bucket: bucketName,
          Key: `tele-${createDevicesGaDto.devId}/client.key`,
          Body: createAwsIotResultStub().certs.keyPair.PrivateKey,
        });

        expect(awsS3ManagerService.uploadFile).toHaveBeenNthCalledWith(2, {
          Bucket: bucketName,
          Key: `tele-${createDevicesGaDto.devId}/client.crt`,
          Body: createAwsIotResultStub().certs.certificatePem,
        });
      });

      it('Should be to call repository.findOnePopulated', async () => {
        await service.create(createDevicesGaDto);

        expect(repository.findOnePopulated).toBeCalledWith({
          devId: createDevicesGaDto.devId,
        });
      });

      it('Should be transform clientId in Object', async () => {
        const spyTransformId = jest.spyOn(service, 'transformIdToObject');

        await service.create({
          createDevicesGaDto,
          //@ts-ignore
          clientId: createDevicesGaDto.clientId.toString(),
        });

        expect(spyTransformId).toReturnWith(
          new Types.ObjectId(createDevicesGaDto.clientId),
        );
        expect(spyTransformId).toBeCalledWith(
          createDevicesGaDto.clientId.toString(),
        );

        spyTransformId.mockClear();
      });

      test('Should be get Error if devId exist', async () => {
        const repositorySpy = jest
          .spyOn(repository, 'findOnePopulated')
          .mockResolvedValue(
            deviceGAStub(null, { devId: createDevicesGaDto.devId }),
          );

        try {
          await service.create(createDevicesGaDto);
        } catch (error) {
          expect(error.message).toBe(
            'Não foi possível usar esse DevId. Ele já está sendo usado!',
          );
        }

        repositorySpy.mockClear();
      });

      it('Should be to call repository.create', async () => {
        await service.create(createDevicesGaDto);

        expect(repository.create).toHaveBeenNthCalledWith(1, {
          clientId: createDevicesGaDto.clientId,
          description: createDevicesGaDto.description,
          devId: createDevicesGaDto.devId,
          name: createDevicesGaDto.name,
          provider: createDevicesGaDto.provider,
        });
      });
    });
  });

  describe('Access with access level SUPPORT', () => {});
  describe('Access with access level VIEWER', () => {});
  describe('Access with access level MANAGER', () => {});
  describe('Access with access level COMMERCIAL', () => {});
});
