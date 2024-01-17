import mongoose from 'mongoose';

export function transformAndInvertCase(inputString) {
  const transformedString = inputString.replace(/./g, (char) => {
    if (/[a-zA-Z]/.test(char)) {
      return char === char.toLowerCase()
        ? char.toUpperCase()
        : char.toLowerCase();
    }
    return char;
  });

  return transformedString;
}

export function convertPropertiesToInt(obj) {
  const newObj = {};
  for (const key in obj) {
    newObj[key] = parseInt(obj[key]);
  }
  return newObj;
}

type filterCriteria =
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
    };

export function convertPropertiesToBoolean(filter) {
  return filter.map((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (key === 'ucs' && value['$exists']) {
      return { [key]: { $exists: value['$exists'] === 'true' } };
    }
    return { [key]: value };
  });
}

export function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function generateRandomQueryParams(url: string, length = 5) {
  const randomQueryParamsKey = makeid(length);
  const randomQueryParamsValue = makeid(length);

  return updateQueryStringParameter(
    url,
    randomQueryParamsKey,
    randomQueryParamsValue,
  );
}

export function updateQueryStringParameter(
  uri: string,
  key: string,
  value: string,
) {
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return uri + separator + key + '=' + value;
  }
}

export function convertArrayStringsToInt(filter) {
  return filter.map((item) => {
    const key = Object.keys(item)[0];
    const value = item[key];

    if (Array.isArray(value)) {
      const intValueArray = value.map((item) => {
        const intValue = parseInt(item);
        return !isNaN(intValue) ? intValue : item;
      });

      return { [key]: intValueArray };
    } else {
      return { [key]: value };
    }
  });
}
