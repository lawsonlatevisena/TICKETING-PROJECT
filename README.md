# Système de Gestion des Tickets - Ministère de la Justice

Application full-stack de gestion de tickets avec Spring Boot 3.3.6 et Angular 17.

## 🚀 Technologies

### Backend
- Java 21
- Spring Boot 3.3.6
- PostgreSQL 18
- Spring Security + JWT
- Maven 3.9.9

### Frontend
- Angular 17
- TypeScript
- Standalone Components
- Reactive Forms
- RxJS

## 📋 Prérequis

- JDK 21+
- Node.js 24+ & npm 11+
- PostgreSQL 18
- Maven 3.9.9

## ⚙️ Configuration

### Base de données PostgreSQL

1. Créer la base de données:
```sql
CREATE DATABASE ticketing_db WITH ENCODING='UTF8' LC_COLLATE='fr_FR' LC_CTYPE='fr_FR';
```

2. Configuration dans `ticketing-backend/src/main/resources/application-prod.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ticketing_db
spring.datasource.username=postgres
spring.datasource.password=
```

### Backend (Spring Boot)

```bash
cd ticketing-backend
mvn clean install
mvn spring-boot:run
```

L'API sera disponible sur: http://localhost:8080

### Frontend (Angular)

```bash
cd ticketing-frontend
npm install
npm start
```

L'application sera disponible sur: http://localhost:4200

## 👤 Compte de test

- **Email:** admin@justice.gov
- **Mot de passe:** Admin@123

## 🎯 Fonctionnalités Implémentées

### Pour tous les utilisateurs
- ✅ Création de tickets (réclamation, incident, demande)
- ✅ Consultation de ses tickets
- ✅ Suivi de l'état des tickets (OUVERT, EN_COURS, RESOLU, CLOS, ESCALADE)
- ✅ Ajout de commentaires
- ✅ Notifications

### Pour les Agents Support
- ✅ Vue de tous les tickets
- ✅ Attribution des tickets
- ✅ Traitement des tickets
- ✅ Escalade des tickets
- ✅ Réouverture des tickets
- ✅ Clôture des tickets avec résolution
- ✅ Consultation de l'historique

### Pour les Administrateurs
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des utilisateurs (activation/désactivation)
- ✅ Gestion des rôles
- ✅ Export des tickets (CSV)
- ✅ Statistiques détaillées:
  - Nombre de tickets par statut
  - Nombre de tickets par type
  - Nombre de tickets par priorité
  - Temps moyen de résolution
  - Tickets par période (jour/semaine/mois)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription

### Tickets
- `POST /api/tickets/create` - Créer un ticket
- `GET /api/tickets/mes-tickets` - Mes tickets
- `GET /api/tickets/mes-assignations` - Mes assignations (agents)
- `GET /api/tickets/all` - Tous les tickets (agents/admin)
- `GET /api/tickets/{id}` - Détails d'un ticket
- `GET /api/tickets/numero/{numeroTicket}` - Ticket par numéro
- `PUT /api/tickets/{id}/status` - Mettre à jour le statut
- `PUT /api/tickets/{id}/assign/{agentId}` - Assigner un ticket
- `POST /api/tickets/{id}/comment` - Ajouter un commentaire
- `PUT /api/tickets/{id}/escalade` - Escalader un ticket
- `PUT /api/tickets/{id}/reopen` - Réouvrir un ticket
- `PUT /api/tickets/{id}/cloturer` - Clôturer un ticket
- `GET /api/tickets/statistics` - Statistiques
- `GET /api/tickets/export` - Exporter (CSV)

### Notifications
- `GET /api/notifications/me` - Mes notifications
- `GET /api/notifications/unread` - Non lues
- `PUT /api/notifications/{id}/mark-as-read` - Marquer comme lue

