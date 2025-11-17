package com.justice.ticketing.repository;

import com.justice.ticketing.model.Ticket;
import com.justice.ticketing.model.TicketHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketHistoriqueRepository extends JpaRepository<TicketHistorique, Long> {
    
    List<TicketHistorique> findByTicketOrderByDateActionDesc(Ticket ticket);
    
    List<TicketHistorique> findByTicketIdOrderByDateActionDesc(Long ticketId);
}
