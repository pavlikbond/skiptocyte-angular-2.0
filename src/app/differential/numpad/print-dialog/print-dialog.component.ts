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
      this.refactor();
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
      this.refactor();
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

  getTotal(rowSpace = false) {
    let title = 1;
    let fields = Math.ceil(this.fields.length / 2);
    let count = this.allSettings.showWBC ? 2 : 1;
    let tableHeader = this.allSettings.showLabels ? 1 : 0;
    let ignoredRows = this.allSettings.showIgnored ? this.getNumIgnored() : 0;
    let normalRows =
      this.presetService.currentPreset.rows.length - this.getNumIgnored();

    let total = title + fields + count + tableHeader + ignoredRows + normalRows;
    let rows = 20 - (title + fields + count + tableHeader);

    return rowSpace ? rows : total;
  }

  getNumIgnored() {
    let count = 0;
    for (let item of this.presetService.currentPreset.rows) {
      if (item.ignore) {
        count++;
      }
    }
    return count;
  }

  refactor() {
    //need the  timeout otherwise it doesn't work
    setTimeout(() => {
      let total = this.getTotal();
      //if we need to add extra pages
      if (total > 20) {
        //let NumNewPages = Math.ceil((total - 20) / 20);
        let page1RowSpaces = this.getTotal(true);
        let rows: Row[][] = [];
        let pageIndex = 0;
        for (let row of this.presetService.currentPreset.rows) {
          if (this.allSettings.showIgnored) {
            rows[pageIndex] = rows[pageIndex]
              ? [...rows[pageIndex], row]
              : [row];
          }
          //if not displaying ignored rows only push non-ignored rows
          else {
            if (!row.ignore) {
              rows[pageIndex] = rows[pageIndex]
                ? [...rows[pageIndex], row]
                : [row];
            }
          }
          //if it's the first page, we only have page1rowspaces amount of space
          if (pageIndex === 0) {
            if (rows[0].length === page1RowSpaces) {
              pageIndex++;
            }
          }
          //all other pages have 20 space
          else {
            if (
              rows[pageIndex].length === (this.allSettings.showLabels ? 19 : 20)
            ) {
              pageIndex++;
            }
          }
        }

        this.pageRows = [...rows];
        this.pages = Array(this.pageRows.length - 1)
          .fill(0)
          .map((x, i) => i);
      }
    });
  }

  // getNumPages() {
  //   let element = this.previewPage.nativeElement;
  //   return Math.ceil(element.scrollHeight / element.clientHeight);
  // }

  // isFull() {
  //   let numPages = this.pageRows.length;

  //   let element = this.previewPage.nativeElement;
  //   let pane = this.previewPane.nativeElement;
  //   let ch = element.clientHeight;
  //   let sh = element.scrollHeight;
  //   console.log(ch);
  //   console.log(sh);
  //   console.log(pane.scrollHeight);

  //   let result = sh > (ch + 5) * numPages;
  //   //console.log(result);
  //   //console.log((ch + 5) * numPages);

  //   return sh > ch + 5;
  // }

  // async work() {
  //   while (this.isFull()) {
  //     let removed = this.pageRows[0].pop();
  //     if (!this.pageRows[1]) {
  //       this.pageRows[1] = [removed!];
  //     } else {
  //       this.pageRows[1] = [removed!, ...this.pageRows[1]];
  //     }
  //     await this.sleep(1);
  //   }
  //   let numPages = this.pageRows.length;
  //   this.pages = Array(numPages - 1)
  //     .fill(0)
  //     .map((x, i) => i);
  // }

  // sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
}
