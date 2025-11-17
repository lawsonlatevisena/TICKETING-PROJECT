# Guide de Configuration de la Base de Données

## Prérequis
- PostgreSQL 12 ou supérieur installé
- Accès administrateur à PostgreSQL

## Installation

### 1. Installer PostgreSQL (si non installé)
Téléchargez et installez PostgreSQL depuis: https://www.postgresql.org/download/

### 2. Créer la base de données

#### Option 1: Via psql (ligne de commande)
```bash
psql -U postgres
CREATE DATABASE ticketing_db;
\q
```

#### Option 2: Via pgAdmin
1. Ouvrez pgAdmin
2. Clic droit sur "Databases" → "Create" → "Database"
3. Nom: `ticketing_db`
4. Cliquez sur "Save"

### 3. Configurer l'utilisateur
Par défaut, l'application utilise:
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

Pour modifier ces paramètres, éditez le fichier:
`src/main/resources/application.properties`

### 4. Vérifier la connexion
L'application créera automatiquement les tables au démarrage grâce à Hibernate.

## Structure de la base de données

Les tables suivantes seront créées automatiquement:
- `users` - Utilisateurs du système
- `roles` - Rôles utilisateur
- `user_roles` - Association utilisateurs-rôles
- `tickets` - Tickets/réclamations
- `ticket_historique` - Historique des modifications
- `commentaires` - Commentaires sur les tickets
- `notifications` - Notifications système

## Données initiales

Au premier démarrage, l'application créera:
- 4 rôles: CITOYEN, AGENT_TRAITEMENT, AGENT_SUPPORT, ADMIN_SUPPORT
- 1 compte admin par défaut:
  - Email: admin@justice.gov
  - Mot de passe: Admin@123

**Important**: Changez le mot de passe admin après la première connexion!
