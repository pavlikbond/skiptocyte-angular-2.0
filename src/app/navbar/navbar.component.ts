import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

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

  homeRoute = {
    name: '',
    route: ''
  }

  ngOnInit(): void {
    debugger;
    this.router.getCurrentNavigation();
    this.activeLink = this.routes[0];
  }



  switchRoute(route: string, activeTab:any) {
    debugger;
      this.router.navigate(['/'+ route]);
      this.activeLink = activeTab;
  }

}
