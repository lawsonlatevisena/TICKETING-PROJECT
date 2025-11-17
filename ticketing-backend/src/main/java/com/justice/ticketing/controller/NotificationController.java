package com.justice.ticketing.controller;

import com.justice.ticketing.model.Notification;
import com.justice.ticketing.model.User;
import com.justice.ticketing.repository.UserRepository;
import com.justice.ticketing.security.UserDetailsImpl;
import com.justice.ticketing.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {
    
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<Notification> notifications = notificationService.getNotificationsByUser(user);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/count-unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        @SuppressWarnings("null")
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Long count = notificationService.countUnreadNotifications(user);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/mark-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
