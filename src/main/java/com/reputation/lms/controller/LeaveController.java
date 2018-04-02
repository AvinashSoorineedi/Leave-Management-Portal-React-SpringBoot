package com.reputation.lms.controller;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reputation.lms.model.Employee;
import com.reputation.lms.model.EmployeeLeave;
import com.reputation.lms.model.LeaveRequest;
import com.reputation.lms.model.LeaveStatus;
import com.reputation.lms.model.LeaveType;
import com.reputation.lms.model.ResponseEntity;
import com.reputation.lms.repositories.EmployeeRepository;
import com.reputation.lms.repositories.LeaveRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class LeaveController {

	@Autowired
	private LeaveRepository leaveRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private MongoTemplate mongoTemplate;

	@PostMapping("/applyleave/{empid}")
	public ResponseEntity applyLeave(@PathVariable("empid") @NotNull String empid,
			@RequestBody @Valid LeaveRequest leaveRequest) {

		ResponseEntity responseEntity = new ResponseEntity();

		// getting the employee details
		Employee emp = employeeRepository.findOne(empid);

		if (emp == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Employee with id: " + empid + " does not exists");

			return responseEntity;
		}

		// validation checks before processing leave request

		// get the leaves already applied which are in approved or pending review state
		List<Date> approvedleavedates = new ArrayList<Date>();

		for (EmployeeLeave empLeave : emp.getEmployeeLeaves()) {
			if (empLeave.getLeavestatus() == LeaveStatus.Approved
					|| empLeave.getLeavestatus() == LeaveStatus.Pending_Review) {
				approvedleavedates.addAll(getDatesBetweenRange(empLeave.getStartdate(), empLeave.getEnddate()));
			}
		}

		// check if leave is applied for the same dates range
		if (checkforDuplicateLeave(leaveRequest, approvedleavedates)) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage(
					"Already a leave request has been raised in this period, please check for applied leaves.");
			
			System.out.println("status "+responseEntity.getStatus()+" message "+responseEntity.getMessage());

			return responseEntity;
		}

		// check if no.of days applied is less than or equal to the available leaves
		long appliedLeaveCount = getLeaveAppliedCount(leaveRequest.getFromdate(), leaveRequest.getTodate());
		long availableLeaveCount = emp.getEl();

		// handling single Casual leave
		if (leaveRequest.getType() == LeaveType.Casual && appliedLeaveCount == 1
				&& !checkPrevAndAfterDates(leaveRequest, approvedleavedates)) {
			availableLeaveCount = emp.getCl();
		} else if (leaveRequest.getType() == LeaveType.Earned) {
			availableLeaveCount = emp.getEl();
		} else {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Sorry!! Only single Casual Leave can be applied in consecutive days.");

			return responseEntity;
		}

		if (appliedLeaveCount > availableLeaveCount) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Sorry!!The applied " + leaveRequest.getType()
					+ " leave count exceeds the available " + leaveRequest.getType() + " leave count.");

			return responseEntity;
		}

		// end of validations

		String leaveId = genarateLeaveID();
		leaveRequest.setId(leaveId);
		leaveRequest.setRequesterid(emp.getId());
		leaveRequest.setRequestername(emp.getName());
		leaveRequest.setApproverid(emp.getSupervisorId());
		leaveRequest.setApprovername(emp.getSupervisorName());
		leaveRequest.setStatus(LeaveStatus.Pending_Review);
		leaveRequest.setNoofdays(appliedLeaveCount);

		// updating the leaves in employee details
		// if (appliedLeaveCount == 1) {
		EmployeeLeave employeeLeave = new EmployeeLeave();
		employeeLeave.setLeaveid(leaveId);
		employeeLeave.setStartdate(leaveRequest.getFromdate());
		employeeLeave.setEnddate(leaveRequest.getTodate());
		employeeLeave.setNoofdays(appliedLeaveCount);
		employeeLeave.setLeavestatus(LeaveStatus.Pending_Review);
		employeeLeave.setLeavetype(leaveRequest.getType());
		emp.getEmployeeLeaves().add(employeeLeave);
		// } else if (appliedLeaveCount > 1) {
		//
		// List<EmployeeLeave> empLeaves = new ArrayList<EmployeeLeave>();
		// LocalDate startdate =
		// leaveRequest.getFromdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		// LocalDate enddate =
		// leaveRequest.getTodate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		//
		// LocalDate next = startdate.minusDays(1);
		// while ((next = next.plusDays(1)).isBefore(enddate.plusDays(1))) {
		// EmployeeLeave employeeLeave = new EmployeeLeave();
		// employeeLeave.setLeaveid(leaveId);
		// employeeLeave.setLeavedate(Date.from(next.atStartOfDay(ZoneId.systemDefault()).toInstant()));
		// employeeLeave.setLeavestatus(LeaveStatus.Pending_Review);
		// employeeLeave.setLeavetype(leaveRequest.getType());
		// empLeaves.add(employeeLeave);
		// }
		// emp.getEmployeeLeaves().addAll(empLeaves);
		// }

		// persisting the employee leave details
		leaveRepository.save(leaveRequest);
		employeeRepository.save(emp);

		responseEntity.setStatus("SUCCESS");
		responseEntity.setMessage("Leave : " + leaveRequest.getId() + " applied successfully and pending approval with "
				+ emp.getSupervisorName() + ".");

		return responseEntity;
	}

	private List<Date> getDatesBetweenRange(Date startdate, Date enddate) {

		List<Date> tempDates = new ArrayList<Date>();

		if (startdate == enddate) {
			tempDates.add(startdate);
		} else {
			Calendar calendar = new GregorianCalendar();
			calendar.setTime(startdate);

			while (calendar.getTime().before(enddate)) {
				Date date = calendar.getTime();
				tempDates.add(date);
				calendar.add(Calendar.DATE, 1);
			}
			tempDates.add(enddate);
		}
		return tempDates;
	}

	@GetMapping("approveleave/{leaveid}/{empid}")
	public ResponseEntity approveLeave(@PathVariable("empid") @NotNull String empid,
			@PathVariable("leaveid") @NotNull String leaveid) {

		ResponseEntity responseEntity = new ResponseEntity();

		long leaveAppliedCount;

		Employee emp = employeeRepository.findOne(empid);
		LeaveRequest leaveRequest = leaveRepository.findOne(leaveid);

		if (emp == null || leaveRequest == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Employee ID or the Leave Request Id is not a valid one");
		} else if (leaveRequest.getStatus() == LeaveStatus.Approved) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Leave Request: " + leaveRequest.getId() + " is already approved");
		} else {
			// updating the leave request state
			leaveRequest.setStatus(LeaveStatus.Approved);

			// updating the employee leaves status
			emp.getEmployeeLeaves().forEach(lev -> {
				if (lev.getLeaveid().equals(leaveid)) {
					lev.setLeavestatus(LeaveStatus.Approved);
				}
			});

			if (leaveRequest.isIshalfday()) {
				leaveAppliedCount = (long) 0.5;
			} else {
				leaveAppliedCount = getLeaveAppliedCount(leaveRequest.getFromdate(), leaveRequest.getTodate());
			}

			// reducing the leave count
			if (leaveRequest.getType() == LeaveType.Casual) {
				emp.setCl(emp.getCl() - leaveAppliedCount);
			} else if (leaveRequest.getType() == LeaveType.Earned) {
				emp.setEl(emp.getEl() - leaveAppliedCount);
			} else if (leaveRequest.getType() == LeaveType.WFH) {
				emp.setWfh(emp.getWfh() - leaveAppliedCount);
			}

			// persisting states into DB
			employeeRepository.save(emp);
			leaveRepository.save(leaveRequest);

			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Leave Approved Successfully");

		}
		return responseEntity;
	}

	@GetMapping("rejectleave/{leaveid}/{empid}")
	public ResponseEntity rejectLeave(@PathVariable("empid") @NotNull String empid,
			@PathVariable("leaveid") @NotNull String leaveid) {

		ResponseEntity responseEntity = new ResponseEntity();

		Employee emp = employeeRepository.findOne(empid);
		LeaveRequest leaveRequest = leaveRepository.findOne(leaveid);

		if (emp == null || leaveRequest == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Employee ID or the Leave Request Id should not be null");
		} else {

			// updating the leave request state
			leaveRequest.setStatus(LeaveStatus.Rejected);

			// updating the employee leaves status
			emp.getEmployeeLeaves().forEach(lev -> {
				if (lev.getLeaveid().equals(leaveid)) {
					lev.setLeavestatus(LeaveStatus.Rejected);
				}
			});

			// persisting states into DB
			employeeRepository.save(emp);
			leaveRepository.save(leaveRequest);

			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Leave Rejected Successfully");

		}
		return responseEntity;
	}

	@DeleteMapping("deleteleave/{leaveid}/{empid}")
	public ResponseEntity deleteLeave(@PathVariable("leaveid") String leaveid, @PathVariable("empid") String empid) {

		ResponseEntity responseEntity = new ResponseEntity();

		LeaveRequest leaveRequest = leaveRepository.findOne(leaveid);
		if (leaveRequest == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("The Leave Request ID: " + leaveid + " does not exist");
		} else if (leaveRequest.getStatus() != LeaveStatus.Pending_Review) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Leave(s) with state [Pending Review] could only be deleted");
		} else {

			Employee emp = employeeRepository.findOne(empid);

			if (emp == null) {
				responseEntity.setStatus("FAILURE");
				responseEntity.setMessage("The employee ID: " + empid + " does not exist");
			} else {

				emp.getEmployeeLeaves().removeIf(leave -> leave.getLeaveid().equals(leaveid));

				employeeRepository.save(emp);

				leaveRepository.delete(leaveid);

				responseEntity.setStatus("SUCCESS");
				responseEntity.setMessage("Leave Request: " + leaveid + " deleted successfully");
			}
		}
		return responseEntity;
	}

	@GetMapping("leave/{id}")
	public LeaveRequest getLeave(@PathVariable("id") String id) {
		LeaveRequest leaveRequest = leaveRepository.findOne(id);
		if (leaveRequest == null) {
			return null;
		}
		return leaveRequest;
	}

	@GetMapping("/leaves")
	public List<LeaveRequest> getLeaveRequests() {
		Sort sortByFromDate = new Sort(Sort.Direction.ASC, "fromdate");
		return leaveRepository.findAll(sortByFromDate);
	}

	@GetMapping("reviewleaves/{supervisorid}")
	public List<LeaveRequest> getLeavesPendingReview(@PathVariable("supervisorid") String supervisorid) {
		Query query = new Query();
		query.addCriteria(Criteria.where("approverid").is(supervisorid).and("status").is(LeaveStatus.Pending_Review));

		List<LeaveRequest> leaveRequests = mongoTemplate.find(query, LeaveRequest.class);
		
		leaveRequests.sort(new Comparator<LeaveRequest>() {
			@Override
			public int compare(LeaveRequest lev1, LeaveRequest lev2) {
				
				if(lev1.getTodate().before(lev2.getTodate())) {
					return -1;
				}if(lev1.getTodate().after(lev2.getTodate())) {
					return 1;
				}
				return 0;
			}
			
		});

		return leaveRequests;
	}

	/*
	 * Method to generate a random Leave ID for the leave request
	 */
	private String genarateLeaveID() {
		return String.valueOf(new Date().getTime());
	}

	/*
	 * Method to check if the previous and after days to the applied leave date are
	 * also Casual leaves.
	 */
	private boolean checkPrevAndAfterDates(LeaveRequest leaveRequest, List<Date> approvedleavedates) {

		LocalDate before = leaveRequest.getFromdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		before.minusDays(1);

		LocalDate after = leaveRequest.getTodate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		after.plusDays(1);

		for (Date date : approvedleavedates) {
			if (before.isEqual(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate())
					|| after.isEqual(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate())) {
				return true;
			}
		}

		return false;
	}

	/*
	 * Method to check for duplicate leave requests
	 */
	private boolean checkforDuplicateLeave(LeaveRequest leaveRequest, List<Date> approvedleavedates) {
		LocalDate from = leaveRequest.getFromdate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate to = leaveRequest.getTodate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		LocalDate nextDate = from.minusDays(1);
		while ((nextDate = nextDate.plusDays(1)).isBefore(to.plusDays(1))) {
			for (Date date : approvedleavedates) {
				if (nextDate.isEqual(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate())) {
					return true;
				}
			}
		}
		return false;
	}

	/*
	 * Method to calculate the applied leave count
	 */
	private long getLeaveAppliedCount(Date fromdate, Date todate) {

		if (fromdate.equals(todate)) {
			return 1;
		}

		LocalDate to = todate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate from = fromdate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		return (Duration.between(from.atStartOfDay(), to.atStartOfDay()).toDays() + 1);
	}
}