import { Component } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-units-dropdown',
  templateUrl: './units-dropdown.component.html',
  styleUrls: ['./units-dropdown.component.scss'],
})
export class UnitsDropdownComponent {
  selectedUnit = this.presetService.selectedUnit;
  constructor(private presetService: PresetService) {}
  units = this.presetService.units;
  addUnits(event: any) {
    this.presetService.units.push(event.target.value);
    event.target.value = '';
  }

  deleteUnitFromList(index: number) {
    this.presetService.units.splice(index, 1);
  }
  changeUnit() {
    this.presetService.selectedUnit = this.selectedUnit;
  }
}
