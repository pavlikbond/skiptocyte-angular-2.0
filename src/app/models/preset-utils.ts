import { dbPreset, Preset } from './preset.model';
//bascially just removing count, relative, absolute from each row of each preset
export function convertPresetsForDb(presets: Preset[]): dbPreset[] {
  let result = [];
  presets.forEach((preset) => {
    let newPreset = {
      name: preset.name,
      maxWBC: preset.maxWBC,
      rows: [],
    };
    for (let row of preset.rows) {
      newPreset.rows.push({
        ignore: row.ignore,
        key: row.key,
        cell: row.cell,
      });
    }
    result.push(newPreset);
  });
  return result;
}
//adds count relative and absolute to presets from DB
export function convertDbPresetsForApp(presets): Preset[] {
  for (let preset of presets) {
    for (let row of preset.rows) {
      row['count'] = 0;
      row['relative'] = 0;
      row['absolute'] = 0;
    }
  }
  return [...presets];
}
