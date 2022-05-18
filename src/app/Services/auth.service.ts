import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '../Interfaces/user.interface';
import { IResponse } from '../Interfaces/response.interface';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	url: string = "http://challenge-react.alkemy.org";

	redirectUrl: string = '/';

	constructor(public http: HttpClient, public router: Router) { }

	signIn(form: IUser):Observable<IResponse> {
		return this.http.post<IResponse>(this.url, form);
	}

	logout() {
    	localStorage.removeItem("token");
		this.router.navigate(['/Login']);
	}
}
