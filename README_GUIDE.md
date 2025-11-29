# 📋 README - Guide Complet du Projet

## 📄 Fichiers Disponibles

Ce dossier contient la documentation complète du Système de Gestion des Tickets :

### Documents Principaux

1. **GUIDE_COMPLET_PROJET.md** (Markdown)
   - Guide complet en format texte
   - Peut être visualisé directement sur GitHub
   - Peut être édité facilement

2. **GUIDE_COMPLET_PROJET.docx** (Word)
   - Version Microsoft Word
   - Peut être édité dans Word, LibreOffice, Google Docs
   - Inclut une table des matières automatique
   - **À envoyer aux autres personnes** ✅

### Guides Spécialisés

3. **GUIDE_TEST_ASSIGNATION.md**
   - Guide de test pour la fonctionnalité d'assignation
   - Comptes de test
   - Scénarios de test détaillés

4. **backups/README.md**
   - Guide pour les backups de la base de données
   - Scripts automatiques
   - Procédures de restauration

## 🚀 Comment Utiliser le Guide

### Pour Partager le Guide

**Option 1 : Partager le fichier Word (Recommandé)**
```bash
# Le fichier est prêt à être envoyé
GUIDE_COMPLET_PROJET.docx
```

**Option 2 : Partager via Email**
- Attachez `GUIDE_COMPLET_PROJET.docx` à votre email
- Taille : ~34 KB (très léger)

**Option 3 : Partager via GitHub**
- Le fichier `.md` s'affiche parfaitement sur GitHub
- URL : https://github.com/lawsonlatevisena/TICKETING-PROJECT

### Pour Éditer le Guide

**Éditer le fichier Word :**
```bash
# Ouvrir avec LibreOffice
libreoffice GUIDE_COMPLET_PROJET.docx

# Ou avec Microsoft Word
# Double-cliquez sur le fichier
```

**Régénérer le Word depuis le Markdown :**
```bash
pandoc GUIDE_COMPLET_PROJET.md -o GUIDE_COMPLET_PROJET.docx --toc --toc-depth=3
```

## 📖 Contenu du Guide

Le guide complet couvre :

### 1. Introduction
- Objectifs du projet
- Rôles utilisateurs
- Architecture générale

### 2. Installation
- Prérequis (Java, PostgreSQL, Node.js, Angular)
- Configuration de la base de données
- Installation des dépendances

### 3. Backend - Spring Boot
- Structure du projet
- Configuration
- Modèle de données
- Sécurité JWT
- Services et contrôleurs

### 4. Frontend - Angular
- Configuration
- Services
- Composants
- Routing et Guards

### 5. Base de Données
- Schéma complet
- Tables et relations
- Index de performance

### 6. Fonctionnalités
- Création de tickets
- Assignation
- Suivi et traitement
- Gestion des utilisateurs

### 7. Sécurité
- Authentification JWT
- Autorisation basée sur rôles
- Protection CORS et CSRF

### 8. Tests et Documentation
- Swagger/OpenAPI
- Tests avec Postman
- Comptes de test

### 9. Backups
- Scripts automatiques
- Restauration
- DBeaver

### 10. Déploiement
- Build et compilation
- Démarrage des services
- Variables d'environnement

### 11. Troubleshooting
- Problèmes courants
- Solutions
- Logs et débogage

## 🛠️ Outils Nécessaires pour Convertir

Si vous souhaitez modifier et reconvertir le guide :

### Installer Pandoc
```bash
sudo apt-get install pandoc
```

### Convertir Markdown → Word
```bash
pandoc GUIDE_COMPLET_PROJET.md -o GUIDE_COMPLET_PROJET.docx --toc --toc-depth=3
```

### Convertir Markdown → HTML
```bash
pandoc GUIDE_COMPLET_PROJET.md -o GUIDE_COMPLET_PROJET.html --toc --toc-depth=3 --standalone
```

### Convertir Markdown → PDF (nécessite LaTeX)
```bash
# Installer LaTeX
sudo apt-get install texlive-xetex

# Convertir
pandoc GUIDE_COMPLET_PROJET.md -o GUIDE_COMPLET_PROJET.pdf --pdf-engine=xelatex --toc --toc-depth=3
```

## 📧 Exemple d'Email pour Partager

```
Objet : Guide Complet - Système de Gestion des Tickets

Bonjour,

Veuillez trouver ci-joint le guide complet pour développer un Système de 
Gestion des Tickets avec Spring Boot et Angular.

Ce guide comprend :
- L'architecture complète du projet
- L'installation et la configuration étape par étape
- Le code source détaillé (Backend et Frontend)
- La configuration de la base de données PostgreSQL
- La sécurité avec JWT
- Les tests avec Swagger
- Le déploiement
- Le troubleshooting

Le projet inclut :
- Backend : Spring Boot 3.3.6 + Spring Security + PostgreSQL
- Frontend : Angular 17 + TypeScript
- Authentification JWT
- Gestion des rôles (Citoyen, Agent, Admin)
- Documentation API avec Swagger

N'hésitez pas si vous avez des questions !

Cordialement,
[Votre nom]
```

## 📦 Fichiers du Projet

```
TICKETING-PROJECT/
├── GUIDE_COMPLET_PROJET.md          ← Guide en Markdown
├── GUIDE_COMPLET_PROJET.docx        ← Guide en Word (à partager)
├── GUIDE_TEST_ASSIGNATION.md        ← Tests d'assignation
├── README.md                        ← Ce fichier
├── ticketing-backend/               ← Code Backend
├── ticketing-frontend/              ← Code Frontend
└── backups/                         ← Scripts de backup
```

## 🔗 Liens Utiles

- **Repository GitHub** : https://github.com/lawsonlatevisena/TICKETING-PROJECT
- **Spring Boot Docs** : https://spring.io/projects/spring-boot
- **Angular Docs** : https://angular.io/docs
- **PostgreSQL Docs** : https://www.postgresql.org/docs/

## ✅ Checklist pour Partager

- [x] Guide complet créé (Markdown)
- [x] Guide converti en Word
- [x] Table des matières automatique
- [x] Code source documenté
- [x] Instructions d'installation
- [x] Troubleshooting inclus
- [ ] Envoyer le fichier GUIDE_COMPLET_PROJET.docx

---

**Date de création** : 23 novembre 2025  
**Auteur** : Équipe de Développement  
**Version** : 1.0.0
