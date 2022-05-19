import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './../../Services/user.service';
import { Router } from '@angular/router';
import { IUser } from '../../Interfaces/user.interface';
import { IResponse } from 'src/app/Interfaces/response.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	  public form: FormGroup;
    public errorMessage: string;
    public error: boolean;
    public success: boolean;
    public successMessage: string;

  	constructor(public formBuilder: FormBuilder, public userService: UserService, private router: Router) {
  		this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });

      this.errorMessage = '';
      this.successMessage = '';
      this.error = false;
      this.success = false;
  	}

  	ngOnInit() {
      this.checkLocalStorage();
  	}

    public checkLocalStorage(){
      if(localStorage.getItem('token')){
        this.router.navigate(['/Dashboard']);
      }
    }

  	public tryLogin(form: IUser){
      if (this.form.valid) {
        this.userService.userLogin(form).subscribe(data => {
          let dataResponse: IResponse = data;
          if(dataResponse.token){
            this.successMessage = 'Successful login!';
            this.success = true;
            localStorage.setItem("token", JSON.stringify(dataResponse.token));
            this.router.navigate(['/Dashboard']);
          }
        },
        (error => {
          this.errorMessage = error.error.error;
          this.error = true;
        }));
      } 
      setTimeout(()=>{ 
        this.error = false;
        this.success = false;
      }, 5000);
  	}

    public closeErrorAlert(){
      this.error = false;
    }

    public closeSuccessAlert(){
      this.success = false;
    }

}