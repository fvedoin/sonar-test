import { deviceGBStub } from '../stubs/deviceGB.stub';

export const DevicesGbRepository = jest.fn().mockReturnValue({
  findByIdPopulate: jest.fn().mockResolvedValue(deviceGBStub()),
  migrateDevices: jest.fn(),
});
