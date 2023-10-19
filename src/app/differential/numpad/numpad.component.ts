import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Row } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from 'src/app/services/settings.service';
@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  isMobile: boolean = false;
  display: string = 'numpad';
  pressedKey: string = '';
  shake: boolean = false;
  constructor(
    public userService: UserService,
    private breakpointObserver: BreakpointObserver,
    public presetService: PresetService,
    public dialog: MatDialog,
    private settingsService: SettingsService
  ) {
    this.presetService.maxCountReached.subscribe((maxCountReached) => {
      if (maxCountReached) {
        this.shake = true;
        setTimeout(() => {
          this.shake = false;
        }, 100);
      }
    });
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.display = 'numpad';
        }
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

  openDialog() {
    //only open if there is a preset selected
    if (this.presetService.currentPreset) {
      this.dialog.open(PrintDialogComponent);
    }
  }

  onButtonToggle(event: any) {
    this.presetService.increase = event.value === '+';
  }
  //listenes for key down events, flashes animation
  @HostListener('window:keydown', ['$event'])
  async onKeyDown(event: any) {
    if (event.target.nodeName === 'INPUT') {
      return;
    }
    let row = this.presetService.currentPreset?.rows.find((row: Row) => {
      return row.key == event.key;
    });
    if (row) {
      this.pressedKey = event.key;
      setTimeout(() => {
        this.pressedKey = '';
      }, 100);
      this.presetService.adjustCount(row);
    }
  }
  onPrint() {
    let currentPreset = this.presetService.currentPreset;
    let selectedUnits = this.presetService.selectedUnit;
    let WBCCount = this.presetService.WbcCount;
    this.settingsService.saveToLocalStorage(
      currentPreset,
      selectedUnits,
      WBCCount
    );
    window.open('/printable', '_blank');
  }
}
