import { deviceTrStub } from '../stubs/devices-tr.stub';

export const DevicesTrService = jest.fn().mockReturnValue({
  findFilteredDevicesTr: jest.fn().mockResolvedValue([deviceTrStub()]),
  findTelikTrafoLiteDevices: jest.fn().mockResolvedValue([deviceTrStub()]),
  findFilteredTransformerTelikTrafoLite: jest
    .fn()
    .mockResolvedValue([deviceTrStub()]),
  findFilteredTransformerDevices: jest.fn().mockResolvedValue([deviceTrStub()]),
  aggregate: jest.fn().mockResolvedValue([deviceTrStub()]),
});
