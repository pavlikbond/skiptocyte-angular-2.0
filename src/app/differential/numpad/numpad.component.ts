import { Component, HostListener } from '@angular/core';
import { Preset } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent {
  currentPreset: Preset = this.presetService.currentPreset;
  maxWBC: number = this.currentPreset.maxWBC;
  active = 'increase';
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit = this.units[0];
  numpadVisible: boolean = true;
  currentKey: string = '';
  WbcCount!: number;
  numpadItems = [
    'NumLock',
    '/',
    '*',
    '-',
    '7',
    '8',
    '9',
    '+',
    '4',
    '5',
    '6',
    '1',
    '2',
    '3',
    'Enter',
    '0',
    '.',
  ];

  constructor(private presetService: PresetService) {}

  updateAbsolutes(event: any) {
    console.log(event);
    this.presetService.WbcCount = +event.value;
    this.presetService.updateRelativesAndAbsolutes();
  }
  //event when chaning the wbc count
  updateMaxWbc(event: any) {
    this.currentPreset.maxWBC = event.value;
  }
  clearBtnHandler(event: any) {
    this.presetService.currentCount = 0;
    this.presetService.clearCounts();
  }

  setActive(event: any) {
    this.active = event.target.id;
    this.presetService.direction = this.active;
  }

  addUnits(event: any) {
    this.units.push(event.target.value);
    event.target.value = '';
  }

  deleteUnitFromList(index: number) {
    this.units.splice(index, 1);
  }

  getMaxWbc() {
    this.maxWBC = this.presetService.currentPreset.maxWBC;
    return this.presetService.currentPreset.maxWBC;
  }
  numpadDropdown() {
    this.numpadVisible = !this.numpadVisible;
  }

  getCurrentCount() {
    return this.presetService.currentCount;
  }

  keyBindingCheck(key: string) {
    const row = this.presetService.currentPreset.rows.find((row) => {
      return row.key == key;
    });
    if (row) {
      return row.cell;
    }
    return '';
  }
  //listenes for key down events, flashes animation
  @HostListener('window:keydown', ['$event'])
  async onKeyDown(event: any) {
    if (event.target.nodeName === 'INPUT') {
      return;
    }
    let row = this.presetService.currentPreset.rows.find((row) => {
      return row.key === event.key;
    });
    //if keybinding was found in current preset, update count depending on direction
    if (row) {
      this.currentKey = row.key;
      this.presetService.adjustCount(
        this.currentKey,
        this.presetService.currentPreset.rows.indexOf(row)
      );
      setTimeout(() => {
        this.currentKey = '';
      }, 200);
    }
  }
}
