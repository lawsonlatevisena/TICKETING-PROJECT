package com.justice.ticketing.dto;

import com.justice.ticketing.model.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    @NotNull(message = "Le nouveau statut est requis")
    private TicketStatus statut;
    
    private String commentaire;
    
    private String resolution;
}
