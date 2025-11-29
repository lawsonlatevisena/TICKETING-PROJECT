package com.justice.ticketing.controller;

import com.justice.ticketing.dto.JwtResponse;
import com.justice.ticketing.dto.LoginRequest;
import com.justice.ticketing.dto.MessageResponse;
import com.justice.ticketing.dto.SignupRequest;
import com.justice.ticketing.model.Role;
import com.justice.ticketing.model.User;
import com.justice.ticketing.model.enums.RoleType;
import com.justice.ticketing.repository.RoleRepository;
import com.justice.ticketing.repository.UserRepository;
import com.justice.ticketing.security.JwtUtils;
import com.justice.ticketing.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("===== LOGIN ATTEMPT =====");
            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Password: " + loginRequest.getPassword());
            
            // Vérifier que l'utilisateur existe
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
            if (user == null) {
                System.out.println("ERROR: User not found!");
                return ResponseEntity.status(401).body(new MessageResponse("Utilisateur non trouvé"));
            }
            
            System.out.println("User found: " + user.getEmail());
            System.out.println("User password hash: " + user.getPassword());
            System.out.println("Password matches: " + passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()));
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            System.out.println("Authentication successful!");
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getNom(),
                userDetails.getPrenom(),
                userDetails.getEmail(),
                roles
            ));
        } catch (Exception e) {
            System.out.println("ERROR during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body(new MessageResponse("Erreur d'authentification: " + e.getMessage()));
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur: Email déjà utilisé!"));
        }
        
        if (signUpRequest.getTelephone() != null && 
            userRepository.existsByTelephone(signUpRequest.getTelephone())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur: Numéro de téléphone déjà utilisé!"));
        }
        
        // Créer le nouveau compte utilisateur
        User user = new User();
        user.setNom(signUpRequest.getNom());
        user.setPrenom(signUpRequest.getPrenom());
        user.setEmail(signUpRequest.getEmail());
        user.setTelephone(signUpRequest.getTelephone());
        user.setAdresse(signUpRequest.getAdresse());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setActif(true);
        
        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();
        
        if (strRoles == null || strRoles.isEmpty()) {
            // Par défaut, attribuer le rôle CITOYEN
            Role citoyenRole = roleRepository.findByName(RoleType.ROLE_CITOYEN)
                .orElseThrow(() -> new RuntimeException("Erreur: Rôle CITOYEN non trouvé."));
            roles.add(citoyenRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN_SUPPORT)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle ADMIN non trouvé."));
                        roles.add(adminRole);
                        break;
                    case "agent_support":
                        Role agentSupportRole = roleRepository.findByName(RoleType.ROLE_AGENT_SUPPORT)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle AGENT_SUPPORT non trouvé."));
                        roles.add(agentSupportRole);
                        break;
                    case "agent_traitement":
                        Role agentTraitementRole = roleRepository.findByName(RoleType.ROLE_AGENT_TRAITEMENT)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle AGENT_TRAITEMENT non trouvé."));
                        roles.add(agentTraitementRole);
                        break;
                    default:
                        Role citoyenRole = roleRepository.findByName(RoleType.ROLE_CITOYEN)
                            .orElseThrow(() -> new RuntimeException("Erreur: Rôle CITOYEN non trouvé."));
                        roles.add(citoyenRole);
                }
            });
        }
        
        user.setRoles(roles);
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Utilisateur enregistré avec succès!"));
    }
}
