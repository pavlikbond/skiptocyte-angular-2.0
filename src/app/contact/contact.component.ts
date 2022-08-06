import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedback:string = '';

  constructor() { }


  ngOnInit(): void {
  }

  submitFeedback(feedback: string) {
    // send feedback/contact request here
  }

}
