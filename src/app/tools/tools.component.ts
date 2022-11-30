import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Item {
  name: string;
}

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
  items: Observable<any[]>;
  constructor(firestore: AngularFirestore) {
    firestore
      .doc('/test/Wk96QDpWIX9e93XdzNVL')
      .get()
      .subscribe((item: any) => {
        console.log(item.data());
      });

    this.items = firestore.collection('test').valueChanges();
    this.items.subscribe((item: any) => {
      console.log(item);
    });
  }

  ngOnInit(): void {}

  onClick() {
    console.log('clicked');
    console.log(this.items);
    console.log();
  }
}
