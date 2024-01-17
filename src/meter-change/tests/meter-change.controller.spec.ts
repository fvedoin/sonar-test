import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../stubs/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateMeterChangeDto } from '../dto/create-meter-change.dto';
import { UpdateMeterChangeDto } from '../dto/update-meter-change.dto';
import { MeterChanges } from '../entities/meter-change.entity';
import { MeterChangeController } from '../meter-change.controller';
import { MeterChangeService } from '../meter-change.service';
import { meterChangeStubs } from '../stubs/meter-change.stub';
import { meterChangeDtoStubs } from '../stubs/meter-changeDTO.stub';
jest.mock('../meter-change.service');

const user: UserFromJwt = userStub();

describe('MeterChangeController', () => {
  let controller: MeterChangeController;
  let service: MeterChangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeterChangeController],
      providers: [MeterChangeService],
    }).compile();

    controller = module.get<MeterChangeController>(MeterChangeController);
    service = module.get<MeterChangeService>(MeterChangeService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: MeterChanges;
    let dto: CreateMeterChangeDto;

    beforeEach(async () => {
      dto = meterChangeDtoStubs();
      result = await controller.create(dto);
    });

    it('should return a meterChange', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a meterChange with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call meterChange service', () => {
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: MeterChanges[];
    let dto: CreateMeterChangeDto;

    beforeEach(async () => {
      dto = meterChangeDtoStubs();
      result = await controller.findAll(user);
    });

    it('should return meterChange array', () => {
      expect(result).toEqual([meterChangeStubs(dto)]);
    });

    it('should call meterChange service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: MeterChanges;
    let dto: CreateMeterChangeDto;

    beforeEach(async () => {
      dto = meterChangeDtoStubs();
      result = await controller.findOne(meterChangeStubs(dto)._id.toString());
    });

    it('should return meterChange with correct id', () => {
      expect(result._id).toEqual(meterChangeStubs(dto)._id);
    });

    it('Should call meterChange service', () => {
      expect(service.findOne).toBeCalledWith(
        meterChangeStubs(dto)._id.toString(),
      );
    });
  });

  describe('update', () => {
    let result: MeterChanges;
    let dto: UpdateMeterChangeDto;
    const id = '1';

    beforeEach(async () => {
      dto = meterChangeDtoStubs({ firstConsumedNewMeter: 123 });
      result = await controller.update(id, dto);
    });

    it('should return meterChange updated', () => {
      expect(result.firstConsumedNewMeter).toEqual(dto.firstConsumedNewMeter);
    });

    it('should call meterChange service', () => {
      expect(service.update).toBeCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    const id = meterChangeStubs(meterChangeDtoStubs())._id.toString();
    beforeEach(async () => {
      await controller.remove(id);
    });
    it('should remove meterChange', () => {
      expect(service.remove).toHaveBeenCalledWith([id]);
    });
  });
});
