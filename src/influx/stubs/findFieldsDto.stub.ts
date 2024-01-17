import { FindFieldsDto } from '../dto/findFields.dto';

export const findFieldsDtoStubs = (): FindFieldsDto => {
  return {
    fields:
      'r["_field"] == "current_phase_a" or r["_field"] == "current_phase_c" or r["_field"] == "consumed_total_energy" or r["_field"] == "generated_total_energy" or r["_field"] == "frequency"',
    devsIds: 'r["dev_id"] == "fxrl-00"',
    begin: 1672935579,
    end: 1680145200,
    aggregation: '30m',
    bucket: 'fox-iot-telemedicao-b',
  };
};
