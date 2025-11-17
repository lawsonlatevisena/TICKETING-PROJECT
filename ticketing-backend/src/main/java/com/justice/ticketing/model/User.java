package com.justice.ticketing.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "telephone")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String nom;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String prenom;
    
    @NotBlank
    @Email
    @Size(max = 150)
    @Column(nullable = false, unique = true)
    private String email;
    
    @Size(max = 20)
    @Column(unique = true)
    private String telephone;
    
    @JsonIgnore
    @Size(max = 255)
    private String password;
    
    @Column(nullable = false)
    private Boolean actif = true;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    @Column(length = 500)
    private String adresse;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @UpdateTimestamp
    private LocalDateTime dateModification;
    
    private LocalDateTime derniereConnexion;
}
