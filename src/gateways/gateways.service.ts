import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import mongoose, { Document, FilterQuery, Types } from 'mongoose';

import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsService } from 'src/clients/clients.service';
import { TtnService } from 'src/common/services/ttn.service';
import { LinkGatewayDto } from './dto/link-gateway.dto';
import { Gateway, GatewayDocument } from './entities/gateway.entity';
import { GatewaysRepository } from './gateways.repository';

@Injectable()
export class GatewaysService {
  constructor(
    private readonly gatewayRepository: GatewaysRepository,
    private readonly clientsService: ClientsService,
  ) {}

  private async getStatusForGateway(gateway) {
    return await TtnService.get(
      `gs/gateways/${gateway.ids.gateway_id}/connection/stats`,
    );
  }

  private async getLinkedInfoForGateway(gateway, clientIdClause) {
    const whereClause = {
      ttnId: gateway.ids.gateway_id,
      ...(clientIdClause ? { clientId: clientIdClause } : {}),
    };

    return await this.findOneWhere(whereClause, 'clientId');
  }

  private shouldIncludeGateway(
    user: UserFromJwt,
    linked: Document<unknown, any, Gateway> &
      Gateway &
      Required<{
        _id: Types.ObjectId;
      }>,
  ) {
    return (
      user.accessLevel === Role.SUPER_ADMIN ||
      user.accessLevel === Role.ADMIN ||
      user.accessLevel === Role.SUPPORT ||
      !!linked
    );
  }

  private async getDeviceInfo(gateway) {
    return await this.findOneWhere({ ttnId: gateway.ids.gateway_id });
  }

  private formatGatewayData(gateway, status, linked, device) {
    return {
      lastSeen: status?.data?.last_status_received_at || '',
      online: !!linked && linked.online,
      client: linked?.clientId?.map((item) => item.name).join(', ') || null,
      coordinates: device?.location?.coordinates || null,
      ...gateway,
    };
  }

  private async linkGateway(ttnId: string, linkGatewayDto: LinkGatewayDto) {
    const { latitude, longitude } = linkGatewayDto;

    const location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    return this.gatewayRepository.findOneAndUpdateWithArgs(
      { ttnId },
      {
        location,
        ...linkGatewayDto,
      },
      {
        upsert: true,
      },
    );
  }

  private async handleAdminRouteForFilteredGateways(clientId: string) {
    const ttnResponse = await TtnService.get(
      'gateways?field_mask=name,description',
    );
    const { gateways } = ttnResponse.data;

    const gatewayData = await this.gatewayRepository.find({ clientId });
    const ttnIds = gatewayData.map((gateway) => gateway.ttnId);

    const filteredGateways = gateways.filter((gateway) => {
      return ttnIds.includes(gateway.ids.gateway_id);
    });

    return filteredGateways;
  }

  private async handleNonAdminRouteForFilteredGateways(user: UserFromJwt) {
    const clientId = user.clientId;

    const ttnResponse = await TtnService.get(
      'gateways?field_mask=name,description',
    );
    const { gateways } = ttnResponse.data;

    const gatewayData = await this.gatewayRepository.find({ clientId });
    const ttnIds = gatewayData.map((gateway) => gateway.ttnId);

    const filteredGateways = gateways.filter((gateway) => {
      return ttnIds.includes(gateway.ids.gateway_id);
    });

    return filteredGateways;
  }

  async findOneWhere(where: FilterQuery<GatewayDocument>, populate?: string) {
    return this.gatewayRepository.findOneAndPopulate(where, populate);
  }

  async findAll(user: UserFromJwt) {
    const ttnResponse = (await TtnService.get(
      'gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address',
    )) as AxiosResponse<{ gateways: Gateway[] }>;
    const { gateways } = ttnResponse.data;

    let clientIdClause = null;

    if (user.accessLevel === Role.MANAGER || user.accessLevel === Role.VIEWER) {
      clientIdClause = new Types.ObjectId(user.clientId);
    }

    if (user.accessLevel === Role.ADMIN) {
      const clients = await this.clientsService.findWhere({
        $or: [
          { parentId: new Types.ObjectId(user.clientId) },
          { _id: new Types.ObjectId(user.clientId) },
        ],
      });

      clientIdClause = {
        $in: clients.map((client) => client._id),
      };
    }

    const response = await Promise.all(
      gateways.map(async (gateway) => {
        const linked = await this.getLinkedInfoForGateway(
          gateway,
          clientIdClause,
        );

        if (linked === null) return null;

        const status = await this.getStatusForGateway(gateway);

        if (!this.shouldIncludeGateway(user, linked)) {
          return null;
        }

        const device = await this.getDeviceInfo(gateway);
        return this.formatGatewayData(gateway, status, linked, device);
      }),
    );

    return response.filter((item) => item !== null);
  }

  async filterByClients(user: UserFromJwt, clientId: string) {
    const isAdmin = user.accessLevel === 'admin';
    if (isAdmin) {
      return this.handleAdminRouteForFilteredGateways(clientId);
    }
    return this.handleNonAdminRouteForFilteredGateways(user);
  }

  async findOne(ttnId: string) {
    const gateway = await this.findOneWhere({ ttnId });
    const ttnResponse = await TtnService.get(
      `gateways/${ttnId}?field_mask=name,description`,
    );

    if (gateway instanceof mongoose.Document) {
      return { ...gateway.toObject(), name: ttnResponse.data.name };
    }

    return { name: ttnResponse.data.name };
  }

  async link(ttnId: string, linkGatewayDto: LinkGatewayDto) {
    return await this.linkGateway(ttnId, linkGatewayDto);
  }
}
