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

export interface dbPreset {
  name: string;
  maxWBC: number;
  rows: dbRow[];
}

interface dbRow {
  ignore: boolean;
  key: string;
  cell: string;
}

export interface LegacyPreset {
  id: number;
  keyCells: [string, string, string][];
  maxWBC: number;
  name: string;
}
