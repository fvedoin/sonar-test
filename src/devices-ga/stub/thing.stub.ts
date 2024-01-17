import { CreateThingCommandOutput } from '@aws-sdk/client-iot';

export const thingStub = (): CreateThingCommandOutput => {
  return {
    thingName: 'thingName',
    $metadata: {},
    thingArn: 'arn:aws:iot:us-east-2:844954956752:thing/tele-34987a9159ec',
    thingId: '844954956752',
  };
};
