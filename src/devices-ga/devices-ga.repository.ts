import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Connection,
  AggregateOptions,
  PipelineStage,
  FilterQuery,
  PopulatedDoc,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { DevicesGa } from './entities/devices-ga.entity';
import DynamicObject from 'src/common/models/dynamicObject';

const fields = [
  'devId',
  'name',
  'ucs.ucCode',
  'clientId.name',
  'applicationId.name',
  'type',
  'communication',
  'allows',
];

@Injectable()
export class DevicesGaRepository extends AbstractRepository<DevicesGa> {
  constructor(
    @InjectModel(DevicesGa.name) private deviceGaModel: Model<DevicesGa>,
    @InjectConnection() connection: Connection,
  ) {
    super(deviceGaModel, connection);
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
          name: { $first: '$name' },
          devId: { $first: '$devId' },
          provider: { $first: '$provider' },
          clientId: { $first: '$clientId' },
          description: { $first: '$description' },
          authenticated: { $first: '$authenticated' },
          online: { $first: '$online' },
        },
      },
      {
        $project: fieldMask || {
          _id: 1,
          name: 1,
          devId: 1,
          provider: 1,
          clientId: 1,
          description: 1,
          authenticated: 1,
          online: 1,
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

  async findAllPopulate({
    edges,
    searchText,
    filter,
    fieldMask,
  }: DynamicObject) {
    const generalWhereClause = this.buildGeneralWhereClause(searchText, filter);
    const aggregatePipeline = this.buildAggregatePipeline(
      generalWhereClause,
      fieldMask,
      edges,
    );

    const result = await this.aggregate(aggregatePipeline);

    return {
      data: result[0].edges,
      pageInfo: result[0].pageInfo[0],
    };
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
        generalWhereClause.$and = [{ $and: generalFilters }];
      }
    }

    if (generalWhereClause.$and) {
      generalWhereClause.$and.push({
        devId: { $not: { $regex: 'ucd-', $options: 'i' } },
      });
    } else {
      generalWhereClause.$and = [
        { devId: { $not: { $regex: 'ucd-', $options: 'i' } } },
      ];
    }

    return generalWhereClause;
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.model.aggregate(pipeline, options);
  }

  async findOnePopulated(where: FilterQuery<DevicesGa>): Promise<DevicesGa> {
    return await this.deviceGaModel.findOne(where, ['clientId']);
  }
}
