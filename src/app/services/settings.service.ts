import { from, Observable } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  allSoundSettings = {
    trackList: [
      { name: 'Sound 1', filePath: '../assets/Beep_1.wav' },
      { name: 'Sound 2', filePath: '../assets/Beep_2.mp3' },
      { name: 'Sound 3', filePath: '../assets/Beep_3.mp3' },
    ],
    trackIndexes: { max: 0, change: 1 },
    soundSettings: {
      playMaxCount: true,
      playCountChange: false,
    },
  };

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
