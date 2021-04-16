import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from './../../utils/constant';
import { CommonUtilsService } from './../../utils/common-utils.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  userRegistration: FormGroup;
  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private _fb: FormBuilder,
    private _utilsService: CommonUtilsService
  ) { }

  ngOnInit() {
    this.userRegistration = this._fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['1']
    });
  }

  get signupFormControl() {
    return this.userRegistration.controls;
  }

  signUp() {
    this._utilsService.showLoading();
    this._authService.signUp(this.userRegistration.value).then((res: any) => {
      localStorage.setItem(Constants.USERID, res.user.uid)
      this.setUserData(res);
    }).catch((ex) => {
      this._utilsService.presentToast(ex.message);
      this._utilsService.hideLoading();
    })
  }

  setUserData(result) {
    this._authService
      .setUserData(result.user, this.userRegistration.value)
      .then((res: any) => {
        this._utilsService.hideLoading();
        localStorage.setItem(Constants.USERNAME, this.userRegistration.value.name)
        localStorage.setItem(Constants.USER_ROLE, "1")
        this._authService.authenticationState.next(true);
        this._authService.adminAuthenticationState.next(false);
        this.userRegistration.reset();
        this._router.navigateByUrl('/home', { replaceUrl: true });
      }).catch((ex) => {
        this._utilsService.hideLoading();
        this._utilsService.presentToast(ex.message);
      })
  }
}