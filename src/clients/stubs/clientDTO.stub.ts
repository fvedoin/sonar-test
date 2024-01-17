import { CreateClientDto } from '../dto/create-client.dto';

export const clientDtoStubs = (
  dto?: Partial<CreateClientDto>,
): CreateClientDto => {
  return {
    name: 'Client 1',
    initials: 'Clnt',
    cnpj: '79.379.491/0008-50',
    local: 'Santa Maria',
    address: 'Av. Roraima, 1000',
    modules: [],
    ...dto,
  };
};
