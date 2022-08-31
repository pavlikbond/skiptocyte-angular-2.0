export interface Preset {
  name: string;
  maxWBC: number;
  rows: Row[];
}

interface Row {
  ignore: boolean;
  key: string;
  cell: string;
}
