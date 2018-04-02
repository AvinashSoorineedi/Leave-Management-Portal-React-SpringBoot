package com.reputation.lms.model;

import java.util.ArrayList;
import java.util.List;

public class YearlyLeave {
	
	private int approvedcl = 0;
	
	private int approvedel = 0;
	
	private int approvedwfh = 0;
	
	private List<EmployeeLeave> yearlyleavedate = new ArrayList<EmployeeLeave>();

	public int getApprovedcl() {
		return approvedcl;
	}

	public void setApprovedcl(int approvedcl) {
		this.approvedcl = approvedcl;
	}

	public int getApprovedel() {
		return approvedel;
	}

	public void setApprovedel(int approvedel) {
		this.approvedel = approvedel;
	}

	public List<EmployeeLeave> getYearlyleavedate() {
		return yearlyleavedate;
	}

	public void setYearlyleavedate(List<EmployeeLeave> yearlyleavedate) {
		this.yearlyleavedate = yearlyleavedate;
	}
	
	public int getApprovedwfh() {
		return approvedwfh;
	}

	public void setApprovedwfh(int approvedwfh) {
		this.approvedwfh = approvedwfh;
	}

	@Override
	public String toString() {
		return approvedcl + " "+ approvedel + " "+ approvedwfh + " "+  yearlyleavedate.toString();
	}
}
