-- Script de création de la base de données PostgreSQL
-- Système de gestion des tickets - Ministère de la Justice

-- Créer la base de données
CREATE DATABASE ticketing_db;

-- Se connecter à la base de données
\c ticketing_db;

-- Les tables seront créées automatiquement par Hibernate
-- Ce script est fourni pour référence et installation manuelle si nécessaire

-- Note: Assurez-vous que PostgreSQL est installé et en cours d'exécution
-- sur le port 5432 avec l'utilisateur 'postgres'
