import { Constants } from './../utils/constant';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUserLocationRequest } from '../interface/userlocation';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _firestore: AngularFirestore) { }

  updateUserLocation(userLocationData: IUserLocationRequest) {
    return this._firestore.collection(Constants.USER_LOCATION_COLLECTION).doc(localStorage.getItem(Constants.USERID)).set(userLocationData);
  }
  getLocationOfUser(userId){
    return this._firestore.collection(Constants.USER_LOCATION_COLLECTION).doc(userId).snapshotChanges();

  }
  getAllUsers(){
    return this._firestore.collection(Constants.USER_COLLECTION).snapshotChanges();
  }
}
