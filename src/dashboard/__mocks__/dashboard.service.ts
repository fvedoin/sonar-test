export const DashboardService = jest.fn().mockReturnValue({
  lastHour: jest.fn().mockResolvedValue([
    {
      deviceId: {
        __v: 0,
        _id: '61a8f7d1a1017b2168ce00dc',
        allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
        applicationId: '61a8f7d1a1017b2168ce00db',
        bucketId: '62179b4f4e4e0029f068f7b6',
        clientId: '63fdef9d4f531800316c6b75',
        communication: 'ABNT NBR 14522',
        description: null,
        devId: 'fxrl-00',
        name: 'Dispositivo (Beta)',
        type: 'LoRa',
      },
      lastHour: { max: 0, min: 0 },
      status: 'Online',
      ucCode: '10108',
    },
  ]),
});
