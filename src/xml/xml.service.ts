import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UcsService } from 'src/ucs/ucs.service';

import { Uc } from 'src/ucs/entities/uc.entity';

import { CSVQuality } from './dto/csv-quality.dto';
import { CSV } from './dto/csv.dto';
import { EventCreateCSV } from './dto/event-create-csv.dto';
import { EventCreateCSVQuality } from './dto/event-create-csv-quality.dto';

@Injectable()
export class XmlService {
  constructor(
    private readonly ucsServices: UcsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async generateCSVQuality(data: CSVQuality) {
    const { ucCodes } = data;

    const foundUcs: Uc[] = await this.ucsServices.findWhere(
      {
        ucCode: { $in: ucCodes },
        deviceId: { $exists: true },
      },
      {
        deviceId: 1,
        _id: 0,
        ucCode: 1,
        timeZone: 1,
      },
    );

    if (!foundUcs.length) {
      throw new Error('Nenhuma UC encontrada ou nenhum disposito vinculado!');
    }

    const dataEvent: EventCreateCSVQuality = {
      foundUcs,
      ...data,
    };

    this.eventEmitter.emit('xml.generateCSVQuality', dataEvent);
  }

  async generateCSV(data: CSV) {
    const { ucCodes } = data;

    const foundUcs: Uc[] = await this.ucsServices.findWhere(
      {
        ucCode: { $in: ucCodes },
        deviceId: { $exists: true },
      },
      {
        deviceId: 1,
        _id: 0,
        ucCode: 1,
        timeZone: 1,
      },
    );

    if (!foundUcs.length) {
      throw new Error('Nenhuma UC encontrada ou nenhum disposito vinculado!');
    }

    const dataEvent: EventCreateCSV = {
      foundUcs,
      ...data,
    };

    this.eventEmitter.emit('xml.generateCSV', dataEvent);
  }
}
