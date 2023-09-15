import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Preset, Row } from 'src/app/models/preset.model';
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
    this.presetService.currentPreset.maxWBC = +result;
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

  clearBtnHandler() {
    this.presetService.clearCounts();
  }

  addUnits(event: any) {
    this.presetService.units.push(event.target.value);
    event.target.value = '';
  }

  deleteUnitFromList(index: number) {
    this.presetService.units.splice(index, 1);
  }

  getMaxWbc() {
    return this.presetService.currentPreset?.maxWBC ?? 100;
  }

  getWBCCount() {
    return this.presetService.WbcCount;
  }

  getCurrentCount() {
    return this.presetService.getCurrentCount();
  }

  private getRow(key: string) {
    return this.presetService.currentPreset?.rows.find((row: Row) => {
      return row.key == key;
    });
  }

  keyBindingCheck(key: string) {
    const row = this.getRow(key);
    return row ? row.cell : '';
  }
  //listenes for key down events, flashes animation
  @HostListener('window:keydown', ['$event'])
  async onKeyDown(event: any) {
    if (event.target.nodeName === 'INPUT') {
      return;
    }
    this.updateAllCounts(event.key);
  }

  updateAllCounts(key: string) {
    let row = this.getRow(key);
    if (row) {
      this.presetService.adjustCount(row);
    }
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
  onButtonToggle(event: any) {
    this.presetService.increase = event.value === '+';
  }
}
