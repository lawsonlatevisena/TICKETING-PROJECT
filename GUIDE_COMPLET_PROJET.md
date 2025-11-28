# Guide Complet - Système de Gestion des Tickets

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Installation et Configuration](#installation-et-configuration)
5. [Structure du Projet](#structure-du-projet)
6. [Backend - Spring Boot](#backend---spring-boot)
7. [Frontend - Angular](#frontend---angular)
8. [Base de Données - PostgreSQL](#base-de-données---postgresql)
9. [Fonctionnalités Principales](#fonctionnalités-principales)
10. [Sécurité et Authentification](#sécurité-et-authentification)
11. [Tests et Documentation API](#tests-et-documentation-api)
12. [Gestion des Backups](#gestion-des-backups)
13. [Déploiement](#déploiement)
14. [Troubleshooting](#troubleshooting)

---

## Introduction

Ce guide présente le développement complet d'un **Système de Gestion des Tickets** pour le Ministère de la Justice. Le système permet aux citoyens de soumettre des tickets, et aux agents de les traiter selon leur rôle.

### Objectifs du Projet

- Permettre aux citoyens de créer et suivre des tickets
- Gérer les tickets par des agents de support et de traitement
- Administrer le système via des comptes administrateurs
- Assurer la sécurité des données avec authentification JWT
- Fournir un suivi complet avec historique et notifications

### Rôles Utilisateurs

1. **ROLE_CITOYEN** : Créer et consulter ses propres tickets
2. **ROLE_AGENT_SUPPORT** : Assigner et traiter les tickets
3. **ROLE_AGENT_TRAITEMENT** : Traiter les tickets assignés
4. **ROLE_ADMIN_SUPPORT** : Administrer le système et gérer les utilisateurs

---

## Architecture du Projet

### Architecture Générale

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Angular 17    │ ◄─────► │  Spring Boot    │ ◄─────► │  PostgreSQL 12  │
│   (Frontend)    │  HTTP   │   (Backend)     │  JDBC   │   (Database)    │
│   Port 4200     │   REST  │   Port 8080     │         │   Port 5432     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Architecture 3-Tiers

1. **Couche Présentation** : Angular (Interface utilisateur)
2. **Couche Métier** : Spring Boot (Logique applicative)
3. **Couche Données** : PostgreSQL (Persistance)

---

## Technologies Utilisées

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| Java | 21 | Langage de programmation |
| Spring Boot | 3.3.6 | Framework backend |
| Spring Security | 3.3.6 | Authentification et autorisation |
| Spring Data JPA | 3.3.6 | ORM et accès aux données |
| PostgreSQL Driver | Runtime | Connexion base de données |
| JWT (jsonwebtoken) | 0.11.5 | Tokens d'authentification |
| Lombok | Latest | Réduction du code boilerplate |
| SpringDoc OpenAPI | 2.3.0 | Documentation API (Swagger) |
| Maven | 3.x | Gestionnaire de dépendances |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| Angular | 17 | Framework frontend |
| TypeScript | 5.x | Langage de programmation |
| RxJS | Latest | Programmation réactive |
| Angular Router | 17 | Navigation |
| HttpClient | 17 | Appels API |

### Base de Données

| Technologie | Version | Usage |
|------------|---------|-------|
| PostgreSQL | 12.22 | Système de gestion de base de données |

### Outils de Développement

- **IDE** : Visual Studio Code / IntelliJ IDEA
- **Contrôle de version** : Git / GitHub
- **Test API** : Swagger UI / Postman
- **Gestion BDD** : DBeaver Community Edition
- **Build** : Maven pour backend, npm pour frontend

---

## Installation et Configuration

### Prérequis

#### 1. Installer Java 21

```bash
# Vérifier la version de Java
java -version

# Si Java n'est pas installé
sudo apt update
sudo apt install openjdk-21-jdk
```

#### 2. Installer PostgreSQL

```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier le statut
sudo systemctl status postgresql
```

#### 3. Installer Node.js et npm

```bash
# Installer Node.js (version 18 ou supérieure)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier les versions
node --version
npm --version
```

#### 4. Installer Angular CLI

```bash
sudo npm install -g @angular/cli@17
ng version
```

#### 5. Installer Maven

```bash
sudo apt install maven
mvn -version
```

### Configuration de la Base de Données

#### 1. Créer l'utilisateur et la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE ticketing_db OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE ticketing_db TO postgres;
\q
```

#### 2. Initialiser le schéma

Le fichier `database/init.sql` contient le schéma complet :

```sql
-- Tables principales
CREATE TABLE roles (...)
CREATE TABLE users (...)
CREATE TABLE user_roles (...)
CREATE TABLE tickets (...)
CREATE TABLE commentaires (...)
CREATE TABLE notifications (...)
CREATE TABLE ticket_historique (...)
```

Exécuter le script :

```bash
psql -U postgres -h localhost -d ticketing_db -f ticketing-backend/database/init.sql
```

---

## Structure du Projet

### Arborescence Complète

```
TICKETING-PROJECT/
│
├── ticketing-backend/              # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/justice/ticketing/
│   │   │   │   ├── TicketingApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── DataInitializer.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── OpenApiConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── TicketController.java
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   └── NotificationController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── SignupRequest.java
│   │   │   │   │   ├── JwtResponse.java
│   │   │   │   │   ├── TicketRequest.java
│   │   │   │   │   └── TicketResponse.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   ├── Ticket.java
│   │   │   │   │   ├── Commentaire.java
│   │   │   │   │   ├── Notification.java
│   │   │   │   │   └── TicketHistorique.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── RoleRepository.java
│   │   │   │   │   ├── TicketRepository.java
│   │   │   │   │   ├── CommentaireRepository.java
│   │   │   │   │   ├── NotificationRepository.java
│   │   │   │   │   └── TicketHistoriqueRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtUtils.java
│   │   │   │   │   ├── AuthTokenFilter.java
│   │   │   │   │   ├── AuthEntryPointJwt.java
│   │   │   │   │   ├── UserDetailsImpl.java
│   │   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │   └── service/
│   │   │   │       ├── TicketService.java
│   │   │   │       └── NotificationService.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod.properties
│   ├── database/
│   │   ├── init.sql
│   │   └── README.md
│   ├── pom.xml
│   └── API_TESTS.http
│
├── ticketing-frontend/             # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   └── admin-ticket-management/
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── proxy.conf.json
│
├── backups/                        # Backups base de données
│   ├── backup.sh
│   ├── restore.sh
│   └── README.md
│
└── README.md
```

---

## Backend - Spring Boot

### Configuration Application

**application.properties**

```properties
spring.application.name=ticketing-system

# Profile actif
spring.profiles.active=dev

# Configuration JWT
app.jwt.secret=YourBase64EncodedSecretKeyHere
app.jwt.expiration=86400000

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Configuration serveur
server.port=8080
```

**application-dev.properties**

```properties
# Database PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/ticketing_db
spring.datasource.username=postgres
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# Logging
logging.level.com.justice.ticketing=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Modèle de Données Principal

#### Entité User

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String nom;
    private String prenom;
    private String telephone;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    private LocalDateTime dateCreation;
    private Boolean actif = true;
}
```

#### Entité Ticket

```java
@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String numeroTicket;
    
    @Column(nullable = false)
    private String sujet;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private StatutTicket statut = StatutTicket.OUVERT;
    
    @Enumerated(EnumType.STRING)
    private PrioriteTicket priorite = PrioriteTicket.MOYENNE;
    
    @ManyToOne
    @JoinColumn(name = "createur_id")
    private User createur;
    
    @ManyToOne
    @JoinColumn(name = "assigne_a_id")
    private User assigneA;
    
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private LocalDateTime dateCloture;
}
```

### Sécurité JWT

#### Configuration de Sécurité

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN_SUPPORT")
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            );
        
        http.addFilterBefore(authTokenFilter, 
                            UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

#### Génération et Validation JWT

```java
@Component
public class JwtUtils {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(key(), SignatureAlgorithm.HS512)
            .compact();
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (Exception e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}
```

### Contrôleurs REST

#### AuthController - Authentification

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(),
            userDetails.getUsername(), roles));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Erreur: Email déjà utilisé!"));
        }
        
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setNom(signUpRequest.getNom());
        user.setPrenom(signUpRequest.getPrenom());
        
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_CITOYEN)
            .orElseThrow(() -> new RuntimeException("Erreur: Rôle non trouvé."));
        roles.add(userRole);
        user.setRoles(roles);
        
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Utilisateur enregistré avec succès!"));
    }
}
```

#### TicketController - Gestion des Tickets

```java
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketController {
    
    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequest ticketRequest,
                                         Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Ticket ticket = ticketService.createTicket(ticketRequest, user);
        
        return ResponseEntity.ok(new TicketResponse(ticket));
    }
    
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Ticket> tickets = ticketService.getTicketsForUser(userDetails.getId());
        
        List<TicketResponse> responses = tickets.stream()
            .map(TicketResponse::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @PutMapping("/{id}/assign/{agentId}")
    @PreAuthorize("hasRole('ADMIN_SUPPORT') or hasRole('AGENT_SUPPORT')")
    public ResponseEntity<?> assignTicket(@PathVariable Long id,
                                         @PathVariable Long agentId) {
        Ticket ticket = ticketService.assignTicket(id, agentId);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }
}
```

### Services Métier

#### TicketService

```java
@Service
@Transactional
public class TicketService {
    
    public Ticket createTicket(TicketRequest request, User createur) {
        Ticket ticket = new Ticket();
        ticket.setNumeroTicket(generateTicketNumber());
        ticket.setSujet(request.getSujet());
        ticket.setDescription(request.getDescription());
        ticket.setPriorite(request.getPriorite());
        ticket.setStatut(StatutTicket.OUVERT);
        ticket.setCreateur(createur);
        ticket.setDateCreation(LocalDateTime.now());
        
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Créer une entrée dans l'historique
        createHistoryEntry(savedTicket, "CREATION", "Ticket créé");
        
        return savedTicket;
    }
    
    public Ticket assignTicket(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        User agent = userRepository.findById(agentId)
            .orElseThrow(() -> new RuntimeException("Agent non trouvé"));
        
        ticket.setAssigneA(agent);
        
        if (ticket.getStatut() == StatutTicket.OUVERT) {
            ticket.setStatut(StatutTicket.EN_COURS);
        }
        
        ticket.setDateModification(LocalDateTime.now());
        
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Historique et notification
        createHistoryEntry(savedTicket, "ASSIGNATION",
            "Ticket assigné à " + agent.getNom() + " " + agent.getPrenom());
        
        notificationService.notifyTicketAssigned(savedTicket, agent);
        
        return savedTicket;
    }
    
    private String generateTicketNumber() {
        return "TKT-" + System.currentTimeMillis();
    }
    
    private void createHistoryEntry(Ticket ticket, String action, String description) {
        TicketHistorique historique = new TicketHistorique();
        historique.setTicket(ticket);
        historique.setAction(action);
        historique.setDescription(description);
        historique.setDateAction(LocalDateTime.now());
        ticketHistoriqueRepository.save(historique);
    }
}
```

---

## Frontend - Angular

### Configuration du Projet

**angular.json** - Configuration principale

```json
{
  "projects": {
    "ticketing-frontend": {
      "architect": {
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
```

**proxy.conf.json** - Configuration du proxy pour éviter CORS

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

### Services Angular

#### AuthService - Gestion de l'authentification

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth-token';
  private userKey = 'auth-user';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, {
      email,
      password
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.saveToken(response.token);
          this.saveUser(response);
        }
      })
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRoles(): string[] {
    const user = this.getUser();
    return user ? user.roles : [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private saveUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
```

#### TicketService - Gestion des tickets

```typescript
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) { }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, ticketData);
  }

  getAllTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTicketByNumber(numero: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/numero/${numero}`);
  }

  assignTicket(ticketId: number, agentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/assign/${agentId}`, {});
  }

  updateTicketStatus(ticketId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/status`, { status });
  }
}
```

### Intercepteur HTTP - Ajout du Token JWT

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}
```

### Guards - Protection des Routes

#### AuthGuard - Vérification de l'authentification

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

#### RoleGuard - Vérification des rôles

```typescript
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const userRoles = authService.getUserRoles();
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (hasRole) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
}
```

### Configuration des Routes

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/tickets',
    loadComponent: () => import('./components/admin-ticket-management/...'),
    canActivate: [roleGuard(['ROLE_ADMIN_SUPPORT'])]
  }
];
```

### Composants Principaux

#### LoginComponent

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      });
    }
  }
}
```

---

## Base de Données - PostgreSQL

### Schéma Complet

#### Table Users

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    telephone VARCHAR(20),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN DEFAULT TRUE
);
```

