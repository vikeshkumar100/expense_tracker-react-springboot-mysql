package com.example.expensetracker.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static class SignupRequest {
        @NotBlank
        public String username;

        @NotBlank
        public String password;
    }

    public static class LoginRequest {
        @NotBlank
        public String username;

        @NotBlank
        public String password;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        String uname = req.username.trim();
        if (uname.length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username must be at least 3 characters"));
        }
        if (req.password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }
        if (userRepository.findByUsername(uname).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
        }

        String hash = passwordEncoder.encode(req.password);
        User u = new User(uname, hash);
        User saved = userRepository.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "username", saved.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        var opt = userRepository.findByUsername(req.username.trim());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
        User u = opt.get();
        if (!passwordEncoder.matches(req.password, u.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
        return ResponseEntity.ok(Map.of("id", u.getId(), "username", u.getUsername()));
    }
}
