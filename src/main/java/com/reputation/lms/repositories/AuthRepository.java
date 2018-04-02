package com.reputation.lms.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.reputation.lms.model.User;

@Repository
public interface AuthRepository extends MongoRepository<User, String> {

}
