package com.reputation.lms.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reputation.lms.model.ResetUser;
import com.reputation.lms.model.ResponseEntity;
import com.reputation.lms.model.User;
import com.reputation.lms.repositories.AuthRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AuthController {
	
	@Autowired
	private AuthRepository authRepository;
	
	@PostMapping("/login")
	public ResponseEntity authenticateUser(@RequestBody @Valid User user) {
		
		ResponseEntity responseEntity = new ResponseEntity();
		
		User loggedUser = authRepository.findOne(user.getUname());
		
		if(loggedUser == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("User does not exist");
		}else if(!loggedUser.getPassword().equals(user.getPassword())) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Username and Password does not match");
		}else {
			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Valid User");
		}
		
		return responseEntity;
	}
	
	@PostMapping("/resetpassword/{id}")
	public ResponseEntity resetPassword(@PathVariable("id") String id, @RequestBody @Valid ResetUser user) {
		
		ResponseEntity responseEntity = new ResponseEntity();
		
		User loggedUser = authRepository.findOne(id);

		if(loggedUser == null) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("User does not exist");
		}else if(!loggedUser.getPassword().equals(user.getOldpassword())) {
			responseEntity.setStatus("FAILURE");
			responseEntity.setMessage("Username and Password does not match");
		}else {
			loggedUser.setPassword(user.getNewpassword());
			authRepository.save(loggedUser);
			
			responseEntity.setStatus("SUCCESS");
			responseEntity.setMessage("Password updated Successfully");
		}
		
		return responseEntity;
	}
	
}
