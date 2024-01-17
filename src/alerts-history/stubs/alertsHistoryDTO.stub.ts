import { CreateAlertHistoryDto } from '../dto/create-alerts-history';

export const alertsHistoryDtoStubs = (
  dto?: Partial<CreateAlertHistoryDto>,
): CreateAlertHistoryDto => {
  return {
    alertType: 'UC',
    alertName: '111',
    alertAllows: 'Custom Allows',
    alertVariables: 'IA - Corrente na fase A (A)',
    alertValue: '0',
    operator: '>',
    sentEmail: ['brunoalvestavares@foxiot.com'],
    alertTime: new Date('2023-08-30T14:00:00Z'),
    clientId: '123123123123sad121231',
  };
};
