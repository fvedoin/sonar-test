import { Injectable } from '@nestjs/common';
import { CreateUcdisabledHistoryDto } from './dto/create-ucdisabled-history.dto';
import { UcdisabledHistoryRepository } from './ucdisabled-history.repository';
import {
  convertPropertiesToBoolean,
  convertPropertiesToInt,
} from 'src/utils/utils';
import DynamicObject from 'src/common/models/dynamicObject';
import { handleFilters } from 'src/utils/filterHandler';
import { ClientSession } from 'mongoose';

const fields = ['clientId', 'devId', 'ucCode', 'dataDeleted', 'user'];

@Injectable()
export class UcdisabledHistoryService {
  constructor(
    private readonly ucdisabledHistoryRepository: UcdisabledHistoryRepository,
  ) {}

  async create(
    createUcdisabledHistoryDto: CreateUcdisabledHistoryDto,
    session: ClientSession,
  ) {
    const createdUcDisabledHistory =
      await this.ucdisabledHistoryRepository.create(
        {
          ...createUcdisabledHistoryDto,
        },
        { session },
      );

    return createdUcDisabledHistory;
  }

  findAll(query) {
    const { sort, skip, limit, searchText, filter = [], fieldMask } = query;
    const convertedSort = sort ? convertPropertiesToInt(sort) : { it: 1 };
    const convertedFieldMask = fieldMask
      ? convertPropertiesToInt(fieldMask)
      : null;
    const convertedFilter = convertPropertiesToBoolean(filter);
    const edges: Array<DynamicObject> = [{ $sort: convertedSort }];

    const handledFilters = handleFilters(convertedFilter, 'date');

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
      {
        $unwind: {
          path: '$clientId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'ucs',
          localField: 'ucId',
          foreignField: '_id',
          as: 'ucId',
        },
      },
      { $unwind: { path: '$ucId', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'deviceId',
        },
      },
      {
        $unwind: {
          path: '$deviceId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: generalWhereClause },
    ];

    aggregatePipeline.push(
      {
        $group: {
          _id: '$_id',
          clientId: { $first: '$clientId' },
          ucId: { $first: '$ucId' },
          deviceId: { $first: '$deviceId' },
          userId: { $first: '$userId' },
          dataDeleted: { $first: '$dataDeleted' },
          date: { $first: '$date' },
        },
      },
      {
        $project: fieldMask || {
          _id: 1,
          ucId: 1,
          deviceId: 1,
          dataDeleted: 1,
          userId: 1,
          date: 1,
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
    const result = await this.ucdisabledHistoryRepository.aggregate(
      aggregatePipeline,
    );
    return {
      data: result[0].edges,
      pageInfo: result[0].pageInfo[0],
    };
  }
}
