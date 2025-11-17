package com.justice.ticketing.dto;

import com.justice.ticketing.model.enums.TicketPriority;
import com.justice.ticketing.model.enums.TicketStatus;
import com.justice.ticketing.model.enums.TicketType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponse {
    
    private Long id;
    private String numeroTicket;
    private String titre;
    private String description;
    private TicketType type;
    private TicketStatus statut;
    private TicketPriority priorite;
    private String categorie;
    private UserSummary createur;
    private UserSummary assigneA;
    private String resolution;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private LocalDateTime dateCloture;
    
    @Data
    public static class UserSummary {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
    }
}
