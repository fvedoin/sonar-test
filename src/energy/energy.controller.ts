import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { EnergyService } from './energy.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { UcsService } from 'src/ucs/ucs.service';
import { MeterChangeRepository } from 'src/meter-change/meter-change.repository';
import { ValidateEnergyTotal } from 'src/common/interceptors/validateEnergyTotal.interceptor';

type ISOString = string;

@Controller('energy')
export class EnergyController {
  constructor(
    private readonly energyService: EnergyService,
    private readonly ucsService: UcsService,
    private readonly influxConnection: InfluxConnectionsService,
    private readonly influxBuckets: InfluxBucketsService,
    private readonly meterChange: MeterChangeRepository,
  ) {}

  @Get()
  async findEnergy(
    @Query('uc') uc: string[],
    @Query('field') field: string,
    @Query('timeGroup') timeGroup: string,
    @Query('dateRange')
    dateRange: {
      endDate: ISOString;
      startDate: ISOString;
    },
  ) {
    const start = new Date(
      dateRange.startDate.substring(0, 11) + '03:00:00.000Z',
    );
    const end = new Date(dateRange.endDate.substring(0, 11) + '20:59:59.000Z');

    const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);

    const devsIds = foundUcs.map((item) => item.deviceId.devId);

    const bucket = await this.influxBuckets.findOne(
      foundUcs[0].deviceId.bucketId,
    );
    const influxConnection = await this.influxConnection.findOne(
      bucket.influxConnectionId,
    );

    const meterChanges = await this.meterChange.find({
      deviceId: { $in: foundUcs.map((item) => item.deviceId._id) },
      changedAt: { $gte: start, $lte: end },
    });

    const header = ['UC'].concat(field);
    const response = [['Date', 'Time'].concat(header)];
    let data = [];

    const hasMeterUpdates = meterChanges.length > 0;

    if (!hasMeterUpdates) {
      data = await this.energyService.findEnergy({
        field,
        devsIds,
        begin: Math.round(new Date(start).getTime() / 1000),
        end: Math.round(new Date(end).getTime() / 1000),
        group: timeGroup,
        urlDb: influxConnection.host,
        tokenDb: influxConnection.apiToken,
        bucket: bucket.name,
      });
    }

    if (hasMeterUpdates) {
      for await (const meterChange of meterChanges) {
        const beforeChange = await this.energyService.findEnergy({
          field,
          devsIds,
          begin: Math.round(new Date(start).getTime() / 1000),
          end:
            timeGroup === '1h'
              ? Math.round(
                  new Date(meterChange.changedAt).setMinutes(0, 0) / 1000,
                )
              : Math.round(
                  new Date(meterChange.changedAt).setHours(0, 0, 0) / 1000,
                ),
          group: timeGroup,
          urlDb: influxConnection.host,
          tokenDb: influxConnection.apiToken,
          bucket: bucket.name,
        });

        const changeMoment = await this.energyService.findEnergy({
          field,
          devsIds,
          begin:
            timeGroup === '1h'
              ? Math.round(
                  new Date(meterChange.changedAt).setMinutes(0, 0) / 1000,
                )
              : Math.round(
                  new Date(meterChange.changedAt).setHours(0, 0, 0) / 1000,
                ),
          end:
            timeGroup === '1h'
              ? Math.round(
                  new Date(meterChange.changedAt).setMinutes(60, 0) / 1000,
                )
              : Math.round(
                  new Date(meterChange.changedAt).setHours(24, 0, 0) / 1000,
                ),
          group: timeGroup,
          urlDb: influxConnection.host,
          tokenDb: influxConnection.apiToken,
          bucket: bucket.name,
        });

        const afterChange = await this.energyService.findEnergy({
          field,
          devsIds,
          begin:
            timeGroup === '1h'
              ? Math.round(
                  new Date(meterChange.changedAt).setMinutes(60, 0) / 1000,
                )
              : Math.round(
                  new Date(meterChange.changedAt).setHours(24, 0, 0) / 1000,
                ),
          end: Math.round(new Date(end).getTime() / 1000),
          group: timeGroup,
          urlDb: influxConnection.host,
          tokenDb: influxConnection.apiToken,
          bucket: bucket.name,
        });

        data = [...beforeChange, ...changeMoment, ...afterChange];
      }
    }

    for await (const item of data.filter((row) => row.result === '_result')) {
      const formattedDate = new Date(item._time).toLocaleDateString('pt-Br', {
        dateStyle: 'short',
        timeZone: 'America/Sao_Paulo',
      });
      const formattedTime = new Date(item._time).toLocaleTimeString('pt-Br', {
        timeStyle: 'medium',
        timeZone: 'America/Sao_Paulo',
      });
      const ucCode = Number(
        foundUcs.find((element) => item.dev_id === element.deviceId.devId)
          ?.ucCode,
      );
      const value = item['_value'];

      const newLine: any = [formattedDate, formattedTime, ucCode];

      if (value || typeof value === 'number') {
        if (typeof value === 'number') {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
            .format(value)
            .replace('.', ',');

          newLine.push(formattedValue);
        } else {
          newLine.push(value);
        }
      } else {
        newLine.push(null);
      }

      response.push(newLine);
    }

