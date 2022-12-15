import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import * as presets from '../differential/presets.json';
import { Preset, Row } from '../models/preset.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { convertDbPresetsForApp } from '../models/preset-utils';

@Injectable({
  providedIn: 'root',
})
export class PresetService {
  presets: Preset[];
  currentPreset: Preset;
  currentPreset$: BehaviorSubject<Preset>;
  currentCount: number = 0;
  direction: string = 'increase';
  WbcCount: number = 0;
  maxDecimals: number = 3;
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit: string = this.units[0];
  trackList: { name: string; filePath: string }[] = [
    { name: 'Sound 1', filePath: '../assets/Beep_1.wav' },
    { name: 'Sound 2', filePath: '../assets/Beep_2.mp3' },
    { name: 'Sound 3', filePath: '../assets/Beep_3.mp3' },
  ];
  currentTrackMax = 0;
  currentTrackChange = 1;
  soundSettings = {
    playMaxCount: true,
    playCountChange: false,
  };

  //currentTrack: { name: string; filePath: string } = this.trackList[0];

  constructor(private user: UserService, private db: AngularFirestore) {
    this.getPresetsFromDb();
    this.presets = [{ name: '', maxWBC: 100, rows: [] }];
    this.currentPreset = this.presets[0];
    this.currentPreset$ = new BehaviorSubject(this.presets[0]);
  }

  getMaxWbc() {
    return this.currentPreset.maxWBC;
  }

  adjustCount(key: string, i: number) {
    //if setting set to increase, increment and row count
    if (
      this.direction === 'increase' &&
      this.currentCount < this.currentPreset.maxWBC
    ) {
      this.currentPreset.rows[i].count++;
    }
    //if setting is decrease, decrease row count
    if (this.direction === 'decrease') {
      if (this.currentPreset.rows[i].count > 0) {
        this.currentPreset.rows[i].count--;
      }
    }
    this.updateRelativesAndAbsolutes();
    if (this.direction === 'increase') {
      if (this.currentCount >= this.currentPreset.maxWBC) {
        if (this.soundSettings.playMaxCount) {
          this.playDing(this.currentTrackMax);
        }
      }
    }
  }

  setCurrentCount() {
    let total = 0;
    for (let row of this.currentPreset.rows) {
      total += row.ignore ? 0 : row.count;
    }
    this.currentCount = total;
    if (this.currentCount < this.currentPreset.maxWBC) {
      if (this.soundSettings.playCountChange) {
        this.playDing(this.currentTrackChange);
      }
    }
  }

  updateRelativesAndAbsolutes() {
    //let fraction = String(this.WbcCount).split('.')[1];
    //let numsAfterDec = fraction ? fraction.length : 0;
    //let exp = 10 ** Math.min(this.maxDecimals, numsAfterDec);
    let exp = 10 ** this.maxDecimals;
    //console.log(typeof num);

    this.setCurrentCount();
    for (let row of this.currentPreset.rows) {
      //or 0 because otherwise it might return NaN
      let num = row.count / this.currentCount || 0;
      if (!row.ignore) {
        row.relative = Math.round((num + Number.EPSILON) * 1000) / 10;

        row.absolute =
          Math.round((num * this.WbcCount + Number.EPSILON) * exp) / exp;
      } else {
        row.relative = 0;
        row.absolute = 0;
      }
    }
  }

  getCount(i: number) {
    return this.currentPreset.rows[i].count;
  }

  getRelative(i: number) {
    return this.currentPreset.rows[i].relative;
  }

  getAbsolute(i: number) {
    //adds commas to digits before the decimal
    let x = String(this.currentPreset.rows[i].absolute).replace(
      /(?<!\.\d*)(\d)(?=(?:\d{3})+(?!\d))/g,
      '$1,'
    );

    return x;
  }

  clearCounts() {
    if (this.currentPreset) {
      for (let row of this.currentPreset.rows) {
        row.count = 0;
        row.relative = 0;
        row.absolute = 0;
      }
    }
    this.currentCount = 0;
  }

  playDing(index: number) {
    let trackIndex =
      index === 0 ? this.currentTrackMax : this.currentTrackChange;

    let audio = new Audio();
    audio.src = this.trackList[trackIndex].filePath;

    audio.load();
    audio.play();
  }
  digits(value: Number) {
    return value
      .toExponential()
      .replace(/^([0-9]+)\.?([0-9]+)?e[\+\-0-9]*$/g, '$1$2').length;
  }

  getDisplayTrack(index: number) {
    return this.trackList[index].name;
  }

  nextTrack(index: number) {
    if (index === 0) {
      this.currentTrackMax = ++this.currentTrackMax % this.trackList.length;
    } else {
      this.currentTrackChange =
        ++this.currentTrackChange % this.trackList.length;
    }
  }

  previousTrack(index: number) {
    if (index === 0) {
      this.currentTrackMax =
        --this.currentTrackMax < 0
          ? this.trackList.length - 1
          : this.currentTrackMax;
    } else {
      this.currentTrackChange =
        --this.currentTrackChange < 0
          ? this.trackList.length - 1
          : this.currentTrackChange;
    }
  }

  getPresetsFromDb() {
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
              if (data.presets) {
                this.presets = convertDbPresetsForApp(data.presets);
                this.currentPreset = this.presets[0];
                this.currentPreset$.next(this.currentPreset);
              } else {
                this.loadStandardPresets();
              }
            } else {
              this.loadStandardPresets();
            }
          })
          .catch((err) => {
            console.log(err);
            this.loadStandardPresets();
          });
      } else {
        this.loadStandardPresets();
      }
    });
  }

  updatePresets() {
    return this.user.updatePresets(this.presets);
  }

  loadStandardPresets() {
    this.presets = Array.from(presets);
    this.currentPreset = this.presets[0];
    this.currentPreset$.next(this.currentPreset);
  }
}
