import { Injectable, Logger } from '@nestjs/common';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { InfluxBucketRepository } from 'src/influx-buckets/influx-buckets.repository';
import { InfluxConnectionRepository } from 'src/influx-connections/influx-connections.repository';
import { InfluxService } from 'src/influx/influx.service';
import DataInfluxFindFaults from 'src/influx/interfaces/dataInfluxFindFaults';
import { Transformer } from 'src/transformers/entities/transformer.entity';
import { Uc } from 'src/ucs/entities/uc.entity';
import { UcsRepository } from 'src/ucs/ucs.repository';
import { timeZones } from 'src/utils/fuso-map';

@Injectable()
export class FaultsService {
  private logger = new Logger(FaultsService.name);

  constructor(
    private readonly influxBucketRepository: InfluxBucketRepository,
    private readonly influxConnectionRepository: InfluxConnectionRepository,
    private readonly influxService: InfluxService,
    private readonly ucRepository: UcsRepository,
  ) {}

  async exportCSV({
    ucs,
    dateRange,
    userId,
  }: {
    ucs: string;
    dateRange: any;
    userId: string;
  }) {
    const foundUcs = (await this.ucRepository.findWherePopulate(
      { ucCode: { $in: ucs.split(',') }, deviceId: { $exists: true } },
      ['deviceId', 'lastReceived', 'settings', 'transformerId'],
    )) as Array<Uc & { deviceId: DeviceGb; transformerId: Transformer }>;

    if (foundUcs.length === 0) {
      throw {
        name: `QueryError`,
        message: `Não foi possível encontrar alguma UC selecionada.`,
      };
    }

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    const header = [
      'UC',
      'TR',
      'Alimentador',
      'Data Queda',
      'Hora Queda',
      'Contador de Queda',
      'Data Retorno',
      'Hora Retorno',
      'Contador de Retornos',
      'Tempo Fora',
    ];

    const devsIds = foundUcs.map(
      (item) => `r["dev_id"] == "${item.deviceId.devId}"`,
    );

    const bucket = await this.influxBucketRepository.findBucketById(
      foundUcs[0].deviceId.bucketId,
    );

    if (!bucket) {
      throw {
        message: `Não foi possível encontrar um bucket.`,
      };
    }

    const influxConnection = await this.influxConnectionRepository.findById(
      bucket.influxConnectionId,
    );

    if (!influxConnection) {
      throw {
        message: `Não foi possível encontrar uma conexão com o Influx.`,
      };
    }

    const data = await this.influxService.findFaultsFieldsByUcAndPeriod({
      devsIds: devsIds.join(' or '),
      begin: Math.round(new Date(startDate).getTime() / 1000),
      end: Math.round(new Date(endDate).getTime() / 1000),
      host: influxConnection.host,
      apiToken: influxConnection.apiToken,
      bucket: bucket.name,
    });

    const parsedData: any[][] = [header];

    const parsedDataJson: Array<
      {
        uc: number;
        timeZone: string;
        tr: string;
        feeder: string;
      } & DataInfluxFindFaults
    > = data.map((item) => {
      const currentUc = foundUcs.find(
        (element) => element.deviceId.devId == item.dev_id,
      );
      item.energy_fall_time =
        item.energy_fall_time - timeZones[currentUc.timeZone] * 60 * 60;
      item.energy_return_time =
        item.energy_return_time - timeZones[currentUc.timeZone] * 60 * 60;

      const newItem = {
        uc: 0,
        timeZone: '',
        tr: '',
        feeder: '',
      };

      newItem.uc = Number(currentUc.ucCode);
      newItem.timeZone = currentUc.timeZone;
      newItem.tr = currentUc.transformerId?.it;
      newItem.feeder = currentUc.transformerId?.feeder;
      return { ...item, ...newItem };
    });

    for await (const row of parsedDataJson) {
      const fallTime = row.energy_fall_time * 1000;
      const returnTime = row.energy_return_time * 1000;
      parsedData.push([
        row.uc,
        row.tr,
        row.feeder,
        new Date(fallTime).toLocaleDateString('pt-Br', {
          timeZone: row.timeZone,
          dateStyle: 'short',
        }),
        new Date(fallTime).toLocaleTimeString('pt-Br', {
          timeZone: row.timeZone,
          timeStyle: 'medium',
        }),
        row.counter_fall,
        new Date(returnTime).toLocaleDateString('pt-Br', {
          timeZone: row.timeZone,
          dateStyle: 'short',
        }),
        new Date(returnTime).toLocaleTimeString('pt-Br', {
          timeZone: row.timeZone,
          timeStyle: 'medium',
        }),
        row.counter_return,
        row.energy_return_time - row.energy_fall_time,
      ]);
    }

    this.logger.log({
      message: 'Gerou arquivo de faltas',
      userId,
    });

    return { csvdoc: parsedData, jsondoc: parsedDataJson };
  }
}
