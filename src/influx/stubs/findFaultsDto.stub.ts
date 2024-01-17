import { FindFaultsDto } from '../dto/FindFaults.dto';

export const findFaultsDtoStubs = (): FindFaultsDto => {
  return {
    begin: 1672935579,
    end: 1680145200,
    host: 'http://localhost:test',
    apiToken: 'testeToken',
    devsIds: 'r["_field"] == "ucd-20"',
    bucket: 'fox-iot-telemedicao-b',
  };
};
