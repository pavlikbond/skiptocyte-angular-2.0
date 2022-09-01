import { Component, HostListener, OnInit } from '@angular/core';
import { Preset } from '../models/preset.model';
import * as presets from './presets.json';

@Component({
  selector: 'app-differential',
  templateUrl: './differential.component.html',
  styleUrls: ['./differential.component.scss'],
})
export class DifferentialComponent implements OnInit {
  presets = Array.from(presets);
  currentPreset = this.presets[0];
  currentCount = 0;
  maxWbc: number = 100;
  direction: string = 'increase';
  constructor() {}

  ngOnInit(): void {
    console.log(this.presets[0].rows);
  }
  //update current preset when table component selects new preset, so it can be passed to numpad
  receiveCurrentPreset(preset: Preset) {
    this.currentPreset = preset;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    if (event.target.nodeName === 'INPUT') {
      return;
    }
    let row = this.currentPreset.rows.find((row) => {
      return row.key === event.key;
    });

    if (row) {
      if (this.direction === 'increase' && this.currentCount < this.maxWbc) {
        this.currentCount++;
      }
      if (this.direction === 'decrease' && this.currentCount > 0) {
        this.currentCount--;
      }
    }
  }

  receiveMaxWbc(maxWbc: number) {
    this.maxWbc = maxWbc;
  }

  receiveIncDec(direction: string) {
    this.direction = direction;
  }
}
