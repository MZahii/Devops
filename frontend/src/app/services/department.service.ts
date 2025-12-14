import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  // Using Kubernetes NodePort 30080 for backend access
  private readonly apiUrl = 'http://192.168.56.20:30080/student/department';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getAll`)
      .pipe(catchError(this.handleError));
  }

  add(dept: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/add`, dept)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
