package com.justice.ticketing.config;

import com.justice.ticketing.model.Role;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.RoleType;
import com.justice.ticketing.repository.RoleRepository;
import com.justice.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        log.info("Initialisation des données...");
        // Initialiser les rôles
        initRoles();
        
        // Créer un utilisateur admin par défaut
        createDefaultAdmin();
        log.info("Initialisation des données terminée.");
    }
    
    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role citoyenRole = new Role();
            citoyenRole.setName(RoleType.ROLE_CITOYEN);
            citoyenRole.setDescription("Citoyen utilisant les services en ligne");
            roleRepository.save(citoyenRole);
            
            Role agentTraitementRole = new Role();
            agentTraitementRole.setName(RoleType.ROLE_AGENT_TRAITEMENT);
            agentTraitementRole.setDescription("Agent de traitement interne");
            roleRepository.save(agentTraitementRole);
            
            Role agentSupportRole = new Role();
            agentSupportRole.setName(RoleType.ROLE_AGENT_SUPPORT);
            agentSupportRole.setDescription("Agent support technique");
            roleRepository.save(agentSupportRole);
            
            Role adminRole = new Role();
            adminRole.setName(RoleType.ROLE_ADMIN_SUPPORT);
            adminRole.setDescription("Administrateur du système de support");
            roleRepository.save(adminRole);
            
            log.info("Rôles initialisés avec succès!");
        }
    }
    
    private void createDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@justice.gov")) {
            User admin = new User();
            admin.setNom("Admin");
            admin.setPrenom("Système");
            admin.setEmail("admin@justice.gov");
            admin.setTelephone("0000000000");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setActif(true);
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN_SUPPORT)
                .orElseThrow(() -> new RuntimeException("Rôle ADMIN non trouvé"));
            roles.add(adminRole);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            log.info("Utilisateur admin créé: admin@justice.gov / Admin@123");
        }
    }
}
