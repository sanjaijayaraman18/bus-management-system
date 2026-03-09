package com.busfinance.service;

import com.busfinance.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User registerUser(User user);
    User findByEmail(String email);
}
