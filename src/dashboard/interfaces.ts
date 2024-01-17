import { Uc } from 'src/ucs/entities/uc.entity';

export interface UcWithLastHour extends Partial<Uc> {
  lastHour?: LastHourData;
  status?: string;
}

export interface LastHourData {
  min: number;
  max: number;
}

export interface LastHourInflux {
  result: string;
  table: number;
  _start: string;
  _stop: string;
  _time: string;
  _value: number;
  _field: string;
  _measurement: string;
  dev_id: string;
}
