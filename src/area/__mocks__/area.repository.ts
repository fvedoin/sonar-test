import { areaStubs } from '../stubs/area.stub';
import { areaDtoStubs } from '../stubs/areaDTO.stub';
import { areaPopulateStub } from '../stubs/areaPopulate.stub';

export const AreaRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(areaStubs(areaDtoStubs())),
  findAllAndPopulate: jest.fn().mockResolvedValue([areaPopulateStub()]),
  findOne: jest.fn().mockResolvedValue(areaStubs(areaDtoStubs())),
  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue(areaStubs(areaDtoStubs({ name: 'updated' }))),
  deleteMany: jest.fn().mockResolvedValue(void 0),
});
