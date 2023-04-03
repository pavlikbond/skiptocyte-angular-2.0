import { Component, OnDestroy, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  ui: firebaseui.auth.AuthUI;
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

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

  ngOnDestroy() {
    this.ui.delete();
  }
  onLoginSuccessful(result) {
    console.log('ui result', result);

    this.router.navigateByUrl('/');
  }
}
