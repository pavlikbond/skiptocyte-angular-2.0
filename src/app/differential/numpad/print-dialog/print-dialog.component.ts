import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { Row } from 'src/app/models/preset.model';
import { PresetService } from 'src/app/services/preset.service';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent {
  numPages: number = 1;
  pages: number[] = [];
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
  @ViewChild('previewPane') previewPane!: ElementRef;
  @ViewChild('previewPage') previewPage!: ElementRef;
  adding: boolean = false;
  newFieldValue: string = '';
  count = this.presetService.WbcCount;
  allSettings = {
    showLabels: true,
    showCell: true,
    showCount: false,
    showRelative: true,
    showAbsolute: true,
    showUnits: false,
    showIgnored: false,
    reportTitle: 'Report',
    showWBC: true,
  };
  pageRows: Row[][] = [[...this.presetService.currentPreset.rows]];
  constructor(private presetService: PresetService) {
    setTimeout(() => {
      this.work();
    });
  }

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
    //this checks the page and shifts the rows if overflow
    //timeout is needed because it needs to wait for the page to rerender
    //before calculating the div height
    setTimeout(() => {
      this.work();
    });
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
  print() {
    window.print();
  }

  getNumPages() {
    let element = this.previewPage.nativeElement;
    return Math.ceil(element.scrollHeight / element.clientHeight);
  }

  isFull() {
    let element = this.previewPage.nativeElement;
    let ch = element.clientHeight;
    let sh = element.scrollHeight;
    console.log(ch);
    console.log(sh);
    console.log(this.numPages);

    return sh > ch + 5;
  }

  async work() {
    this.numPages = this.getNumPages();
    this.pages = Array(this.numPages - 1)
      .fill(0)
      .map((x, i) => i);

    while (this.isFull()) {
      let removed = this.pageRows[0].pop();
      if (!this.pageRows[1]) {
        this.pageRows[1] = [removed!];
      } else {
        this.pageRows[1] = [removed!, ...this.pageRows[1]];
      }
      await this.sleep(1);
    }
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
