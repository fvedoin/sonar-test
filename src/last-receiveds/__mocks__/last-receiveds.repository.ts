import { lastReceivedsStubs } from '../stubs/lastReceiveds.stubs';

export const LastReceivedsRepository = jest.fn().mockReturnValue({
  find: jest.fn().mockResolvedValue([lastReceivedsStubs()]),
});