#### Table Roles

```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT INTO roles (name, description) VALUES
('ROLE_CITOYEN', 'Utilisateur citoyen'),
('ROLE_AGENT_SUPPORT', 'Agent de support'),
('ROLE_AGENT_TRAITEMENT', 'Agent de traitement'),
('ROLE_ADMIN_SUPPORT', 'Administrateur support');
```

#### Table User_Roles (Association)

```sql
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
```

#### Table Tickets

```sql
CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    numero_ticket VARCHAR(50) UNIQUE NOT NULL,
    sujet VARCHAR(255) NOT NULL,
    description TEXT,
    statut VARCHAR(50) DEFAULT 'OUVERT',
    priorite VARCHAR(50) DEFAULT 'MOYENNE',
    createur_id BIGINT REFERENCES users(id),
    assigne_a_id BIGINT REFERENCES users(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    date_cloture TIMESTAMP
);
```

#### Table Commentaires

```sql
CREATE TABLE commentaires (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    auteur_id BIGINT REFERENCES users(id),
    contenu TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table Notifications

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    destinataire_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table Ticket_Historique

```sql
CREATE TABLE ticket_historique (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    auteur_id BIGINT REFERENCES users(id)
);
```

### Index pour Performance

```sql
CREATE INDEX idx_tickets_numero ON tickets(numero_ticket);
CREATE INDEX idx_tickets_statut ON tickets(statut);
CREATE INDEX idx_tickets_createur ON tickets(createur_id);
CREATE INDEX idx_tickets_assigne ON tickets(assigne_a_id);
CREATE INDEX idx_notifications_destinataire ON notifications(destinataire_id);
CREATE INDEX idx_notifications_lu ON notifications(lu);
```

---

## Fonctionnalités Principales

### 1. Création de Ticket (Citoyen)

**Workflow :**
1. Citoyen se connecte
2. Remplit le formulaire de ticket (sujet, description, priorité)
3. Soumet le ticket
4. Reçoit un numéro de ticket unique
5. Peut suivre l'évolution du ticket

**Code Backend :**
```java
public Ticket createTicket(TicketRequest request, User createur) {
    String numeroTicket = "TKT-" + System.currentTimeMillis();
    
    Ticket ticket = new Ticket();
    ticket.setNumeroTicket(numeroTicket);
    ticket.setSujet(request.getSujet());
    ticket.setDescription(request.getDescription());
    ticket.setPriorite(request.getPriorite());
    ticket.setStatut(StatutTicket.OUVERT);
    ticket.setCreateur(createur);
    
    return ticketRepository.save(ticket);
}
```

### 2. Assignation de Ticket (Admin)

**Workflow :**
1. Admin consulte la liste des tickets
2. Sélectionne un ticket non assigné
3. Choisit un agent disponible
4. Assigne le ticket
5. L'agent reçoit une notification

**Code Backend :**
```java
public Ticket assignTicket(Long ticketId, Long agentId) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
    
    User agent = userRepository.findById(agentId)
        .orElseThrow(() -> new RuntimeException("Agent non trouvé"));
    
    ticket.setAssigneA(agent);
    ticket.setStatut(StatutTicket.EN_COURS);
    
    // Enregistrer l'historique
    createHistoryEntry(ticket, "ASSIGNATION", 
        "Assigné à " + agent.getNom());
    
    // Envoyer notification
    notificationService.notifyTicketAssigned(ticket, agent);
    
    return ticketRepository.save(ticket);
}
```

### 3. Suivi de Ticket (Citoyen)

**Workflow :**
1. Citoyen entre le numéro de ticket
2. Consulte le statut actuel
3. Voit l'historique des actions
4. Ajoute des commentaires si nécessaire

### 4. Traitement de Ticket (Agent)

**Workflow :**
1. Agent voit ses tickets assignés
2. Change le statut (EN_COURS, RESOLU, CLOS)
3. Ajoute des commentaires
4. Met à jour la priorité si nécessaire

### 5. Gestion des Utilisateurs (Admin)

**Workflow :**
1. Admin consulte la liste des utilisateurs
2. Peut créer de nouveaux agents
3. Assigne les rôles appropriés
4. Active/Désactive des comptes

---

## Sécurité et Authentification

### Authentification JWT

#### Processus de Login

```
1. User → POST /api/auth/signin {email, password}
2. Backend → Valide credentials
3. Backend → Génère JWT token
4. Backend → Response {token, user info, roles}
5. Frontend → Stocke token dans localStorage
6. Frontend → Ajoute token à chaque requête HTTP (Header: Authorization: Bearer <token>)
```

#### Structure du Token JWT

```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "iat": 1700000000,
    "exp": 1700086400
  },
  "signature": "..."
}
```

### Hachage des Mots de Passe

Utilisation de **BCrypt** avec Spring Security :

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Lors de la création d'un utilisateur
String hashedPassword = passwordEncoder.encode(plainPassword);
user.setPassword(hashedPassword);
```

