package com.justice.ticketing.controller;

import com.justice.ticketing.dto.MessageResponse;
import com.justice.ticketing.dto.TicketRequest;
import com.justice.ticketing.dto.TicketResponse;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.TicketStatus;
import com.justice.ticketing.repository.UserRepository;
import com.justice.ticketing.security.UserDetailsImpl;
import com.justice.ticketing.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TicketController {
    
    private final TicketService ticketService;
    private final UserRepository userRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequest request, 
                                          Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        TicketResponse ticket = ticketService.createTicket(request, user);
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping("/mes-tickets")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TicketResponse>> getMesTickets(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<TicketResponse> tickets = ticketService.getTicketsByCreateur(user);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/mes-assignations")
    @PreAuthorize("hasAnyRole('AGENT_SUPPORT', 'ADMIN_SUPPORT')")
    public ResponseEntity<List<TicketResponse>> getMesAssignations(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<TicketResponse> tickets = ticketService.getTicketsByAgent(user);
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('AGENT_SUPPORT', 'ADMIN_SUPPORT')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        TicketResponse ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping("/numero/{numeroTicket}")
    public ResponseEntity<TicketResponse> getTicketByNumero(@PathVariable String numeroTicket) {
        TicketResponse ticket = ticketService.getTicketByNumero(numeroTicket);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AGENT_SUPPORT', 'ADMIN_SUPPORT')")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id,
                                                 @RequestBody Map<String, String> payload,
                                                 Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        TicketStatus newStatus = TicketStatus.valueOf(payload.get("status"));
        String commentaire = payload.get("commentaire");
        
        TicketResponse ticket = ticketService.updateTicketStatus(id, newStatus, user, commentaire);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/assign/{agentId}")
    @PreAuthorize("hasRole('ADMIN_SUPPORT')")
    public ResponseEntity<?> assignTicket(@PathVariable Long id,
                                          @PathVariable Long agentId,
                                          Authentication authentication) {
        TicketResponse ticket = ticketService.assignTicket(id, agentId);
        return ResponseEntity.ok(ticket);
    }
    
    @PostMapping("/{id}/comment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(@PathVariable Long id,
                                        @RequestBody Map<String, String> payload,
                                        Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        String contenu = payload.get("contenu");
        Boolean isInternal = Boolean.parseBoolean(payload.getOrDefault("isInternal", "false"));
        
        ticketService.addComment(id, contenu, user, isInternal);
        return ResponseEntity.ok(new MessageResponse("Commentaire ajouté avec succès"));
    }
}
