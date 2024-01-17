export const InfluxBucketRepository = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue([]),
});
