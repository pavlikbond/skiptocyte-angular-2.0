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

  constructor(
    private breakpointObserver: BreakpointObserver,
    public user: UserService
  ) {}

  onClick() {
    //this.opened = this.sidenav.opened;
  }

  logout() {
    this.user.logout();
  }
}
