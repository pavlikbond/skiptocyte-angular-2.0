import { dbPreset, Preset } from './preset.model';
//bascially just removing count, relative, absolute from each row of each preset
export function convertPresetsForDb(presets: Preset[]): dbPreset[] {
  return presets.map((preset) => ({
    name: preset.name,
    maxWBC: preset.maxWBC,
    rows: preset.rows.map((row) => ({
      ignore: row.ignore,
      key: row.key,
      cell: row.cell,
    })),
  }));
}
//adds count relative and absolute to presets from DB
export function convertDbPresetsForApp(presets: dbPreset[]): Preset[] {
  return presets.map((preset) => ({
    ...preset,
    rows: preset.rows.map((row) => ({
      ...row,
      key: row.key.toString(),
      count: 0,
      relative: 0,
      absolute: 0,
    })),
  }));
}
