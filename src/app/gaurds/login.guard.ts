import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  constructor(public authService: AuthenticationService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.authenticationState.pipe(
      map(isAuthenticated => {
        console.log("Login " , isAuthenticated);
        if (!isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/home');
          return false;
        }
      })
    )
  }
}
