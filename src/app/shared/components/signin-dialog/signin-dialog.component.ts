import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
@Component({
  selector: 'app-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.scss'],
})
export class SigninDialogComponent {
  constructor(public dialogRef: MatDialogRef<SigninDialogComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
