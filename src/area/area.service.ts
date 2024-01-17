import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { Role } from '../auth/models/Role';
import { AreaRepository } from './area.repository';

@Injectable()
export class AreaService {
  constructor(private readonly areaRepository: AreaRepository) {}

  async create(createAreaDto: CreateAreaDto, user: UserFromJwt) {
    if (!createAreaDto.clientId && user.accessLevel === Role.SUPER_ADMIN) {
      throw new HttpException('ClientId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const parsedPoints = this.parsePoints(createAreaDto.points);

    if (user.accessLevel === Role.SUPER_ADMIN) {
      return this.areaRepository.create({
        ...createAreaDto,
        points: parsedPoints,
      });
    }

    return this.areaRepository.create({
      ...createAreaDto,
      points: parsedPoints,
      clientId: user.clientId,
    });
  }

  parsePoints(points: CreateAreaDto['points']) {
    return points.map(({ lng, lat }) => ({
      type: 'Point',
      coordinates: [lng, lat],
    }));
  }

  findAll(user: UserFromJwt) {
    if (user.accessLevel === Role.SUPER_ADMIN) {
      return this.areaRepository.findAllAndPopulate(['clientId']);
    }
    return this.areaRepository.findAndPopulate({ clientId: user.clientId }, [
      'clientId',
    ]);
  }

  findOne(id: string) {
    return this.areaRepository.findOne({ _id: id });
  }

  async update(id: string, updateAreaDto: UpdateAreaDto, user: UserFromJwt) {
    const parsedPoints = this.parsePoints(updateAreaDto.points);

    if (user.accessLevel === Role.SUPER_ADMIN) {
      return this.areaRepository.findOneAndUpdate(
        { _id: id },
        { ...updateAreaDto, points: parsedPoints },
      );
    }
    return this.areaRepository.findOneAndUpdate(
      { _id: id },
      {
        ...updateAreaDto,
        clientId: user.clientId,
        points: parsedPoints,
      },
    );
  }

  async remove(id: string[]) {
    await this.areaRepository.deleteMany({ _id: { $in: id } });
  }
}
