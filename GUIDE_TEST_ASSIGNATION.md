# Guide de Test - Fonctionnalité d'Assignation/Réassignation de Tickets

## 🎯 Objectif
Tester la fonctionnalité d'assignation et de réassignation de tickets par l'ADMIN_SUPPORT.

## ✅ Prérequis

### Services actifs
- ✅ Backend Spring Boot : http://localhost:8080
- ✅ Frontend Angular : http://localhost:4200
- ✅ PostgreSQL : Port 5432

### Comptes de test créés

#### Admin
- Email: `admin@justice.com`
- Mot de passe: `Admin@123`
- Rôle: ROLE_ADMIN_SUPPORT

#### Agents
1. **Agent 1**
   - Email: `agent1@justice.gov`
   - Mot de passe: `Agent@123`
   - Nom: Pierre Dupont
   - Rôle: ROLE_AGENT_SUPPORT

2. **Agent 2**
   - Email: `agent2@justice.gov`
   - Mot de passe: `Agent@123`
   - Nom: Sophie Martin
   - Rôle: ROLE_AGENT_SUPPORT

#### Citoyen
- Email: `test@test.com`
- Mot de passe: `Test@123`
- Rôle: ROLE_CITOYEN

## 📝 Scénarios de Test

### Scénario 1 : Créer des tickets de test

1. Connectez-vous avec le compte citoyen (`test@test.com`)
2. Créez 2-3 tickets avec différentes priorités :
   ```
   Ticket 1:
   - Titre: Problème d'accès au dossier
   - Description: Je ne peux plus accéder à mon dossier en ligne
   - Type: INCIDENT
   - Priorité: HAUTE
   
   Ticket 2:
   - Titre: Demande de rectification
   - Description: Une erreur dans mon dossier numéro 12345
   - Type: DEMANDE
   - Priorité: MOYENNE
   
   Ticket 3:
   - Titre: Plainte non traitée
   - Description: Ma plainte n'a pas été traitée depuis 2 semaines
   - Type: RECLAMATION
   - Priorité: URGENTE
   ```

### Scénario 2 : Assigner un ticket non assigné

1. **Déconnexion** du compte citoyen
2. **Connexion** avec le compte admin (`admin@justice.com`)
3. Dans le dashboard admin, cliquer sur **"📋 Gestion des Tickets"**
4. Vous devriez voir la liste de tous les tickets
5. Filtrer par **"Non assigné"**
6. Cliquer sur **"📌 Assigner"** pour un ticket
7. Dans la modal qui s'ouvre :
   - Vérifier que les informations du ticket sont affichées
   - Sélectionner un agent (ex: Pierre Dupont)
   - Cliquer sur **"Confirmer"**
8. ✅ Vérifier que le ticket affiche maintenant l'agent assigné

### Scénario 3 : Réassigner un ticket

1. Sur un ticket déjà assigné, cliquer sur **"🔄 Réassigner"**
2. Dans la modal :
   - Vérifier que l'agent actuellement assigné est affiché
   - Sélectionner un autre agent (ex: Sophie Martin)
   - Cliquer sur **"Confirmer"**
3. ✅ Vérifier que le ticket affiche le nouvel agent

### Scénario 4 : Tester les filtres

1. Utiliser les filtres en haut de la page :
   - **Statut** : Tester "Ouvert", "En cours", etc.
   - **Priorité** : Tester "Urgente", "Haute", etc.
   - **Assignation** : Tester "Assigné" / "Non assigné"
2. ✅ Vérifier que seuls les tickets correspondants s'affichent

### Scénario 5 : Vérifier l'historique

1. Assigner/réassigner un ticket plusieurs fois
2. Cliquer sur le ticket pour voir ses détails (si fonctionnalité disponible)
3. ✅ Vérifier que l'historique des assignations est enregistré

## 🔍 Points à vérifier

### Interface utilisateur
- [ ] La liste des tickets s'affiche correctement
- [ ] Les badges de statut et priorité sont bien colorés
- [ ] Les filtres fonctionnent
- [ ] La modal d'assignation s'ouvre et se ferme correctement
- [ ] La liste des agents disponibles est complète
- [ ] Le bouton "Confirmer" se désactive pendant le chargement

### Backend
- [ ] L'endpoint `/api/admin/users/agents` retourne les agents
- [ ] L'endpoint `/api/tickets/{id}/assign/{agentId}` fonctionne
- [ ] Le statut du ticket passe à "EN_COURS" après assignation
- [ ] Une notification est créée pour l'agent assigné
- [ ] L'historique est enregistré dans `ticket_historique`

### Base de données
```sql
-- Vérifier les assignations
SELECT id, numero_ticket, titre, statut, assigne_a_id 
FROM tickets 
ORDER BY date_creation DESC;

-- Vérifier l'historique
SELECT * FROM ticket_historique 
WHERE action = 'ASSIGNATION' 
ORDER BY date_action DESC;

-- Vérifier les notifications
SELECT * FROM notifications 
WHERE type = 'ASSIGNATION' 
ORDER BY date_creation DESC;
```

## 🐛 Tests d'erreur

1. **Tenter d'assigner sans sélectionner d'agent** :
   - Le bouton "Confirmer" devrait être désactivé

2. **Annuler l'assignation** :
   - Cliquer sur "Annuler" devrait fermer la modal sans changement

3. **Accès non autorisé** :
   - Tenter d'accéder à `/admin/tickets` avec un compte citoyen
   - Devrait rediriger vers login ou dashboard

## 📊 Résultats attendus

✅ **Succès** :
- Les tickets peuvent être assignés aux agents
- Les tickets peuvent être réassignés à d'autres agents
- L'interface est intuitive et réactive
- Les filtres fonctionnent correctement
- Les notifications sont créées
- L'historique est enregistré

## 📸 Captures d'écran recommandées

1. Vue de la liste des tickets
2. Modal d'assignation ouverte
3. Ticket assigné (avant/après)
4. Utilisation des filtres
5. Dashboard admin avec le bouton "Gestion des Tickets"

## 🔗 URLs de test

- Frontend: http://localhost:4200
- Login Admin: http://localhost:4200/login
- Dashboard Admin: http://localhost:4200/admin
- Gestion Tickets: http://localhost:4200/admin/tickets

## 🎓 Fonctionnalités implémentées

✅ Liste complète des tickets avec filtres
✅ Modal d'assignation/réassignation
✅ Sélection d'agents disponibles
✅ Mise à jour en temps réel de l'interface
✅ Gestion des erreurs
✅ Protection des routes (guards)
✅ Design responsive et moderne
