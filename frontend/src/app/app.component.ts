import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // REQUIRED for inputs

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  departments: any[] = [];
  loading = false;
  
  // Model for the new department form
  newDept = {
    name: '',
    location: ''
  };

  // Backend URL (Tunnel)
  private baseUrl = 'http://localhost:9999/student/department';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDepartments();
  }

  // --- READ ---
  loadDepartments() {
    this.loading = true;
    this.http.get<any[]>(`${this.baseUrl}/getAllDepartment`).subscribe({
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

  // --- CREATE ---
  addDepartment() {
    if (!this.newDept.name || !this.newDept.location) {
      alert('Please fill in both fields!');
      return;
    }

    this.http.post(`${this.baseUrl}/createDepartment`, this.newDept).subscribe({
      next: (res) => {
        alert('Department Added Successfully! 🎉');
        this.loadDepartments(); // Refresh list
        this.newDept = { name: '', location: '' }; // Reset form
      },
      error: (err) => alert('Failed to create department.')
    });
  }

  // --- DELETE ---
  deleteDepartment(id: number) {
    if(confirm('Are you sure you want to delete this department?')) {
      this.http.delete(`${this.baseUrl}/deleteDepartment/${id}`).subscribe({
        next: () => {
          this.loadDepartments(); // Refresh list
        },
        error: (err) => alert('Delete failed.')
      });
    }
  }
}