import { Component, Input } from '@angular/core';
import { Preset, Row } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
})
export class RowComponent {
  @Input() item: Row;
  @Input() i: number;
  currentPreset: Preset = this.presetService.currentPreset;

  constructor(private presetService: PresetService) {
    // this.presetService.currentPreset$.subscribe((preset) => {
    //   this.currentPreset = preset;
    // });
  }

  deleteRow() {
    this.currentPreset.rows.splice(this.i, 1);
    this.presetService.updateRelativesAndAbsolutes();
  }

  onCheckboxClick() {
    this.presetService.updateRelativesAndAbsolutes();
  }

  duplicateCheck(event: any, item: Row) {
    event.target.classList.remove('!bg-red-600');
    if (event.key === 'Backspace' || event.key === 'Tab') {
      return;
    }
    item.key = '';
    //get a list of all keys from this.currentPreset
    let keys = this.currentPreset.rows.map((row: any) => {
      return row.key;
    });

    if (keys.includes(event.key)) {
      event.preventDefault();
      event.target.classList.add('!bg-red-600');
      setTimeout(() => {
        event.target.classList.remove('!bg-red-600');
      }, 1000);
    } else if (event.key.length > 1) {
      item.key = event.key;
    }
  }

  //function that adds commas to a large number
  addCommas(x: number) {
    if (x === 0) return 0;
    //convert number to string
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