    return response;
  }

  @Get('total-consumption')
  @UseInterceptors(ValidateEnergyTotal)
  async findEnergyTotal(
    @Query('uc') uc: string[],
    @Query('field') field: string,
    @Query('dateRange')
    dateRange: {
      endDate: ISOString;
      startDate: ISOString;
    },
  ) {
    const start = new Date(
      dateRange.startDate.substring(0, 11) + '03:00:00.000Z',
    );
    const end = new Date(dateRange.endDate.substring(0, 11) + '20:59:59.000Z');

    const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);

    const devsIds = foundUcs.map((item) => item.deviceId.devId);

    if (!foundUcs.length) throw new NotFoundException('UC not found.');

    const bucket = await this.influxBuckets.findOne(
      foundUcs[0].deviceId.bucketId,
    );
    const influxConnection = await this.influxConnection.findOne(
      bucket.influxConnectionId,
    );

    const data = await this.energyService.findEnergyTotal({
      field,
      devsIds,
      begin: Math.round(start.getTime() / 1000),
      end: Math.round(end.getTime() / 1000),
      urlDb: influxConnection.host,
      tokenDb: influxConnection.apiToken,
      bucket: bucket.name,
    });

    const response = data.find((item: any) => item.result === '_result');

    return response;
  }

  @Get('ia/total-consumption')
  async findEnergyPredictionTotal(
    @Query('uc') uc: string[],
    @Query('field') field: string,
    @Query('dateRange')
    dateRange: {
      endDate: ISOString;
      startDate: ISOString;
    },
  ) {
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;

    const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);

    const devsIds = foundUcs.map((item) => item.deviceId.devId);

    const urlDb = 'https://influxdb-analytics.dev.spinon.com.br';
    const tokenDb =
      'j5e67MfZPqCGIrepobO2iJs-nOB-4JEBoW_QBfd0Hu7ohNZRzv_Bi59L_2tQwWr-dhD2CMrzRlycabepUxjNKg==';
    const bucket = 'mux-energia-telemedicao-b-predicts';

    const energyPredictionTotalData =
      await this.energyService.findEnergyPredictionTotal({
        begin: startDate,
        end: endDate,
        bucket,
        devsIds,
        field,
        tokenDb,
        urlDb,
      });

    return energyPredictionTotalData.find((item) => item.result === '_result');
  }

  @Get('ia')
  async findEnergyPrediction(
    @Query('uc') uc: string[],
    @Query('field') field: string,
    @Query('timeGroup') timeGroup: string,
    @Query('dateRange')
    dateRange: {
      endDate: ISOString;
      startDate: ISOString;
    },
  ) {
    const startDate = new Date(dateRange.startDate);

    const endDate = new Date(dateRange.endDate);

    const header = ['UC', field];
    const response = [['Data', 'Hora', ...header]];

    const urlDb = 'https://influxdb-analytics.dev.spinon.com.br';
    const tokenDb =
      'j5e67MfZPqCGIrepobO2iJs-nOB-4JEBoW_QBfd0Hu7ohNZRzv_Bi59L_2tQwWr-dhD2CMrzRlycabepUxjNKg==';
    const bucket = 'mux-energia-telemedicao-b-predicts';

    const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);

    const devsIds = foundUcs.map((item) => item.deviceId.devId);

    const energyPredictionData = await this.energyService.findEnergyPrediction({
      begin: startDate.getTime(),
      end: endDate.getTime(),
      bucket,
      devsIds,
      field,
      group: timeGroup,
      tokenDb,
      urlDb,
    });

    for (const energyPredictionItem of energyPredictionData as any[]) {
      if (
        typeof energyPredictionItem === 'object' &&
        energyPredictionItem !== null &&
        'result' in energyPredictionItem &&
        'dev_id' in energyPredictionItem &&
        '_time' in energyPredictionItem
      ) {
        const formattedDate = new Date(
          energyPredictionItem._time,
        ).toLocaleDateString('pt-Br', {
          dateStyle: 'short',
          timeZone: 'America/Sao_Paulo',
        });

        const formattedTime = new Date(
          energyPredictionItem._time,
        ).toLocaleTimeString('pt-Br', {
          timeStyle: 'medium',
          timeZone: 'America/Sao_Paulo',
        });

        const ucCode = Number(
          foundUcs.find(
            (element) => energyPredictionItem.dev_id == element.deviceId.devId,
          ).ucCode,
        );

        const resultRow: any = [formattedDate, formattedTime, ucCode];

        let newValue;

        if (!energyPredictionItem['_value']) {
          newValue = null;
        }

        if (typeof energyPredictionItem['_value'] !== 'number') {
          newValue = energyPredictionItem['_value'];
        } else {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'decimal',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })
            .format(energyPredictionItem['_value'])
            .replace('.', ',');

          newValue = formattedValue;
        }

        resultRow.push(newValue);

        response.push(resultRow);
      }
    }

    return response;
  }
}
