import mongoose from 'mongoose';
import { handleFilters } from '../filterHandler';

describe('filterHandler', () => {
  it('deve transformar os filtros corretamente', () => {
    const inputFilters = [
      { 'clientId.name': 'Fox Îot' },
      {
        'clientId._id': [
          '5f8b4c4e4e0c3d3f8c8b4567',
          '63ca917253899d9c2e48a713',
        ],
      },
      { 'tranformerId.it': ['sm', 'sm-02', 'true', 'false'] },
      {
        dateRange: {
          startDate: '2023-08-02T03:59:00.000Z',
          endDate: '2023-08-31T03:00:59.000Z',
        },
      },
    ];

    const expectedOutput = [
      {
        'clientId.name': {
          $options: 'i',
          $regex: 'Fox Îot',
        },
      },
      {
        'clientId._id': {
          $in: [
            new mongoose.Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
            new mongoose.Types.ObjectId('63ca917253899d9c2e48a713'),
          ],
        },
      },
      {
        $or: [
          {
            'tranformerId.it': {
              $options: 'i',
              $regex: 'sm',
            },
          },
          {
            'tranformerId.it': {
              $options: 'i',
              $regex: 'sm-02',
            },
          },
          {
            'tranformerId.it': true,
          },
          {
            'tranformerId.it': false,
          },
        ],
      },
      {
        $and: [
          {
            alertTime: {
              $gte: new Date('2023-08-02T03:59:00.000Z'),
            },
          },
          {
            alertTime: {
              $lte: new Date('2023-08-31T03:00:59.000Z'),
            },
          },
        ],
      },
    ];

    const output = handleFilters(inputFilters, 'alertTime');
    expect(output).toEqual(expectedOutput);
  });

  it('deve transformar os filtros corretamente, sem endDate', () => {
    const inputFilters = [
      {
        dateRange: {
          startDate: '2022',
        },
      },
    ];

    const expectedOutput = [
      {
        $and: [
          {
            alertTime: {
              $gte: new Date('2022-01-01T00:00:00.000Z'),
            },
          },
          {
            alertTime: {
              $lte: new Date(),
            },
          },
        ],
      },
    ];

    const output = handleFilters(inputFilters, 'alertTime');

    expect(output).toEqual(expectedOutput);
  });

  it('deve transformar os filtros corretamente, sem startDate', () => {
    const inputFilters = [
      {
        dateRange: {
          endDate: '2023',
        },
      },
    ];

    const expectedOutput = [
      {
        $and: [
          {
            alertTime: {
              $gte: new Date('2020-01-01T00:00:00.000Z'),
            },
          },
          {
            alertTime: {
              $lte: new Date('2023-01-01T00:00:00.000Z'),
            },
          },
        ],
      },
    ];

    const output = handleFilters(inputFilters, 'alertTime');
    expect(output).toEqual(expectedOutput);
  });

  it('deve transformar os filtros corretamente, sem startDate e endDate', () => {
    const inputFilters = [
      {
        dateRange: {
          endDate: '2023',
        },
      },
    ];

    const expectedOutput = [
      {
        $and: [
          {
            alertTime: {
              $gte: new Date('2020-01-01T00:00:00.000Z'),
            },
          },
          {
            alertTime: {
              $lte: new Date('2023-01-01T00:00:00.000Z'),
            },
          },
        ],
      },
    ];

    const output = handleFilters(inputFilters, 'alertTime');

    expect(output).toEqual(expectedOutput);
  });
});
