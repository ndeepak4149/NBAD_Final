import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';


import { AuthGuard } from './gaurds/auth-gaurd';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseComponent } from './expense/expense.component';
import { SignupComponent } from './signup/signup.component';
const routes: Routes = [
  {
    path:'',component:HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'login',component:LoginComponent,

  },
  {
    path:'signUp',component:SignupComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  } ,
   {
    path: 'budget', component: BudgetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses', component: ExpenseComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }