import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  providers: [DatePipe]
})
export class BudgetComponent implements OnInit {
  budgets: any[] = [];
  newBudgetForm: FormGroup;
  categories: any[] = [];
  displayEditDialog: boolean = false;
  months: string[] = [];
  newBudget: any = {};
  add:boolean=false;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.newBudgetForm = this.formBuilder.group({
      category: ['', Validators.required],
      amount: ['', Validators.required],
      month: ['', Validators.required]
    });
    this.initializeMonths();
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchBudgets();
  }

  initializeMonths(): void {
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const monthName = this.datePipe.transform(new Date(currentDate.getFullYear(), i), 'MMMM') || '';
      this.months.push(monthName);
    }
  }

  addBudget(): void {
    this.add = true;
  }

  saveBudget(): void {
    if (this.newBudgetForm.valid) { 
      const formData = this.newBudgetForm.value;
      this.http.post<any>(`${AppConstant.API_URL}/budget`, formData).subscribe(
        (data) => {
          this.budgets.push(data);
          this.add = false;
          this.newBudgetForm.reset();
        },
        (error) => {
          console.error('Error saving budget:', error);
        }
      );
    }
  }

  fetchCategories(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/categories`).subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  fetchBudgets(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/budget`).subscribe(
      (data) => {
        this.budgets = data;
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }
    );
  }

  openEditDialog(rowData: any): void {
    this.newBudget = { ...rowData }; // Create a copy of rowData to avoid modifying the original object
    this.displayEditDialog = true;
  }

  updateBudget(updatedBudget: any): void {
    this.http.put<any>(`${AppConstant.API_URL}/budget/${updatedBudget._id}`, updatedBudget, { withCredentials: true })
      .subscribe(
        (data) => {
          console.log('Budget updated successfully:', data);
          this.fetchBudgets();
        },
        (error) => {
          console.error('Error updating budget:', error);
        }
      );
    this.displayEditDialog = false;
  }

  deleteBudget(budgetId: number): void {
    this.http.delete<any>(`${AppConstant.API_URL}/budget/${budgetId}`).subscribe(
      () => {
        this.budgets = this.budgets.filter(budget => budget._id !== budgetId);
      },
      (error) => {
        console.error('Error deleting budget:', error);
      }
    );
    this.displayEditDialog = false;
  }
}
