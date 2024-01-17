import { deviceGBStub } from '../stubs/deviceGB.stub';
import { ucStubs } from '../stubs/uc.stub';
import { ucDtoStubs } from '../stubs/ucDto.stub';

export const UcsRepository = jest.fn().mockReturnValue({
  countByDeviceId: jest.fn().mockResolvedValue(0),
  countByUcByDeviceId: jest.fn().mockResolvedValue(0),
  create: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  findOne: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue(ucStubs(ucDtoStubs({ ucCode: '123' }))),
  findByIdWithPopulate: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  delete: jest.fn().mockResolvedValue(void 0),
  deleteMany: jest.fn().mockResolvedValue(void 0),
  findWithPopulate: jest.fn().mockResolvedValue([ucStubs(ucDtoStubs())]),
  findPopulatedAndSortLastReceivedByPort: jest
    .fn()
    .mockResolvedValue([ucStubs(ucDtoStubs())]),
  findWithOnePopulate: jest.fn().mockResolvedValue({
    ...ucStubs(ucDtoStubs()),
    deviceId: deviceGBStub(),
  }),
  findAndPopulate: jest.fn().mockResolvedValue([ucStubs(ucDtoStubs())]),
  findPaginated: jest
    .fn()
    .mockResolvedValue({ data: [ucStubs(ucDtoStubs())], pageInfo: {} }),
  migrateUcDevice: jest.fn(),
});
