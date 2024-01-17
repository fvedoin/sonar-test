import { newsStub } from '../stubs/news.stub';

export const NewsRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(newsStub()),

  find: jest.fn().mockResolvedValue([newsStub()]),

  findOne: jest.fn().mockResolvedValue(newsStub()),

  deleteMany: jest.fn().mockResolvedValue([newsStub()]),

  startTransaction: jest.fn().mockResolvedValue({
    commitTransaction: jest.fn(),
    startTransaction: jest.fn(),
    abortTransaction: jest.fn(),
  }),

  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue({ ...newsStub(), description: 'updated' }),

  remove: jest.fn().mockResolvedValue(newsStub()),
});
