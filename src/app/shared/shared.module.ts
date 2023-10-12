import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutButtonComponent } from './components/checkout-button/checkout-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TrialButtonComponent } from './components/trial-button/trial-button.component';

@NgModule({
  declarations: [CheckoutButtonComponent, TrialButtonComponent],
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
  ],
  exports: [CheckoutButtonComponent, TrialButtonComponent],
})
export class SharedModule {}
