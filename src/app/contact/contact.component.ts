import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {


  constructor(private http: HttpClient) { }

  feedback:string = '';
  SERVER_URL: string = "https://formsubmit.co/bf8ccb78dcfa78bcf9219843dd68e957";

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.feedback.length < 1 || this.feedback == '')
    {
      alert('cannot have an empty string');
    }
    else
    {
      let body:string = this.feedback;
      console.log('submitting...')
      this.http.post<any>("https://formsubmit.co/b81320abefcf2688218169ae7c36c518", body).subscribe( res => {
          alert('Thank you for your feedback!');
        },
        (err) => console.error('failed to send response')
      );

    }
  }

}
