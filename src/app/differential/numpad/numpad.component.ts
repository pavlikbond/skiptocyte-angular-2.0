import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Preset, Row } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  isMobile: boolean = false;
  display: string = 'numpad';
  constructor(
    private breakpointObserver: BreakpointObserver,
    private presetService: PresetService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

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

  onButtonToggle(event: any) {
    this.presetService.increase = event.value === '+';
  }
}
