// app.component.ts

import { Component } from '@angular/core';
import { AuthService } from './services/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'budget-tracker';
  tokenModal:boolean=false;

  constructor(private authService:AuthService){}
  
  ngOnInit(): void {
    setInterval(() => {
      this.authService.checkTokenExpiration().subscribe(
        expired => {
          if (expired) {
              this.tokenModal=true;
          } else {
            this.tokenModal=false;
          }
        }
      );
    }, 1000);
  }

  refreshToken(){
    this.tokenModal=false;
    this.authService.refreshToken();
  }

  logOut(){
    this.tokenModal=false;
    this.authService.logout();
  }
}
