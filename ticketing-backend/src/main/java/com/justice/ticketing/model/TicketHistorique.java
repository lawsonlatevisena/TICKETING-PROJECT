package com.justice.ticketing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_historique")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistorique {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private User utilisateur;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(columnDefinition = "TEXT")
    private String ancienneValeur;
    
    @Column(columnDefinition = "TEXT")
    private String nouvelleValeur;
    
    @Column(columnDefinition = "TEXT")
    private String commentaire;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateAction;
}
