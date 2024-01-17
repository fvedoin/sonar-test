import { ucStubs } from '../stubs/uc.stub';
import { ucDtoStubs } from '../stubs/ucDto.stub';

export const UcsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  findAll: jest.fn().mockResolvedValue([ucStubs(ucDtoStubs())]),
  findOne: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  update: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs({ ucCode: '123' }))),
  removeOne: jest.fn().mockResolvedValue(void 0),
  removeMany: jest.fn().mockResolvedValue(void 0),
  findByIdPopulate: jest.fn().mockResolvedValue(ucStubs(ucDtoStubs())),
  findWhere: jest.fn().mockResolvedValue([ucStubs(ucDtoStubs())]),
  findPaginated: jest
    .fn()
    .mockResolvedValue({ data: [ucStubs(ucDtoStubs())], pageInfo: {} }),
});
