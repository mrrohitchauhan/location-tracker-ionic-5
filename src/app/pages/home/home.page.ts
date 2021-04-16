import { CommonUtilsService } from './../../utils/common-utils.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationService } from '../../requests/location.service';
import { CommonService } from '../../services/common.service';
import { IUserLocationRequest } from '../../interface/userlocation';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  marker = null;
  infowindow = null;
  subscribedWatch: Subscription;
  users = [];
  bounds = null;
  public useraddress: string = "Fetching your location...";
  map: any;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  isAdmin: boolean = false;

  constructor(private _locationRequest: LocationService, private _commonService: CommonService, private _utilsService: CommonUtilsService,
    private _authService: AuthenticationService, private _ngZone: NgZone, private _geolocation: Geolocation) { }

  ionViewWillEnter() {
    this._locationRequest.requestBehaviourSubject.subscribe((res) => {
      if (res) {
        this._ngZone.run((_) => {
          this.isAdmin = this._authService.adminAuthenticationState.value;
          this.renderMap()
          this.getCurrentCordinates();
        });
      } else
        this._locationRequest.checkGPSPermission();
    });
  }

  ionViewDidLeave() {
    if (!this.subscribedWatch.closed) this.subscribedWatch.unsubscribe();
  }

  getCurrentCordinates() {
    this.isAdmin ? this.getUsers() : this.addWatchAndMarker();
  }

  renderMap() {
    let defaultLocation = new google.maps.LatLng("20.5937", "78.9629");
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: 5,
      center: defaultLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.addMarker(defaultLocation);
  }

  addWatchAndMarker() {
    let watch = this._geolocation.watchPosition();
    this.subscribedWatch = watch.subscribe((data: any) => {
      this.marker.setPosition(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
      this.insertLocation(data.coords.latitude, data.coords.longitude).then((_) => {
        this.setZoomAndCenter();
      });
    });
  }

  addMarker(location) {
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
  }

  insertLocation(lat, long) {
    let data: IUserLocationRequest = {
      latitude: lat,
      longitude: long,
    };
    return this._commonService.updateUserLocation(data);
  }

  getUsers() {
    this._utilsService.showLoading();
    this._commonService.getAllUsers()
      .subscribe((res: any) => {
        this.users = [];
        let users = res.filter(e => e.payload.doc.data().role != "0")
        users.forEach((e) => {
          this.users.push(e.payload.doc.data());
        })
      this._utilsService.hideLoading();
      });
  }

  getLocationByUser(userId, userName) {
    this._utilsService.showLoading();
    this._commonService.getLocationOfUser(userId).subscribe((res: any) => {
      let location = res.payload.data();
      this.marker.setPosition(new google.maps.LatLng(location.latitude, location.longitude));
      this.setZoomAndCenter();
      this.createUserInfoWindow(userName);
      this._utilsService.hideLoading();
    });
  }

  createUserInfoWindow(userName: string) {
    if (this.infowindow) this.infowindow.close();
    const contentString = `<div id="content"><h4 id="firstHeading" class="firstHeading">${userName}</h4></div>`;
    this.infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    this.infowindow.open(this.map, this.marker);
  }

  setZoomAndCenter() {
      this.bounds = new google.maps.LatLngBounds();
    this.bounds.extend(this.marker.getPosition());
    this.map.fitBounds(this.bounds);
    this.map.panToBounds(this.bounds);
  }

  signOut() {
    this._authService.signOut();
  }
}
