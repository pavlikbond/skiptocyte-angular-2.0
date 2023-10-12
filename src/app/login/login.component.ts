import { PresetService } from './../services/preset.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;
  constructor(
    private afAuth: AngularFireAuth,
    private presetService: PresetService
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
    this.presetService.handleLoginSuccess(result);
  }
}
