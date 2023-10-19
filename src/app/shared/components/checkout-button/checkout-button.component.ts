import { UserService } from 'src/app/services/user.service';
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
})
export class CheckoutButtonComponent {
  @Input() text: string;
  @Input() buttonClass: string;
  loadingCheckoutSession: boolean;
  uid: string;
  email: string;
  userLoggedIn: boolean;
  private apiURLs = {
    checkout: 'http://localhost:4000/api/checkout',
    trial: 'http://localhost:4000/api/trial',
  };

  constructor(
    public userService: UserService,
    private httpClient: HttpClient,
    private snackBarService: SnackbarService
  ) {
    this.userService.email$.subscribe((email) => {
      this.email = email;
    });
    this.userService.uid$.subscribe((uid) => {
      this.uid = uid;
    });
  }

  onSubscribe() {
    if (this.loadingCheckoutSession) return;
    this.loadingCheckoutSession = true;
    let data = {
      userId: this.uid,
      cancelURL: window.location.href,
      successURL: window.location.origin + '/differential',
    };
    this.httpClient
      .post(this.apiURLs.checkout, data)
      .pipe(
        catchError((error) => {
          this.loadingCheckoutSession = false;
          this.snackBarService.openSnackBar('An Error Has Occurred', 'Close');
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.loadingCheckoutSession = false;
        // Process the data as needed
        console.log('data', data);
        let url = data['url'];
        window.location.href = url;
      });
  }
}
