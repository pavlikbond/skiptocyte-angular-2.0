import { Component } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-units-dropdown',
  templateUrl: './units-dropdown.component.html',
})
export class UnitsDropdownComponent {
  selectedUnit = this.presetService.selectedUnit;
  units = this.presetService.units;

  constructor(private presetService: PresetService) {}

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
