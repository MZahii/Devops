package tn.esprit.studentmanagement;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.repositories.DepartmentRepository;
import tn.esprit.studentmanagement.services.DepartmentService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentService departmentService;

    @Test
    void testGetDepartmentById() {
        Department dept = new Department();
        dept.setIdDepartment(1L);

        // Simulation de la base de données
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(dept));

        // Appel de la VRAIE méthode (getDepartmentById)
        Department result = departmentService.getDepartmentById(1L);

        assertNotNull(result);
    }
}