import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  constructor(private http: HttpClient) {}
  errorMessage: string = '';
  loading: boolean = false;
  email: string = '';
  feedback: string = '';
  success: boolean = false;
  SERVER_URL: string =
    'https://formsubmit.co/ajax/bf8ccb78dcfa78bcf9219843dd68e957';
  //SERVER_URL: string = 'https://formsubmit.co/ajax/pavlik.bond@gmail.com';
  ngOnInit(): void {}

  onSubmit(value: any) {
    this.loading = true;
    this.errorMessage = '';
    fetch(this.SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(value),
    })
      .then((response) => response.json())
      .then((data) => {
        this.loading = false;
        console.log(data);
        this.success = true;
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
        this.errorMessage = 'An error occured. Please try again later.';
      });
  }
}
