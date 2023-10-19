import { UserService } from './../services/user.service';
import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  @ViewChild('drawer') sidenav: any;
  opened: boolean = false;
  trialExpires;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public userService: UserService
  ) {
    userService.isTrialing$.subscribe((isTrialing) => {
      if (isTrialing) {
        let trialStart = userService.subscription.trialStart;
        //figure out date when trial ends
        let trialEnd = trialStart + 30 * 24 * 60 * 60 * 1000;
        // figure out how many hours are left in the trial
        let hoursLeft = (trialEnd - Date.now()) / (60 * 60 * 1000);
        //if more than 24 hours left, display the number of days left, else dispaly hours
        if (hoursLeft > 24) {
          let daysLeft = Math.floor(hoursLeft / 24);
          this.trialExpires = ` ${daysLeft} days`;
        } else {
          if (hoursLeft > 1) {
            this.trialExpires = ` ${Math.ceil(hoursLeft)} hours`;
          } else {
            //figure out how many minutes are left
            let minutesLeft = hoursLeft * 60;
            this.trialExpires = ` ${Math.ceil(minutesLeft)} minutes`;
          }
        }
      }
    });
  }

  onClick() {
    //this.opened = this.sidenav.opened;
  }

  logout() {
    this.userService.logout();
  }
}
