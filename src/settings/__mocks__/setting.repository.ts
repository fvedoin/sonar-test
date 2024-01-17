import { settingStubs } from '../stubs/setting.stub';
import { settingDtoStubs } from '../stubs/settingDTO.stub';
import { settingPopulateStub } from '../stubs/settingPopulate.stub';

export const SettingsRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(settingStubs(settingDtoStubs())),
  aggregate: jest
    .fn()
    .mockResolvedValue([
      { edges: [settingPopulateStub()], pageInfo: [{ count: 1 }] },
    ]),
  findOne: jest.fn().mockResolvedValue(settingStubs(settingDtoStubs())),
  findCriticalAndPrecariousVoltages: jest
    .fn()
    .mockResolvedValue([settingPopulateStub()]),
  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue(
      settingStubs(settingDtoStubs({ precariousVoltageAbove: 'updated' })),
    ),
  deleteMany: jest.fn().mockResolvedValue(void 0),
});
