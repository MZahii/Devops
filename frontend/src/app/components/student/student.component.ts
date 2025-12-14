import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { DepartmentService } from '../../services/department.service';
import { Student } from '../../models/student.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  departments: Department[] = [];
  loading = false;
  selectedDepartmentId?: number;
  
  // Model for the new student form
  newStudent: Student = {
    firstName: '',
    lastName: '',
    email: '',
    department: {} as Department
  };

  constructor(
    private studentService: StudentService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadDepartments();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.loading = false;
        alert('Connection Error! Check your backend connection.');
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        alert('Failed to load departments.');
      }
    });
  }

  addStudent(): void {
    if (!this.newStudent.firstName || !this.newStudent.lastName || !this.newStudent.email || !this.selectedDepartmentId) {
      alert('Please fill in all fields!');
      return;
    }

    // Find the selected department object
    const selectedDept = this.departments.find(d => d.idDepartment === this.selectedDepartmentId);
    if (!selectedDept) {
      alert('Please select a valid department!');
      return;
    }

    // Set the department object
    this.newStudent.department = selectedDept;

    this.studentService.add(this.newStudent).subscribe({
      next: (res) => {
        alert('Student Added Successfully! 🎉');
        this.loadStudents(); // Refresh list
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding student:', err);
        alert('Failed to create student. Please try again.');
      }
    });
  }

  delete(id: number | undefined): void {
    if (!id) {
      console.error('Cannot delete: ID is missing');
      return;
    }

    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe({
        next: () => {
          this.loadStudents(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          alert('Delete failed. Please try again.');
        }
      });
    }
  }

  getStudentName(student: Student): string {
    return `${student.firstName} ${student.lastName}`;
  }

  private resetForm(): void {
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      department: {} as Department
    };
    this.selectedDepartmentId = undefined;
  }
}
