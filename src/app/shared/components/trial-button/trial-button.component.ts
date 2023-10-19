import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { throwError } from 'rxjs';
import { map, switchMap, catchError, filter, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-trial-button',
  templateUrl: './trial-button.component.html',
})
export class TrialButtonComponent {
  userLoggedIn: boolean;
  constructor(public userService: UserService, private router: Router) {
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.userLoggedIn = isLoggedIn;
    });
  }

  onStartTrial() {
    if (this.userService.loadingTrial) return;
    if (!this.userLoggedIn) {
      //route to login
      this.userService.trialAfterLogin$.next(true);
      this.router.navigate(['/login']);
      return;
    }
    this.userService.startTrial();
    // startTrial
    //   .pipe(
    //     catchError((error) => {
    //       this.snackbarService.openSnackBar('An Error Has Occurred', 'Close');
    //       return throwError(() => error);
    //     })
    //   )
    //   .subscribe((data) => {
    //     this.router.navigate(['/differential']);
    //     this.snackbarService.openSnackBar('Trial Started', 'Close');
    //   });
  }
}
