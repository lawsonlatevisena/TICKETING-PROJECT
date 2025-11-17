package com.justice.ticketing.dto;

import com.justice.ticketing.model.enums.TicketPriority;
import com.justice.ticketing.model.enums.TicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketRequest {
    
    @NotBlank
    @Size(max = 255)
    private String titre;
    
    @NotBlank
    private String description;
    
    private TicketType type;
    
    private TicketPriority priorite;
    
    private String categorie;
}
