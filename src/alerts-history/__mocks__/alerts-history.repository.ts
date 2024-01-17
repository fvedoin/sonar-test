import { alertHistoryPopulateStub } from '../stubs/alertsHistoryPopulate.stub';

export const AlertsHistoryRepository = jest.fn().mockReturnValue({
  aggregate: jest
    .fn()
    .mockResolvedValue([
      { edges: [alertHistoryPopulateStub()], pageInfo: [{ count: 1 }] },
    ]),
});
