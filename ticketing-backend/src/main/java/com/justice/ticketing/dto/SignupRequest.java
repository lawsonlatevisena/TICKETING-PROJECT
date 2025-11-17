package com.justice.ticketing.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {
    
    @NotBlank
    @Size(max = 100)
    private String nom;
    
    @NotBlank
    @Size(max = 100)
    private String prenom;
    
    @NotBlank
    @Email
    @Size(max = 150)
    private String email;
    
    @Size(max = 20)
    private String telephone;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    private String adresse;
    
    private Set<String> roles;
}
