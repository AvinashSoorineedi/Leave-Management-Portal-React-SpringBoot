package com.reputation.lms.model;

import java.util.Date;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

public class EmployeeLeave {

	private String leaveid;
	
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date startdate;
	
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date enddate;
	
	private long noofdays;
	
	private LeaveType leavetype;
	
	private LeaveStatus leavestatus;

	public String getLeaveid() {
		return leaveid;
	}

	public void setLeaveid(String leaveid) {
		this.leaveid = leaveid;
	}

	public LeaveType getLeavetype() {
		return leavetype;
	}

	public void setLeavetype(LeaveType leavetype) {
		this.leavetype = leavetype;
	}

	public LeaveStatus getLeavestatus() {
		return leavestatus;
	}

	public void setLeavestatus(LeaveStatus leavestatus) {
		this.leavestatus = leavestatus;
	}
	
	public Date getStartdate() {
		return startdate;
	}

	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}

	public Date getEnddate() {
		return enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public long getNoofdays() {
		return noofdays;
	}

	public void setNoofdays(long noofdays) {
		this.noofdays = noofdays;
	}

	@Override
	public String toString() {
		return leaveid +" "+startdate + " "+enddate + " "+noofdays + " "+leavetype+" "+leavestatus;
	}
}
