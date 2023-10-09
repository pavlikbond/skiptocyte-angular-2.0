import { NgModule } from '@angular/core';
import { CheckoutButtonComponent } from './components/checkout-button/checkout-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [CheckoutButtonComponent],
  imports: [MatProgressSpinnerModule, MatButtonModule],
  exports: [CheckoutButtonComponent],
})
export class SharedModule {}
