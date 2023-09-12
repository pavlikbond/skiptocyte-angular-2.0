import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Preset } from 'src/app/models/preset.model';
import { NgForm } from '@angular/forms';
import { PresetService } from 'src/app/services/preset.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  isLoading = false;
  currentPreset: Preset = this.presetService.currentPreset;
  index: string = '0';
  numRowsError: string = '';
  maxCount!: string;

  constructor(
    public presetService: PresetService,
    public dialog: MatDialog,
    public user: UserService,
    private snackbarService: SnackbarService
  ) {
    this.presetService.currentPreset$.subscribe((preset) => {
      console.log('current preset changed');
      this.currentPreset = preset;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.currentPreset.rows,
      event.previousIndex,
      event.currentIndex
    );
  }

  addRow() {
    this.currentPreset?.rows.push({
      ignore: false,
      key: '',
      cell: '',
      count: 0,
      relative: 0,
      absolute: 0,
    });
  }

  clearAll() {
    if (this.currentPreset?.rows.length > 0) {
      this.currentPreset.rows = [];
    }
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
    this.isLoading = true;
    let startTime = Date.now();
    this.presetService
      .updatePresets()
      .then(() => {
        this.stopLoading(startTime);
        this.snackbarService.openSnackBar('Saved Successfully');
      })
      .catch((e) => {
        console.log(e);
        this.stopLoading(startTime);
        this.snackbarService.openSnackBar('Error Saving');
      });
  }
  //fires when presets dropdown is changed
  changeClient(event: any) {
    let value = +event.value;
    this.currentPreset = this.presetService.presets[value];
    this.presetService.currentPreset = this.presetService.presets[value];
    this.presetService.clearCounts();
  }

  //validation for new preset form submit
  onSubmit(presetForm: NgForm) {
    //if form is valid create new preset and close modal
    if (presetForm.valid) {
      let maxWBC: string = presetForm.controls['inputMaxCount'].value;
      let name = presetForm.controls['presetName'].value;
      let newPreset: Preset = this.createPreset(name, maxWBC ? +maxWBC : 100);
      presetForm.resetForm();

      this.presetService.presets.push(newPreset);
      this.changeClient(this.presetService.presets.length - 1);
      this.index = (this.presetService.presets.length - 1).toString();

      this.presetService.currentPreset = newPreset;
      this.currentPreset = this.presetService.currentPreset;
    }
  }

  openDialog() {
    this.dialog.open(SettingsDialogComponent);
  }

  deletePreset(i: number) {
    if (this.currentPreset === this.presetService.presets[i]) {
      this.presetService.presets.splice(i, 1);
      if (this.presetService.presets.length === 0) {
        let preset: Preset = this.createPreset();
        this.currentPreset = preset;
        this.presetService.currentPreset = preset;
      } else {
        this.presetService.currentPreset = this.presetService.presets[0];
        this.currentPreset = this.presetService.currentPreset;
      }
    } else {
      this.presetService.presets.splice(i, 1);
    }

    this.index = this.presetService.presets
      .indexOf(this.currentPreset)
      .toString();

    this.presetService
      .updatePresets()
      .then(() => {
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }

  createPreset(name: string = 'Default', max: number = 100) {
    let newPreset: Preset = {
      name: name,
      maxWBC: max,
      rows: [
        {
          ignore: false,
          key: '',
          cell: '',
          count: 0,
          relative: 0,
          absolute: 0,
        },
      ],
    };
    return newPreset;
  }
}
