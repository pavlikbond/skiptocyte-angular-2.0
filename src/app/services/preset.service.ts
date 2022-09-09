import { Injectable } from '@angular/core';
import * as presets from '../differential/presets.json';
import { Preset } from '../models/preset.model';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  presets: Preset[] = Array.from(presets);
  currentPreset: Preset = this.presets[0];
  maxWBC: number = this.currentPreset.maxWBC;
  currentCount: number = 0;
  direction: string = 'increase';

  constructor() {}

  setCurrentPreset(preset: Preset) {
    this.currentPreset = preset;
    console.log(this.currentPreset);
  }
}
