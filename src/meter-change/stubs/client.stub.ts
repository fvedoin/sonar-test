import { Types } from 'mongoose';

export const clientStub = (id: string) => {
  return {
    _id: new Types.ObjectId(id),
    active: true,
    users: [],
    name: 'Fox IoT',
    local: 'Santa Maria',
    address: 'Avenida Roraima 100, ITSM, Prédio 02, Sala 23',
    initials: 'FX',
    cnpj: '27.077.377/0001-03',
    aneelcode: '12345',
    __v: 0,
    modules: [
      'qualityGB',
      'exportGB',
      'alertsGB',
      'cutReconnectGB',
      'faultsGB',
      'qualityTR',
      'exportTR',
      'alertsTR',
    ],
  };
};
