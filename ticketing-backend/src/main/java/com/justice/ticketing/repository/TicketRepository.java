package com.justice.ticketing.repository;

import com.justice.ticketing.model.Ticket;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    Optional<Ticket> findByNumeroTicket(String numeroTicket);
    
    List<Ticket> findByCreateur(User createur);
    
    List<Ticket> findByAssigneA(User assigneA);
    
    List<Ticket> findByStatut(TicketStatus statut);
    
    List<Ticket> findByCreateurOrderByDateCreationDesc(User createur);
    
    List<Ticket> findByAssigneAOrderByDateCreationDesc(User assigneA);
    
    @Query("SELECT t FROM Ticket t WHERE t.statut = :statut ORDER BY t.priorite DESC, t.dateCreation ASC")
    List<Ticket> findByStatutOrderByPrioriteDesc(@Param("statut") TicketStatus statut);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.statut = :statut")
    Long countByStatut(@Param("statut") TicketStatus statut);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.assigneA = :user AND t.statut IN ('OUVERT', 'EN_COURS')")
    Long countActiveTicketsByAgent(@Param("user") User user);
    
    @Query("SELECT t FROM Ticket t WHERE t.dateCreation BETWEEN :debut AND :fin")
    List<Ticket> findTicketsByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
}
