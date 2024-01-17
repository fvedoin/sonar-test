import { Injectable } from '@nestjs/common';
import { InjectAws } from 'aws-sdk-v3-nest';
import {
  IoTClient,
  CreateThingCommand,
  CreateKeysAndCertificateCommand,
  ListPrincipalThingsCommand,
  DeleteThingCommand,
  DetachPolicyCommand,
  DeleteCertificateCommand,
  DetachThingPrincipalCommand,
  AttachThingPrincipalCommand,
  AttachPolicyCommand,
  UpdateCertificateCommand,
  CreateThingCommandInput,
  ListAttachedPoliciesCommand,
  ListThingPrincipalsCommand,
} from '@aws-sdk/client-iot';

@Injectable()
export class AwsIoTManagerRepository {
  constructor(@InjectAws(IoTClient) private readonly iotClient: IoTClient) {}

  async createThing({ thingName }: CreateThingCommandInput) {
    const createThingCommand = new CreateThingCommand({ thingName });
    const createResult = await this.iotClient.send(createThingCommand);

    return createResult;
  }

  async createCertificate() {
    const createKeysAndCertificateCommand = new CreateKeysAndCertificateCommand(
      { setAsActive: true },
    );

    const createKeysAndCertificateResult = await this.iotClient.send(
      createKeysAndCertificateCommand,
    );

    return createKeysAndCertificateResult;
  }

  async attachCertificate({ certificateArn, thingName }) {
    const policyName = process.env.AWS_IOT_MQTT_POLICY_NAME;

    const attachPolicyCommand = new AttachPolicyCommand({
      policyName,
      target: certificateArn,
    });

    await this.iotClient.send(attachPolicyCommand);

    const attachThingPrincipalCommand = new AttachThingPrincipalCommand({
      thingName,
      principal: certificateArn,
    });
    await this.iotClient.send(attachThingPrincipalCommand);
  }

  async deleteThing({ thingName }) {
    const deleteThingCommand = new DeleteThingCommand({ thingName: thingName });
    return await this.iotClient.send(deleteThingCommand);
  }

  async deleteCertificate({ certificateId }) {
    const deleteCertificateCommand = new DeleteCertificateCommand({
      certificateId: certificateId,
    });

    await this.iotClient.send(deleteCertificateCommand);
  }

  private async detachPoliciesFromCertificate({ certificateArn }) {
    const listAttachedPoliciesCommand = new ListAttachedPoliciesCommand({
      target: certificateArn,
    });

    const listAttachedPoliciesResult = await this.iotClient.send(
      listAttachedPoliciesCommand,
    );

    for (const policy of listAttachedPoliciesResult.policies) {
      await this.detachPolicy({
        policyName: policy.policyName,
        certificateArn,
      });
    }
  }

  private async detachPolicy({ policyName, certificateArn }) {
    const detachPolicyCommand = new DetachPolicyCommand({
      policyName: policyName,
      target: certificateArn,
    });
    await this.iotClient.send(detachPolicyCommand);
  }

  private async detachDeviceFromCertificate({ thingName, certificateArn }) {
    const detachThingPrincipalCommand = new DetachThingPrincipalCommand({
      thingName: thingName,
      principal: certificateArn,
    });

    await this.iotClient.send(detachThingPrincipalCommand);
  }

  private async updateCertificateStatus({ certificateId }) {
    const updateCertificateCommand = new UpdateCertificateCommand({
      certificateId: certificateId,
      newStatus: 'INACTIVE',
    });

    await this.iotClient.send(updateCertificateCommand);
  }

  async remove({ thingName }) {
    const listThingPrincipalsCommand = new ListThingPrincipalsCommand({
      thingName: thingName,
    });
    const listThingPrincipalsResult = await this.iotClient.send(
      listThingPrincipalsCommand,
    );

    for (const principal of listThingPrincipalsResult.principals) {
      const certificateArn = principal;
      const certificateId = certificateArn.split('/')[1];

      await this.detachPoliciesFromCertificate({
        certificateArn,
      });

      await this.detachDeviceFromCertificate({
        thingName,
        certificateArn,
      });

      await this.updateCertificateStatus({ certificateId });

      await this.deleteCertificate({ certificateId });
    }

    await this.deleteThing({ thingName });
  }
}
