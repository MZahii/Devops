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
@AllArgsConstructor
public class StudentController {
    
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final IStudentService studentService;

    @GetMapping("/getAllStudents")
    public ResponseEntity<List<Student>> getAllStudents() {
        logger.info("Fetching all students");
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/getStudent/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        logger.info("Fetching student with id: {}", id);
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    @PostMapping("/createStudent")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        logger.info("Creating student: {} {}", student.getFirstName(), student.getLastName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.saveStudent(student));
    }

    @PutMapping("/updateStudent")
    public ResponseEntity<Student> updateStudent(@Valid @RequestBody Student student) {
        logger.info("Updating student with id: {}", student.getIdStudent());
        return ResponseEntity.ok(studentService.saveStudent(student));
    }

    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        logger.info("Deleting student with id: {}", id);
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
