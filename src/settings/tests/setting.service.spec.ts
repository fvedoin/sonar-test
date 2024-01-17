import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { RemoveSettingDto } from '../dto/remove-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { Setting } from '../entities/setting.entity';
import { SettingsController } from '../setting.controller';
import { SettingsRepository } from '../setting.repository';
import { SettingsService } from '../setting.service';
import { settingStubs } from '../stubs/setting.stub';
import { settingDtoStubs } from '../stubs/settingDTO.stub';
import { settingPopulateStub } from '../stubs/settingPopulate.stub';
import { userStub } from '../stubs/user.stub';
import { FindSettingDto } from '../dto/find-setting.dto';
import { ObjectId } from 'mongodb';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';

jest.mock('../setting.repository');

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: SettingsRepository;
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
      providers: [SettingsService, SettingsRepository, EventEmitter2],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<SettingsRepository>(SettingsRepository);
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('_sanitizeValue', () => {
    it('should remove spaces from string values', () => {
      const dto = {
        precariousVoltageAbove: '1 2 34',
        precariousVoltageBelow: '56 78',
        criticalVoltageAbove: '90 12',
        criticalVoltageBelow: '34 56',
      };

      const result = service.sanitizeValue(dto);

      expect(result.precariousVoltageAbove).toBe('1234');
      expect(result.precariousVoltageBelow).toBe('5678');
      expect(result.criticalVoltageBelow).toBe('3456');
      expect(result.criticalVoltageAbove).toBe('9012');
    });
  });

  describe('create', () => {
    let result: Setting;
    let dto: CreateSettingDto;

    beforeEach(async () => {
      dto = settingDtoStubs();
      result = await service.create(dto);
    });

    it('should return a Setting', async () => {
      expect(result).toEqual(settingStubs(dto));
    });

    // it('should emit SETTINGS_CREATED event with correct values', async () => {
    //   const eventEmitter = jest.fn().mockReturnValue({
    //     emit: jest.fn(),
    //   });
    //   expect(eventEmitter.emit).toHaveBeenCalledWith(
    //     SETTINGS_CREATED,
    //     new SettingsCreatedEvent(settingDtoStubs().clientId.toString()),
    //   );
    // });

    it('should return a Changelog with id', () => {
      expect(result._id).toBeDefined();
    });

    it('Should call changelogs repository', () => {
      expect(repository.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: { data: Setting[]; pageInfo: any };

    beforeEach(async () => {
      result = await service.findAll(findSettings, user);
    });

    it('should return settings array', () => {
      const expected = {
        data: [settingPopulateStub()],
        pageInfo: { count: 1 },
      };
      expect(result).toEqual(expected);
    });

    it('should return array with clientId populate', () => {
      expect(result.data[0].clientId).toEqual(settingPopulateStub().clientId);
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
      const user = userStub();
      const clientId = settingPopulateStub().clientId.toString();

      beforeEach(async () => {
        result = await service.findCriticalAndPrecariousVoltages(
          user,
          clientId,
        );
      });

      it('should return correct extracted settings', () => {
        const expectedSettings = {
          precariousVoltageAbove: {
            low: 233,
            high: 250,
          },
          precariousVoltageBelow: {
            low: 231,
            high: 233,
          },
          criticalVoltageAbove: {
            low: 231,
            high: 233,
          },
          criticalVoltageBelow: {
            low: 191,
            high: 202,
          },
        };
        expect(result).toEqual(expectedSettings);
      });

      it('should call setting repository', () => {
        expect(repository.findOne).toBeCalledWith(
          { clientId: clientId },
          {
            precariousVoltageAbove: 1,
            precariousVoltageBelow: 1,
            criticalVoltageAbove: 1,
            criticalVoltageBelow: 1,
          },
        );
      });
    });

    describe('findOne', () => {
      let result: Setting;
      let dto: CreateSettingDto;
      let id: string;

      beforeEach(async () => {
        dto = settingDtoStubs();
        id = settingStubs(dto)._id.toString();
        result = await service.find({ _id: id });
      });

      it('should return setting with correct id', () => {
        expect(result._id).toEqual(settingStubs(dto)._id);
      });

      it('Should call setting repository', () => {
        expect(repository.findOne).toBeCalledWith({ _id: id }, undefined);
      });
    });
  });

  describe('update', () => {
    let result: Setting;
    let dto: UpdateSettingDto;
    const id = '1';

    beforeEach(async () => {
      dto = settingDtoStubs({ precariousVoltageAbove: 'updated' });
      result = await service.update(id, dto);
    });

    it('should return setting updated', () => {
      expect(result.precariousVoltageAbove).toEqual(dto.precariousVoltageAbove);
    });

    it('should call setting repository', () => {
      expect(repository.findOneAndUpdate).toBeCalledWith(
        { _id: id },
        { $set: dto },
      );
    });
  });

  describe('remove', () => {
    let dto: RemoveSettingDto;

    beforeEach(async () => {
      dto = settingDtoStubs();
      await service.remove([settingStubs(dto)._id.toString()]);
    });

    it('Should call setting repository', () => {
      expect(repository.deleteMany).toBeCalledWith({
        _id: { $in: [settingStubs(dto)._id.toString()] },
      });
    });
  });
});
