import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset, dbPreset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isSubbed$: BehaviorSubject<boolean>;
  isNotSubbed$: BehaviorSubject<boolean>;
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
    //get boolean of whether the user is subscribed or not once we get uid
    this.uid$.subscribe((uid) => {
      //console.log(uid);
      return this.db
        .collection(`users/${uid}/subscriptions`, (ref) =>
          ref.where('status', 'in', ['active', 'trialing'])
        )
        .get()
        .subscribe((data) => {
          if (!data.empty) {
            this.isSubbed$ = new BehaviorSubject(true);
            let sub: any = data.docs.find((sub) => {
              let data = sub.data() as any;
              return data?.status === 'trialing';
            });
            let timeLeft = Math.abs(sub.data().endDate - Date.now());
            console.log(timeLeft / (10 * 60 * 60 * 24));
          } else {
            this.isNotSubbed$ = new BehaviorSubject(true);
          }
        });
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
