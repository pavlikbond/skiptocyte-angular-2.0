import { Component } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss'],
})
export class KeypadComponent {
  buttons: string[] = [
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
  constructor(public presetService: PresetService) {}

  keyBindingCheck(key: string) {
    const row = this.presetService.currentPreset?.rows.find((row) => {
      return row.key == key;
    });
    return row ? row.cell : '';
  }
}
