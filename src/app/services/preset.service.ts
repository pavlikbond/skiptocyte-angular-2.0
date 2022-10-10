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
  maxDecimals: number = 3;
  constructor() {}

  adjustCount(key: string, i: number) {
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
    if (this.currentCount >= this.currentPreset.maxWBC) {
      this.playDing();
    }
  }

  setCurrentCount() {
    let total = 0;
    for (let row of this.currentPreset.rows) {
      total += row.ignore ? 0 : row.count;
    }
    this.currentCount = total;
  }

  updateRelativesAndAbsolutes() {
    //let fraction = String(this.WbcCount).split('.')[1];
    //let numsAfterDec = fraction ? fraction.length : 0;
    //let exp = 10 ** Math.min(this.maxDecimals, numsAfterDec);
    let exp = 10 ** this.maxDecimals;
    //console.log(typeof num);

    this.setCurrentCount();
    for (let row of this.currentPreset.rows) {
      //or 0 because otherwise it might return NaN
      let num = row.count / this.currentCount || 0;
      if (!row.ignore) {
        row.relative = Math.round((num + Number.EPSILON) * 1000) / 10;

        row.absolute =
          Math.round((num * this.WbcCount + Number.EPSILON) * exp) / exp;
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
    //adds commas to digits before the decimal
    let x = String(this.currentPreset.rows[i].absolute).replace(
      /(?<!\.\d*)(\d)(?=(?:\d{3})+(?!\d))/g,
      '$1,'
    );

    return x;
  }

  clearCounts() {
    for (let row of this.currentPreset.rows) {
      row.count = 0;
      row.relative = 0;
      row.absolute = 0;
    }
    this.currentCount = 0;
  }

  playDing() {
    let audio = new Audio();
    audio.src = '../assets/smb_fireball.wav';
    audio.load();
    audio.play();
  }
  digits(value: Number) {
    return value
      .toExponential()
      .replace(/^([0-9]+)\.?([0-9]+)?e[\+\-0-9]*$/g, '$1$2').length;
  }
}
