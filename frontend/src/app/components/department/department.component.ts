import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  loading = false;

  // Model for the new department form
  newDept: Department = {
    name: '',
    location: ''
  };

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.loading = false;
        alert('Connection Error! Check your backend connection.');
      }
    });
  }

  addDepartment(): void {
    if (!this.newDept.name || !this.newDept.location) {
      alert('Please fill in both fields!');
      return;
    }

    this.departmentService.add(this.newDept).subscribe({
      next: (res) => {
        alert('Department Added Successfully! 🎉');
        this.loadDepartments(); // Refresh list
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding department:', err);
        alert('Failed to create department. Please try again.');
      }
    });
  }

  delete(id: number | undefined): void {
    if (!id) {
      console.error('Cannot delete: ID is missing');
      return;
    }

    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(id).subscribe({
        next: () => {
          this.loadDepartments(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting department:', err);
          alert('Delete failed. Please try again.');
        }
      });
    }
  }

  // Check if the form is valid for enabling/disabling the save button
  get isFormValid(): boolean {
    return !!(this.newDept.name && this.newDept.location);
  }

  private resetForm(): void {
    this.newDept = { name: '', location: '' };
  }
}
