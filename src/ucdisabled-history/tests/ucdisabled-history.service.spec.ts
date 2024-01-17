import { Test, TestingModule } from '@nestjs/testing';
import { UcdisabledHistoryService } from '../ucdisabled-history.service';
import { UcdisabledHistoryRepository } from '../ucdisabled-history.repository';
import { UcdisabledHistoryController } from '../ucdisabled-history.controller';
import { UcdisabledHistory } from '../entities/ucdisabled-history.entity';
import { createUcdisabledHistoryDtoStubs } from '../stubs/ucdisabled-history.stub';
import { CreateUcdisabledHistoryDto } from '../dto/create-ucdisabled-history.dto';
import { ClientSession } from 'mongoose';

jest.mock('../ucdisabled-history.repository');

describe('UcdisabledHistoryService', () => {
  let service: UcdisabledHistoryService;
  let repository: UcdisabledHistoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UcdisabledHistoryController],
      providers: [UcdisabledHistoryService, UcdisabledHistoryRepository],
    }).compile();

    service = module.get<UcdisabledHistoryService>(UcdisabledHistoryService);
    repository = module.get<UcdisabledHistoryRepository>(
      UcdisabledHistoryRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });
  });

  describe('create', () => {
    let result: UcdisabledHistory;
    let dto: CreateUcdisabledHistoryDto;
    let session: ClientSession;

    beforeEach(async () => {
      dto = createUcdisabledHistoryDtoStubs();
      result = await service.create(dto, session);
    });

    it('should return a ucdisabledHistory', () => {
      expect(result).toMatchObject(dto);
    });
  });
});
