package com.justice.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketStatisticsResponse {
    private Long totalTickets;
    private Long ticketsOuverts;
    private Long ticketsEnCours;
    private Long ticketsClos;
    private Long ticketsEscalades;
    
    private Map<String, Long> ticketsParType;
    private Map<String, Long> ticketsParPriorite;
    private Map<String, Long> ticketsParCategorie;
    
    private Double tempsResolutionMoyen; // En heures
    private Long ticketsCeJour;
    private Long ticketsCetteSemaine;
    private Long ticketsCeMois;
}
