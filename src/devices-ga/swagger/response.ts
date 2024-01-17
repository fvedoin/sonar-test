import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const DeviceGAResponse: SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    clientId: { type: 'string' },
    transformerId: { type: 'string' },
    transformer: { type: 'string' },
    applicationId: { type: 'string' },
    bucketId: { type: 'string' },
    communication: {
      type: 'string',
      enum: ['PIMA', 'ABNT NBR 14522', 'Saída de usuário', 'DLMS'],
    },
    type: { type: 'string', enum: ['LoRa', 'GSM'] },
    devId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    allows: { type: 'array' },
  },
};

export const errorSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    message: {
      type: 'string',
    },
    error: {
      type: 'string',
    },
  },
};
