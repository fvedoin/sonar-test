import { Types } from 'mongoose';
import { Gateway } from '../entities/gateway.entity';
import { range } from '../../utils/range';
import { Client } from 'src/clients/entities/client.entity';

interface GatewayResponseFromTtnType {
  lastSeen: string;
  online: boolean;
  client: string;
  coordinates: [number, number];
  ids: {
    gateway_id: string;
    eui: string;
  };
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  gateway_server_address: string;
  frequency_plan_id: string;
  frequency_plan_ids: string[];
}

export const gatewayResponseStubFromTtn: GatewayResponseFromTtnType = {
  lastSeen: '',
  online: false,
  client: 'Fox IoT',
  coordinates: [-0.01292, 0.03772],
  ids: {
    gateway_id: 'poiuytrewq',
    eui: 'CFFAFDAFAFAFAFA0',
  },
  created_at: '2022-04-06T17:24:08.667Z',
  updated_at: '2022-04-06T17:24:08.667Z',
  name: 'bjnkml',
  description: 'ekfhfgfdsgdfdegfsgtfsgreergrgt',
  gateway_server_address: 'eu1.cloud.thethings.network',
  frequency_plan_id: 'AU_915_928_FSB_2',
  frequency_plan_ids: ['AU_915_928_FSB_2'],
};

export function buildGatewayResponseStubFromTtn(
  clientId: Types.ObjectId[],
  ttnId = new Types.ObjectId().toString(),
) {
  return {
    ...gatewayResponseStubFromTtn,
    ids: {
      gateway_id: ttnId,
      eui: 'CFFAFDAFAFAFAFA0',
    },
    ttnId,
    clientId,
    _id: new Types.ObjectId(),
  };
}

export const gatewayStub: Omit<Gateway, '_id' | 'clientId' | 'ttnId'> = {
  lastChecked: new Date(),
  location: {
    coordinates: [0, 0],
    type: 'Point',
  },
  online: true,
};

type BuildGatewayStubProps = {
  numberOfGateways: number;
  clients: Client[];
  _id?: Types.ObjectId;
  gatewayDto?: Partial<Gateway>;
};

export function buildGatewayStub({
  numberOfGateways,
  _id,
  clients,
  gatewayDto,
}: BuildGatewayStubProps) {
  const gateways: Array<
    Omit<Gateway, '_id' | 'clientId' | 'ttnId'> & {
      ids: {
        gateway_id: string;
        eui: string;
      };
      clientId: Array<Partial<Client>>;
      ttnId: string;
    }
  > = [];

  for (const client of clients) {
    const clientId = client._id;

    range(numberOfGateways).forEach(() => {
      const ttnId = new Types.ObjectId().toString();
      const newGateway = {
        ...gatewayDto,
        ...gatewayStub,
        clientId: [clientId],
        _id: _id ?? new Types.ObjectId(),
        ttnId,
        ids: {
          gateway_id: ttnId,
          eui: 'CFFAFDAFAFAFAFA0',
        },
      };

      gateways.push(newGateway);
    });
  }

  return gateways;
}
