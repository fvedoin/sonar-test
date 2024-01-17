import { LinkGatewayDto } from '../dto/link-gateway.dto';

export const linkGatewaysDtoStubs = (
  dto?: Partial<LinkGatewayDto>,
): LinkGatewayDto => {
  return {
    clientId: '5f8b4c4e4e0c3d3f8c8b4567',
    latitude: '2332323',
    longitude: '-232323',
    ...dto,
  };
};
