import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Preset } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  isLoading = false;
  currentPreset: Preset = this.presetService.currentPreset;
  index: string = '0';

  constructor(
    public presetService: PresetService,
    public dialog: MatDialog,
    public user: UserService
  ) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.presetService.currentPreset.rows,
      event.previousIndex,
      event.currentIndex
    );
  }

  stopLoading(startTime: number) {
    let endTime = Date.now();
    let timeElapsed = endTime - startTime;
    if (timeElapsed < 1000) {
      setTimeout(() => {
        this.isLoading = false;
      }, 1500 - timeElapsed);
    } else {
      this.isLoading = false;
    }
  }

  updatePreset() {
    if (this.isLoading) return;
    this.isLoading = true;
    let startTime = Date.now();
    this.presetService.updatePresets().then(() => {
      setTimeout(() => {
        this.stopLoading(startTime);
      }, 1000);
    });
  }
  openDialog() {
    this.dialog.open(SettingsDialogComponent);
  }
  //fires when presets dropdown is changed
  changeClient(event: MatSelectChange) {
    const value = +event.value;
    this.presetService.currentPreset = this.presetService.presets[value];
    this.presetService.clearCounts();
  }
  deletePreset(i: number) {
    // Check if the preset to delete is the currently selected one
    if (this.presetService.currentPreset === this.presetService.presets[i]) {
      // Remove the preset from the array
      this.presetService.presets.splice(i, 1);

      if (this.presetService.presets.length === 0) {
        // If there are no presets left, create a new one
        this.presetService.createPreset();
        this.presetService.currentPreset = this.presetService.presets[0];
      } else {
        // Select the first preset in the updated array
        this.presetService.currentPreset = this.presetService.presets[0];
      }
    } else {
      // If the preset to delete is not the currently selected one, just remove it
      this.presetService.presets.splice(i, 1);
    }
  }
}
