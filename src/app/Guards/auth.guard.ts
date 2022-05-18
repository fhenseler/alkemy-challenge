import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {

    const token = localStorage.getItem('token');
    const tokenInfo = JSON.parse(token!); 
    let check: boolean = false;

    if (tokenInfo) {
      this.authService.redirectUrl = '/Dashboard';
      check = true;
      return true;
      // this.router.navigate(['/Dashboard']);

    } else {
      // Store the attempted URL for redirecting
      this.authService.redirectUrl = url;
    }

    if (!check) {
      this.authService.logout();
      // Navigate to the login page with extras
      this.router.navigate(['/Login']);
    }

    return check;
  }
}