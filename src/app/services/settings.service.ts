import { from } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  trackList = [
    { name: 'Sound 1', filePath: '../assets/Beep_1.wav' },
    { name: 'Sound 2', filePath: '../assets/Beep_2.mp3' },
    { name: 'Sound 3', filePath: '../assets/Beep_3.mp3' },
  ];
  trackIndexes = { max: 0, change: 1 };
  soundSettings = {
    playMaxCount: true,
    playCountChange: false,
  };

  printSettings = {
    showLabels: true,
    showCell: true,
    showCount: false,
    showRelative: true,
    showAbsolute: true,
    showUnits: true,
    showIgnored: false,
    reportTitle: 'Report',
    showWBC: true,
    fields: [
      { name: 'Specimen #', value: '' },
      { name: 'MRN', value: '' },
      { name: 'Name', value: '' },
      { name: 'DOB', value: '' },
      { name: 'Tech', value: '' },
      { name: 'Date', value: '' },
    ],
  };
  constructor(private db: AngularFirestore, private user: UserService) {
    this.user.uid$.subscribe((uid) => {
      if (uid) {
        this.getTableSettings();
        this.getPrintSettings();
      }
    });
  }

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
              this.printSettings = data.printSettings;
            }
          }
        })
    );
  }

  savePrintSettings() {
    return from(
      this.db
        .doc(`users/${this.user.uid}`)
        .update({ printSettings: this.printSettings })
    );
  }

  saveTableSettings() {
    this.db
      .doc(`users/${this.user.uid}`)
      .update({
        tableSettings: {
          trackList: this.trackList,
          trackIndexes: this.trackIndexes,
          soundSettings: this.soundSettings,
        },
      })
      .then(() => {
        console.log('saved successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTableSettings() {
    this.db
      .collection(`users`)
      .doc(this.user.uid)
      .ref.get()
      .then((result) => {
        if (result.exists) {
          console.log(result.data());
          let data: any = result.data();
          if (data.tableSettings) {
            this.trackList = data.tableSettings.trackList;
            this.trackIndexes = data.tableSettings.trackIndexes;
            this.soundSettings = data.tableSettings.soundSettings;
            console.log('got the data', data.tableSettings);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTrack(type: string) {
    if (type === 'max') {
      return this.trackList[this.trackIndexes.max].name;
    } else {
      return this.trackList[this.trackIndexes.change].name;
    }
  }

  playSound(type: string) {
    if (type === 'max' && !this.soundSettings.playMaxCount) return;
    if (type === 'change' && !this.soundSettings.playCountChange) return;

    let trackIndex = this.trackIndexes[type];

    let audio = new Audio();
    audio.src = this.trackList[trackIndex].filePath;

    audio.load();
    audio.play();
  }

  nextTrack(type: string) {
    this.trackIndexes[type] = ++this.trackIndexes[type] % this.trackList.length;
    this.playSound(type);
  }

  previousTrack(type: string) {
    this.trackIndexes[type] =
      --this.trackIndexes[type] < 0
        ? this.trackList.length - 1
        : this.trackIndexes[type];

    this.playSound(type);
  }
}
