import { Routes } from '@angular/router';
import { DepartmentComponent } from './components/department/department.component';
import { StudentComponent } from './components/student/student.component';

export const routes: Routes = [
  { path: '', redirectTo: '/departments', pathMatch: 'full' },
  { path: 'departments', component: DepartmentComponent },
  { path: 'students', component: StudentComponent }
];
