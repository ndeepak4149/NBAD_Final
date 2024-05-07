import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../app.constants';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [MessageService, DatePipe]
})
export class ExpenseComponent implements OnInit {
  expenses: any[] = [];
  newExpenseForm: FormGroup;
  categories: any[] = [];
  display: boolean = false;
  months: string[] = [];
  newExpense: any = {};
  showForm:boolean=false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { 
    this.newExpenseForm = this.formBuilder.group({
      category: ['', Validators.required],
      amount: ['', Validators.required],
      month: ['', Validators.required]
    });
    this.initializeMonths();
  }

  ngOnInit(): void {
    this.getCategories();
    this.getExpenses();
  }

  initializeMonths(): void {
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const monthName = this.datePipe.transform(new Date(currentDate.getFullYear(), i), 'MMMM') || '';
      this.months.push(monthName);
    }
  }

  addExpense(): void {
    this.showForm = true;
  }

  saveExpense(): void {
    if (this.newExpenseForm.valid) {
      this.http.post<any>(`${AppConstant.API_URL}/expense`, this.newExpenseForm.value).subscribe(
        (data) => {
          this.expenses.push(data);
          this.showForm = false;
          this.newExpenseForm.reset();
        },
        (error) => {
          console.error('Error saving expense:', error);
        }
      );
    }
  }

  getCategories(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/categories`).subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  getExpenses(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/expense`).subscribe(
      (data) => {
        this.expenses = data;
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  openEditDialog(rowData: any): void {
    this.newExpense = rowData;
    this.display = true;
  }

  updateExpense(newExpense: any): void {
    this.http.put<any>(`${AppConstant.API_URL}/expense/${newExpense._id}`, newExpense, { withCredentials: true }).subscribe(
      (data) => {
        console.log('Expense updated successfully:', data);
        this.getExpenses();
      },
      (error) => {
        console.error('Error updating expense:', error);
      }
    );
    this.display = false;
  }

  deleteExpense(expenseId: number): void {
    this.http.delete<any>(`${AppConstant.API_URL}/expense/${expenseId}`).subscribe(
      () => {
        this.expenses = this.expenses.filter(expense => expense._id !== expenseId);
      },
      (error) => {
        console.error('Error deleting expense:', error);
      }
    );
    this.display = false;
  }
}
