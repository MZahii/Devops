import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Department } from '../models/department.model';
import { API_CONFIG } from '../config/app.config';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly apiUrl = API_CONFIG.DEPARTMENT_BASE;

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getAllDepartment`)
      .pipe(catchError(this.handleError));
  }

  addDepartment(dept: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/createDepartment`, dept)
      .pipe(catchError(this.handleError));
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDepartment/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}

