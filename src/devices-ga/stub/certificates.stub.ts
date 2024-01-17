import { CreateKeysAndCertificateCommandOutput } from '@aws-sdk/client-iot';

export const certsStub = (): CreateKeysAndCertificateCommandOutput => {
  return {
    $metadata: {},
    certificateArn: 'certificateArn',
    certificateId: 'certificateId',
    certificatePem: 'certificatePem',
    keyPair: {
      PrivateKey: 'privateKey',
      PublicKey: 'publicKey',
    },
  };
};
