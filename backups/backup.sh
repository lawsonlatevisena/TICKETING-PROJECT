#!/bin/bash

# Script de backup automatique pour la base de données ticketing_db
# Usage: ./backup.sh

# Configuration
DB_NAME="ticketing_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"
BACKUP_DIR="/home/lawson/Téléchargements/TICKETING-PROJECT/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Nom des fichiers de backup
SQL_BACKUP="$BACKUP_DIR/ticketing_db_backup_$DATE.sql"
DUMP_BACKUP="$BACKUP_DIR/ticketing_db_backup_$DATE.dump"

echo "🔄 Début du backup de la base de données '$DB_NAME'..."

# Backup au format SQL (lisible)
echo "📝 Création du backup SQL..."
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME > "$SQL_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Backup SQL créé : $SQL_BACKUP ($(du -h "$SQL_BACKUP" | cut -f1))"
else
    echo "❌ Erreur lors de la création du backup SQL"
    exit 1
fi

# Backup au format custom compressé
echo "📦 Création du backup compressé..."
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h $DB_HOST -p $DB_PORT -Fc $DB_NAME > "$DUMP_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Backup compressé créé : $DUMP_BACKUP ($(du -h "$DUMP_BACKUP" | cut -f1))"
else
    echo "❌ Erreur lors de la création du backup compressé"
    exit 1
fi

# Supprimer les backups de plus de 7 jours (optionnel)
echo "🗑️  Nettoyage des anciens backups (> 7 jours)..."
find "$BACKUP_DIR" -name "ticketing_db_backup_*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "ticketing_db_backup_*.dump" -mtime +7 -delete

echo "✅ Backup terminé avec succès !"
echo "📊 Contenu du dossier backup :"
ls -lh "$BACKUP_DIR" | grep "ticketing_db_backup"
