import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preset } from 'src/app/models/preset.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { convertPresetsForDb } from '../models/preset-utils';
import { map, switchMap, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { throwError, combineLatest } from 'rxjs';
import { ServerService } from './server.service';
@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isSubbed$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isTrialing$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isTrialingOrSubbed$: Observable<boolean> = combineLatest([
    this.isSubbed$,
    this.isTrialing$,
  ]).pipe(map(([isSubbed, isTrialing]) => isSubbed || isTrialing));
  showTrialBtn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showUpgradeBtn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  uid: string;
  uid$: Observable<string>;
  email$ = new BehaviorSubject<string>('');
  subscription: any;
  trialAfterLogin$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
    private snackbarService: SnackbarService,
    private serverService: ServerService
  ) {
    this.isLoggedIn$ = afAuth.authState.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.uid$ = afAuth.authState.pipe(map((user) => user?.uid || ''));
    this.isLoggedOut$.subscribe((value) => {
      this.showTrialBtn$.next(value);
    });

    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user?.uid;
        this.email$.next(user?.email || '');
        this.onUserSignIn(); // Call the method to set up the Firestore listener
      } else {
        // User is logged out, handle the logout logic here
        // For example, clear user-related data or unsubscribe from Firestore listener
        this.uid = ''; // Clear user's UID
        this.email$.next(''); // Clear user's email
        this.unsubscribeFromFirestore(); // Unsubscribe from Firestore listener
      }
    });
  }
  private unsubscribeFromFirestore() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onUserSignIn() {
    // Implement your logic for user sign-in, e.g., setting up Firestore listeners
    // Unsubscribe from Firestore listener to avoid duplicates
    this.unsubscribeFromFirestore();

    // Subscribe to user ID changes and set up Firestore listener
    this.userSubscription = this.uid$
      .pipe(switchMap((uid) => this.observeUserStatus(uid)))
      .subscribe();
  }

  private observeUserStatus(uid: string): Observable<void> {
    console.log('Observing user status', uid);

    return this.db
      .doc(`users/${uid}`)
      .valueChanges()
      .pipe(
        filter((userData) => !!userData), // Only proceed if userData is available
        map((userData: any) => {
          const subscriptionStatus = userData.subscription?.status;
          if (userData.subscription) this.subscription = userData.subscription;
          if (!userData.subscription?.trialed) {
            this.showTrialBtn$.next(true);
          }
          if (subscriptionStatus === 'active') {
            this.isSubbed$.next(true);
          } else if (subscriptionStatus === 'expired') {
            this.showUpgradeBtn$.next(true);
          } else if (subscriptionStatus === 'trialing') {
            this.showUpgradeBtn$.next(true);
            const currentDate = Date.now();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (currentDate - thirtyDays < userData.subscription.trialStart) {
              this.isTrialing$.next(true);
            } else {
              this.serverService.updateSubscriptionStatus('expired', uid);
            }
          } else {
            //handle inactive later, but for now, just log it
            console.log('subscription status is', subscriptionStatus);
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
    this.unsubscribeFromFirestore();
  }

  async updatePresets(presets: Preset[], signedUp = false) {
    let dbPresets = convertPresetsForDb(presets);
    let updateDoc = {
      presets: dbPresets,
    };
    signedUp ? (updateDoc['email'] = this.email$.value) : null;
    try {
      await this.db.doc(`users/${this.uid}`).set(updateDoc, { merge: true });
      console.log('Document successfully set or updated.');
    } catch (error) {
      console.error('Error setting or updating document:', error);
    }
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
