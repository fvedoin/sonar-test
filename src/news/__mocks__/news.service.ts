import { newsStub } from '../stubs/news.stub';

export const NewsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(newsStub()),

  findAll: jest.fn().mockResolvedValue([newsStub()]),

  findOne: jest.fn().mockResolvedValue(newsStub()),

  update: jest
    .fn()
    .mockResolvedValue({ ...newsStub(), description: 'updated' }),

  remove: jest.fn().mockResolvedValue(newsStub()),
});
