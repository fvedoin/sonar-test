import { Injectable } from '@nestjs/common';
import { QueryApi } from '@influxdata/influxdb-client';
import { LastHourDto } from './dto/lastHour.dto';
import { FindQualityDto } from './dto/findQuality.dto';
import { FindFieldsDto } from './dto/findFields.dto';
import { LastHourInflux } from 'src/dashboard/interfaces';
import DataInfluxFindQuality from './interfaces/dataInfluxFindQuality';
import DataInfluxFindFields from './interfaces/dataInfluxFindFields';
import { InfluxRepository } from './influx.repository';
import {
  queryConsume,
  queryDashboardQuality,
  queryFindCommunication,
  queryFindFields,
  queryFindQuality,
  queryVoltage,
  findDrpDrcByUcAndPeriod,
} from './utils';
import { GetConsumeDto } from './dto/getConsume.dto';
import { DashboardQualityDto } from './dto/dashboardQuality.dto';
import DataInfluxDashboardQuality from './interfaces/dataInfluxDashboardQuality';
import { FindFaultsDto } from './dto/FindFaults.dto';
import DataInfluxFindFaults from './interfaces/dataInfluxFindFaults';
import { GetAllDataByDevId } from './dto/GetAllData.dto';
import queryGetAllDataByDevId from './utils/queryGetAllData';
import axios from 'axios';
import findAnalyticsFields from './utils/findAnalyticsFields';
import { FindAnalyticsFields } from './dto/FindAnalyticsFields.dto';

const DATABASE_NAME = 'fox-iot';

@Injectable()
export class InfluxService {
  constructor(private readonly influxRepository: InfluxRepository) {}

  private async getConnection(url: string, token: string) {
    const client = await this.influxRepository.connection(url, token);
    if (!client) {
      throw new Error('Influx connection not found');
    }
    return client;
  }

  private async getQuery<T>(queryApi: QueryApi, query: string): Promise<T[]> {
    const result = await queryApi.collectRows<T>(query);
    if (!result) {
      throw new Error('Influx query not found');
    }
    return result;
  }

  async lastHour(lastHourDto: LastHourDto): Promise<LastHourInflux[]> {
    const query = queryVoltage(lastHourDto.bucket, lastHourDto.devId);
    return this.executeQuery<LastHourInflux>(
      lastHourDto.host,
      lastHourDto.apiToken,
      DATABASE_NAME,
      query,
    );
  }

  async findQuality(
    findQualityDto: FindQualityDto,
  ): Promise<DataInfluxFindQuality[]> {
    const query = queryFindQuality(findQualityDto);
    return this.executeQuery<DataInfluxFindQuality>(
      process.env.INFLUX_HOST,
      process.env.INFLUX_API_TOKEN,
      DATABASE_NAME,
      query,
    );
  }

  async findFaultsFieldsByUcAndPeriod(
    findFaultsDto: FindFaultsDto,
  ): Promise<DataInfluxFindFaults[]> {
    const query = findDrpDrcByUcAndPeriod(findFaultsDto);

    return this.executeQuery<DataInfluxFindFaults>(
      findFaultsDto.host,
      findFaultsDto.apiToken,
      DATABASE_NAME,
      query,
    );
  }

  async findAnalyticsFieldData(
    findAnalyticsDTO: FindAnalyticsFields,
  ): Promise<DataInfluxFindFaults[]> {
    const query = findAnalyticsFields(findAnalyticsDTO);

    return this.executeQuery<DataInfluxFindFaults>(
      findAnalyticsDTO.host,
      findAnalyticsDTO.apiToken,
      DATABASE_NAME,
      query,
    );
  }

  async dashboardQuality(dashboardQualityDto: DashboardQualityDto) {
    const query = queryDashboardQuality(dashboardQualityDto);
    return this.executeQuery<DataInfluxDashboardQuality>(
      process.env.INFLUX_HOST,
      process.env.INFLUX_API_TOKEN,
      DATABASE_NAME,
      query,
    );
  }

  async findFields(
    findFieldsDto: FindFieldsDto,
  ): Promise<{ dataResult: DataInfluxFindFields[] }> {
    const queryFields = queryFindFields(findFieldsDto);
    const dataResult = await this.executeQuery<DataInfluxFindFields>(
      process.env.INFLUX_HOST,
      process.env.INFLUX_API_TOKEN,
      DATABASE_NAME,
      queryFields,
    );

    return { dataResult };
  }

  async findFieldsCommunication(
    findFieldsDto: FindFieldsDto,
  ): Promise<{ dataResult: DataInfluxFindFields[] }> {
    const queryCommunication = queryFindCommunication(findFieldsDto);
    const dataResult = await this.executeQuery<DataInfluxFindFields>(
      process.env.INFLUX_HOST,
      process.env.INFLUX_API_TOKEN,
      DATABASE_NAME,
      queryCommunication,
    );

    return { dataResult };
  }

  async getConsume(getConsumeDto: GetConsumeDto) {
    const query = queryConsume(getConsumeDto);
    return this.executeQuery<DataInfluxFindFields>(
      process.env.INFLUX_HOST,
      process.env.INFLUX_API_TOKEN,
      DATABASE_NAME,
      query,
    );
  }

  async getAllDataByDevId(data: GetAllDataByDevId) {
    const query = queryGetAllDataByDevId(data);

    return axios.post(data.host + '/api/v2/query', query, {
      params: {
        orgID: data.orgId,
        chunked: 'true',
        chunk_size: '10000',
      },
      responseType: 'stream',
      headers: {
        Accept: 'application/csv',
        'Content-type': 'application/vnd.flux',
        Authorization: `Token ${data.apiToken}`,
      },
    });
  }

  async deleteOldDataByDevId(data: GetAllDataByDevId) {
    return axios.post(
      data.host + '/api/v2/delete',
      {
        predicate: `"dev_id" = "${data.devId}"`,
        start: new Date(0).toISOString(),
        stop: new Date().toISOString(),
      },
      {
        params: {
          orgID: data.orgId,
          bucket: data.bucketName,
        },
        headers: {
          Authorization: `Token ${data.apiToken}`,
          encoding: 'json',
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
  }

  private async executeQuery<T>(
    url: string,
    token: string,
    dbName: string,
    query: string,
  ): Promise<T[]> {
    const client = await this.getConnection(url, token);
    const queryApi: QueryApi = client.getQueryApi(dbName);
    return this.getQuery<T>(queryApi, query);
  }
}
