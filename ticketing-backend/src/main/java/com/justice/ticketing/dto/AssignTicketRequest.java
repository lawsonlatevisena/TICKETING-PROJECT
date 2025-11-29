package com.justice.ticketing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTicketRequest {
    @NotNull(message = "L'ID de l'agent est requis")
    private Long agentId;
    
    private String commentaire;
}
