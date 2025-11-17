# Système de Gestion des Tickets - Ministère de la Justice

Application full-stack de gestion de tickets avec Spring Boot et Angular 17.

## 🚀 Technologies

### Backend
- Java 21
- Spring Boot 3.2.0
- PostgreSQL 18
- Spring Security + JWT
- Maven 3.9.9

### Frontend
- Angular 17
- TypeScript
- Standalone Components
- Reactive Forms

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
mvn spring-boot:run
```

L'API sera disponible sur: http://localhost:8080

### Frontend (Angular)

```bash
cd ticketing-frontend
npm install
npm run ng serve
```

L'application sera disponible sur: http://localhost:4200

## 👤 Compte de test

- **Email:** admin@justice.gov
- **Mot de passe:** Admin@123

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription

### Tickets
- `GET /api/tickets` - Liste des tickets
- `POST /api/tickets` - Créer un ticket
- `PUT /api/tickets/{id}` - Mettre à jour un ticket
- `DELETE /api/tickets/{id}` - Supprimer un ticket

### Notifications
- `GET /api/notifications/me` - Mes notifications
- `GET /api/notifications/unread` - Non lues
- `PUT /api/notifications/{id}/mark-as-read` - Marquer comme lue

## 🏗️ Structure du projet

```
TICKETING/
├── ticketing-backend/          # Application Spring Boot
│   ├── src/main/java/
│   │   └── com/justice/ticketing/
│   │       ├── config/         # Configuration Spring
│   │       ├── controller/     # REST Controllers
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── model/          # Entités JPA
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
    │   ├── services/           # Services HTTP
    │   └── app.routes.ts       # Routing
    └── proxy.conf.json         # Proxy de développement
```

## 🔐 Sécurité

- Authentification JWT
- Mots de passe hashés avec BCrypt
- CORS configuré
- Validation des données

## 📝 License

Projet développé pour le Ministère de la Justice.
