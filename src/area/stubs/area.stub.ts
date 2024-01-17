import { Types } from 'mongoose';
import { CreateAreaDto } from '../dto/create-area.dto';
import { Area } from '../entities/area.entity';

export const areaStubs = (areaDtoStubs: CreateAreaDto): Area => {
  const parsedPoints = areaDtoStubs.points.map(({ lng, lat }) => ({
    type: 'Point',
    coordinates: [lng, lat],
  }));
  return {
    ...areaDtoStubs,
    points: parsedPoints,
    _id: new Types.ObjectId('4edd40c86762e0fb12000003'),
  };
};
