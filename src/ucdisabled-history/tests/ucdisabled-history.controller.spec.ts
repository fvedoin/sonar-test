import { Test, TestingModule } from '@nestjs/testing';
import { UcdisabledHistoryController } from '../ucdisabled-history.controller';
import { UcdisabledHistoryService } from '../ucdisabled-history.service';
import { UcdisabledHistory } from '../entities/ucdisabled-history.entity';
import { CreateUcdisabledHistoryDto } from '../dto/create-ucdisabled-history.dto';
import { FindUcDisableHistoryDto } from '../dto/find-ucdisabled-history.dto';
import { createUcdisabledHistoryDtoStubs } from '../stubs/ucdisabled-history.stub';
import { ClientSession } from 'mongoose';

jest.mock('../ucdisabled-history.service');

describe('UcdisabledHistoryController', () => {
  let controller: UcdisabledHistoryController;
  let service: UcdisabledHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UcdisabledHistoryController],
      providers: [UcdisabledHistoryService],
    }).compile();

    controller = module.get<UcdisabledHistoryController>(
      UcdisabledHistoryController,
    );
    service = module.get<UcdisabledHistoryService>(UcdisabledHistoryService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('UcdisabledHistory', () => {
    let result: { data: UcdisabledHistory[]; pageInfo: any };
    let dto: CreateUcdisabledHistoryDto;
    let query: FindUcDisableHistoryDto;

    beforeEach(async () => {
      dto = createUcdisabledHistoryDtoStubs();
      result = await controller.findAll(query);
    });

    it('should return UcdisabledHistory array', () => {
      const expectedData = [createUcdisabledHistoryDtoStubs(dto)];
      const expected = { data: expectedData, pageInfo: {} };

      expect(result).toEqual(expected);
    });

    it('should call UcdisabledHistory service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('create', () => {
    let result: UcdisabledHistory;
    let dto: CreateUcdisabledHistoryDto;
    let session: ClientSession;

    beforeEach(async () => {
      dto = createUcdisabledHistoryDtoStubs();
      result = await controller.create(dto, session);
    });

    it('should return a ucdisabledHistory', () => {
      expect(result).toMatchObject(dto);
    });
  });
});
