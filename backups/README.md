# 📦 Backups de la Base de Données

Ce dossier contient les backups de la base de données `ticketing_db` ainsi que les scripts pour créer et restaurer les backups.

## 📝 Fichiers Disponibles

### Scripts
- **`backup.sh`** : Script automatique pour créer un backup
- **`restore.sh`** : Script pour restaurer un backup

### Backups
Les backups sont nommés avec le format : `ticketing_db_backup_YYYYMMDD_HHMMSS.{sql|dump}`

- **`.sql`** : Format SQL lisible (non compressé)
- **`.dump`** : Format custom PostgreSQL compressé

## 🔧 Utilisation

### Créer un Backup

**Méthode 1 : Utiliser le script automatique**
```bash
./backups/backup.sh
```

**Méthode 2 : Commande manuelle (SQL)**
```bash
PGPASSWORD=postgres pg_dump -U postgres -h localhost -p 5432 ticketing_db > backups/ticketing_db_backup_$(date +%Y%m%d_%H%M%S).sql
```

**Méthode 3 : Commande manuelle (Compressé)**
```bash
PGPASSWORD=postgres pg_dump -U postgres -h localhost -p 5432 -Fc ticketing_db > backups/ticketing_db_backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restaurer un Backup

**Utiliser le script de restauration**
```bash
./backups/restore.sh backups/ticketing_db_backup_20251122_210441.sql
```

Ou pour un fichier dump :
```bash
./backups/restore.sh backups/ticketing_db_backup_20251122_210543.dump
```

**⚠️ ATTENTION** : La restauration supprime toutes les données existantes !

### Backup via DBeaver

1. Clic droit sur `ticketing_db` dans DBeaver
2. **Tools** → **Dump database**
3. Sélectionner le format et l'emplacement
4. Cliquer sur **Start**

### Restauration via DBeaver

1. Clic droit sur `ticketing_db` dans DBeaver
2. **Tools** → **Restore database**
3. Sélectionner le fichier de backup
4. Cliquer sur **Start**

## 📊 Informations sur les Backups

### Contenu sauvegardé
- ✅ Structure des tables (DDL)
- ✅ Données de toutes les tables
- ✅ Contraintes et index
- ✅ Séquences
- ✅ Rôles et permissions (selon les options)

### Tables sauvegardées
- `users` - Utilisateurs
- `roles` - Rôles système
- `user_roles` - Association users ↔ roles
- `tickets` - Tickets
- `commentaires` - Commentaires
- `notifications` - Notifications
- `ticket_historique` - Historique

## 🔄 Automatisation (Optionnel)

Pour créer des backups automatiques quotidiens via cron :

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour un backup tous les jours à 2h du matin
0 2 * * * /home/lawson/Téléchargements/TICKETING-PROJECT/backups/backup.sh
```

## 📌 Bonnes Pratiques

1. **Fréquence** : Créer un backup avant toute modification importante
2. **Rétention** : Le script `backup.sh` supprime automatiquement les backups > 7 jours
3. **Stockage** : Copier les backups importants sur un disque externe ou cloud
4. **Test** : Tester régulièrement la restauration des backups

## 🆘 En cas de Problème

### Erreur de connexion
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Vérifier les identifiants dans les scripts
```

### Erreur de permissions
```bash
# Donner les droits d'exécution
chmod +x backup.sh restore.sh
```

### Base de données verrouillée
```bash
# Arrêter le backend avant la restauration
pkill -f "java -jar.*ticketing-backend"
```