### Administration
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/users/agents` - Liste des agents
- `PUT /api/admin/users/{id}/toggle-active` - Activer/Désactiver un utilisateur
- `PUT /api/admin/users/{id}/roles` - Modifier les rôles
- `POST /api/admin/users` - Créer un utilisateur
- `DELETE /api/admin/users/{id}` - Supprimer (désactiver) un utilisateur
- `GET /api/admin/dashboard/stats` - Statistiques du dashboard

## 🏗️ Structure du projet

```
TICKETING-PROJECT/
├── ticketing-backend/          # Application Spring Boot
│   ├── src/main/java/
│   │   └── com/justice/ticketing/
│   │       ├── config/         # Configuration Spring
│   │       ├── controller/     # REST Controllers
│   │       │   ├── AdminController.java
│   │       │   ├── AuthController.java
│   │       │   ├── NotificationController.java
│   │       │   └── TicketController.java
│   │       ├── dto/            # Data Transfer Objects
│   │       │   ├── CommentRequest.java
│   │       │   ├── AssignTicketRequest.java
│   │       │   ├── UpdateTicketStatusRequest.java
│   │       │   └── TicketStatisticsResponse.java
│   │       ├── model/          # Entités JPA
│   │       │   └── enums/      # Énumérations
│   │       ├── repository/     # Repositories
│   │       ├── security/       # JWT & Spring Security
│   │       └── service/        # Business Logic
│   └── src/main/resources/
│       ├── application.properties
│       └── application-prod.properties
│
└── ticketing-frontend/         # Application Angular 17
    ├── src/app/
    │   ├── components/         # Composants Angular
    │   │   ├── admin-dashboard/
    │   │   ├── create-ticket/
    │   │   ├── dashboard/
    │   │   ├── login/
    │   │   └── ticket-list/
    │   ├── guards/             # Route Guards
    │   │   └── auth.guard.ts
    │   ├── services/           # Services HTTP
    │   │   ├── auth.service.ts
    │   │   └── ticket.service.ts
    │   └── app.routes.ts       # Routing
    └── proxy.conf.json         # Proxy de développement
```

## 🔐 Sécurité

- Authentification JWT
- Mots de passe hashés avec BCrypt
- CORS configuré
- Validation des données
- Guards pour protéger les routes (authGuard, roleGuard)
- Autorisation basée sur les rôles

## 🎨 Interface Utilisateur

- Design moderne et responsive
- Composants standalone Angular 17
- Navigation intuitive
- Tableaux de bord interactifs
- Filtres et recherche

## 📊 Rôles et Permissions

1. **ROLE_CITOYEN** - Utilisateur de base
   - Créer des tickets
   - Voir ses propres tickets
   - Ajouter des commentaires

2. **ROLE_AGENT_TRAITEMENT** - Agent de traitement (hérite de CITOYEN)
   - Toutes les permissions de CITOYEN

3. **ROLE_AGENT_SUPPORT** - Agent de support (hérite de AGENT_TRAITEMENT)
   - Traiter les tickets
   - Escalader les tickets
   - Réouvrir les tickets
   - Clôturer les tickets
   - Voir tous les tickets

4. **ROLE_ADMIN_SUPPORT** - Administrateur (hérite de AGENT_SUPPORT)
   - Toutes les permissions des agents
   - Gérer les utilisateurs
   - Assigner/réassigner les tickets
   - Exporter les données
   - Voir les statistiques complètes

## 🚀 Démarrage Rapide

1. **Démarrer PostgreSQL** et créer la base de données

2. **Lancer le backend:**
```bash
cd ticketing-backend
mvn spring-boot:run
```

3. **Lancer le frontend:**
```bash
cd ticketing-frontend
npm install
npm start
```

4. **Accéder à l'application:** http://localhost:4200

5. **Se connecter avec le compte admin:** admin@justice.gov / Admin@123

## 📝 Notes de développement

- Le backend utilise Spring Boot 3.3.6 (mise à jour depuis 3.2.0)
- Tous les DTOs nécessaires ont été créés
- Les endpoints REST sont complets et fonctionnels
- Le frontend utilise des composants standalone Angular 17
- Les routes sont protégées par des guards
- L'export CSV est fonctionnel
- Les statistiques sont calculées en temps réel

## 📝 License

Projet développé pour le Ministère de la Justice.
