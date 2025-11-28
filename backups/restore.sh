#!/bin/bash

# Script de restauration de la base de données ticketing_db
# Usage: ./restore.sh <fichier_backup>

# Configuration
DB_NAME="ticketing_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Vérifier qu'un fichier de backup est fourni
if [ -z "$1" ]; then
    echo "❌ Erreur : Veuillez spécifier un fichier de backup"
    echo "Usage: ./restore.sh <fichier_backup>"
    echo ""
    echo "Backups disponibles :"
    ls -lh /home/lawson/Téléchargements/TICKETING-PROJECT/backups/ | grep "ticketing_db_backup"
    exit 1
fi

BACKUP_FILE="$1"

# Vérifier que le fichier existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erreur : Le fichier '$BACKUP_FILE' n'existe pas"
    exit 1
fi

echo "⚠️  ATTENTION : Cette opération va remplacer la base de données '$DB_NAME'"
echo "Fichier de restauration : $BACKUP_FILE"
read -p "Voulez-vous continuer ? (oui/non) : " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

# Déterminer le type de fichier
if [[ "$BACKUP_FILE" == *.sql ]]; then
    # Restauration depuis un fichier SQL
    echo "🔄 Restauration depuis le fichier SQL..."
    
    # Supprimer et recréer la base de données
    echo "🗑️  Suppression de la base de données existante..."
    PGPASSWORD=$DB_PASSWORD dropdb -U $DB_USER -h $DB_HOST -p $DB_PORT --if-exists $DB_NAME
    
    echo "🆕 Création d'une nouvelle base de données..."
    PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
    
    echo "📥 Importation des données..."
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME < "$BACKUP_FILE"
    
elif [[ "$BACKUP_FILE" == *.dump ]]; then
    # Restauration depuis un fichier dump compressé
    echo "🔄 Restauration depuis le fichier dump compressé..."
    
    # Supprimer et recréer la base de données
    echo "🗑️  Suppression de la base de données existante..."
    PGPASSWORD=$DB_PASSWORD dropdb -U $DB_USER -h $DB_HOST -p $DB_PORT --if-exists $DB_NAME
    
    echo "🆕 Création d'une nouvelle base de données..."
    PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
    
    echo "📥 Importation des données..."
    PGPASSWORD=$DB_PASSWORD pg_restore -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME "$BACKUP_FILE"
else
    echo "❌ Erreur : Format de fichier non reconnu (utilisez .sql ou .dump)"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo "✅ Restauration terminée avec succès !"
else
    echo "❌ Erreur lors de la restauration"
    exit 1
fi
