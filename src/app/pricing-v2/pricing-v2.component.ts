import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from '../services/snackbar.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-pricing-v2',
  templateUrl: './pricing-v2.component.html',
})
export class PricingV2Component {
  loadingCheckoutSession: boolean;
  loadingTrial: boolean;
  email: string;
  uid: string;
  private apiURLs = {
    checkout: 'http://localhost:4000/api/checkout',
    trial: 'http://localhost:4000/api/trial',
  };
  constructor(
    private userService: UserService,
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

  onStartTrial() {
    this.loadingTrial = true;
    let data = {
      userId: this.uid,
    };
    this.httpClient
      .put(this.apiURLs.trial, data)
      .pipe(
        catchError((error) => {
          this.loadingTrial = false;
          this.snackBarService.openSnackBar('An Error Has Occurred', 'Close');
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.loadingTrial = false;
        // Process the data as needed
        console.log('data', data);
      });
  }
}