### Protection CSRF et CORS

```java
// Configuration CORS
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

// Désactivation CSRF (API REST stateless)
http.csrf(csrf -> csrf.disable())
```

### Autorisation basée sur les Rôles

```java
// Au niveau des méthodes
@PreAuthorize("hasRole('ADMIN_SUPPORT')")
public List<User> getAllAgents() {
    return userRepository.findByRoles();
}

// Au niveau des routes
.requestMatchers("/api/admin/**").hasRole("ADMIN_SUPPORT")
```

---

## Tests et Documentation API

### Swagger/OpenAPI

#### Configuration

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Système de Gestion des Tickets")
                .version("1.0.0")
                .description("Documentation de l'API REST"))
            .components(new Components()
                .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")))
            .addSecurityItem(new SecurityRequirement()
                .addList("bearer-jwt"));
    }
}
```

#### Accès à Swagger UI

```
URL: http://localhost:8080/swagger-ui/index.html
```

#### Utilisation de Swagger

1. **Se connecter** :
   - Utilisez `/api/auth/signin`
   - Copiez le token reçu

2. **Autoriser** :
   - Cliquez sur "Authorize" 🔓
   - Collez le token JWT
   - Cliquez sur "Authorize"

3. **Tester les endpoints** :
   - Tous les endpoints sont maintenant accessibles
   - Cliquez sur "Try it out"
   - Remplissez les paramètres
   - Cliquez sur "Execute"

### Tests Manuels avec Postman

**Collection de tests disponible dans** : `API_TESTS.http`

Exemple :
```http
### 1. Login Admin
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "email": "admin@justice.com",
  "password": "Admin@123"
}

