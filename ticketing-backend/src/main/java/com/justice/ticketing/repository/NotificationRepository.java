package com.justice.ticketing.repository;

import com.justice.ticketing.model.Notification;
import com.justice.ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUtilisateurOrderByDateCreationDesc(User utilisateur);
    
    List<Notification> findByUtilisateurAndLuOrderByDateCreationDesc(User utilisateur, Boolean lu);
    
    Long countByUtilisateurAndLu(User utilisateur, Boolean lu);
    
    List<Notification> findByEnvoyeFalse();
}
