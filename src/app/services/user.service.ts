import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';
import { map, switchMap, catchError, filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isSubbed$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isTrialing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  uid: string;
  uid$: Observable<string>;
  email$: Observable<string>;
  subscription;
  constructor(
    private afAuth: AngularFireAuth,
    // private presetService: PresetService,
    private db: AngularFirestore
  ) {
    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.uid$ = afAuth.authState.pipe(
      map((user) => user?.uid || ''),
      filter((uid) => !!uid)
    );
    this.email$ = afAuth.authState.pipe(map((user) => user?.email || ''));
    afAuth.authState.subscribe((user) => {
      this.uid = user?.uid;
    });

    this.uid$
      .pipe(
        switchMap((uid) => this.db.collection('users').doc(uid).get()),
        filter((data) => data.exists),
        map((data) => data.data()),
        catchError((error) => {
          console.error('Error fetching user data:', error);
          return [];
        })
      )
      .subscribe((user) => {
        if (user) {
          const subscriptionStatus = user.subscription?.status;
          if (user.subscription) {
            this.subscription = user.subscription;
          }
          if (subscriptionStatus === 'active') {
            this.isSubbed$.next(true);
            this.isTrialing$.next(false);
          } else if (subscriptionStatus === 'trialing') {
            const currentDate = Date.now();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (currentDate - thirtyDays < user.subscription.trialStart) {
              this.isSubbed$.next(true);
              this.isTrialing$.next(true);
            } else {
              this.isSubbed$.next(false);
              this.isTrialing$.next(false);
            }
          }
        }
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
