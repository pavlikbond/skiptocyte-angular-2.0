import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Preset } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent {
  active = 'increase';
  units = this.presetService.units;
  selectedUnit = this.presetService.selectedUnit;
  currentKey: string = '';
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

  constructor(private presetService: PresetService, public dialog: MatDialog) {}

  formatFloat(int: Number) {
    return int
      .toString()
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
  }

  //event when chaning the wbc count
  updateMaxWbc(e: any) {
    let result = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = result;
    this.presetService.currentPreset.maxWBC = Number(result);
  }

  updateWBCCount(e: any) {
    //regex that only allows numbers and a single period to be inputted
    let result = e.target.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
    if (result === '.') {
      result = '0.';
    }
    e.target.value = result;
    this.presetService.WbcCount = Number(result);
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
    this.presetService.units.push(event.target.value);
    event.target.value = '';
  }

  deleteUnitFromList(index: number) {
    this.presetService.units.splice(index, 1);
  }

  getMaxWbc() {
    return this.presetService.currentPreset?.maxWBC || 100;
  }

  getWBCCount() {
    return this.presetService.WbcCount;
  }

  getCurrentCount() {
    return this.presetService.currentCount;
  }

  keyBindingCheck(key: string) {
    const row = this.presetService.currentPreset?.rows.find((row) => {
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
    let row = this.presetService.currentPreset?.rows.find((row) => {
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

  openDialog() {
    //only open if there is a preset selected
    if (this.presetService.currentPreset) {
      this.dialog.open(PrintDialogComponent);
    }
  }

  changeUnit() {
    this.presetService.selectedUnit = this.selectedUnit;
  }
}
