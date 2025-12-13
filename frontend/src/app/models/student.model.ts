import { Department } from './department.model';

export interface Student {
  idStudent?: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
}

