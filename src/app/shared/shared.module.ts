import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutButtonComponent } from './components/checkout-button/checkout-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SigninDialogComponent } from './components/signin-dialog/signin-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CheckoutButtonComponent, SigninDialogComponent],
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
  ],
  exports: [CheckoutButtonComponent, SigninDialogComponent],
})
export class SharedModule {}
