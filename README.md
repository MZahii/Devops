# 🎓 Student Management System - DevOps Project

A full-stack **CRUD application** built with **Spring Boot** and **Angular**, containerized with **Docker**, and deployed using **Kubernetes**.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [License](#license)

---

## ✨ Features

- ✅ **Complete CRUD Operations** for Students and Departments
- ✅ **RESTful API** with Spring Boot
- ✅ **Reactive Frontend** with Angular 17+
- ✅ **MySQL Database** with JPA/Hibernate
- ✅ **Docker Containerization** for both backend and frontend
- ✅ **Kubernetes Deployment** with service orchestration
- ✅ **CI/CD Pipeline** with Jenkins
- ✅ **Modern UI/UX** with glassmorphism design and animations
- ✅ **Form Validation** with real-time feedback
- ✅ **Responsive Design** for mobile and desktop

---

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL 8.0**
- **Lombok**
- **Maven**

### Frontend
- **Angular 17**
- **TypeScript**
- **Bootstrap 5**
- **RxJS**
- **Modern CSS** (Glassmorphism, Animations)

### DevOps & Deployment
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **Jenkins** - CI/CD Pipeline
- **Nginx** - Frontend web server

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                    │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │    MySQL     │  │
│  │   (Angular)  │  │ (Spring Boot)│  │  (Database)  │  │
│  │   Port: 80   │  │  Port: 8089  │  │  Port: 3306  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- MySQL 8.0
- Docker (optional)
- Kubernetes cluster (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/MZahii/Devops.git
cd Devops
```

### 2. Backend Setup

#### Configure Database
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_db
spring.datasource.username=root
spring.datasource.password=your_password
```

#### Run Backend
```bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

Backend will run on: `http://localhost:8089`

**Swagger UI**: `http://localhost:8089/swagger-ui/index.html`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on: `http://localhost:4200`

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Build backend image
docker build -t student-management-backend .

# Build frontend image
cd frontend
docker build -t student-management-frontend .

# Run containers
docker run -d -p 8089:8089 student-management-backend
docker run -d -p 80:80 student-management-frontend
```

---

## ☸️ Kubernetes Deployment

### Apply Kubernetes Configurations

```bash
# Deploy MySQL
kubectl apply -f k8s-mysql.yaml

# Deploy Spring Boot Backend
kubectl apply -f k8s-spring.yaml

# Deploy Angular Frontend
kubectl apply -f k8s-frontend.yaml

# Check pod status
kubectl get pods

# Get service URLs
kubectl get services
```

### Access the Application

```bash
# Get the frontend service URL
kubectl get service frontend-service

# Forward ports for local access
kubectl port-forward service/frontend-service 80:80
kubectl port-forward service/spring-service 8089:8089
```

---

## 📸 Screenshots

### Student Management
![Student Management](docs/screenshots/students.png)

### Department Management
![Department Management](docs/screenshots/departments.png)

---

## 📁 Project Structure

```
.
├── src/
│   ├── main/
│   │   ├── java/tn/esprit/studentmanagement/
│   │   │   ├── controllers/      # REST endpoints
│   │   │   ├── entities/          # JPA entities
│   │   │   ├── repositories/      # Data access layer
│   │   │   ├── services/          # Business logic
│   │   │   └── config/            # Configuration classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/                      # Unit tests
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # Angular components
│   │   │   ├── models/            # TypeScript models
│   │   │   └── services/          # HTTP services
│   │   └── styles.css             # Global styles
│   └── package.json
├── k8s-mysql.yaml                 # MySQL deployment
├── k8s-spring.yaml                # Backend deployment
├── k8s-frontend.yaml              # Frontend deployment
├── Jenkinsfile                    # CI/CD pipeline
├── Dockerfile                     # Backend container
└── pom.xml                        # Maven configuration
```

---

## 🔌 API Endpoints

### Students
- `GET /students` - Get all students
- `GET /students/{id}` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Departments
- `GET /departments` - Get all departments
- `GET /departments/{id}` - Get department by ID
- `POST /departments` - Create new department
- `PUT /departments/{id}` - Update department
- `DELETE /departments/{id}` - Delete department

---

## 🧪 Testing

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mohamed Zahii**
- GitHub: [@MZahii](https://github.com/MZahii)
- Email: your.email@esprit.tn

---

## 🙏 Acknowledgments

- ESPRIT - École Supérieure Privée d'Ingénierie et de Technologies
- DevOps Course - 4th Year
- Spring Boot Documentation
- Angular Documentation
- Kubernetes Documentation

---

## 📊 Project Status

✅ **Completed** - Fully functional and deployed

---

**⭐ If you find this project useful, please give it a star!**
