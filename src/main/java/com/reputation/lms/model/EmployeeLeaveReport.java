package com.reputation.lms.model;

import java.util.Date;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;

public class EmployeeLeaveReport {

	private long cl;
	
	private long el;
	
	private long wfh;
	
	private String id;
	
	private String name;
	
	@DateTimeFormat(pattern = "yyyy.MM.dd")
	private Date joiningdate;
	
	private Map<String, YearlyLeave> leavedates;

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

	public long getWfh() {
		return wfh;
	}

	public void setWfh(long wfh) {
		this.wfh = wfh;
	}

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

	public Date getJoiningdate() {
		return joiningdate;
	}

	public void setJoiningdate(Date joiningdate) {
		this.joiningdate = joiningdate;
	}

	public Map<String, YearlyLeave> getLeavedates() {
		return leavedates;
	}

	public void setLeavedates(Map<String, YearlyLeave> leavedates) {
		this.leavedates = leavedates;
	}
	
}
