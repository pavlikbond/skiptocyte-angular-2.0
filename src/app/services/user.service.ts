import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';
import { map, switchMap, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isSubbed$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isTrialing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  trialExpired$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  uid: string;
  uid$: Observable<string>;
  email$: Observable<string>;
  subscription: any;
  trialAfterLogin: boolean;
  loadingTrial: boolean;
  private userSubscription: Subscription;
  private apiURLs = {
    checkout: 'http://localhost:4000/api/checkout',
    trial: 'http://localhost:4000/api/trial',
  };

  constructor(
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.uid$ = afAuth.authState.pipe(map((user) => user?.uid || ''));
    this.email$ = afAuth.authState.pipe(map((user) => user?.email || ''));
    afAuth.authState.subscribe((user) => {
      this.uid = user?.uid;
    });
    // Subscribe to user ID changes and set up Firestore listener
    this.userSubscription = this.uid$
      .pipe(switchMap((uid) => this.observeUserStatus(uid)))
      .subscribe();
  }
  private observeUserStatus(uid: string): Observable<void> {
    return this.db
      .doc(`users/${uid}`)
      .valueChanges()
      .pipe(
        filter((userData) => !!userData), // Only proceed if userData is available
        map((userData: any) => {
          const subscriptionStatus = userData.subscription?.status;
          if (userData.subscription) this.subscription = userData.subscription;
          if (subscriptionStatus === 'active') {
            this.isSubbed$.next(true);
            this.isTrialing$.next(false);
          } else if (subscriptionStatus === 'trialing') {
            const currentDate = Date.now();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (currentDate - thirtyDays < userData.subscription.trialStart) {
              this.isSubbed$.next(true);
              this.isTrialing$.next(true);
            } else {
              this.isSubbed$.next(false);
              this.isTrialing$.next(false);
              this.trialExpired$.next(true);
            }
          } else {
            this.isSubbed$.next(false);
            this.isTrialing$.next(false);
          }
        }),
        catchError((error) => {
          console.error('Error fetching user data:', error);
          return [];
        })
      );
  }

  ngOnDestroy() {
    // Unsubscribe from the Firestore listener to prevent memory leaks
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.afAuth.signOut();
  }

  updatePresets(presets: Preset[]) {
    let dbPresets = convertPresetsForDb(presets);
    return this.db.doc(`users/${this.uid}`).update({ presets: dbPresets });
  }

  startTrial() {
    this.loadingTrial = true; // Set loadingTrial to true when starting the trial.

    // Chain the observables using switchMap
    this.uid$
      .pipe(
        // Filter out undefined or falsy values
        filter((uid) => !!uid),
        switchMap((uid) => {
          const data = { userId: uid };
          return this.httpClient.put(this.apiURLs.trial, data).pipe(
            catchError((error) => {
              this.router.navigate(['/differential']);
              this.snackbarService.openSnackBar(
                'An Error Has Occurred',
                'Close'
              );
              return throwError(() => error);
            })
          );
        })
      )
      .subscribe(() => {
        this.router.navigate(['/differential']);
        this.snackbarService.openSnackBar('Trial Started', 'Close');
      });
  }
}
