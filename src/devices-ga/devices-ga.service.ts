import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { AwsIotManagerService } from 'src/aws-iot-manager/aws-iot-manager.service';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import DynamicObject from 'src/common/models/dynamicObject';
import { handleFilters } from 'src/utils/filterHandler';
import {
  convertPropertiesToInt,
  convertPropertiesToBoolean,
} from 'src/utils/utils';
import { DevicesGaRepository } from './devices-ga.repository';

import { CreateDevicesGaDto } from './dto/create-devices-ga.dto';
import { UpdateDevicesGaDto } from './dto/update-devices-ga.dto';
import { FindDevicesGaDto } from './dto/find-devices-ga.dto';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';

@Injectable()
export class DevicesGaService {
  constructor(
    private readonly devicesGaRepository: DevicesGaRepository,
    private readonly awsIotManagerService: AwsIotManagerService,
    private readonly awsS3ManagerService: AwsS3ManagerService,
  ) {}

  public transformIdToObject(id: string) {
    return new Types.ObjectId(id);
  }

  async create(createDevicesGaDto: CreateDevicesGaDto) {
    const thingName = 'tele-' + createDevicesGaDto.devId;

    if (typeof createDevicesGaDto.clientId === 'string') {
      createDevicesGaDto.clientId = this.transformIdToObject(
        createDevicesGaDto.clientId,
      );
    }

    const device = await this.devicesGaRepository.findOnePopulated({
      devId: createDevicesGaDto.devId,
    });

    if (device)
      throw Error(`Não foi possível usar esse DevId. Ele já está sendo usado!`);

    const iotResult = await this.awsIotManagerService.create({
      thingName,
    });

    const bucketName = process.env.AWS_BUCKET_IOT_CERTS;

    try {
      const certsToUpload = [
        {
          Key: thingName + '/' + 'client.key',
          Body: iotResult.certs.keyPair.PrivateKey,
        },
        {
          Key: thingName + '/' + 'client.crt',
          Body: iotResult.certs.certificatePem,
        },
      ];

      certsToUpload.forEach(async (object) => {
        const params = {
          Bucket: bucketName,
          Key: object.Key,
          Body: object.Body,
        };

        await this.awsS3ManagerService.uploadFile(params);
      });
    } catch (error) {
      await this.awsS3ManagerService.deleteFile({
        Key: thingName,
        Bucket: bucketName,
      });

      await this.awsIotManagerService.deleteThing({ thingName });

      await this.awsIotManagerService.deleteCertificate({
        certificateId: iotResult.certs.certificateId,
      });

      throw Error(`Error uploading certs in S3: ${error.message}`);
    }

    return await this.devicesGaRepository.create(createDevicesGaDto);
  }

  findAllPaginated(query: FindDevicesGaDto, user: UserFromJwt) {
    const { sort, skip, limit, searchText, filter = [], fieldMask } = query;

    const convertedSort = sort ? convertPropertiesToInt(sort) : { it: 1 };
    const convertedFieldMask = fieldMask
      ? convertPropertiesToInt(fieldMask)
      : null;
    const convertedFilter = convertPropertiesToBoolean(filter);
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

    if (
      user.accessLevel === Role.SUPER_ADMIN ||
      user.accessLevel === Role.SUPPORT
    ) {
      return this.devicesGaRepository.findAllPopulate(searchOpts);
    }

    if (user.accessLevel === Role.ADMIN) {
      searchOpts.filter.push({
        $or: [
          {
            'clientId._id': new Types.ObjectId(user.clientId),
          },
          {
            'clientId.parentId': new Types.ObjectId(user.clientId),
          },
        ],
      });

      return this.devicesGaRepository.findAllPopulate(searchOpts);
    }

    if (user.clientId) {
      searchOpts.filter.push({
        'clientId._id': new Types.ObjectId(user.clientId),
      });

      return this.devicesGaRepository.findAllPopulate(searchOpts);
    }
  }

  findOne(id: string) {
    return this.devicesGaRepository.findOne({ _id: id });
  }

  update(
    id: string,
    updateDevicesGaDto: UpdateDevicesGaDto,
    user: UserFromJwt,
  ) {
    delete updateDevicesGaDto.devId;

    if (user.accessLevel === Role.MANAGER || user.accessLevel === Role.ADMIN) {
      return this.devicesGaRepository.upsert(
        { _id: id },
        { name: updateDevicesGaDto.name },
      );
    }

    return this.devicesGaRepository.upsert({ _id: id }, updateDevicesGaDto);
  }

  async remove(ids: string[]) {
    const devices = await this.devicesGaRepository.find({ _id: { $in: ids } });
    const bucketName = process.env.AWS_BUCKET_IOT_CERTS;

    for (const device of devices) {
      const thingName = 'tele-' + device.devId;

      const certsToRemove = [
        {
          thingName: thingName + '/' + 'client.key',
        },
        {
          thingName: thingName + '/' + 'client.crt',
        },
      ];

      certsToRemove.forEach(async (object) => {
        const params = {
          Bucket: bucketName,
          Key: object.thingName,
        };
        await this.awsS3ManagerService.deleteFile(params);
      });
      await this.awsIotManagerService.remove(thingName);
      await this.devicesGaRepository.delete(device._id.toString());
    }
  }
}
