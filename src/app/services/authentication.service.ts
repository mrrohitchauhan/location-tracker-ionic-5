import { Constants } from './../utils/constant';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  adminAuthenticationState = new BehaviorSubject(false);
  constructor(public _router: Router, private _firestore: AngularFirestore, public _afAuth: AngularFireAuth) {
    this.authenticationState.next(this.isLoggedIn)
    this.adminAuthenticationState.next(localStorage.getItem(Constants.USER_ROLE) == "0")
  }

  signin(userCredentials) {
    return this._afAuth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password);
  }

  getUserData(userId) {
    console.log(Constants.USER_COLLECTION, userId);

    return this._firestore.collection(Constants.USER_COLLECTION).doc(userId).get();
  }

  signUp(user) {
    return this._afAuth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
  }
  setUserData(user, userDetails) {
    const userData: any = {
      uid: user.uid,
      email: user.email,
      name: userDetails.name,
      role: userDetails.role
    };
    return this._firestore.collection(Constants.USER_COLLECTION).doc(user.uid).set(userData);
  }
  signOut() {
    localStorage.clear();
    this.authenticationState.next(false);
    this.adminAuthenticationState.next(false);
    this._router.navigateByUrl('/signin', { replaceUrl: true });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(Constants.USERID);
  }
}
