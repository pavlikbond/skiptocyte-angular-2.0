import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent {
  preview = true;
  adding: boolean = false;
  newFieldValue: string = '';
  saving: boolean = false;

  constructor(
    private presetService: PresetService,
    public user: UserService,
    public settings: SettingsService
  ) {}

  drop(event: any) {
    moveItemInArray(
      this.settings.printSettings.fields,
      event.previousIndex,
      event.currentIndex
    );
  }
  deleteFieldRow(i: number) {
    this.settings.printSettings.fields.splice(i, 1);
  }

  addNewField() {
    this.settings.printSettings.fields.push({
      name: this.newFieldValue,
      value: '',
    });
    this.newFieldValue = '';
    this.toggleField();
  }

  toggleField() {
    this.adding = !this.adding;
  }

  onSaveSettings() {
    this.saving = true;
    this.settings.savePrintSettings().subscribe({
      error: (e) => console.error(e),
      complete: () => {
        this.saving = false;
      },
    });
  }

  onPrint() {
    let currentPreset = this.presetService.currentPreset;
    let selectedUnits = this.presetService.selectedUnit;
    let WBCCount = this.presetService.WbcCount;
    this.settings.saveToLocalStorage(currentPreset, selectedUnits, WBCCount);
    window.open('/printable', '_blank');
  }
}
