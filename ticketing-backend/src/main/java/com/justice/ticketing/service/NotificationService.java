package com.justice.ticketing.service;

import com.justice.ticketing.model.Notification;
import com.justice.ticketing.model.Ticket;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.TicketStatus;
import com.justice.ticketing.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    
    @Transactional
    public void notifyTicketCreated(Ticket ticket) {
        String titre = "Nouveau ticket créé: " + ticket.getNumeroTicket();
        String message = String.format(
            "Votre ticket '%s' a été créé avec succès. Numéro: %s",
            ticket.getTitre(), ticket.getNumeroTicket()
        );
        
        createAndSendNotification(ticket.getCreateur(), ticket, titre, message, "EMAIL");
    }
    
    @Transactional
    public void notifyTicketStatusChanged(Ticket ticket, TicketStatus oldStatus, TicketStatus newStatus) {
        String titre = "Changement de statut - " + ticket.getNumeroTicket();
        String message = String.format(
            "Le statut de votre ticket '%s' est passé de %s à %s",
            ticket.getTitre(), oldStatus, newStatus
        );
        
        createAndSendNotification(ticket.getCreateur(), ticket, titre, message, "EMAIL");
    }
    
    @Transactional
    public void notifyTicketAssigned(Ticket ticket, User agent) {
        String titre = "Nouveau ticket assigné: " + ticket.getNumeroTicket();
        String message = String.format(
            "Le ticket '%s' vous a été assigné. Priorité: %s",
            ticket.getTitre(), ticket.getPriorite()
        );
        
        createAndSendNotification(agent, ticket, titre, message, "EMAIL");
    }
    
    @Transactional
    public void notifyNewComment(Ticket ticket, User auteur, String contenu) {
        String titre = "Nouveau commentaire - " + ticket.getNumeroTicket();
        String message = String.format(
            "%s %s a ajouté un commentaire sur le ticket '%s'",
            auteur.getNom(), auteur.getPrenom(), ticket.getTitre()
        );
        
        // Notifier le créateur si ce n'est pas lui qui a commenté
        if (!ticket.getCreateur().getId().equals(auteur.getId())) {
            createAndSendNotification(ticket.getCreateur(), ticket, titre, message, "EMAIL");
        }
        
        // Notifier l'agent assigné si ce n'est pas lui qui a commenté
        if (ticket.getAssigneA() != null && !ticket.getAssigneA().getId().equals(auteur.getId())) {
            createAndSendNotification(ticket.getAssigneA(), ticket, titre, message, "EMAIL");
        }
    }
    
    private void createAndSendNotification(User user, Ticket ticket, String titre, String message, String type) {
        Notification notification = new Notification();
        notification.setUtilisateur(user);
        notification.setTicket(ticket);
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLu(false);
        notification.setEnvoye(false);
        
        Notification saved = notificationRepository.save(notification);
        
        // Envoyer l'email de manière asynchrone
        if ("EMAIL".equals(type)) {
            sendEmailAsync(user.getEmail(), titre, message, saved);
        }
    }
    
    @Async
    public void sendEmailAsync(String to, String subject, String text, Notification notification) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(text);
            mailMessage.setFrom("noreply@justice.gov");
            
            mailSender.send(mailMessage);
            
            notification.setEnvoye(true);
            notification.setDateEnvoi(LocalDateTime.now());
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Logger l'erreur sans bloquer le processus
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        @SuppressWarnings("null")
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        notification.setLu(true);
        notification.setDateLecture(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUtilisateurOrderByDateCreationDesc(user);
    }
    
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUtilisateurAndLuOrderByDateCreationDesc(user, false);
    }
    
    public Long countUnreadNotifications(User user) {
        return notificationRepository.countByUtilisateurAndLu(user, false);
    }
}
