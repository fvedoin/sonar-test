import { areaStubs } from '../stubs/area.stub';
import { areaDtoStubs } from '../stubs/areaDTO.stub';

export const AreaService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(areaStubs(areaDtoStubs())),
  findAll: jest.fn().mockResolvedValue([areaStubs(areaDtoStubs())]),
  findOne: jest.fn().mockResolvedValue(areaStubs(areaDtoStubs())),
  update: jest
    .fn()
    .mockResolvedValue(areaStubs(areaDtoStubs({ name: 'updated' }))),
  remove: jest.fn().mockResolvedValue(areaStubs(areaDtoStubs())),
});
