package com.reputation.lms.controller;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reputation.lms.model.Employee;
import com.reputation.lms.model.EmployeeLeave;
import com.reputation.lms.model.EmployeeLeaveReport;
import com.reputation.lms.model.LeaveStatus;
import com.reputation.lms.model.LeaveType;
import com.reputation.lms.model.ResponseEntity;
import com.reputation.lms.model.User;
import com.reputation.lms.model.YearlyLeave;
import com.reputation.lms.repositories.AuthRepository;
import com.reputation.lms.repositories.EmployeeRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private AuthRepository authRepository;

	@PostMapping("/employee")
	public ResponseEntity addEmployee(@RequestBody @Valid Employee employee) {

		ResponseEntity responseEntity = new ResponseEntity();

		// checking if employee already exists with the same employee id
		Employee emp = employeeRepository.findOne(employee.getId());

		// Add a new Employee if he does not exist already
		if (emp != null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Employee with employee id: " + employee.getId() + " already exists");
		} else {

			// get supervisor details
			Employee supervisor = employeeRepository.findOne(employee.getSupervisorId());

			employee.setSupervisorName(supervisor.getName());

			employeeRepository.save(employee);

			// persisting user details
			User user = new User();
			user.setUname(employee.getId());
			user.setPassword("Password1234");

			authRepository.save(user);

			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Employee Added Successfully");

		}
		return responseEntity;

	}

	@DeleteMapping("/employee/{id}")
	public ResponseEntity deleteEmployee(@PathVariable("id") String id) {

		ResponseEntity responseEntity = new ResponseEntity();

		// checking if Employee exists
		Employee emp = employeeRepository.findOne(id);
		User user = authRepository.findOne(id);

		if (emp == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Employee with id: " + id + " is not present in records");
		} else {
			employeeRepository.delete(emp);
			authRepository.delete(user);

			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Employee with id: " + emp.getId() + " is deleted successfully");
		}
		return responseEntity;

	}

	@PutMapping("/employee/{id}")
	public ResponseEntity updateEmployee(@PathVariable("id") String id, @RequestBody @Valid Employee updatedemployee) {

		ResponseEntity responseEntity = new ResponseEntity();

		Employee actualemp = employeeRepository.findOne(id);

		if (actualemp == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Employee with id: " + id + " does not exist");
		} else {

			actualemp.setName(updatedemployee.getName());
			actualemp.setDob(updatedemployee.getDob());
			actualemp.setJoiningdate(updatedemployee.getJoiningdate());
			actualemp.setRole(updatedemployee.getRole());
			actualemp.setDepartment(updatedemployee.getDepartment());
			actualemp.setCl(updatedemployee.getCl());
			actualemp.setEl(updatedemployee.getEl());
			actualemp.setSupervisorId(updatedemployee.getSupervisorId());
			actualemp.setEmail(updatedemployee.getEmail());

			Employee supervisor = employeeRepository.findOne(updatedemployee.getSupervisorId());

			actualemp.setSupervisorName(supervisor.getName());

			employeeRepository.save(actualemp);

			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Employee details updated successfully");
		}
		return responseEntity;
	}

	@GetMapping("/employee/{id}")
	public Employee getEmployeeByID(@PathVariable("id") String id) {

		Employee emp = employeeRepository.findOne(id);

		if (emp == null) {
			return null;
		}

		// sort the leaves of employee based on latest date
		emp.getEmployeeLeaves().sort(new Comparator<EmployeeLeave>() {
			@Override
			public int compare(EmployeeLeave lev1, EmployeeLeave lev2) {
				if (lev1.getEnddate().before(lev2.getEnddate())) {
					return 1;
				} else if (lev1.getEnddate().after(lev2.getEnddate())) {
					return -1;
				}
				return 0;
			}
		});
		
		return emp;
	}

	@GetMapping("/employees")
	public List<Employee> getAllEmployees() {
		Sort sortByID = new Sort(Sort.Direction.ASC, "id");
		return employeeRepository.findAll(sortByID);
	}

	@GetMapping("/employee/{id}/report")
	public EmployeeLeaveReport getEmployeeReport(@PathVariable("id") String id) {

		Employee emp = employeeRepository.findOne(id);

		if (emp == null) {
			return null;
		}

		EmployeeLeaveReport employeeLeaveReport = new EmployeeLeaveReport();

		employeeLeaveReport.setId(emp.getId());
		employeeLeaveReport.setName(emp.getName());
		employeeLeaveReport.setCl(emp.getCl());
		employeeLeaveReport.setEl(emp.getEl());
		employeeLeaveReport.setWfh(emp.getWfh());
		employeeLeaveReport.setJoiningdate(emp.getJoiningdate());

		Map<String, YearlyLeave> yearlyleaves = new HashMap<String, YearlyLeave>();

		emp.getEmployeeLeaves().forEach(empleave -> {
			if (empleave.getLeavestatus() == LeaveStatus.Approved) {
				LocalDate localDate = empleave.getEnddate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
				String year = String.valueOf(localDate.getYear());
				YearlyLeave yearwiseleave = yearlyleaves.computeIfAbsent(year, val -> new YearlyLeave());
				if (empleave.getLeavetype() == LeaveType.Casual) {
					yearwiseleave.setApprovedcl(yearwiseleave.getApprovedcl() + 1);
				} else if (empleave.getLeavetype() == LeaveType.Earned) {
					yearwiseleave.setApprovedel(yearwiseleave.getApprovedel() + 1);
				} else {
					yearwiseleave.setApprovedwfh(yearwiseleave.getApprovedwfh() + 1);
				}
				yearwiseleave.getYearlyleavedate().add(empleave);
			}
		});

		employeeLeaveReport.setLeavedates(yearlyleaves);

		return employeeLeaveReport;
	}

}