### 2. Créer un Ticket
POST http://localhost:8080/api/tickets/create
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "sujet": "Problème technique",
  "description": "Description détaillée",
  "priorite": "HAUTE"
}

### 3. Lister tous les Tickets
GET http://localhost:8080/api/tickets
Authorization: Bearer {{token}}
```

---

## Gestion des Backups

### Scripts de Backup Automatique

#### Script backup.sh

```bash
#!/bin/bash

DB_NAME="ticketing_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup SQL
echo "🔄 Création du backup SQL..."
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost \
  $DB_NAME > "$BACKUP_DIR/ticketing_db_backup_$DATE.sql"

# Backup compressé
echo "📦 Création du backup compressé..."
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost \
  -Fc $DB_NAME > "$BACKUP_DIR/ticketing_db_backup_$DATE.dump"

# Nettoyer les backups > 7 jours
find "$BACKUP_DIR" -name "ticketing_db_backup_*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "ticketing_db_backup_*.dump" -mtime +7 -delete

echo "✅ Backup terminé !"
```

### Utilisation des Backups

#### Créer un Backup

```bash
# Via script
./backups/backup.sh

# Manuellement
PGPASSWORD=postgres pg_dump -U postgres -h localhost \
  ticketing_db > backup.sql
```

#### Restaurer un Backup

```bash
# Via script
./backups/restore.sh backups/ticketing_db_backup_20251122.sql

