import mongoose from 'mongoose';

export type filterCriteria =
  | {
      [keyof: string]: mongoose.Types.ObjectId;
    }
  | {
      [keyof: string]: {
        $regex: unknown;
        $options: 'i';
      };
    }
  | {
      [keyof: string]: {
        $in: string[];
      };
    }
  | {
      [keyof: string]: {
        [keyof: string]: any;
      };
    };

export function handleFilters(
  filters: any[] = [],
  keyOfDateRange?: string,
): filterCriteria[] {
  return filters.map((filter) => {
    const [key, value] = Object.entries(filter)[0];
    if (typeof value === 'string') {
      if (key.includes('_id')) {
        return {
          [key]: new mongoose.Types.ObjectId(value as string),
        };
      }

      return {
        [key]: {
          $regex: value,
          $options: 'i',
        },
      };
    }

    if (Array.isArray(value)) {
      if (key.includes('_id')) {
        return {
          [key]: {
            $in: value.map((id) => new mongoose.Types.ObjectId(id as string)),
          },
        };
      }
      const filter = {
        $or: value.map((item) => {
          if (item === 'true' || item === 'false') {
            const Value = item === 'true';
            return { [key]: Value };
          } else if (Number.isInteger(item)) {
            return { [key]: item };
          } else {
            return {
              [key]: {
                $regex: item,
                $options: 'i',
              },
            };
          }
        }),
      };

      return filter;
    }

    if (typeof value === 'object') {
      const [_, ObjectValue] = Object.entries(filter)[0];

      if (key === 'dateRange' && keyOfDateRange) {
        const ObjectValue_ = ObjectValue as {
          startDate: string;
          endDate: string;
        };

        return {
          $and: [
            {
              [keyOfDateRange]: {
                $gte: new Date(ObjectValue_.startDate || new Date('2020')),
              },
            },
            {
              [keyOfDateRange]: {
                $lte: new Date(ObjectValue_.endDate || new Date()),
              },
            },
          ],
        };
      }
    }

    return filter;
  });
}
