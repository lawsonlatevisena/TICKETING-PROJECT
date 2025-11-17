package com.justice.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private List<String> roles;
    
    public JwtResponse(String token, Long id, String nom, String prenom, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.roles = roles;
    }
}
