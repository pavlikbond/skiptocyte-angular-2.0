import { PresetService } from 'src/app/services/preset.service';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent {
  @Input() pressedKey: string;
  rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ];
  constructor(public presetService: PresetService) {}

  keyBindingCheck(key: string) {
    const row = this.presetService.currentPreset?.rows.find((row) => {
      return row.key == key;
    });
    return row ? row.cell : '';
  }
}
