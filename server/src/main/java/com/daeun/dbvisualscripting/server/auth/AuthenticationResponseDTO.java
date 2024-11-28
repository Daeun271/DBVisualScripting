package com.daeun.dbvisualscripting.server.auth;

import lombok.Getter;

@Getter
public class AuthenticationResponseDTO {
    private final String token;

    public AuthenticationResponseDTO(String token) {
        this.token = token;
    }
}
