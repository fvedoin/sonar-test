import { Injectable } from '@nestjs/common';
import { AlertsHistoryRepository } from './alerts-history.repository';
import DynamicObject from 'src/common/models/dynamicObject';
import { handleFilters } from 'src/utils/filterHandler';
import {
  convertPropertiesToBoolean,
  convertPropertiesToInt,
} from 'src/utils/utils';
import { FindAlertsHistoryDto } from './dto/find-alerts-history';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import mongoose from 'mongoose';

const fields = [
  'clientId.name',
  'alertType',
  'alertName',
  'alertAllows',
  'alertVariables',
  'alertValue',
  'operator',
  'sentEmail',
  'alertTime',
];

@Injectable()
export class AlertsHistoryService {
  constructor(
    private readonly alertsHistoryRepository: AlertsHistoryRepository,
  ) {}

  async findAll(query: FindAlertsHistoryDto, user: UserFromJwt) {
    const {
      clientId,
      sort,
      skip,
      limit,
      searchText,
      filter = [],
      fieldMask,
    } = query;
    const convertedSort = sort ? convertPropertiesToInt(sort) : { it: 1 };
    const convertedFieldMask = fieldMask
      ? convertPropertiesToInt(fieldMask)
      : null;
    const convertedFilter = convertPropertiesToBoolean(filter);
    const edges: Array<DynamicObject> = [{ $sort: convertedSort }];

    const handledFilters = handleFilters(convertedFilter, 'alertTime');

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

    if (user.clientId) {
      handledFilters.push({
        'clientId._id': new mongoose.Types.ObjectId(user.clientId),
      });
      return this.findAllPopulate(searchOpts);
    }
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
          alertType: { $first: '$alertType' },
          alertAllows: { $first: '$alertAllows' },
          alertName: { $first: '$alertName' },
          alertVariables: { $first: '$alertVariables' },
          alertValue: { $first: '$alertValue' },
          operator: { $first: '$operator' },
          sentEmail: { $first: '$sentEmail' },
          alertTime: { $first: '$alertTime' },
          clientId: { $first: '$clientId' },
        },
      },
      {
        $project: fieldMask || {
          _id: 1,
          alertType: 1,
          alertName: 1,
          alertAllows: 1,
          alertVariables: 1,
          alertValue: 1,
          operator: 1,
          sentEmail: 1,
          alertTime: 1,
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

    const result = await this.alertsHistoryRepository.aggregate(
      aggregatePipeline,
    );
    return {
      data: result[0].edges,
      pageInfo: result[0].pageInfo[0],
    };
  }
}
