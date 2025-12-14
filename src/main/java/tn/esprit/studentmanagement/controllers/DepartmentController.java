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
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class DepartmentController {
    
    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    private final IDepartmentService departmentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<Department>> getAll() {
        logger.info("Fetching all departments");
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getById(@PathVariable Long id) {
        logger.info("Fetching department with id: {}", id);
        Department department = departmentService.getDepartmentById(id);
        if (department == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(department);
    }

    @PostMapping("/add")
    public ResponseEntity<Department> add(@Valid @RequestBody Department department) {
        logger.info("Creating department: {}", department.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departmentService.saveDepartment(department));
    }

    @PutMapping("/update")
    public ResponseEntity<Department> update(@Valid @RequestBody Department department) {
        logger.info("Updating department with id: {}", department.getIdDepartment());
        return ResponseEntity.ok(departmentService.saveDepartment(department));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("Deleting department with id: {}", id);
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
