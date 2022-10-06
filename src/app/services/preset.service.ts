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
    let ignore = this.currentPreset.rows[i].ignore;
    //if setting set to increase, increment and row count
    if (
      this.direction === 'increase' &&
      this.currentCount < this.currentPreset.maxWBC
    ) {
      this.currentPreset.rows[i].count++;
    }
    //if setting is decrease, decrease row count
    if (this.direction === 'decrease' && this.currentCount > 0) {
      if (this.currentPreset.rows[i].count > 0) {
        this.currentPreset.rows[i].count--;
      }
    }
    this.updateRelativesAndAbsolutes();
  }

  setCurrentCount() {
    let total = 0;
    for (let row of this.currentPreset.rows) {
      total += row.ignore ? 0 : row.count;
    }
    this.currentCount = total;
  }

  updateRelativesAndAbsolutes() {
    this.setCurrentCount();
    for (let row of this.currentPreset.rows) {
      let num = row.count / this.currentCount;
      if (!row.ignore) {
        row.relative = Math.round((num + Number.EPSILON) * 1000) / 10;

        row.absolute =
          Math.round((num * this.WbcCount + Number.EPSILON) * 100) / 100;
      } else {
        row.relative = 0;
        row.absolute = 0;
      }
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
    this.currentCount = 0;
  }
}