# Manuellement
PGPASSWORD=postgres psql -U postgres -h localhost \
  -d ticketing_db < backup.sql
```

#### Backup via DBeaver

1. Clic droit sur `ticketing_db`
2. **Tools** → **Dump database**
3. Choisir le format : **Custom** (recommandé)
4. Sélectionner toutes les tables
5. Cliquer sur **Start**

---

## Déploiement

### Compilation et Build

#### Backend

```bash
cd ticketing-backend

# Compiler le projet
mvn clean package -DskipTests

# Le fichier JAR sera créé dans target/
# ticketing-backend-1.0.0.jar
```

#### Frontend

```bash
cd ticketing-frontend

# Build de production
ng build --configuration production

# Les fichiers seront dans dist/ticketing-frontend/
```

### Démarrage de l'Application

#### Démarrer PostgreSQL

```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

#### Démarrer le Backend

```bash
cd ticketing-backend

# Mode développement avec logs
SPRING_DATASOURCE_PASSWORD=postgres \
  java -jar target/ticketing-backend-1.0.0.jar

# Mode production en arrière-plan
SPRING_DATASOURCE_PASSWORD=postgres \
  nohup java -jar target/ticketing-backend-1.0.0.jar > backend.log 2>&1 &
```

#### Démarrer le Frontend

