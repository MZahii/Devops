package tn.esprit.studentmanagement.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.services.IStudentService;

import java.util.List;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class StudentController {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final IStudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAll() {
        logger.info("Fetching all students");
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        logger.info("Fetching student with id: {}", id);
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    @PostMapping
    public ResponseEntity<Student> add(@Valid @RequestBody Student student) {
        logger.info("Creating student: {} {}", student.getFirstName(), student.getLastName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.saveStudent(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable Long id, @Valid @RequestBody Student student) {
        logger.info("Updating student with id: {}", id);
        student.setIdStudent(id);
        return ResponseEntity.ok(studentService.saveStudent(student));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("Deleting student with id: {}", id);
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
