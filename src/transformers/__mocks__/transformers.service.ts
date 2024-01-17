import { transformersAggregateStub } from '../stubs/transformerAggregateStub';

export const TransformersService = jest.fn().mockReturnValue({
  filterTransformersDevice: jest.fn().mockResolvedValue({
    data: [transformersAggregateStub()],
    pageInfo: { count: 1 },
  }),
});
