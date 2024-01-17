import { Injectable } from '@nestjs/common';
import { AwsIoTManagerRepository } from './aws-iot-manager.repository';
import {
  CreateKeysAndCertificateCommandOutput,
  CreateThingCommandInput,
} from '@aws-sdk/client-iot';

@Injectable()
export class AwsIotManagerService {
  constructor(
    private readonly awsIotManagerRepository: AwsIoTManagerRepository,
  ) {}

  async create({ thingName }: CreateThingCommandInput) {
    let createKeysAndCertificateResult: CreateKeysAndCertificateCommandOutput;

    const thing = await this.awsIotManagerRepository.createThing({
      thingName,
    });

    try {
      createKeysAndCertificateResult =
        await this.awsIotManagerRepository.createCertificate();
    } catch (error) {
      await this.awsIotManagerRepository.deleteThing({ thingName });

      throw new Error('Erro ao criar certificado. ' + error.message);
    }

    try {
      await this.awsIotManagerRepository.attachCertificate({
        thingName,
        certificateArn: createKeysAndCertificateResult.certificateArn,
      });
    } catch (error) {
      await this.awsIotManagerRepository.deleteThing({ thingName });

      await this.awsIotManagerRepository.deleteCertificate({
        certificateId: createKeysAndCertificateResult.certificateId,
      });

      throw new Error(
        'Erro ao anexar o certificado ao dispositivo. ' + error.message,
      );
    }

    return {
      certs: { ...createKeysAndCertificateResult },
      thing,
    };
  }

  async deleteThing({ thingName }) {
    return await this.awsIotManagerRepository.deleteThing({ thingName });
  }

  async deleteCertificate({ certificateId }) {
    return await this.awsIotManagerRepository.deleteCertificate({
      certificateId: certificateId,
    });
  }

  async remove(thingName: string) {
    return await this.awsIotManagerRepository.remove({ thingName });
  }
}
