import { tokenStub } from '../stubs/token.stub';

export const NewsRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(tokenStub()),

  find: jest.fn().mockResolvedValue([tokenStub()]),

  findOne: jest.fn().mockResolvedValue(tokenStub()),

  deleteMany: jest.fn().mockResolvedValue([tokenStub()]),

  startTransaction: jest.fn().mockResolvedValue({
    commitTransaction: jest.fn(),
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
  }),

  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue({ ...tokenStub(), description: 'updated' }),

  remove: jest.fn().mockResolvedValue(tokenStub()),
});
