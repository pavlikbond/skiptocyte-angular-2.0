import { from } from 'rxjs';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  trackList = [
    { name: 'Sound 1', filePath: 'assets/Beep_1.wav' },
    { name: 'Sound 2', filePath: 'assets/Beep_2.mp3' },
    { name: 'Sound 3', filePath: 'assets/Beep_3.mp3' },
  ];
  trackIndexes = { max: 1, change: 1 };
  soundSettings = {
    playMaxCount: true,
    playCountChange: false,
  };

  ogSettings = {};

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
  constructor(
    private db: AngularFirestore,
    private user: UserService,
    private snackBar: SnackbarService
  ) {
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
            //console.log(result.data());
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
    let currentSettings = {
      soundSettings: this.soundSettings,
      trackIndexes: this.trackIndexes,
      trackList: this.trackList,
    };
    if (this.deepEqual(this.ogSettings, currentSettings)) {
      return;
    }
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
        this.ogSettings = structuredClone(currentSettings);
        this.snackBar.openSnackBar('Settings saved successfully');
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
          //console.log(result.data());
          let data: any = result.data();
          if (data.tableSettings) {
            this.trackList = data.tableSettings.trackList;
            this.trackIndexes = data.tableSettings.trackIndexes;
            this.soundSettings = data.tableSettings.soundSettings;
            //console.log('got the data', data.tableSettings);
            this.ogSettings = structuredClone(data.tableSettings);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  preloadSounds() {
    for (const track of this.trackList) {
      const audio = new Audio();
      audio.src = track.filePath;
      audio.load();
    }
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

    audio.addEventListener('canplaythrough', () => {
      audio.play();
    });

    audio.addEventListener('ended', () => {
      // Do something when audio has finished playing.
    });
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

  saveToLocalStorage(currentPreset, selectedUnits, WBCCount) {
    //store the current preset in session storage
    sessionStorage.setItem('currentPreset', JSON.stringify(currentPreset));
    //store the print settings in session storage
    sessionStorage.setItem('printSettings', JSON.stringify(this.printSettings));
    //store the selected units in session storage
    sessionStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
    //set WBC Count to session storage
    sessionStorage.setItem('WbcCount', JSON.stringify(WBCCount));
  }

  deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }
}
