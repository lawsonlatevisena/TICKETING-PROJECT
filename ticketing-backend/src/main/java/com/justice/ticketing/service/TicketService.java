package com.justice.ticketing.service;

import com.justice.ticketing.dto.TicketRequest;
import com.justice.ticketing.dto.TicketResponse;
import com.justice.ticketing.model.*;
import com.justice.ticketing.model.enums.TicketStatus;
import com.justice.ticketing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final TicketHistoriqueRepository historiqueRepository;
    private final CommentaireRepository commentaireRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    
    @Transactional
    public TicketResponse createTicket(TicketRequest request, User createur) {
        Ticket ticket = new Ticket();
        ticket.setTitre(request.getTitre());
        ticket.setDescription(request.getDescription());
        ticket.setType(request.getType());
        ticket.setPriorite(request.getPriorite());
        ticket.setCategorie(request.getCategorie());
        ticket.setCreateur(createur);
        ticket.setStatut(TicketStatus.OUVERT);
        
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Créer l'historique
        createHistorique(savedTicket, createur, "CREATION", null, "Ticket créé", null);
        
        // Envoyer notification
        notificationService.notifyTicketCreated(savedTicket);
        
        return convertToResponse(savedTicket);
    }
    
    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId, TicketStatus newStatus, User user, String commentaire) {
        @SuppressWarnings("null")
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        TicketStatus oldStatus = ticket.getStatut();
        ticket.setStatut(newStatus);
        
        if (newStatus == TicketStatus.CLOS) {
            ticket.setDateCloture(LocalDateTime.now());
        } else if (newStatus == TicketStatus.ESCALADE) {
            ticket.setDateEscalade(LocalDateTime.now());
        }
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        
        // Créer l'historique
        createHistorique(updatedTicket, user, "CHANGEMENT_STATUT", 
            oldStatus.name(), newStatus.name(), commentaire);
        
        // Envoyer notification
        notificationService.notifyTicketStatusChanged(updatedTicket, oldStatus, newStatus);
        
        return convertToResponse(updatedTicket);
    }
    
    @Transactional
    public TicketResponse assignTicket(Long ticketId, Long agentId) {
        @SuppressWarnings("null")
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        @SuppressWarnings("null")
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent non trouvé"));
        
        User oldAgent = ticket.getAssigneA();
        ticket.setAssigneA(agent);
        
        if (ticket.getStatut() == TicketStatus.OUVERT) {
            ticket.setStatut(TicketStatus.EN_COURS);
        }
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        
        // Créer l'historique
        String oldValue = oldAgent != null ? oldAgent.getEmail() : "Non assigné";
        createHistorique(updatedTicket, agent, "ASSIGNATION", 
            oldValue, agent.getEmail(), "Ticket assigné à " + agent.getNom());
        
        // Envoyer notification
        notificationService.notifyTicketAssigned(updatedTicket, agent);
        
        return convertToResponse(updatedTicket);
    }
    
    @Transactional
    public void addComment(Long ticketId, String contenu, User auteur, Boolean isInternal) {
        @SuppressWarnings("null")
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        Commentaire commentaire = new Commentaire();
        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteur);
        commentaire.setContenu(contenu);
        commentaire.setIsInternal(isInternal);
        
        commentaireRepository.save(commentaire);
        
        // Notifier les parties concernées
        notificationService.notifyNewComment(ticket, auteur, contenu);
    }
    
    public List<TicketResponse> getTicketsByCreateur(User createur) {
        return ticketRepository.findByCreateurOrderByDateCreationDesc(createur)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<TicketResponse> getTicketsByAgent(User agent) {
        return ticketRepository.findByAssigneAOrderByDateCreationDesc(agent)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public TicketResponse getTicketById(Long id) {
        @SuppressWarnings("null")
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        return convertToResponse(ticket);
    }
    
    public TicketResponse getTicketByNumero(String numeroTicket) {
        Ticket ticket = ticketRepository.findByNumeroTicket(numeroTicket)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        return convertToResponse(ticket);
    }
    
    private void createHistorique(Ticket ticket, User user, String action, 
                                   String ancienneValeur, String nouvelleValeur, String commentaire) {
        TicketHistorique historique = new TicketHistorique();
        historique.setTicket(ticket);
        historique.setUtilisateur(user);
        historique.setAction(action);
        historique.setAncienneValeur(ancienneValeur);
        historique.setNouvelleValeur(nouvelleValeur);
        historique.setCommentaire(commentaire);
        
        historiqueRepository.save(historique);
    }
    
    private TicketResponse convertToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setNumeroTicket(ticket.getNumeroTicket());
        response.setTitre(ticket.getTitre());
        response.setDescription(ticket.getDescription());
        response.setType(ticket.getType());
        response.setStatut(ticket.getStatut());
        response.setPriorite(ticket.getPriorite());
        response.setCategorie(ticket.getCategorie());
        response.setResolution(ticket.getResolution());
        response.setDateCreation(ticket.getDateCreation());
        response.setDateModification(ticket.getDateModification());
        response.setDateCloture(ticket.getDateCloture());
        
        // Créateur
        TicketResponse.UserSummary createurSummary = new TicketResponse.UserSummary();
        createurSummary.setId(ticket.getCreateur().getId());
        createurSummary.setNom(ticket.getCreateur().getNom());
        createurSummary.setPrenom(ticket.getCreateur().getPrenom());
        createurSummary.setEmail(ticket.getCreateur().getEmail());
        response.setCreateur(createurSummary);
        
        // Assigné à
        if (ticket.getAssigneA() != null) {
            TicketResponse.UserSummary assigneSummary = new TicketResponse.UserSummary();
            assigneSummary.setId(ticket.getAssigneA().getId());
            assigneSummary.setNom(ticket.getAssigneA().getNom());
            assigneSummary.setPrenom(ticket.getAssigneA().getPrenom());
            assigneSummary.setEmail(ticket.getAssigneA().getEmail());
            response.setAssigneA(assigneSummary);
        }
        
        return response;
    }
}
