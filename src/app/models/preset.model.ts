export interface Preset {
  name: string;
  maxWBC: number;
  rows: Row[];
}

export interface Row {
  ignore: boolean;
  key: string;
  cell: string;
  count: number;
  relative: number;
  absolute: number;
}
