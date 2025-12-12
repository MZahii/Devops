import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  // These must match the filenames you renamed in Step 1
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  departments: any[] = [];
  loading = false;
  // This points to your Windows Tunnel (Port 9999)
  apiUrl = 'http://localhost:9999/student/department/getAllDepartment';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  fetchDepartments() {
    this.loading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error connecting to backend', err);
        this.loading = false;
        alert('Could not connect to Backend on Port 9999. Is the tunnel open?');
      }
    });
  }
}