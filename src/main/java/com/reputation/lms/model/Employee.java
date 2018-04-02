package com.reputation.lms.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Document(collection = "employees")
public class Employee {

	@Id
	@NotNull
	private String id;

	@NotNull(message = "Employee Name cannot be Empty")
	@Size(min = 6, message = "Employee Name cannot be less than 6 characters")
	private String name;

	@NotNull @Valid
	@DateTimeFormat(pattern = "yyyy-mm-dd")
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date dob;

	@NotNull @Valid
	@DateTimeFormat(pattern = "yyyy-mm-dd")
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date joiningdate;

	@NotNull
	private Role role;

	private String department;

	private long cl = 0;

	private long el = 0;
	
	private long wfh = 0;
	
	@NotNull @Valid
	private String supervisorId;
	
	private String supervisorName;
	
	private String email;
	
	private List<EmployeeLeave> employeeLeaves = new ArrayList<EmployeeLeave>();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	@JsonSerialize(using = CustomDateSerializer.class)
	public Date getJoiningdate() {
		return joiningdate;
	}

	public void setJoiningdate(Date joiningdate) {
		this.joiningdate = joiningdate;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public long getCl() {
		return cl;
	}

	public void setCl(long cl) {
		this.cl = cl;
	}

	public long getEl() {
		return el;
	}

	public void setEl(long el) {
		this.el = el;
	}

	public String getSupervisorId() {
		return supervisorId;
	}

	public void setSupervisorId(String supervisorId) {
		this.supervisorId = supervisorId;
	}

	public String getSupervisorName() {
		return supervisorName;
	}

	public void setSupervisorName(String supervisorName) {
		this.supervisorName = supervisorName;
	}

	public List<EmployeeLeave> getEmployeeLeaves() {
		return employeeLeaves;
	}

	public void setEmployeeLeaves(List<EmployeeLeave> employeeLeaves) {
		this.employeeLeaves = employeeLeaves;
	}

	public long getWfh() {
		return wfh;
	}

	public void setWfh(long wfh) {
		this.wfh = wfh;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return id+"-"+name+"-"+dob+""+joiningdate+""+role+"-"+department+""+cl+""+el+""+wfh+""+supervisorId+""+supervisorName+""+email;
	}
}
