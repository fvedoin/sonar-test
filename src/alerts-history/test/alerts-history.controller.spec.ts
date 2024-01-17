import { Test, TestingModule } from '@nestjs/testing';
import { AlertsHistoryController } from '../alerts-history.controller';
import { AlertsHistoryService } from '../alerts-history.service';
import { AlertHistory } from '../entities/alerts-history.entity';
import { CreateAlertHistoryDto } from '../dto/create-alerts-history';
import { alertsHistoryDtoStubs } from '../stubs/alertsHistoryDTO.stub';
import { userStub } from '../stubs/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { FindAlertsHistoryDto } from '../dto/find-alerts-history';

jest.mock('../alerts-history.service');

const user: UserFromJwt = userStub();

describe('AlertsHistoryController', () => {
  let controller: AlertsHistoryController;
  let service: AlertsHistoryService;
  let findAlerts: FindAlertsHistoryDto;

  beforeEach(async () => {
    findAlerts = {
      clientId: new Object().toString(),
      sort: 'asc',
      skip: '0',
      limit: '10',
      searchText: 'textoDeBusca',
      filter: [],
      fieldMask: 'campo1,campo2',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsHistoryController],
      providers: [AlertsHistoryService],
    }).compile();

    controller = module.get<AlertsHistoryController>(AlertsHistoryController);
    service = module.get<AlertsHistoryService>(AlertsHistoryService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('getAlertsHistory', () => {
    let result: { data: AlertHistory[]; pageInfo: any };
    let dto: CreateAlertHistoryDto;

    const expected = {
      data: [
        {
          alertAllows: 'Custom Allows',
          alertName: '111',
          alertTime: new Date('2023-08-30T14:00:00.000Z'),
          alertType: 'UC',
          alertValue: '0',
          alertVariables: 'IA - Corrente na fase A (A)',
          clientId: '123123123123sad121231',
          operator: '>',
          sentEmail: ['brunoalvestavares@foxiot.com'],
        },
      ],
      pageInfo: {
        count: 1,
      },
    };

    beforeEach(async () => {
      dto = alertsHistoryDtoStubs();
      result = await service.findAll(findAlerts, user);
    });

    it('should return alertsHistory array', () => {
      expect(result).toEqual(expected);
    });

    it('should call alertsHistory service', () => {
      expect(service.findAll).toBeCalled();
    });
  });
});
