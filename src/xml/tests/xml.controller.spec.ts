import { Test, TestingModule } from '@nestjs/testing';
import { XmlController } from '../xml.controller';
import { XmlService } from '../xml.service';
import { GenerateCSVQuality } from '../dto/generate-csv-quality.dto';
import { generateCSVQualityStubs } from '../stubs/generateCSVQuality.stubs';
import { GenerateCSV } from '../dto/generate-csv.dto';
import { generateCSVStubs } from '../stubs/generateCSV.stubs';
import { userDTOStub } from '../stubs/userDTO.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { Types } from 'mongoose';
jest.mock('../xml.service');

describe('XmlController', () => {
  let controller: XmlController;
  let service: XmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlController],
      providers: [XmlService],
    }).compile();

    controller = module.get<XmlController>(XmlController);
    service = module.get<XmlService>(XmlService);
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('export-csv-quality', () => {
    let dto: GenerateCSVQuality;
    let user: UserFromJwt;
    const id = new Types.ObjectId().toString();

    beforeEach(async () => {
      dto = generateCSVQualityStubs();
      user = { ...userDTOStub(), id };
      await controller.generateCSVQuality(dto, user);
    });

    it('should call xmlService', () => {
      expect(service.generateCSVQuality).toBeCalledWith({ ...dto, user });
    });
  });

  describe('export-csv', () => {
    let dto: GenerateCSV;
    let user: UserFromJwt;
    const id = new Types.ObjectId().toString();

    beforeEach(async () => {
      dto = generateCSVStubs();
      user = { ...userDTOStub(), id };
      await controller.generateCSV(dto, user);
    });

    it('should call xmlService', () => {
      expect(service.generateCSV).toBeCalledWith({ ...dto, user });
    });
  });
});
