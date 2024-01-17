import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { unparse } from 'papaparse';
import { DateTime } from 'luxon';

import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxService } from 'src/influx/influx.service';

import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';

import { measurements } from '../../utils/CSVfields-map';
import { EventCreateCSV } from '../dto/event-create-csv.dto';
import { EventCreateCSVQuality } from '../dto/event-create-csv-quality.dto';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CreateCSVListener {
  constructor(
    private readonly influxService: InfluxService,
    private readonly influxBucketsService: InfluxBucketsService,
    private readonly awsS3ManagerService: AwsS3ManagerService,
    private readonly notificationService: NotificationService,
  ) {}

  private getDateTime(unixTimeStamp: number, timeZone: string, format: string) {
    return DateTime.fromSeconds(unixTimeStamp, {
      zone: timeZone,
      locale: 'pt-BR',
    }).toFormat(format);
  }

  private async saveInS3(data: string, user: UserFromJwt, nameFile: string) {
    const { username, clientId } = user;
    try {
      const bucket = process.env.AWS_BUCKET_CSV_FILES;
      const now = new Date().getTime();
      const buffer = Buffer.from(data, 'utf-8');

      const expirationDate = new Date().setDate(new Date().getDate() + 7);

      await this.awsS3ManagerService.uploadFile({
        Bucket: bucket,
        Key: `${username}-${now}-${nameFile}.csv`,
        Body: buffer,
        Expires: new Date(expirationDate),
      });

      await this.notificationService.create({
        title: 'Arquivo CSV gerado!',
        message: `O arquivo ${nameFile} foi gerado com sucesso`,
        clientId,
        createdAt: new Date(),
      });
    } catch (error) {
      await this.notificationService.create({
        title: 'Erro ao gerar arquivo CSV!',
        message: `O arquivo ${nameFile} não foi gerado com sucesso`,
        clientId,
        createdAt: new Date(),
      });
      throw new Error(error);
    }
  }

  private generateQuery(items) {
    return (items || []).map((item) => `r["_field"] == "${item}"`).join(' or ');
  }

  private convertItemsToLabels(items, measurements) {
    return (items || [])
      .map((item) => {
        const measurement = (measurements || []).find((m) => m.value === item);
        if (measurement) return measurement.label;
      })
      .filter((item) => !!item);
  }

  private processFields(item, currentUc, sliceStart) {
    return Object.values(item)
      .slice(sliceStart)
      .map((fields) => (typeof fields === 'number' ? fields.toFixed(2) : ''));
  }

  private combineData(parseData, parsedCommunicationFields, hasCommunication) {
    return parseData.map((dataItem, index) => {
      const communicationFields = hasCommunication
        ? parsedCommunicationFields[index].slice(3)
        : [];
      return [...dataItem, ...communicationFields];
    });
  }

  private processDataItem(item, foundUcs, queryCommunication, sliceStart) {
    const currentUc = foundUcs.find((uc) => {
      const deviceId = uc.deviceId as DeviceGb;
      return deviceId.devId === item.dev_id;
    });

    const unixTimeStamp = new Date(item._time).getTime() / 1000;
    const time = this.getDateTime(
      unixTimeStamp,
      currentUc.timeZone,
      'HH:mm:ss',
    );
    const date = this.getDateTime(
      unixTimeStamp,
      currentUc.timeZone,
      'dd/MM/yyyy',
    );

    const dataFields = queryCommunication
      ? this.processFields(item, currentUc, sliceStart)
      : [];

    return [date, time, currentUc.ucCode, ...dataFields];
  }

  @OnEvent('xml.generateCSV')
  async createCSV(data: EventCreateCSV) {
    try {
      const {
        fields,
        dateRange,
        foundUcs,
        aggregation,
        user,
        nameFile,
        communication,
      } = data;

      const endDateTime = new Date(dateRange.endDate).getTime();
      const startDateTime = new Date(dateRange.startDate).getTime();

      const devsIds = foundUcs
        .map((uc) => {
          const deviceId = uc.deviceId as DeviceGb;
          return `r["dev_id"] == "${deviceId.devId}"`;
        })
        .join(' or ');

      const queryFields = this.generateQuery(fields);
      const queryCommunication = this.generateQuery(communication);

      const { bucketId } = foundUcs[0].deviceId as DeviceGb;

      const bucket = await this.influxBucketsService.findOne(
        bucketId.toString(),
      );

      const parseFields = this.convertItemsToLabels(fields, measurements);
      const parseCommunication = this.convertItemsToLabels(
        communication,
        measurements,
      );

      const header = [
        'Data',
        'Hora',
        'UC',
        ...parseFields,
        ...parseCommunication,
      ];

      const dataFields = queryFields
        ? await this.influxService.findFields({
            fields: queryFields,
            devsIds,
            begin: Math.round(startDateTime / 1000),
            end: Math.round(endDateTime / 1000),
            aggregation,
            bucket: bucket.name,
          })
        : { dataResult: [] };

      const dataCommunication = queryCommunication
        ? await this.influxService.findFieldsCommunication({
            communication: queryCommunication,
            devsIds,
            begin: Math.round(startDateTime / 1000),
            end: Math.round(endDateTime / 1000),
            aggregation,
            bucket: bucket.name,
          })
        : { dataResult: [] };

      const parsedCommunicationFields = [];
      const parseData = [];
      const hasFields = fields && fields.length > 0;
      const hasCommunication = communication && communication.length > 0;

      dataCommunication.dataResult.forEach((item) => {
        const communicationFields = this.processDataItem(
          item,
          foundUcs,
          queryCommunication,
          5,
        );
        parsedCommunicationFields.push(communicationFields);
      });

      dataFields.dataResult.forEach((item) => {
        const dataFields = this.processDataItem(item, foundUcs, fields, 4);
        parseData.push(dataFields);
      });

      let combinedData = [];

      if (hasFields) {
        combinedData = this.combineData(
          parseData,
          parsedCommunicationFields,
          hasCommunication,
        );
      } else if (hasCommunication) {
        combinedData = parsedCommunicationFields;
      }

      const csv = unparse(
        {
          fields: header,
          data: combinedData,
        },
        {
          delimiter: ';',
        },
      );

      this.saveInS3(csv, user, nameFile);
    } catch (error) {
      throw new Error(error);
    }
  }

  @OnEvent('xml.generateCSVQuality')
  async createCSVQuality(data: EventCreateCSVQuality) {
    try {
      const { dateRange, fields, foundUcs, user, nameFile } = data;

      const endDateTime = new Date(dateRange.endDate).getTime();
      const startDateTime = new Date(dateRange.startDate).getTime();

      const devsIds = foundUcs
        .map((uc) => {
          const deviceId = uc.deviceId as DeviceGb;
          return `r["dev_id"] == "${deviceId.devId}"`;
        })
        .join(' or ');

      const queryFields = fields
        .map((item) => `r["_field"] == "${item}"`)
        .join(' or ');

      const { bucketId } = foundUcs[0].deviceId as DeviceGb;

      const bucket = await this.influxBucketsService.findOne(
        bucketId.toString(),
        undefined,
        { name: 1, _id: 0 },
      );

      const parseFields = fields.map((item) => {
        const measurement = measurements.find((m) => m.value === item);
        return measurement.label;
      });

      const header = [
        'UC',
        'Data Início',
        'Hora Início',
        'Data Fim',
        'Hora Fim',
        ...parseFields,
      ];

      const dataInflux = await this.influxService.findQuality({
        fields: queryFields,
        devsIds,
        begin: Math.round(startDateTime / 1000),
        end: Math.round(endDateTime / 1000),
        bucket: bucket.name,
      });

      const parseData = dataInflux.map((item) => {
        const currentUc = foundUcs.find((uc) => {
          const deviceId = uc.deviceId as DeviceGb;
          return deviceId.devId === item.dev_id;
        });

        const ucCode = currentUc.ucCode;
        const timeZone = currentUc.timeZone;

        const dateStart = this.getDateTime(
          item.quality_interval_start,
          timeZone,
          'dd/MM/yyyy',
        );

        const timeStart = this.getDateTime(
          item.quality_interval_start,
          timeZone,
          'HH:mm:ss',
        );

        const dateEnd = this.getDateTime(
          item.quality_interval_end,
          timeZone,
          'dd/MM/yyyy',
        );

        const timeEnd = this.getDateTime(
          item.quality_interval_end,
          timeZone,
          'HH:mm:ss',
        );

        return [
          ucCode,
          dateStart,
          timeStart,
          dateEnd,
          timeEnd,
          item.drp_phase_a?.toString(),
          item.drp_phase_b?.toString(),
          item.drp_phase_c?.toString(),
          item.drc_phase_a?.toString(),
          item.drc_phase_b?.toString(),
          item.drc_phase_c?.toString(),
        ];
      });

      const csv = unparse(
        {
          fields: header,
          data: parseData,
        },
        {
          delimiter: ';',
        },
      );

      this.saveInS3(csv, user, nameFile);
    } catch (error) {
      throw new Error(error);
    }
  }
}
