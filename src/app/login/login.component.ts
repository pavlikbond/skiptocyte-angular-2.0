import { PresetService } from './../services/preset.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private presetService: PresetService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.afAuth.app.then((app) => {
      const uiConfig = {
        signInOptions: [
          {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
          },
          GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this),
        },
      };
      this.ui = new firebaseui.auth.AuthUI(app.auth());
      this.ui.start('#firebaseui-auth-container', uiConfig);
      //this.ui.disableAutoSignIn();
    });

    const authuiObserver = new MutationObserver(function (
      mutationsList,
      observer
    ) {
      const texts = document.querySelectorAll(
        '.firebaseui-idp-text-long, .firebaseui-title'
      );
      for (let i = 0; i < texts.length; ++i) {
        const item = texts.item(i);
        if (item?.textContent?.includes('Sign up')) {
          item.textContent = item.textContent.replace('Sign up', 'Sign in');
        }
      }
    });

    authuiObserver.observe(
      document.querySelectorAll('.auth-container-login')[0],
      {
        attributes: true,
        childList: true,
        subtree: true,
      }
    );
  }

  ngOnDestroy() {
    this.ui.delete();
  }
  onLoginSuccessful(result) {
    //if logged in successfully, wait for is logged in to be true, then update presets
    //wait for 5 seconds to allow for firebase to update the user
    if (result.additionalUserInfo.isNewUser) {
      this.user.isLoggedIn$.subscribe((loggedIn) => {
        if (loggedIn) {
          setTimeout(() => {
            this.presetService
              .updatePresets()
              .then(() => {})
              .catch((e) => {
                console.log(e);
              });
          }, 5000);
        }
      });
    }
    this.router.navigateByUrl('/differential');
  }
}
