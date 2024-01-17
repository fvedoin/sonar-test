import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SETTINGS_CREATED, SETTINGS_UPDATED } from 'src/common/constants';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsCreatedEvent } from './events/settingsCreated.event';
import { SettingsUpdatedEvent } from './events/settingsUpdated.event';
import { SettingsRepository } from './setting.repository';
import mongoose, { FilterQuery, ProjectionFields } from 'mongoose';
import { Setting } from './entities/setting.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import DynamicObject from 'src/common/models/dynamicObject';
import { handleFilters } from 'src/utils/filterHandler';
import {
  convertPropertiesToInt,
  convertArrayStringsToInt,
} from 'src/utils/utils';
import { FindDevicesGbDto } from 'src/devices-gb/dto/find-devices-gb.dto';
import { Role } from 'src/auth/models/Role';

const fields = [
  'clientId',
  'offlineTime',
  'peakHourStart',
  'peakHourEnd',
  'precariousVoltageAbove',
  'precariousVoltageBelow',
  'criticalVoltageAbove',
  'criticalVoltageBelow',
];

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingRepository: SettingsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getDefaultSettings(): Setting {
    return {
      offlineTime: 60,
      peakHourStart: 18,
      peakHourEnd: 21,
      precariousVoltageAbove: '231,233',
      precariousVoltageBelow: '191,202',
      criticalVoltageAbove: '233,250',
      criticalVoltageBelow: '0,191',
    } as Setting;
  }

  sanitizeValue(dto: CreateSettingDto | UpdateSettingDto) {
    const setting = {
      ...dto,
      precariousVoltageAbove: dto.precariousVoltageAbove.replaceAll(' ', ''),
      precariousVoltageBelow: dto.precariousVoltageBelow.replaceAll(' ', ''),
      criticalVoltageAbove: dto.criticalVoltageAbove.replaceAll(' ', ''),
      criticalVoltageBelow: dto.criticalVoltageBelow.replaceAll(' ', ''),
    };
    return setting;
  }

  async create(createSettingDto: CreateSettingDto) {
    const settings = this.sanitizeValue(createSettingDto);
    const clientId = createSettingDto.clientId.toString();
    const settingsCreated = await this.settingRepository.create(
      settings as CreateSettingDto,
    );
    this.eventEmitter.emit(
      SETTINGS_CREATED,
      new SettingsCreatedEvent(clientId),
    );
    return settingsCreated;
  }

  findAll(query: FindDevicesGbDto, user: UserFromJwt) {
    const {
      clientId,
      sort,
      skip,
      limit,
      searchText,
      filter = [],
      fieldMask,
    } = query;
    const convertedSort = sort
      ? convertPropertiesToInt(sort)
      : { offlineTime: 1 };
    const convertedFieldMask = fieldMask
      ? convertPropertiesToInt(fieldMask)
      : null;
    const convertedFilter: any = convertArrayStringsToInt(filter);
    const edges: Array<DynamicObject> = [{ $sort: convertedSort }];

    const handledFilters = handleFilters(convertedFilter);

    if (skip) {
      edges.push({ $skip: Number(skip) });
    }
    if (limit) {
      edges.push({ $limit: Number(limit) });
    }

    const searchOpts: DynamicObject = {
      edges,
      searchText,
      filter: handledFilters,
      fieldMask: convertedFieldMask,
      match: {},
    };

    if (clientId) {
      searchOpts.filter.push({
        'clientId._id': new mongoose.Types.ObjectId(clientId),
      });
      return this.findAllPopulate(searchOpts);
    }

    if (user.accessLevel === 'admin' || user.accessLevel === 'support') {
      return this.findAllPopulate(searchOpts);
    }

    if (user.accessLevel === Role.ADMIN) {
      searchOpts.filter.push({
        $or: [
          {
            'clientId._id': new mongoose.Types.ObjectId(user.clientId),
          },
          {
            'clientId.parentId': new mongoose.Types.ObjectId(user.clientId),
          },
        ],
      });

      return this.findAllPopulate(searchOpts);
    }

    searchOpts.filter.push({
      'clientId._id': new mongoose.Types.ObjectId(user.clientId),
    });

    return this.findAllPopulate(searchOpts);
  }

  private buildGeneralWhereClause(
    searchText: string,
    filter: any[],
  ): DynamicObject {
    const generalWhereClause: DynamicObject = {};
    if (searchText) {
      generalWhereClause.$and = [
        {
          $or: [
            ...fields.map((item) => {
              return { [item]: { $regex: searchText, $options: 'i' } };
            }),
          ],
        },
      ];
    }
    const generalFilters = filter || [];
    if (generalFilters.length > 0) {
      if (generalWhereClause.$and) {
        generalWhereClause.$and.push({
          $and: generalFilters,
        });
      } else {
        generalWhereClause.$and = [{ $and: filter }];
      }
    }

    return generalWhereClause;
  }

  private buildAggregatePipeline(
    generalWhereClause: DynamicObject,
    fieldMask: DynamicObject,
    edges: any,
  ) {
    const aggregatePipeline: any[] = [
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'clientId',
        },
      },
      { $match: generalWhereClause },
      { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
    ];

    aggregatePipeline.push(
      {
        $group: {
          _id: '$_id',
          clientId: { $first: '$clientId' },
          offlineTime: { $first: '$offlineTime' },
          peakHourStart: { $first: '$peakHourStart' },
          peakHourEnd: { $first: '$peakHourEnd' },
          precariousVoltageAbove: { $first: '$precariousVoltageAbove' },
          precariousVoltageBelow: { $first: '$precariousVoltageBelow' },
          criticalVoltageAbove: { $first: '$criticalVoltageAbove' },
          criticalVoltageBelow: { $first: '$criticalVoltageBelow' },
        },
      },
      {
        $project: fieldMask || {
          _id: 1,
          offlineTime: 1,
          peakHourStart: 1,
          peakHourEnd: 1,
          precariousVoltageAbove: 1,
          precariousVoltageBelow: 1,
          criticalVoltageAbove: 1,
          criticalVoltageBelow: 1,
          clientId: 1,
        },
      },
      {
        $facet: {
          edges,
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    );

    return aggregatePipeline;
  }

  async findAllPopulate({ edges, searchText, filter, fieldMask }: any) {
    const generalWhereClause = this.buildGeneralWhereClause(searchText, filter);
    const aggregatePipeline = this.buildAggregatePipeline(
      generalWhereClause,
      fieldMask,
      edges,
    );
    const result = await this.settingRepository.aggregate(aggregatePipeline);
    return {
      data: result[0].edges,
      pageInfo: result[0].pageInfo[0],
    };
  }

  async parseVoltageRange(voltage: string) {
    const [low, high] = voltage.split(',');
    return {
      low: parseFloat(low),
      high: parseFloat(high),
    };
  }

  async findCriticalAndPrecariousVoltages(user: UserFromJwt, clientId: string) {
    let filteredClientId = clientId;
    if (user.accessLevel === 'orgadmin' || user.accessLevel === 'admin') {
      filteredClientId = clientId;
    } else {
      filteredClientId = user.clientId;
    }

    const settings = await this.settingRepository.findOne(
      { clientId: filteredClientId },
      {
        precariousVoltageAbove: 1,
        precariousVoltageBelow: 1,
        criticalVoltageAbove: 1,
        criticalVoltageBelow: 1,
      },
    );

    const formattedSettings = {
      precariousVoltageAbove: await this.parseVoltageRange(
        settings.precariousVoltageAbove,
      ),
      precariousVoltageBelow: await this.parseVoltageRange(
        settings.precariousVoltageBelow,
      ),
      criticalVoltageAbove: await this.parseVoltageRange(
        settings.criticalVoltageAbove,
      ),
      criticalVoltageBelow: await this.parseVoltageRange(
        settings.criticalVoltageBelow,
      ),
    };

    return formattedSettings;
  }

  find(query: FilterQuery<Setting>, projection?: ProjectionFields<Setting>) {
    return this.settingRepository.findOne(query, projection);
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    const settings = this.sanitizeValue(updateSettingDto);
    const clientId = updateSettingDto.clientId.toString();
    const settingsUpdated = await this.settingRepository.findOneAndUpdate(
      { _id: id },
      { $set: settings as UpdateSettingDto },
    );
    this.eventEmitter.emit(
      SETTINGS_UPDATED,
      new SettingsUpdatedEvent(clientId),
    );
    return settingsUpdated;
  }

  async remove(id: string[]) {
    await this.settingRepository.deleteMany({ _id: { $in: id } });
  }
}
