# 📋 Guide des Fonctionnalités Agent Support

## Vue d'ensemble

L'interface **Mes Assignations** offre aux agents support toutes les fonctionnalités nécessaires pour gérer efficacement les tickets qui leur sont assignés.

## Accès à l'interface

1. **Connexion** : Se connecter avec un compte agent
   - Email : `agent1@justice.gov`
   - Mot de passe : `Agent@123`

2. **Navigation** : Depuis le dashboard, cliquer sur **"📌 Mes Assignations"**

## Les 5 Fonctionnalités Principales

### 1. ▶️ Traiter un ticket

**Quand l'utiliser :** Lorsqu'un ticket est au statut "OUVERT" et que vous commencez à travailler dessus.

**Action :**
- Cliquez sur le bouton **"▶️ Traiter"**
- Le statut du ticket passe automatiquement à **"EN_COURS"**
- Une entrée est ajoutée à l'historique
- Une notification est envoyée au créateur du ticket

**Effet :** Indique que l'agent a pris en charge le ticket et travaille activement dessus.

---

### 2. ⬆️ Escalader un ticket

**Quand l'utiliser :** Lorsqu'un ticket nécessite une expertise de niveau supérieur ou des permissions spéciales.

**Action :**
1. Cliquez sur le bouton **"⬆️ Escalader"**
2. Une modal s'ouvre pour saisir un commentaire obligatoire
3. Expliquez pourquoi le ticket doit être escaladé
4. Cliquez sur **"Escalader"**

**Champs requis :**
- ✅ Commentaire d'escalade (obligatoire)

**Effet :**
- Le statut passe à **"ESCALADE"**
- Le ticket est transféré à un niveau supérieur
- L'historique est mis à jour
- Une notification est envoyée

**Disponible pour :** Tickets "OUVERT" ou "EN_COURS"

---

### 3. 🔄 Réouvrir un ticket

**Quand l'utiliser :** Lorsqu'un ticket fermé ou résolu nécessite une nouvelle intervention.

**Action :**
1. Cliquez sur le bouton **"🔄 Réouvrir"**
2. Une modal s'ouvre pour saisir la raison de réouverture
3. Expliquez pourquoi le ticket doit être réouvert
4. Cliquez sur **"Réouvrir"**

**Champs requis :**
- ✅ Raison de réouverture (obligatoire)

**Effet :**
- Le statut repasse à **"OUVERT"**
- Le ticket redevient actif
- L'historique enregistre la réouverture
- Une notification est envoyée

**Disponible pour :** Tickets "FERMÉ" ou "RÉSOLU"

---

### 4. 📜 Consulter l'historique

**Quand l'utiliser :** Pour voir toutes les modifications et actions effectuées sur un ticket.

**Action :**
1. Cliquez sur le bouton **"📜 Historique"**
2. Une modal affiche l'historique complet du ticket

**Informations affichées :**
- 🔹 **Action effectuée** (Création, Assignation, Changement de statut, etc.)
- 👤 **Utilisateur** qui a effectué l'action
- 📅 **Date et heure** de l'action
- 📝 **Description** et commentaires associés

**Disponible pour :** Tous les tickets

**Utilité :**
- Traçabilité complète des modifications
- Comprendre l'évolution du ticket
- Identifier les intervenants
- Vérifier les actions passées

---

### 5. ✅ Clôturer le ticket

**Quand l'utiliser :** Lorsque le problème est définitivement résolu et que le ticket peut être fermé.

**Action :**
1. Cliquez sur le bouton **"✅ Clôturer"**
2. Une modal s'ouvre pour saisir la résolution finale
3. Décrivez en détail la solution apportée
4. Cliquez sur **"Clôturer"**

**Champs requis :**
- ✅ Résolution finale (obligatoire, détaillée)

**Effet :**
- Le statut passe à **"FERMÉ"**
- Le ticket est archivé
- La résolution est enregistrée dans l'historique
- Une notification finale est envoyée au créateur

**Disponible pour :** Tickets "RÉSOLU" ou "EN_COURS"

**Important :** La clôture est une action finale. Assurez-vous que le problème est bien résolu avant de clôturer.

---

## Fonctionnalités Additionnelles

### 🔍 Filtres

**Filtrer par Statut :**
- Tous
- Ouvert
- En cours
- Résolu
- Fermé
- Escaladé

**Filtrer par Priorité :**
- Toutes
- Faible
- Moyenne
- Haute
- Urgente

### 📊 Statistiques en temps réel

- **Total** : Nombre total de tickets assignés
- **🔥 Urgents** : Nombre de tickets avec priorité urgente
- **⚙️ En cours** : Nombre de tickets actuellement en traitement

### 👁️ Voir les détails

Chaque ticket possède un bouton **"👁️ Voir"** pour accéder aux détails complets :
- Description détaillée
- Commentaires
- Pièces jointes (si disponibles)
- Informations du créateur

---

## Codes Couleur des Badges

### Priorité
- 🟢 **Faible** : Vert clair
- 🟡 **Moyenne** : Orange clair
- 🟠 **Haute** : Orange foncé
- 🔴 **Urgente** : Rouge avec animation pulsante

### Statut
- 🔵 **Ouvert** : Bleu
- 🟠 **En cours** : Orange
- 🟢 **Résolu** : Vert
- ⚪ **Fermé** : Gris
- 🔴 **Escaladé** : Rouge

---

## Workflow Recommandé

### Traitement Standard
```
1. Ticket assigné → Statut "OUVERT"
2. Agent clique "▶️ Traiter" → Statut "EN_COURS"
3. Agent résout le problème
4. Agent clique "✅ Clôturer" avec résolution → Statut "FERMÉ"
```

### Cas d'escalade
```
1. Ticket assigné → Statut "OUVERT"
2. Agent commence le traitement → Statut "EN_COURS"
3. Problème complexe détecté
4. Agent clique "⬆️ Escalader" avec justification → Statut "ESCALADE"
5. Ticket transféré au niveau supérieur
```

### Réouverture
```
1. Ticket fermé → Statut "FERMÉ"
2. Problème réapparaît ou solution insatisfaisante
3. Agent clique "🔄 Réouvrir" avec raison → Statut "OUVERT"
4. Nouveau cycle de traitement
```

---

## Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours commenter** lors de l'escalade ou de la réouverture
2. **Être précis** dans la résolution lors de la clôture
3. **Consulter l'historique** avant de prendre une action
4. **Traiter les tickets urgents** en priorité
5. **Mettre à jour régulièrement** le statut des tickets

### ❌ À ÉVITER

1. Clôturer un ticket sans résolution détaillée
2. Escalader sans justification claire
3. Réouvrir un ticket sans expliquer pourquoi
4. Laisser des tickets en "EN_COURS" trop longtemps
5. Ignorer les tickets avec priorité urgente

---

## Raccourcis et Astuces

- **Tri automatique** : Les tickets sont triés par date de création (plus récents en premier)
- **Vue d'ensemble** : Les statistiques en haut donnent une vue rapide de la charge de travail
- **Actions contextuelles** : Seules les actions pertinentes pour le statut actuel sont affichées
- **Historique complet** : Chaque action est tracée pour une transparence totale

---

## Support et Questions

Pour toute question sur l'utilisation de ces fonctionnalités :
- Consultez l'administrateur système
- Référez-vous à la documentation complète du projet
- Contactez le support technique

---

**Version** : 1.0  
**Date de mise à jour** : 27 novembre 2025  
**Système** : Gestion des Tickets - Ministère de la Justice
