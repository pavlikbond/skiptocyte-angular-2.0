import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset, dbPreset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  uid: string;
  uid$: Observable<string>;
  constructor(
    private afAuth: AngularFireAuth,
    // private presetService: PresetService,
    private db: AngularFirestore
  ) {
    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.uid$ = afAuth.authState.pipe(map((user) => user?.uid));
    afAuth.authState.subscribe((user) => {
      this.uid = user?.uid;
    });
  }

  logout() {
    this.afAuth.signOut();
  }

  updatePresets(presets: Preset[]) {
    let dbPresets = convertPresetsForDb(presets);
    return from(
      this.db.doc(`users/${this.uid}`).update({ presets: dbPresets })
    );
  }
}
