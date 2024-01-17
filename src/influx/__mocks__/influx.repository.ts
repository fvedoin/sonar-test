import { lastHourStubs } from '../stubs/lastHours.stub';

export const InfluxRepository = jest.fn().mockReturnValue({
  connection: jest.fn().mockResolvedValue({
    getQueryApi: jest.fn().mockReturnValue({
      collectRows: jest.fn().mockResolvedValue([lastHourStubs()]),
    }),
  }),
});
