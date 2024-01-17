import { meterChangeStubs } from '../stubs/meter-change.stub';
import { meterChangeDtoStubs } from '../stubs/meter-changeDTO.stub';
import { meterChangesPopulateStub } from '../stubs/meter-changePopulate.stub';

export const MeterChangeRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(meterChangeStubs(meterChangeDtoStubs())),
  findAndPopulate: jest.fn().mockResolvedValue([meterChangesPopulateStub()]),
  findOne: jest.fn().mockResolvedValue(meterChangeStubs(meterChangeDtoStubs())),
  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue(
      meterChangeStubs(meterChangeDtoStubs({ firstConsumedNewMeter: 123 })),
    ),
  deleteMany: jest.fn().mockResolvedValue(void 0),
});
