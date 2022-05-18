import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { IUser } from '../Interfaces/user.interface';
import { IResponse } from '../Interfaces/response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	constructor(private authService:AuthService) { }

  	public userLogin(form: IUser):Observable<IResponse>{
  		return this.authService.signIn(form);
  	}
}
