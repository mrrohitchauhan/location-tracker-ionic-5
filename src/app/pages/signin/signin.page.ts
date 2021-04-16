import { CommonUtilsService } from '../../utils/common-utils.service';
import { Constants } from '../../utils/constant';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  userLogin: FormGroup;
  constructor(
    private _router: Router,
    private _authService: AuthenticationService,
    private _fb: FormBuilder,
    private _utilsService: CommonUtilsService
  ) { }

  ngOnInit() {
    this.userLogin = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get signinFormControl() {
    return this.userLogin.controls;
  }

  signIn() {
    this._utilsService.showLoading();
    this._authService.signin(this.userLogin.value)
      .then((res: any) => {
        localStorage.setItem(Constants.USERID, res.user.uid)
        this.verifyUser(res.user.uid);
      }).catch((ex) => {
        this._utilsService.hideLoading();
      this._utilsService.presentToast(ex.message);
      })
  }

  verifyUser(userId) {
    this._authService.getUserData(userId).subscribe((res: any) => {
      this._utilsService.hideLoading();
      localStorage.setItem(Constants.USERNAME, res.data().name)
      localStorage.setItem(Constants.USER_ROLE, res.data().role)
      this._authService.adminAuthenticationState.next(res.data().role == "0")
      this._authService.authenticationState.next(true);
      this.userLogin.reset();
      this._router.navigateByUrl('/home', { replaceUrl: true });
    })

  }
}