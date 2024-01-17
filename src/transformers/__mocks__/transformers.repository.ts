import { transformersAggregateStub } from '../stubs/transformerAggregateStub';

export const TransformersRepository = jest.fn().mockReturnValue({
  aggregate: jest.fn().mockResolvedValue([
    {
      data: [transformersAggregateStub()],
      count: 1,
      _id: null,
    },
  ]),
});
