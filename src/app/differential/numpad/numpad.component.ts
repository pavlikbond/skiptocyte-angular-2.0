import { Component, HostListener } from '@angular/core';
import { Preset } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent {
  active = 'increase';
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit = this.units[0];
  numpadVisible: boolean = true;
  currentKey: string = '';
  //WbcCount!: number;
  maxLength: number = 8;
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

  formatInt(int: Number) {
    const maxLength = this.maxLength;

    let result = String(int).replace(/[^0-9]/g, '');
    if (result === '0') {
      result = '';
    }
    result = result.slice(0, maxLength);
    return result.replace(/(?<!\.\d*)(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  formatFloat(int: Number) {
    const maxLength = this.maxLength;
    const maxDecimals = this.presetService.maxDecimals;
    let result = String(int);
    //regex that only allows numbers and periods to be inputted
    result = result.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    //remove leading zeros
    if (result === '0') {
      result = '';
    }
    //if decimal entered, add zero before it
    if (result === '.') {
      result = '0.';
    }
    //check for lengths before and after decimal
    if (result.includes('.')) {
      let split = result.split('.');
      if (split[1].length > maxDecimals) {
        //console.log(split)
        result = result.slice(0, -1);
      }
      if (split[0].length > maxLength) {
        split[0] = split[0].slice(0, maxLength);
        result = split.join('.');
      }
    } else {
      result = result.substring(0, maxLength);
    }
    //regex to add commas every thousands before decimal
    return result.replace(/(?<!\.\d*)(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  //event when chaning the wbc count
  updateMaxWbc(e: any) {
    let result = this.formatInt(e.target.value);
    e.target.value = result;
    //update maxwbc with converted number
    this.presetService.currentPreset.maxWBC = Number(
      result.split(',').join('')
    );
  }

  updateWBCCount(e: any) {
    let result = this.formatFloat(e.target.value);
    e.target.value = result;
    this.presetService.WbcCount = Number(result.split(',').join(''));
    this.presetService.updateRelativesAndAbsolutes();
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
    return this.formatInt(this.presetService.currentPreset.maxWBC);
  }

  getWBCCount() {
    let value = this.formatFloat(this.presetService.WbcCount);
    return value;
  }
  numpadDropdown() {
    this.numpadVisible = !this.numpadVisible;
  }

  getCurrentCount() {
    let result = this.formatInt(this.presetService.currentCount);
    return result === '' ? 0 : result;
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
    this.updateAllCounts(event.key);
  }

  updateAllCounts(key: String) {
    let row = this.presetService.currentPreset.rows.find((row) => {
      return row.key === key;
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

  onNumpadClick(event: any, i: number) {
    navigator.vibrate(200);
    let key = this.numpadItems[i];
    this.updateAllCounts(key);
  }
}
