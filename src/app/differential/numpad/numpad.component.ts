import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  active = 'increase';
  maxWbc: string = '100';
  currentCount: number = 10;
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit = this.units[0];
  numpadVisible: boolean = true;
  constructor() {}

  ngOnInit(): void {}

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
    if (event.keyCode) return true;
    return;
  }

  clearBtnHandler(event: any) {
    this.currentCount = 0;
  }

  setActive(event: any) {
    this.active = event.target.id;
  }

  addUnits(event: any) {
    this.units.push(event.target.value);
    event.target.value = '';
  }

  deleteUnitFromList(index: number) {
    this.units.splice(index, 1);
  }

  numpadDropdown() {
    this.numpadVisible = !this.numpadVisible;
  }
}
