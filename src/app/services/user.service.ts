import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isSubbed$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isNotSubbed$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isTrialing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  uid: string;
  uid$: Observable<string>;
  email$: Observable<string>;
  trialExpDate: number;
  constructor(
    private afAuth: AngularFireAuth,
    // private presetService: PresetService,
    private db: AngularFirestore
  ) {
    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.uid$ = afAuth.authState.pipe(map((user) => user?.uid));
    this.email$ = afAuth.authState.pipe(map((user) => user?.email));
    afAuth.authState.subscribe((user) => {
      this.uid = user?.uid;
    });
    //get boolean of whether the user is subscribed or not once we get uid
    this.uid$.subscribe((uid) => {
      //console.log(uid);
      this.db
        .collection(`users/${uid}/subscriptions`, (ref) =>
          ref.where('status', 'in', ['active', 'trialing'])
        )
        .get()
        .subscribe((data) => {
          if (!data.empty) {
            let results = [];
            for (let item of data.docs) {
              results.push(item.data());
            }
            let active = results.find((item) => {
              return item.status === 'active';
            });
            let trialing = results.find((item) => {
              return item.status === 'trialing';
            });

            if (active) {
              this.isSubbed$.next(true);
              this.isNotSubbed$.next(false);
              this.isTrialing$.next(false);
            } else if (trialing) {
              //if the end date is in the future
              if (trialing.endDate.seconds * 1000 > Date.now()) {
                this.isTrialing$.next(true);
                this.isSubbed$.next(true);
                this.isNotSubbed$.next(false);
              }
              //if trial has expired
              else {
                this.isTrialing$.next(false);
                this.isSubbed$.next(false);
                this.isNotSubbed$.next(true);
              }
              this.trialExpDate = trialing.endDate.seconds * 1000;
            }
          }
        });
    });
  }

  logout() {
    this.afAuth.signOut();
  }

  updatePresets(presets: Preset[]) {
    let dbPresets = convertPresetsForDb(presets);
    return this.db.doc(`users/${this.uid}`).update({ presets: dbPresets });
  }
}
