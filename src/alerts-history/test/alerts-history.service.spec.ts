import { Test, TestingModule } from '@nestjs/testing';
import { AlertsHistoryController } from '../alerts-history.controller';
import { AlertsHistoryService } from '../alerts-history.service';
import { AlertHistory } from '../entities/alerts-history.entity';
import { AlertsHistoryRepository } from '../alerts-history.repository';
import { alertHistoryPopulateStub } from '../stubs/alertsHistoryPopulate.stub';
import { FindAlertsHistoryDto } from '../dto/find-alerts-history';
import { userStub } from '../stubs/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ObjectId } from 'mongodb';

jest.mock('../alerts-history.repository');

const user: UserFromJwt = userStub();

describe('AlertsHistoryService', () => {
  let service: AlertsHistoryService;
  let repository: AlertsHistoryRepository;
  let findAlerts: FindAlertsHistoryDto;

  beforeEach(async () => {
    findAlerts = {
      clientId: new ObjectId().toHexString(),
      sort: 'asc',
      skip: '0',
      limit: '10',
      searchText: 'textoDeBusca',
      filter: [],
      fieldMask: 'campo1,campo2',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsHistoryController],
      providers: [AlertsHistoryService, AlertsHistoryRepository],
    }).compile();

    service = module.get<AlertsHistoryService>(AlertsHistoryService);
    repository = module.get<AlertsHistoryRepository>(AlertsHistoryRepository);
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('getAlertsHistory', () => {
    let result: { data: AlertHistory[]; pageInfo: any };

    beforeEach(async () => {
      result = await service.findAll(findAlerts, user);
    });

    it('should return alertsHistory array', () => {
      const expected = {
        data: [alertHistoryPopulateStub()],
        pageInfo: { count: 1 },
      };
      expect(result).toEqual(expected);
    });

    it('should return array with clientId populate', () => {
      expect(result.data[0].clientId).toEqual(
        alertHistoryPopulateStub().clientId,
      );
    });
  });
});
