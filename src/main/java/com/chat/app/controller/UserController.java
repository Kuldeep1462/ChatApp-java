package com.chat.app.controller;

import com.chat.app.model.User;
import com.chat.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    private static final long START_USER_ID = 1200001L;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User existing = userRepository.findByUsername(user.getUsername());
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist");
            }
            // Check password
            if (!existing.getPassword().equals(user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
            }
            return ResponseEntity.ok(existing);
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User existing = userRepository.findByUsername(user.getUsername());
            if (existing != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
            }
            
            // Assign next userId
            User last = userRepository.findTopByOrderByUserIdDesc();
            long nextId = (last != null) ? last.getUserId() + 1 : START_USER_ID;
            
            User newUser = new User(nextId, user.getUsername(), user.getPassword(), user.getName(), user.getEmail());
            User savedUser = userRepository.save(newUser);
            System.out.println("Created new user: " + savedUser.getUsername() + " with ID: " + savedUser.getUserId());
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed");
        }
    }

    @GetMapping("/search/{userId}")
    public ResponseEntity<?> searchByUserId(@PathVariable String userId) {
        try {
            System.out.println("Searching for user ID: " + userId);
            
            // Try to parse as Long
            Long userIdLong;
            try {
                userIdLong = Long.parseLong(userId);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID format");
            }
            
            User user = userRepository.findByUserId(userIdLong);
            if (user == null) {
                System.out.println("User not found for ID: " + userIdLong);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            System.out.println("Found user: " + user.getUsername() + " for ID: " + userIdLong);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("Search error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Search failed");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            System.err.println("Get all users error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to get users");
        }
    }
}
