package com.justice.ticketing.model;

import com.justice.ticketing.model.enums.TicketPriority;
import com.justice.ticketing.model.enums.TicketStatus;
import com.justice.ticketing.model.enums.TicketType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String numeroTicket;
    
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String titre;
    
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketType type = TicketType.RECLAMATION;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus statut = TicketStatus.OUVERT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priorite = TicketPriority.MOYENNE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "createur_id", nullable = false)
    private User createur;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigne_a_id")
    private User assigneA;
    
    @Column(length = 500)
    private String categorie;
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketHistorique> historique = new ArrayList<>();
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Commentaire> commentaires = new ArrayList<>();
    
    @Column(columnDefinition = "TEXT")
    private String resolution;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @UpdateTimestamp
    private LocalDateTime dateModification;
    
    private LocalDateTime dateCloture;
    
    private LocalDateTime dateEscalade;
    
    @PrePersist
    private void generateTicketNumber() {
        if (this.numeroTicket == null) {
            this.numeroTicket = "TKT-" + System.currentTimeMillis();
        }
    }
}
