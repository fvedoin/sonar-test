export const removeTrailingSlash = (str: string): string => {
  return str.replace(/\/+$/, '');
};
