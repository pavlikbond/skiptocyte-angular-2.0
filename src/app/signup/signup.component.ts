import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import { PresetService } from '../services/preset.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
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
        if (item?.textContent?.includes('Sign in')) {
          item.textContent = item.textContent.replace('Sign in', 'Sign up');
        }
      }
    });

    authuiObserver.observe(
      document.querySelectorAll('.auth-container-signup')[0],
      { attributes: true, childList: true, subtree: true }
    );
  }

  // Function to handle user sign-up
  onUserSignUp(user) {
    // Do something when a user signs up
    console.log('User signed up:', user);
  }

  ngOnDestroy() {
    this.ui.delete();
  }
  onLoginSuccessful(result) {
    this.presetService.handleLoginSuccess(result);
  }
}
