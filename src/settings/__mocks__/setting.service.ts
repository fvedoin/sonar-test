import { settingStubs } from '../stubs/setting.stub';
import { settingDtoStubs } from '../stubs/settingDTO.stub';

export const SettingsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(settingStubs(settingDtoStubs())),
  findAll: jest.fn().mockResolvedValue([settingStubs(settingDtoStubs())]),
  find: jest.fn().mockResolvedValue(settingStubs(settingDtoStubs())),
  findCriticalAndPrecariousVoltages: jest
    .fn()
    .mockResolvedValue([settingStubs(settingDtoStubs())]),
  update: jest
    .fn()
    .mockResolvedValue(
      settingStubs(settingDtoStubs({ precariousVoltageAbove: 'updated' })),
    ),
  remove: jest.fn().mockResolvedValue(settingStubs(settingDtoStubs())),
});