```bash
cd ticketing-frontend

# Mode développement
npm start

# En arrière-plan
npm start > frontend.log 2>&1 &
```

### Vérification du Déploiement

```bash
# Vérifier le backend
curl http://localhost:8080/api/auth/signin

# Vérifier le frontend
curl http://localhost:4200

# Vérifier les processus
ps aux | grep java
ps aux | grep "ng serve"
```

### Variables d'Environnement

Pour la production, utilisez des variables d'environnement :

```bash
# Backend
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ticketing_db
export SPRING_DATASOURCE_PASSWORD=your_secure_password
export JWT_SECRET=your_base64_encoded_secret
export JWT_EXPIRATION=86400000

# Démarrer
java -jar ticketing-backend-1.0.0.jar
```

---

## Troubleshooting

### Problèmes Courants

#### 1. Erreur de connexion à la base de données

**Symptôme :**
```
org.postgresql.util.PSQLException: Connection refused
```

**Solutions :**
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql
sudo systemctl start postgresql

# Vérifier les credentials dans application.properties
# Tester la connexion manuellement
psql -U postgres -h localhost -d ticketing_db
```

#### 2. CORS Error dans le navigateur

**Symptôme :**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions :**
- Vérifier que le proxy est configuré (`proxy.conf.json`)
- Vérifier la configuration CORS dans `SecurityConfig.java`
- Redémarrer le frontend : `npm start`

#### 3. Token JWT invalide ou expiré

**Symptôme :**
```
401 Unauthorized - Invalid JWT token
```

**Solutions :**
- Se reconnecter pour obtenir un nouveau token
- Vérifier que la clé secrète JWT est correcte
- Augmenter la durée d'expiration si nécessaire

#### 4. Port déjà utilisé

**Symptôme :**
```
Port 8080 is already in use
```

**Solutions :**
```bash
# Trouver le processus utilisant le port
lsof -i :8080

