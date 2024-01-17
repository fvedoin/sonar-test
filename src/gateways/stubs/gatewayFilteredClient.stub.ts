interface Gateway {
  ids: {
    gateway_id: string;
    eui: string;
  };
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  lastSeen: string;
  online: boolean;
  client: string;
  coordinates: [number, number];
  gateway_server_address: string;
  frequency_plan_id: string;
  frequency_plan_ids: string[];
}

export const findFilteredGatewaysResponseStub: Gateway[] = [
  {
    ids: {
      gateway_id: 'poiuytrewq',
      eui: 'CFFAFDAFAFAFAFA0',
    },
    created_at: '2022-04-06T17:24:08.667Z',
    updated_at: '2022-04-06T17:24:08.667Z',
    name: 'bjnkml',
    description: 'ekfhfgfdsgdfdegfsgtfsgreergrgt',
    lastSeen: '',
    online: false,
    client: 'Universidade Federal de Santa Maria',
    coordinates: [-0.01292, 0.03772],
    gateway_server_address: 'eu1.cloud.thethings.network',
    frequency_plan_id: 'AU_915_928_FSB_2',
    frequency_plan_ids: ['AU_915_928_FSB_2'],
  },
];
