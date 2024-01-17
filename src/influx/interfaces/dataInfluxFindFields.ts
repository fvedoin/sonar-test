interface dataFixed {
  result: string;
  table: number;
  _time: Date;
  dev_id: string;
}

export default interface DataInfluxFindFields extends dataFixed {
  [keys: string]: any;
}
