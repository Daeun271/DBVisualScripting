package com.daeun.dbvisualscripting.server.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateDTO {
    @Size(max = 25)
    private String username;

    @NotEmpty(message = "Email is required.")
    @Email
    private String email;
    
    @NotEmpty(message = "Password is required.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=\\S+$).{8,16}$", message = "Password must be 8-16 characters long and contain at least one number and one letter")
    private String password;
}
