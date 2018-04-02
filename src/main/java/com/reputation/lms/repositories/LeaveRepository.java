package com.reputation.lms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.reputation.lms.model.LeaveRequest;

public interface LeaveRepository extends MongoRepository<LeaveRequest, String>{

}
