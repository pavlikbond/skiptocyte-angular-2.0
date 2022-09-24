import { Injectable } from '@angular/core';
import * as presets from '../differential/presets.json';
import { Preset, Row } from '../models/preset.model';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  presets: Preset[] = Array.from(presets);
  currentPreset: Preset = this.presets[0];
  maxWBC: number = this.currentPreset.maxWBC;
  currentCount: number = 0;
  direction: string = 'increase';
  WbcCount: number = 0;

  constructor() {}

  adjustCount(key: string, i: number) {
    if (this.direction === 'increase' && this.currentCount < this.maxWBC) {
      this.currentCount++;
      this.currentPreset.rows[i].count++;
    }
    if (this.direction === 'decrease' && this.currentCount > 0) {
      if (this.currentPreset.rows[i].count > 0) {
        this.currentCount--;
        this.currentPreset.rows[i].count--;
      }
    }
    for (let row of this.currentPreset.rows) {
      let num = row.count / this.currentCount;
      row.relative = Math.round((num + Number.EPSILON) * 1000) / 10;

      row.absolute =
        Math.round((num * this.WbcCount + Number.EPSILON) * 100) / 100;
    }
  }

  getCount(i: number) {
    return this.currentPreset.rows[i].count;
  }

  getRelative(i: number) {
    return this.currentPreset.rows[i].relative;
  }

  getAbsolute(i: number) {
    return this.currentPreset.rows[i].absolute;
  }

  clearCounts() {
    for (let row of this.currentPreset.rows) {
      row.count = 0;
      row.relative = 0;
      row.absolute = 0;
    }
  }
}
