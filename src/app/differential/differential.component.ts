import { Component, HostListener, OnInit } from '@angular/core';
import { Preset } from '../models/preset.model';
import * as presets from './presets.json';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-differential',
  templateUrl: './differential.component.html',
  styleUrls: ['./differential.component.scss'],
  providers: [PresetService],
})
export class DifferentialComponent {
  presets = Array.from(presets);
  currentPreset = this.presets[0];
  currentCount = 0;
  maxWbc: number = 100;
  direction: string = 'increase';

  constructor(private presetService: PresetService) {}

  receiveCurrentPreset(preset: Preset) {
    this.currentPreset = preset;
  }

  // @HostListener('window:keydown', ['$event'])
  // onKeyDown(event: any) {
  //   if (event.target.nodeName === 'INPUT') {
  //     return;
  //   }
  //   let row = this.currentPreset.rows.find((row) => {
  //     return row.key === event.key;
  //   });

  //   if (row) {
  //     if (this.direction === 'increase' && this.currentCount < this.maxWbc) {
  //       this.currentCount++;
  //     }
  //     if (this.direction === 'decrease' && this.currentCount > 0) {
  //       this.currentCount--;
  //     }
  //   }
  // }

  receiveMaxWbc(maxWbc: number) {
    this.maxWbc = maxWbc;
  }

  receiveIncDec(direction: string) {
    this.direction = direction;
  }

  receiveCurrentCount(count: number) {
    this.currentCount = count;
  }
}
