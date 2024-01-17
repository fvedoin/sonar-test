import { createUcdisabledHistoryDtoStubs } from '../stubs/ucdisabled-history.stub';

export const UcdisabledHistoryRepository = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue({
    data: [createUcdisabledHistoryDtoStubs()],
    pageInfo: {},
  }),
  create: jest.fn().mockResolvedValue(createUcdisabledHistoryDtoStubs()),
});
