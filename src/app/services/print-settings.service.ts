import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PrintSettingsService {
  printSettings$: Observable<object>;

  constructor(private db: AngularFirestore, private user: UserService) {
    this.user.uid$.subscribe((uid) => {
      console.log(uid);

      if (uid) {
        this.db
          .collection(`users`)
          .doc(uid)
          .ref.get()
          .then((result) => {
            if (result.exists) {
              console.log(result.data());
              let data: any = result.data();
            }
          });
      }
    });
  }
}
