import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { Preset } from 'src/app/models/preset.model';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  @Input() currentPreset!: Preset;
  @Input() currentCount!: number;
  @Output() maxWbcEvent = new EventEmitter<number>();
  @Output() incDecEvent = new EventEmitter<string>();
  @Output() updateCurrentCount = new EventEmitter<number>();

  active = 'increase';
  maxWbc: number = 100;
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit = this.units[0];
  numpadVisible: boolean = true;
  currentKey: string = '';
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

  constructor() {}

  ngOnInit(): void {}

  keyPressNumbers(event: any) {
    this.maxWbcEvent.emit(this.maxWbc);
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
    this.updateCurrentCount.emit(this.currentCount);
  }

  setActive(event: any) {
    this.active = event.target.id;
    this.incDecEvent.emit(this.active);
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

  keyBindingCheck(key: string) {
    const row = this.currentPreset.rows.find((row) => {
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
    let row = this.currentPreset.rows.find((row) => {
      return row.key === event.key;
    });

    if (row) {
      this.currentKey = row.key;
      setTimeout(() => {
        this.currentKey = '';
      }, 200);
    }
  }
}
