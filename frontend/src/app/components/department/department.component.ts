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

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Connection Error! Check your Tunnels.');
      }
    });
  }

  addDepartment() {
    if (!this.newDept.name || !this.newDept.location) {
      alert('Please fill in both fields!');
      return;
    }

    this.departmentService.addDepartment(this.newDept).subscribe({
      next: (res) => {
        alert('Department Added Successfully! 🎉');
        this.loadDepartments(); // Refresh list
        this.newDept = { name: '', location: '' }; // Reset form
      },
      error: (err) => alert('Failed to create department.')
    });
  }

  deleteDepartment(id: number | undefined) {
    if (!id) {
      console.error('Cannot delete: ID is missing');
      return;
    }

    if(confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => alert('Delete failed.')
      });
    }
  }
}

