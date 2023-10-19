import { Row, LegacyPreset } from './../models/preset.model';
import { SettingsService } from './settings.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import * as presets from '../differential/presets.json';
import { Preset } from '../models/preset.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  convertDbPresetsForApp,
  convertLegacyToNew,
} from '../models/preset-utils';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PresetService {
  initialLoad: boolean = false;
  presets: Preset[];
  currentPreset: Preset;
  increase: boolean = true;
  WbcCount: number = 0;
  maxDecimals: number = 3;
  units = ['10^9/L', '10^6/mL', '10^3/uL'];
  selectedUnit: string = this.units[0];
  loggedIn: boolean = false;
  maxCountReached: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
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
    private analytics: AngularFireAnalytics,
    private router: Router,
    private fsService: FirestoreService
  ) {
    this.getPresetsFromDb();
    this.presets = [{ name: '', maxWBC: 100, rows: [] }];
    this.currentPreset = this.presets[0];
    this.user.isLoggedIn$.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }

  adjustCount(row: Row) {
    let currentCount = this.getCurrentCount();
    let countChanged = false;
    //if setting set to increase, increment and row count
    if (this.increase && currentCount < this.currentPreset.maxWBC) {
      row.count++;
      countChanged = true;
    }
    //if setting is decrease, decrease row count
    if (!this.increase && row.count > 0) {
      row.count--;
      countChanged = true;
    }
    this.updateRelativesAndAbsolutes();
    currentCount = this.getCurrentCount();
    if (this.increase && currentCount >= this.currentPreset.maxWBC) {
      this.settings.playSound('max');
      this.maxCountReached.next(true);
    } else if (countChanged) {
      this.settings.playSound('change');
    }
  }

  getCurrentCount() {
    return this.currentPreset?.rows
      .filter((row) => !row.ignore)
      .reduce((total, row) => total + row.count, 0);
  }

  updateRelativesAndAbsolutes() {
    const currentCount: number = this.getCurrentCount();
    const exp = 10 ** this.maxDecimals;
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
                //this.currentPreset$.next(this.currentPreset);
                this.initialLoad = true;
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

  async updatePresets() {
    if (this.loggedIn) {
      await this.fsService.updatePresets(this.presets, this.user.uid);
    } else {
      await this.fsService.updateLocalStorage(this.presets);
    }
  }

  //check local storage for preset list and update this.Presets with it
  //if no preset list in local storage, load standard presets
  loadPresets() {
    const presetList = localStorage.getItem('presetList');
    const presetsData = localStorage.getItem('presets');

    if (presetList) {
      const legacyPresets: LegacyPreset[] = JSON.parse(presetList);
      this.presets = convertLegacyToNew(legacyPresets);
      localStorage.removeItem('presetList');
      this.fsService.updateLocalStorage(this.presets);
    } else if (presetsData) {
      this.presets = convertDbPresetsForApp(JSON.parse(presetsData));
    } else {
      this.presets = Array.from(presets);
    }

    this.currentPreset = this.presets[0];
    this.initialLoad = true;
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
  handleLoginSuccess(result) {
    if (result.additionalUserInfo.isNewUser) {
      this.user.isLoggedIn$.subscribe((loggedIn) => {
        if (loggedIn) {
          this.user.updatePresets(this.presets, true);
        }
      });
    }
    if (this.user.trialAfterLogin$.value) {
      this.user.trialAfterLogin$.next(false);
      this.user.startTrial();
    } else {
      this.router.navigateByUrl('/differential');
    }
  }
}
