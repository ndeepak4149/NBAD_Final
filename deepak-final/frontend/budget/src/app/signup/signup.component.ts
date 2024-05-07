import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from '../app.constants';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm: FormGroup;
  constructor(private authService:AuthService, private http:HttpClient, private router:Router) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  submit() {
    let user = this.registerForm.getRawValue();

    if (this.registerForm.valid) {

      this.http
      .post(`${AppConstant.API_URL}/signup`, user, {
        withCredentials: true,
      })
      .subscribe(
        (user: any) => {
          alert('Success User registered successfully');
          localStorage.setItem('user', user.user);
          this.authService.isLoggedin.next(true);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          alert('Error');
        }
      );
    }
  }
  _v() {
    return this.registerForm.value;
  }
}
