package com.daeun.dbvisualscripting.server.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.validation.BindingResult;

import java.util.Map;
import java.util.Arrays;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final JwtTokenService jwtTokenService;
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateDTO registerRequest, BindingResult bindingResult, HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }

        UserEntity createdUser = null;
        try {
            createdUser = authenticationService.create(
                registerRequest.getUsername(), 
                registerRequest.getEmail(), 
                registerRequest.getPassword()
            );
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
            
        String username = createdUser.getName();

        final String token = jwtTokenService.generateAccessToken(createdUser);

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
            .httpOnly(true)
            // .secure(true) only for HTTPS
            .sameSite("Strict")
            .path("/")
            .maxAge(jwtTokenService.getExpirationInSec())
            .build();
        
        response.addHeader("Set-Cookie", cookie.toString());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("username", username));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO loginRequest, BindingResult bindingResult, HttpServletResponse response) throws Exception {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }

        UserEntity user = authenticationService.login(loginRequest.getEmail(), loginRequest.getPassword());
        String username = user.getName();

        final String token = jwtTokenService.generateAccessToken(user);

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
            .httpOnly(true)
            // .secure(true) only for HTTPS
            .sameSite("Strict")
            .path("/")
            .maxAge(jwtTokenService.getExpirationInSec())
            .build();
        
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok().body(Map.of("username", username));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(0)
            .build();
        
        response.addHeader("Set-Cookie", cookie.toString());
            
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkAuthStatus(HttpServletRequest request) {
        boolean isAuthenticated = request.getCookies() != null && 
            Arrays.stream(request.getCookies())
                .anyMatch(cookie -> "jwt".equals(cookie.getName()) && 
                                    !cookie.getValue().isEmpty());
        
        return ResponseEntity.ok(Map.of("authenticated", isAuthenticated));
    }
}
