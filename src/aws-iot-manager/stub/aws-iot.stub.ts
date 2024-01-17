import { certsStub } from './certificates.stub';
import { thingStub } from './thing.stub';

export const createAwsIotResultStub = () => {
  return {
    thing: thingStub(),
    certs: certsStub(),
  };
};
