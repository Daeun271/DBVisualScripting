package com.daeun.dbvisualscripting.server.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UserEntity create(String username, String email, String password) {
        UserEntity user = new UserEntity();
        if (username == null || username.trim().isEmpty()) {
            user.setUsername(email.split("@")[0]);
        } else {
            user.setUsername(username);
        }
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        this.userRepository.save(user);
        return user;
    }

    public UserEntity login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
