import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(public authService: AuthenticationService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.authenticationState.pipe(
      map(isAuthenticated => {
        console.log("Auth   " , isAuthenticated);
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/signin');
          return false;
        }
      })
    )
  }
}
