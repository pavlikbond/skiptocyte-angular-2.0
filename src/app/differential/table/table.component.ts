import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Preset } from 'src/app/models/preset.model';
import { NgForm } from '@angular/forms';
import { PresetService } from 'src/app/services/preset.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  isLoading = false;
  presets: Preset[] = this.getAllPresets();
  currentPreset: Preset = this.presetService.currentPreset;
  index: string = '0';
  numRowsError: string = '';
  maxCount!: string;

  constructor(
    private presetService: PresetService,
    public dialog: MatDialog,
    public user: UserService
  ) {
    this.presetService.currentPreset$.subscribe((preset) => {
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
    this.currentPreset.rows.push({
      ignore: false,
      key: '',
      cell: '',
      count: 0,
      relative: 0,
      absolute: 0,
    });
  }

  clearAll() {
    this.currentPreset.rows = [];
  }

  updatePreset() {
    this.isLoading = true;
    this.presetService.updatePresets().subscribe({
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  //fires when presets dropdown is changed
  changeClient(event: any) {
    let value = +event.value;
    this.currentPreset = this.presetService.presets[value];
    this.presetService.currentPreset = this.presetService.presets[value];
    this.presetService.clearCounts();
  }

  deleteRow(event: any) {
    let indexToDelete = event.target.dataset.target;
    this.currentPreset.rows.splice(indexToDelete, 1);
    //updates the current count to adjust for the amount that was deleted
    this.presetService.setCurrentCount(true);
  }

  onCheckboxClick(event: any, i: number) {
    let checked = event.target.checked;
    this.currentPreset.rows[i].ignore = checked;
    this.presetService.updateRelativesAndAbsolutes(true);
  }

  getCount(i: number) {
    return this.presetService.getCount(i);
  }

  getRelative(i: number) {
    let result = '';
    let relative = this.presetService.getRelative(i);

    if (relative > 0) {
      result += relative + '%';
    }
    return result;
  }

  getAbsolute(i: number) {
    let absolute = this.presetService.getAbsolute(i);
    return absolute !== '0' ? absolute : '';
  }

  duplicateCheck(event: any, i: number) {
    let keys = this.currentPreset.rows.map((row: any) => {
      return row.key;
    });
    //if backspace is pressed, blank out the key
    if (event.key === 'Backspace') {
      this.currentPreset.rows[i].key = '';
    }
    //if backspace or tab are hit, return so they perform normal function
    if (event.key === 'Backspace' || event.key === 'Tab') {
      return;
    }
    let index = 0;
    let duplicateFound: boolean = false;
    for (let row of this.currentPreset.rows) {
      //skip checking against itself
      if (index++ === i) {
        continue;
      }
      if (row.key == event.key) {
        duplicateFound = true;
        event.preventDefault();
        event.target.value = '';
        this.currentPreset.rows[i].key = '';
        event.target.style.border = '2px solid red';
        setTimeout(() => {
          event.target.style.border = 'none';
        }, 2000);
      }
    }
    if (!duplicateFound) {
      event.target.style.border = 'none';
      event.preventDefault();
      let key = event.key;
      event.target.value = key;
      this.currentPreset.rows[i].key = key;
    }
  }
  //update current preset with key value
  updateCurrentPreset(event: any, i: number) {
    this.currentPreset.rows[i].cell = event.target.value;
  }
  //validation for new preset form submit
  onSubmit(presetForm: NgForm) {
    //if form is valid create new preset and close modal
    if (presetForm.valid) {
      let maxWBC: string = presetForm.controls['inputMaxCount'].value;
      let name = presetForm.controls['presetName'].value;
      let newPreset: Preset = this.createPreset(name, maxWBC ? +maxWBC : 100);
      this.presets = [...this.presets, newPreset];
      this.changeClient(this.presets.length - 1);
      this.index = (this.presets.length - 1).toString();
      presetForm.resetForm();
      this.currentPreset = this.presets[this.presets.length - 1];

      this.presetService.presets = this.presets;
      this.presetService.currentPreset = this.currentPreset;
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

  getCurrentPreset() {
    return this.presetService.currentPreset;
  }

  getAllPresets() {
    return this.presetService.presets;
  }
}
