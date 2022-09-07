import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Preset } from 'src/app/models/preset.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  isLoading = false;
  @Input() presets: Preset[] = [];
  @Input() currentPreset!: Preset;
  index: string = '0';
  @Output() presetEvent = new EventEmitter<Preset>();
  numRowsError: string = '';
  maxCount!: string;

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
    });
  }

  clearAll() {
    this.currentPreset.rows = [];
  }

  updatePreset() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    //TODO: save to preset json
  }
  //fires when presets dropdown is changed
  changeClient(value: any) {
    this.currentPreset = this.presets[value];
    this.presetEvent.emit(this.currentPreset);
  }

  deleteRow(event: any) {
    let indexToDelete = event.target.dataset.target;
    this.currentPreset.rows.splice(indexToDelete, 1);
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
      let maxWBC = presetForm.controls['inputMaxCount'].value;
      let newPreset: Preset = {
        name: presetForm.controls['presetName'].value,
        maxWBC: maxWBC ? maxWBC : 100,
        rows: [
          {
            ignore: false,
            key: '',
            cell: '',
          },
        ],
      };
      this.presets = [...this.presets, newPreset];
      this.changeClient(this.presets.length - 1);
      this.index = (this.presets.length - 1).toString();
      presetForm.resetForm();
    }
  }
}
