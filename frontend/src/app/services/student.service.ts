import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Student } from '../models/student.model';
import { API_CONFIG } from '../config/app.config';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiUrl = API_CONFIG.STUDENT_BASE;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/getAllStudents`)
      .pipe(catchError(this.handleError));
  }

  add(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, student)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteStudent/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}

