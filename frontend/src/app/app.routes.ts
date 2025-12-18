import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/departments', pathMatch: 'full' },
  {
    path: 'departments',
    loadComponent: () => import('./components/department/department.component')
      .then(m => m.DepartmentComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./components/student/student.component')
      .then(m => m.StudentComponent)
  }
];
