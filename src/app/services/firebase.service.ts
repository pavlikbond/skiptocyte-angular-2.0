import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  isLoggedIn = false;
  constructor(public firebaseAuth: AngularFireAuth) {}

  async signin(email: string, password: string){
    //await this.firebaseAuth.sign
  }
}
