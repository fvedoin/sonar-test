import { Test, TestingModule } from '@nestjs/testing';
import { XmlController } from '../xml.controller';
import { XmlService } from '../xml.service';
import { generateCSVQualityStubs } from '../stubs/generateCSVQuality.stubs';
import { UcsService } from 'src/ucs/ucs.service';
import { ucStubs } from '../stubs/uc.stubs';
import { CSVQuality } from '../dto/csv-quality.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { userDTOStub } from '../stubs/userDTO.stub';
import { Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CSV } from '../dto/csv.dto';
import { generateCSVStubs } from '../stubs/generateCSV.stubs';
jest.mock('@nestjs/event-emitter');

describe('XmlService', () => {
  let service: XmlService;
  let ucsService: UcsService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [
        XmlService,
        EventEmitter2,
        {
          provide: UcsService,
          useValue: {
            findWhere: jest.fn().mockResolvedValue([ucStubs()]),
          },
        },
      ],
    }).compile();

    service = module.get<XmlService>(XmlService);
    ucsService = module.get<UcsService>(UcsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined ucsService', () => {
    expect(ucsService).toBeDefined();
  });

  describe('generateCSVQuality', () => {
    let dto: CSVQuality;
    let user: UserFromJwt;
    const id = new Types.ObjectId().toString();

    beforeEach(async () => {
      user = { ...userDTOStub(), id };
      dto = { ...generateCSVQualityStubs(), user };
      await service.generateCSVQuality(dto);
    });

    it('should call ucsService with correct params', () => {
      expect(ucsService.findWhere).toHaveBeenCalledWith(
        {
          ucCode: { $in: dto.ucCodes },
          deviceId: { $exists: true },
        },
        {
          deviceId: 1,
          _id: 0,
          ucCode: 1,
          timeZone: 1,
        },
      );
    });

    it('should call eventEmitter with correct params', () => {
      expect(eventEmitter.emit).toHaveBeenCalledWith('xml.generateCSVQuality', {
        foundUcs: [ucStubs()],
        ...dto,
      });
    });
  });

  describe('generateCSV', () => {
    let dto: CSV;
    let user: UserFromJwt;
    const id = new Types.ObjectId().toString();

    beforeEach(async () => {
      user = { ...userDTOStub(), id };
      dto = { ...generateCSVStubs(), user };
      await service.generateCSVQuality(dto);
    });

    it('should call ucsService with correct params', () => {
      expect(ucsService.findWhere).toHaveBeenCalledWith(
        {
          ucCode: { $in: dto.ucCodes },
          deviceId: { $exists: true },
        },
        {
          deviceId: 1,
          _id: 0,
          ucCode: 1,
          timeZone: 1,
        },
      );
    });

    it('should call eventEmitter with correct params', () => {
      expect(eventEmitter.emit).toHaveBeenCalledWith('xml.generateCSVQuality', {
        foundUcs: [ucStubs()],
        ...dto,
      });
    });
  });
});
