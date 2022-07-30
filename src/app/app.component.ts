import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private router: Router) {}
  title = 'skiptocyte-angular';
  routes = [
    {
      name: 'Home',
      route:''
    },
    {
      name: 'Dilution',
      route: 'dilution'
    },
    {
      name: 'Counter',
      route: 'differential'
    },
    {
      name: 'Contact',
      route: 'contact'
    }
  ]

  activeLink = this.routes[0];
  background: ThemePalette = 'primary';

  switchRoute(route: string) {
      this.router.navigate(['/'+ route]);
  }
}
