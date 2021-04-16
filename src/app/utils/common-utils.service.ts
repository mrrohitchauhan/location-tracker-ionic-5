import { Injectable } from "@angular/core";
import {
  LoadingController, ToastController,
} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class CommonUtilsService {
  loading;
  constructor(
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController
  ) { }

  async showLoading() {
    this.loading = await this._loadingCtrl.create();
    await this.loading.present();
  }
  async hideLoading() {
    await this._loadingCtrl.getTop().then((res) =>{
      if(res)
         this.loading.dismiss();
    })
  }
  async presentToast(msg) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
