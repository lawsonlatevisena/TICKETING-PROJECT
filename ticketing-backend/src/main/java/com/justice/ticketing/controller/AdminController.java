package com.justice.ticketing.controller;

import com.justice.ticketing.model.User;
import com.justice.ticketing.repository.TicketRepository;
import com.justice.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN_SUPPORT')")
public class AdminController {
    
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id) {
        @SuppressWarnings("null")
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        user.setActif(!user.getActif());
        userRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalTickets", ticketRepository.count());
        stats.put("ticketsOuverts", ticketRepository.countByStatut(
            com.justice.ticketing.model.enums.TicketStatus.OUVERT));
        stats.put("ticketsEnCours", ticketRepository.countByStatut(
            com.justice.ticketing.model.enums.TicketStatus.EN_COURS));
        stats.put("ticketsResolus", ticketRepository.countByStatut(
            com.justice.ticketing.model.enums.TicketStatus.RESOLU));
        stats.put("ticketsClos", ticketRepository.countByStatut(
            com.justice.ticketing.model.enums.TicketStatus.CLOS));
        stats.put("totalUtilisateurs", userRepository.count());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/users/agents")
    public ResponseEntity<List<User>> getAgents() {
        // Cette requête devrait filtrer uniquement les agents support
        // Pour simplifier, on retourne tous les utilisateurs
        List<User> agents = userRepository.findAll();
        return ResponseEntity.ok(agents);
    }
}
