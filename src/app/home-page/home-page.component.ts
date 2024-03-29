import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(public user: UserService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Skiptocyte: Laboratory Tools');
  }

  logout() {
    this.user.logout();
  }
}
