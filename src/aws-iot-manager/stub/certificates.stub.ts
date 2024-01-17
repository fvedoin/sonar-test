import { CreateKeysAndCertificateCommandOutput } from '@aws-sdk/client-iot';

export const certsStub = (): CreateKeysAndCertificateCommandOutput => {
  return {
    $metadata: {},
    certificateArn: '',
    certificateId: '',
    certificatePem: '',
  };
};
