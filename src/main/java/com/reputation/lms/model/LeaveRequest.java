package com.reputation.lms.model;

import java.util.Date;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Document(collection="leave-requests")
public class LeaveRequest {
	
	@Id
	private String id;
	
	@DateTimeFormat(pattern="yyyy-mm-dd") @NotNull @Valid
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date fromdate;
	
	@DateTimeFormat(pattern="yyyy-mm-dd") @NotNull @Valid
	@JsonSerialize(using = CustomDateSerializer.class)
	private Date todate;
	
	@NotNull
	private LeaveType type;

	@NotNull
	private String reason;
	
	private boolean ishalfday;
	
	private LeaveStatus status;
	
	private String requesterid;
	
	private String requestername;
	
	private String approverid;
	
	private String approvername;
	
	private long noofdays;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getFromdate() {
		return fromdate;
	}

	public void setFromdate(Date fromdate) {
		this.fromdate = fromdate;
	}

	public Date getTodate() {
		return todate;
	}

	public void setTodate(Date todate) {
		this.todate = todate;
	}

	public LeaveType getType() {
		return type;
	}

	public void setType(LeaveType type) {
		this.type = type;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LeaveStatus getStatus() {
		return status;
	}

	public void setStatus(LeaveStatus status) {
		this.status = status;
	}

	public String getRequesterid() {
		return requesterid;
	}

	public void setRequesterid(String requesterid) {
		this.requesterid = requesterid;
	}

	public String getRequestername() {
		return requestername;
	}

	public void setRequestername(String requestername) {
		this.requestername = requestername;
	}

	public String getApproverid() {
		return approverid;
	}

	public void setApproverid(String approverid) {
		this.approverid = approverid;
	}

	public String getApprovername() {
		return approvername;
	}

	public void setApprovername(String approvername) {
		this.approvername = approvername;
	}

	public boolean isIshalfday() {
		return ishalfday;
	}

	public void setIshalfday(boolean ishalfday) {
		this.ishalfday = ishalfday;
	}

	public long getNoofdays() {
		return noofdays;
	}

	public void setNoofdays(long noofdays) {
		this.noofdays = noofdays;
	}
	
}
