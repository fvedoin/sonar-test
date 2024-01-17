import { meterChangeStubs } from '../stubs/meter-change.stub';
import { meterChangeDtoStubs } from '../stubs/meter-changeDTO.stub';

export const MeterChangeService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(meterChangeStubs(meterChangeDtoStubs())),
  findAll: jest
    .fn()
    .mockResolvedValue([meterChangeStubs(meterChangeDtoStubs())]),
  findOne: jest.fn().mockResolvedValue(meterChangeStubs(meterChangeDtoStubs())),
  update: jest
    .fn()
    .mockResolvedValue(
      meterChangeStubs(meterChangeDtoStubs({ firstConsumedNewMeter: 123 })),
    ),
  remove: jest.fn().mockResolvedValue(meterChangeStubs(meterChangeDtoStubs())),
});
