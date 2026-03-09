package com.busfinance.controller;

import com.busfinance.dto.AuthRequest;
import com.busfinance.dto.AuthResponse;
import com.busfinance.entity.User;
import com.busfinance.security.JwtUtil;
import com.busfinance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("Registration attempt for email: " + user.getEmail());
        try {
            User registeredUser = userService.registerUser(user);
            System.out.println("User registered successfully: " + registeredUser.getEmail());
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            System.err.println("Registration failed for " + user.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        System.out.println("Login attempt for email: " + authRequest.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            System.out.println("Authentication successful for: " + authRequest.getEmail());
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.out.println("Invalid credentials for: " + authRequest.getEmail());
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            System.out.println("Error during authentication: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during login"));
        }

        final UserDetails userDetails = userService.loadUserByUsername(authRequest.getEmail());
        System.out.println("UserDetails loaded for: " + authRequest.getEmail());
        
        final String jwt = jwtUtil.generateToken(userDetails);
        System.out.println("JWT generated");
        
        User dbUser = userService.findByEmail(authRequest.getEmail());
        // Create a copy to avoid accidental database update if Hibernate is tracking
        User responseUser = new User();
        responseUser.setId(dbUser.getId());
        responseUser.setEmail(dbUser.getEmail());
        responseUser.setName(dbUser.getName());
        responseUser.setRole(dbUser.getRole());
        responseUser.setTransportName(dbUser.getTransportName());
        
        System.out.println("Sending successful response for: " + authRequest.getEmail());
        return ResponseEntity.ok(new AuthResponse(jwt, responseUser));
    }
}
