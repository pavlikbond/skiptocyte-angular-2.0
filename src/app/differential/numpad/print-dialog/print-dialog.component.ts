import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent {
  currentCounts = this.presetService.currentPreset.rows;
  fields: { name: string; value: string }[] = [
    { name: 'Specimen #', value: '' },
    { name: 'MRN', value: '' },
    { name: 'Name', value: '' },
    { name: 'DOB', value: '' },
    { name: 'Tech', value: '' },
    { name: 'Date', value: '' },
  ];
  @ViewChild('newFieldInput') newFieldInputRef!: ElementRef;
  adding: boolean = false;
  newFieldValue: string = '';

  constructor(private presetService: PresetService) {}

  drop(event: any) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }
  deleteFieldRow(i: number) {
    this.fields.splice(i, 1);
  }

  addNewField() {
    this.fields.push({ name: this.newFieldValue, value: '' });
    this.newFieldValue = '';
    this.toggleField();
  }

  toggleField() {
    this.adding = !this.adding;
    if (this.adding) {
      //need the timeout because if it's too fast, the element isn't found yet
      setTimeout(() => {
        this.newFieldInputRef.nativeElement.focus();
      }, 50);
    }
  }
}
