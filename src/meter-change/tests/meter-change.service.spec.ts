import { Test, TestingModule } from '@nestjs/testing';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateMeterChangeDto } from '../dto/create-meter-change.dto';
import { UpdateMeterChangeDto } from '../dto/update-meter-change.dto';
import { MeterChanges } from '../entities/meter-change.entity';
import { MeterChangeController } from '../meter-change.controller';
import { MeterChangeRepository } from '../meter-change.repository';
import { MeterChangeService } from '../meter-change.service';
import { meterChangeStubs } from '../stubs/meter-change.stub';
import { meterChangeDtoStubs } from '../stubs/meter-changeDTO.stub';
import { meterChangesPopulateStub } from '../stubs/meter-changePopulate.stub';
import { userStub } from '../stubs/user.stub';
jest.mock('../meter-change.repository');

const user: UserFromJwt = userStub();

describe('MeterChangeService', () => {
  let service: MeterChangeService;
  let repository: MeterChangeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeterChangeController],
      providers: [MeterChangeService, MeterChangeRepository],
    }).compile();

    service = module.get<MeterChangeService>(MeterChangeService);
    repository = module.get<MeterChangeRepository>(MeterChangeRepository);
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: MeterChanges;
    let dto: CreateMeterChangeDto;

    beforeEach(async () => {
      dto = meterChangeDtoStubs();
      result = await service.create(dto);
    });

    it('should return a meterChange', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a meterChange with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call meterChange repository', () => {
      expect(repository.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: MeterChanges[];

    beforeEach(async () => {
      result = await service.findAll(user);
    });

    it('should return meterChanges array', () => {
      expect(result).toEqual([meterChangesPopulateStub()]);
    });

    it('should return array with clientId populate', () => {
      expect(result[0].clientId).toEqual(meterChangesPopulateStub().clientId);
    });

    it('should call meterChange repository', () => {
      expect(repository.findAndPopulate).toBeCalledWith({}, [
        'clientId',
        'deviceId',
      ]);
    });
  });

  describe('findOne', () => {
    let result: MeterChanges;
    let dto: CreateMeterChangeDto;
    let id: string;

    beforeEach(async () => {
      dto = meterChangeDtoStubs();
      id = meterChangeStubs(dto)._id.toString();
      result = await service.findOne(id);
    });

    it('should return meterChange with correct id', () => {
      expect(result._id).toEqual(meterChangeStubs(dto)._id);
    });
  });

  describe('update', () => {
    let result: MeterChanges;
    let dto: UpdateMeterChangeDto;
    const id = '1';

    beforeEach(async () => {
      dto = meterChangeDtoStubs({ firstConsumedNewMeter: 123 });
      result = await service.update(id, dto);
    });

    it('should return meterChange updated', () => {
      expect(result.firstConsumedNewMeter).toEqual(dto.firstConsumedNewMeter);
    });

    it('should call meterChange repository', () => {
      expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, dto);
    });
  });

  describe('remove', () => {
    const id = meterChangeStubs(meterChangeDtoStubs())._id.toString();
    beforeEach(async () => {
      await repository.deleteMany([id]);
    });
    it('should remove meterChange', () => {
      expect(repository.deleteMany).toHaveBeenCalledWith([id]);
    });
  });
});
