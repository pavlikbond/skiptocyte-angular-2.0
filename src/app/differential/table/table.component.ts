import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as data from '../presets.json';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { TooltipComponent } from '@angular/material/tooltip';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  isLoading = false;
  presets: any = data;
  currentPreset = this.presets.presets[0];

  constructor() {}

  ngOnInit(): void {}

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

  changeClient(value: any) {
    this.currentPreset = this.presets.presets[value];
  }

  deleteRow(event: any) {
    let indexToDelete = event.target.dataset.target;
    this.currentPreset.rows.splice(indexToDelete, 1);
  }

  updateKey(event: any) {
    event.preventDefault();
    let key = event.key;
    event.target.value = key;
    //event.target.value = value;
  }

  duplicateCheck(event: any) {
    if (event.key === 'Backspace' || event.key === 'Tab') {
      return;
    }

    let duplicateFound: boolean = false;
    for (let row of this.currentPreset.rows) {
      if (row.key == event.key) {
        duplicateFound = true;
        event.preventDefault();
        event.target.value = '';
        event.target.style.border = '2px solid red';
        setTimeout(() => {
          event.target.style.border = 'none';
        }, 2000);
      }
    }
    if (!duplicateFound) {
      event.target.style.border = 'none';
      this.updateKey(event);
    }
  }
}
