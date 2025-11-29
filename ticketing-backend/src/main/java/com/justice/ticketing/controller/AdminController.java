package com.justice.ticketing.controller;

import com.justice.ticketing.dto.MessageResponse;
import com.justice.ticketing.model.Role;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.RoleType;
import com.justice.ticketing.repository.RoleRepository;
import com.justice.ticketing.repository.TicketRepository;
import com.justice.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN_SUPPORT')")
public class AdminController {
    
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(roles);
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
        List<User> agents = userRepository.findAll().stream()
            .filter(user -> user.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleType.ROLE_AGENT_SUPPORT || 
                                 role.getName() == RoleType.ROLE_ADMIN_SUPPORT))
            .collect(Collectors.toList());
        return ResponseEntity.ok(agents);
    }
    
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<?> updateUserRoles(@PathVariable Long id, 
                                             @RequestBody Map<String, List<String>> payload) {
        @SuppressWarnings("null")
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        List<String> roleNames = payload.get("roles");
        Set<Role> roles = new HashSet<>();
        
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(RoleType.valueOf(roleName))
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé: " + roleName));
            roles.add(role);
        }
        
        user.setRoles(roles);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Rôles mis à jour avec succès"));
    }
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        if (userRepository.existsByEmail(payload.get("email"))) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur: Email déjà utilisé"));
        }
        
        User user = new User();
        user.setEmail(payload.get("email"));
        user.setNom(payload.get("nom"));
        user.setPrenom(payload.get("prenom"));
        user.setPassword(passwordEncoder.encode(payload.get("password")));
        user.setActif(true);
        
        // Assigner le rôle CITOYEN par défaut
        Role userRole = roleRepository.findByName(RoleType.ROLE_CITOYEN)
            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Utilisateur créé avec succès"));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        @SuppressWarnings("null")
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Au lieu de supprimer, on désactive l'utilisateur
        user.setActif(false);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Utilisateur désactivé avec succès"));
    }
}
