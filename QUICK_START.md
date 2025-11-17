# Guide de Démarrage Rapide

## 🚀 Lancer le projet en 5 minutes

### Prérequis
✅ PostgreSQL installé et démarré
✅ JDK 21 installé
✅ Node.js 24+ installé
✅ Maven 3.9+ installé

### Étape 1: Base de données (2 minutes)

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE ticketing_db;

# Quitter
\q
```

### Étape 2: Backend (2 minutes)

```bash
# Aller dans le dossier backend
cd ticketing-backend

# Installer et démarrer
mvn clean install
mvn spring-boot:run
```

✅ Le backend démarre sur http://localhost:8080

### Étape 3: Frontend (1 minute)

```bash
# Dans un nouveau terminal, aller dans le dossier frontend
cd ticketing-frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

✅ Le frontend démarre sur http://localhost:4200

### Étape 4: Tester l'application

1. Ouvrir http://localhost:4200 dans votre navigateur
2. Se connecter avec:
   - **Email**: admin@justice.gov
   - **Mot de passe**: Admin@123

3. Explorer les fonctionnalités:
   - Cliquer sur "Mes Tickets" pour voir/créer des tickets
   - Cliquer sur "Administration" pour accéder au tableau de bord admin

## 🎯 Que faire ensuite?

### Créer un ticket
1. Cliquer sur "Mes Tickets"
2. Cliquer sur "+ Créer un ticket"
3. Remplir le formulaire
4. Soumettre

### Voir les statistiques (Admin)
1. Cliquer sur "Administration"
2. Voir les statistiques en temps réel
3. Gérer les utilisateurs
4. Exporter les tickets

### Tester l'API directement

Utiliser le fichier `ticketing-backend/API_TESTS.http` avec l'extension REST Client de VS Code:

```http
### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@justice.gov",
  "password": "Admin@123"
}

### Get All Tickets (copier le token de la réponse ci-dessus)
GET http://localhost:8080/api/tickets/all
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📱 Fonctionnalités Disponibles

### Pour tous les utilisateurs connectés
- ✅ Créer des tickets
- ✅ Voir mes tickets
- ✅ Ajouter des commentaires
- ✅ Suivre le statut

### Pour les agents (ROLE_AGENT_SUPPORT)
- ✅ Voir tous les tickets
- ✅ Traiter les tickets
- ✅ Escalader les tickets
- ✅ Clôturer les tickets

### Pour les admins (ROLE_ADMIN_SUPPORT)
- ✅ Tout ce que les agents peuvent faire
- ✅ Assigner les tickets aux agents
- ✅ Voir les statistiques détaillées
- ✅ Gérer les utilisateurs
- ✅ Exporter les données

## 🔧 Configuration

### Modifier le port du backend
Dans `ticketing-backend/src/main/resources/application.properties`:
```properties
server.port=8080
```

### Modifier le port du frontend
Dans `ticketing-frontend/package.json`:
```json
"start": "ng serve --port 4200"
```

### Connexion à PostgreSQL
Dans `ticketing-backend/src/main/resources/application-prod.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ticketing_db
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

## ❓ Dépannage

### Le backend ne démarre pas
1. Vérifier que PostgreSQL est démarré
2. Vérifier que la base de données existe
3. Vérifier les logs dans le terminal

### Le frontend ne se connecte pas
1. Vérifier que le backend est démarré sur le port 8080
2. Vérifier la console du navigateur (F12)
3. Vérifier le fichier `proxy.conf.json`

### Erreur 401 Unauthorized
1. Le token JWT a peut-être expiré
2. Se déconnecter et se reconnecter

### Erreur 403 Forbidden
1. L'utilisateur n'a pas les permissions nécessaires
2. Vérifier les rôles de l'utilisateur

## 📚 Ressources

- **Documentation API**: Voir tous les endpoints dans `README.md`
- **Cahier des charges**: `Copie de gestion des tickets.docx.txt`
- **Améliorations**: `AMELIORATIONS.md`

## 🎉 Prêt à développer!

Le projet est maintenant opérationnel. Vous pouvez:
- Créer de nouveaux composants Angular
- Ajouter de nouveaux endpoints REST
- Personnaliser l'interface
- Ajouter des fonctionnalités
