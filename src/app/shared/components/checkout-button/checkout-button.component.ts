import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
})
export class CheckoutButtonComponent {
  @Input() text: string;
  constructor() {}
}
