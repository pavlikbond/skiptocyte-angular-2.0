import { from, Observable } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PrintSettingsService {
  printSettings$: Observable<object>;

  constructor(private db: AngularFirestore, private user: UserService) {}

  getPrintSettings() {
    return from(
      this.db
        .collection(`users`)
        .doc(this.user.uid)
        .ref.get()
        .then((result) => {
          if (result.exists) {
            console.log(result.data());
            let data: any = result.data();
            if (data.printSettings) {
              return data.printSettings;
            }
          }
        })
    );
  }

  savePrintSettings(printSettings) {
    return from(
      this.db
        .doc(`users/${this.user.uid}`)
        .update({ printSettings: printSettings })
    );
  }
}
