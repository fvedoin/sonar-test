import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/models/Role';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateMeterChangeDto } from './dto/create-meter-change.dto';
import { UpdateMeterChangeDto } from './dto/update-meter-change.dto';
import { MeterChangeRepository } from './meter-change.repository';

@Injectable()
export class MeterChangeService {
  constructor(private readonly meterChangeRepository: MeterChangeRepository) {}

  create(createMeterChangeDto: CreateMeterChangeDto) {
    return this.meterChangeRepository.create(createMeterChangeDto);
  }

  findAll(user: UserFromJwt) {
    if (
      user.accessLevel === Role.SUPER_ADMIN ||
      user.accessLevel === Role.SUPPORT
    ) {
      return this.meterChangeRepository.findAndPopulate({}, [
        'clientId',
        'deviceId',
      ]);
    } else {
      return this.meterChangeRepository.find({ clientId: user.clientId });
    }
  }

  findOne(_id: string) {
    return this.meterChangeRepository.findOne({ _id });
  }

  update(_id: string, updateMeterChangeDto: UpdateMeterChangeDto) {
    return this.meterChangeRepository.findOneAndUpdate(
      { _id },
      updateMeterChangeDto,
    );
  }

  remove(id: string[]) {
    return this.meterChangeRepository.deleteMany({ _id: { $in: id } });
  }
}