# Tuer le processus
kill -9 <PID>

# Ou utiliser pkill
pkill -f "java -jar.*ticketing"
```

#### 5. Compilation TypeScript échoue

**Symptôme :**
```
Object is possibly 'undefined'
```

**Solutions :**
- Utiliser l'opérateur de chaînage optionnel : `object?.property`
- Vérifier les types dans les interfaces TypeScript
- Ajouter des vérifications null : `if (object) { ... }`

### Logs et Débogage

#### Consulter les logs Backend

```bash
# Logs en temps réel
tail -f ticketing-backend/backend.log

# Rechercher des erreurs
grep -i "error" ticketing-backend/backend.log

# Voir les requêtes SQL
grep -i "hibernate" ticketing-backend/backend.log
```

#### Consulter les logs Frontend

```bash
# Logs en temps réel
tail -f ticketing-frontend/frontend.log

# Console du navigateur
# F12 → Console (Chrome/Firefox)
```

#### Activer les logs de débogage

Dans `application-dev.properties` :
```properties
logging.level.com.justice.ticketing=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Commandes Utiles

```bash
# Vérifier les services en cours
ps aux | grep -E "(java|ng serve|postgres)"

# Arrêter tous les services
pkill -f "java -jar.*ticketing"
pkill -f "ng serve"

# Nettoyer et rebuilder le backend
cd ticketing-backend
mvn clean install -DskipTests

# Nettoyer et rebuilder le frontend
cd ticketing-frontend
rm -rf node_modules dist
npm install
ng build

# Vérifier les ports ouverts
netstat -tlnp | grep -E "(8080|4200|5432)"

# Tester la connectivité base de données
psql -U postgres -h localhost -d ticketing_db -c "SELECT version();"
```

---

## Comptes de Test

### Utilisateurs Préconfigurés

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@justice.com | Admin@123 | ADMIN_SUPPORT |
| agent1@justice.gov | Agent@123 | AGENT_SUPPORT |
| agent2@justice.gov | Agent@123 | AGENT_SUPPORT |
| test@test.com | Test@123 | CITOYEN |

---

## Ressources et Documentation

### Documentation Officielle

- **Spring Boot** : https://spring.io/projects/spring-boot
- **Spring Security** : https://spring.io/projects/spring-security
- **Angular** : https://angular.io/docs
- **PostgreSQL** : https://www.postgresql.org/docs/
- **JWT** : https://jwt.io/

### Outils Utilisés

- **DBeaver** : https://dbeaver.io/
- **Swagger** : https://swagger.io/
- **Postman** : https://www.postman.com/

---

## Conclusion

Ce guide couvre l'ensemble du développement du système de gestion des tickets, de l'installation initiale au déploiement final. 

### Points Clés à Retenir

1. **Architecture 3-tiers** : Séparation claire entre présentation, métier et données
2. **Sécurité JWT** : Authentification et autorisation robustes
3. **RESTful API** : Communication standardisée entre frontend et backend
4. **Documentation** : Swagger pour tester et documenter l'API
5. **Backups** : Scripts automatiques pour la sauvegarde des données

### Prochaines Étapes

- Implémenter des tests unitaires et d'intégration
- Ajouter la fonctionnalité d'envoi d'emails
- Créer un tableau de bord avec statistiques
- Implémenter la recherche avancée de tickets
- Ajouter le support multi-langues

### Support

Pour toute question ou problème, consultez la documentation ou créez une issue sur le dépôt GitHub.

---

**Date de création** : Novembre 2025  
**Auteur** : Équipe de Développement - Ministère de la Justice  
**Version** : 1.0.0
