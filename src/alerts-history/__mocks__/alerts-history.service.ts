import { alertsHistoryDtoStubs } from '../stubs/alertsHistoryDTO.stub';

export const AlertsHistoryService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue({
    data: [alertsHistoryDtoStubs()],
    pageInfo: { count: 1 },
  }),
});
