export type DataInfluxFindAnalytics<T extends readonly string[]> = {
  [key in T[number]]: string;
} & {
  result: string;
  table: number;
  _time: string;
};
