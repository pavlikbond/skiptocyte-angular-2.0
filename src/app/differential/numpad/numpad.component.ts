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
  active = 'increase';
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit = this.units[0];
  numpadVisible: boolean = true;
  currentKey: string = '';
  WbcCount: number = 0;
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

  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (event.target.value.length > 5) {
      event.preventDefault();
      return false;
    }
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    if (event.keyCode) {
      this.presetService.WbcCount = +event.target.value;
      return true;
    }
    return;
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
