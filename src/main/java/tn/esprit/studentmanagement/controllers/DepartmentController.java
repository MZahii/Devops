package tn.esprit.studentmanagement.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.services.IDepartmentService;

import java.util.List;

@RestController
@RequestMapping("/department")
@AllArgsConstructor
public class DepartmentController {
    
    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    private final IDepartmentService departmentService;

    @GetMapping("/getAllDepartment")
    public ResponseEntity<List<Department>> getAllDepartment() {
        logger.info("Fetching all departments");
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/getDepartment/{id}")
    public ResponseEntity<Department> getDepartment(@PathVariable Long id) {
        logger.info("Fetching department with id: {}", id);
        Department department = departmentService.getDepartmentById(id);
        if (department == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(department);
    }

    @PostMapping("/createDepartment")
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) {
        logger.info("Creating department: {}", department.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.saveDepartment(department));
    }

    @PutMapping("/updateDepartment")
    public ResponseEntity<Department> updateDepartment(@Valid @RequestBody Department department) {
        logger.info("Updating department with id: {}", department.getIdDepartment());
        return ResponseEntity.ok(departmentService.saveDepartment(department));
    }

    @DeleteMapping("/deleteDepartment/{id}")
    public void deleteDepartment(@PathVariable Long id) {
      departmentService.deleteDepartment(id); }
}