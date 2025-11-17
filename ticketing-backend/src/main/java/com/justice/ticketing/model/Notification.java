package com.justice.ticketing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private User utilisateur;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    
    @Column(nullable = false, length = 255)
    private String titre;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false, length = 50)
    private String type; // EMAIL, SMS, IN_APP
    
    @Column(nullable = false)
    private Boolean lu = false;
    
    @Column(nullable = false)
    private Boolean envoye = false;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    private LocalDateTime dateEnvoi;
    
    private LocalDateTime dateLecture;
}
