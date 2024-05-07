import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private authService:AuthService,private router:Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let user=this.loginForm.getRawValue()
      this.authService.login(user.username,user.password)
      .subscribe(
        (Response:any)=>
        {
          localStorage.setItem("username",user['username'])
          this.authService.isLoggedin.next(true);
          this.router.navigate(['/']);
        },(error)=>{
          console.log(error);
        }
        );
    }
  }
  _v() {
    return this.loginForm.value;
  }
}