import { Row, legacyPreset } from './../models/preset.model';
import { SettingsService } from './settings.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import * as presets from '../differential/presets.json';
import { Preset } from '../models/preset.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { convertDbPresetsForApp } from '../models/preset-utils';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
@Injectable({
  providedIn: 'root',
})
export class PresetService {
  presets: Preset[];
  currentPreset: Preset;
  currentPreset$: BehaviorSubject<Preset>;
  increase: boolean = true;
  WbcCount: number = 0;
  maxDecimals: number = 3;
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit: string = this.units[0];
  loggedIn: boolean = false;
  emptyRow = {
    ignore: false,
    key: '',
    cell: '',
    count: 0,
    relative: 0,
    absolute: 0,
  };
  constructor(
    private user: UserService,
    private db: AngularFirestore,
    private settings: SettingsService,
    private analytics: AngularFireAnalytics
  ) {
    this.getPresetsFromDb();
    this.presets = [{ name: '', maxWBC: 100, rows: [] }];
    this.currentPreset = this.presets[0];
    this.currentPreset$ = new BehaviorSubject(this.presets[0]);
    this.user.isLoggedIn$.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }

  adjustCount(row: Row) {
    let currentCount = this.getCurrentCount();
    //if setting set to increase, increment and row count
    if (this.increase && currentCount < this.currentPreset.maxWBC) {
      row.count++;
    }
    //if setting is decrease, decrease row count
    if (!this.increase && row.count > 0) {
      row.count--;
    }
    this.updateRelativesAndAbsolutes();
  }

  getCurrentCount() {
    return this.currentPreset?.rows
      .filter((row) => !row.ignore)
      .reduce((total, row) => total + row.count, 0);
  }

  updateRelativesAndAbsolutes() {
    const currentCount: number = this.getCurrentCount();
    const exp = 10 ** this.maxDecimals;
    if (this.increase && currentCount >= this.currentPreset.maxWBC) {
      console.log('maxed out');

      this.settings.playSound('max');
    }
    //legit don't know how it works exactly, but it rounds relative and absolute
    for (const row of this.currentPreset.rows) {
      let num = (!row.ignore ? row.count / currentCount : 0) || 0;
      row.relative = Math.round((num + Number.EPSILON) * 1000) / 10;
      row.absolute =
        Math.round((num * this.WbcCount + Number.EPSILON) * exp) / exp;
    }
  }

  clearCounts() {
    if (this.currentPreset) {
      for (let row of this.currentPreset.rows) {
        row.count = 0;
        row.relative = 0;
        row.absolute = 0;
      }
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
              //console.log(result.data());
              let data: any = result.data();
              if (data.presets) {
                this.presets = convertDbPresetsForApp(data.presets);
                this.currentPreset = this.presets[0];
                this.currentPreset$.next(this.currentPreset);
              } else {
                this.loadPresets();
              }
            } else {
              this.loadPresets();
            }
          })
          .catch((err) => {
            console.log(err);
            this.loadPresets();
          });
      } else {
        this.loadPresets();
        console.log('no uid');
      }
    });
  }

  sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  updatePresets() {
    if (this.loggedIn) {
      return this.user.updatePresets(this.presets);
    }
    //update local storage and return a promise that resolves after 1 second
    return new Promise((resolve, reject) => {
      this.analytics.logEvent('saved local storage');
      try {
        localStorage.setItem('presets', JSON.stringify(this.presets));
        setTimeout(() => {
          resolve('done updating local storage');
        }, 1000);
      } catch (error) {
        reject('error updating local storage');
      }
    });
  }

  loadStandardPresets() {
    this.presets = Array.from(presets);
    this.currentPreset = this.presets[0];
    this.currentPreset$.next(this.currentPreset);
  }

  //check local storage for preset list and update this.Presets with it
  //if no preset list in local storage, load standard presets
  loadPresets() {
    let presetList = localStorage.getItem('presetList');
    let presets = localStorage.getItem('presets');
    if (presetList) {
      let legacyPresets: legacyPreset[] = JSON.parse(presetList);
      //convert legacy presets to new presets
      this.presets = legacyPresets.map((preset) => {
        return {
          name: preset.name,
          maxWBC: preset.maxWBC,
          rows: preset.keyCells.map((row) => {
            return {
              cell: row[1],
              count: 0,
              ignore: row[2] === 'ignore' ? true : false,
              relative: 0,
              absolute: 0,
              key: row[0],
            };
          }),
        };
      });
      //clear local storage
      localStorage.removeItem('presetList');
      this.currentPreset = this.presets[0];
      this.currentPreset$.next(this.currentPreset);
      localStorage.setItem('presets', JSON.stringify(this.presets));
    } else if (presets) {
      this.presets = JSON.parse(presets);
      this.currentPreset = this.presets[0];
      this.currentPreset$.next(this.currentPreset);
    } else {
      this.loadStandardPresets();
    }
  }
  createPreset(index: number = 0, name: string = 'Default', max: number = 100) {
    let newPreset: Preset = {
      name: name,
      maxWBC: max,
      rows: [{ ...this.emptyRow }],
    };
    this.presets.push(newPreset);
    this.currentPreset = this.presets.at(index);
  }

  addRow() {
    this.currentPreset?.rows.push({ ...this.emptyRow });
  }

  onNumpadClick(key: string) {
    navigator.vibrate(200);
    let row = this.currentPreset?.rows.find((row: Row) => {
      return row.key == key;
    });
    if (row) {
      this.adjustCount(row);
    }
  }
}
