import { Test, TestingModule } from '@nestjs/testing';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { Setting } from '../entities/setting.entity';
import { SettingsController } from '../setting.controller';
import { SettingsService } from '../setting.service';
import { settingStubs } from '../stubs/setting.stub';
import { settingDtoStubs } from '../stubs/settingDTO.stub';
import { settingPopulateStub } from '../stubs/settingPopulate.stub';
import { userStub } from '../stubs/user.stub';
import { FindSettingDto } from '../dto/find-setting.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ObjectId } from 'mongodb';
jest.mock('../setting.service');

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;
  let findSettings: FindSettingDto;
  const user: UserFromJwt = userStub();

  beforeEach(async () => {
    findSettings = {
      clientId: new ObjectId().toHexString(),
      sort: 'asc',
      skip: '0',
      limit: '10',
      searchText: 'textoDeBusca',
      filter: [],
      fieldMask: 'campo1,campo2',
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: Setting;
    let dto: CreateSettingDto;

    beforeEach(async () => {
      dto = settingDtoStubs();
      result = await controller.create(dto);
    });

    it('should return a setting', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a setting with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call setting service', () => {
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: { data: Setting[]; pageInfo: any };
    let dto: CreateSettingDto;

    beforeEach(async () => {
      dto = settingDtoStubs();
      result = await service.findAll(findSettings, user);
    });

    it('should return settings array', () => {
      expect(result).toEqual([settingStubs(dto)]);
    });

    it('should call setting service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findCriticalAndPrecariousVoltages', () => {
    let result: {
      precariousVoltageAbove: {
        low: number;
        high: number;
      };
      precariousVoltageBelow: {
        low: number;
        high: number;
      };
      criticalVoltageAbove: {
        low: number;
        high: number;
      };
      criticalVoltageBelow: {
        low: number;
        high: number;
      };
    };
    let dto: CreateSettingDto;
    const user = userStub();
    const clientId = settingPopulateStub().clientId.toString();

    beforeEach(async () => {
      dto = settingDtoStubs();
      result = await controller.findCriticalAndPrecariousVoltages(
        user,
        clientId,
      );
    });

    it('should return settings array', () => {
      expect(result).toEqual([settingStubs(dto)]);
    });

    it('should call setting service', () => {
      expect(service.findCriticalAndPrecariousVoltages).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: Setting;
    let dto: CreateSettingDto;

    beforeEach(async () => {
      dto = settingDtoStubs();
      result = await controller.findOne(settingStubs(dto)._id.toString());
    });

    it('should return setting with correct id', () => {
      expect(result._id).toEqual(settingStubs(dto)._id);
    });

    it('Should call setting service', () => {
      expect(service.find).toBeCalledWith({
        _id: settingStubs(dto)._id.toString(),
      });
    });
  });

  describe('update', () => {
    let result: Setting;
    let dto: UpdateSettingDto;
    const id = '1';

    beforeEach(async () => {
      dto = settingDtoStubs({ precariousVoltageAbove: 'updated' });
      result = await controller.update(id, dto);
    });

    it('should return setting updated', () => {
      expect(result.precariousVoltageAbove).toEqual(dto.precariousVoltageAbove);
    });

    it('should call setting service', () => {
      expect(service.update).toBeCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    const id = settingStubs(settingDtoStubs())._id.toString();
    beforeEach(async () => {
      await controller.remove(id);
    });
    it('should remove settings', () => {
      expect(service.remove).toHaveBeenCalledWith([id]);
    });
  });
});
