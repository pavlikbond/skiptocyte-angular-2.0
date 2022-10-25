import { Component, OnInit } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.scss'],
})
export class PrintViewComponent {
  currentCounts = this.presetService.currentPreset.rows;

  allSettings = {
    showLabels: true,
    showCell: true,
    showCount: false,
    showRelative: true,
    showAbsolute: true,
    showUnits: false,
    showIgnored: false,
    reportTitle: 'Report',
  };
  fields: { name: string; value: string }[] = [
    { name: 'Specimen #', value: '' },
    { name: 'MRN', value: '' },
    { name: 'Name', value: '' },
    { name: 'DOB', value: '' },
    { name: 'Tech', value: '' },
    { name: 'Date', value: '' },
  ];
  constructor(private presetService: PresetService) {}

  formattedUnit() {
    let unit = this.presetService.selectedUnit;
    if (unit.includes('^')) {
      let index = unit.indexOf('^');
      let superScript = '';
      for (let i = index + 1; i < unit.length; i++) {
        if (!isNaN(+unit[i])) {
          superScript += unit[i];
        } else {
          break;
        }
      }
      unit = unit.replace('^' + superScript, `<sup>${superScript}</sup>`);
    }
    return `${unit}`;
  }
}
