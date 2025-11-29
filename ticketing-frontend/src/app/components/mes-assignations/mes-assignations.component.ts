import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mes-assignations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="assignations-container">
      <div class="header">
        <h1>📌 Mes Tickets Assignés - Agent Support</h1>
        <button class="btn btn-secondary" (click)="retour()">
          ← Retour au Dashboard
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        ⏳ Chargement des tickets...
      </div>

      <div *ngIf="error" class="error-message">
        ❌ {{ error }}
      </div>

      <div *ngIf="!loading && tickets.length === 0" class="no-tickets">
        <p>📭 Aucun ticket ne vous est assigné pour le moment.</p>
      </div>

      <!-- Filtres -->
      <div *ngIf="!loading && tickets.length > 0" class="filters">
        <div class="filter-group">
          <label>📊 Statut:</label>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()">
            <option value="">Tous</option>
            <option value="OUVERT">Ouvert</option>
            <option value="EN_COURS">En cours</option>
            <option value="RESOLU">Résolu</option>
            <option value="FERME">Fermé</option>
            <option value="ESCALADE">Escaladé</option>
          </select>
        </div>

        <div class="filter-group">
          <label>⚡ Priorité:</label>
          <select [(ngModel)]="filterPriority" (change)="applyFilters()">
            <option value="">Toutes</option>
            <option value="FAIBLE">Faible</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="HAUTE">Haute</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>

        <div class="stats">
          <span class="stat-badge">Total: {{ filteredTickets.length }}</span>
          <span class="stat-badge urgent">🔥 Urgents: {{ countUrgent() }}</span>
          <span class="stat-badge open">⚙️ En cours: {{ countEnCours() }}</span>
        </div>
      </div>

      <!-- Liste des tickets -->
      <div class="tickets-grid" *ngIf="!loading">
        <div class="ticket-card" *ngFor="let ticket of filteredTickets">
          <div class="ticket-header">
            <div class="ticket-number">🎫 {{ ticket.numeroTicket || 'N/A' }}</div>
            <span class="priority-badge" [class]="'priority-' + (ticket.priorite?.toLowerCase() || 'faible')">
              {{ ticket.priorite }}
            </span>
          </div>

          <h3 class="ticket-title">{{ ticket.titre }}</h3>
          
          <div class="ticket-meta">
            <span class="status-badge" [class]="'status-' + ((ticket.statut?.toLowerCase() || 'ouvert').replace('_', ''))">
              {{ getStatusLabel(ticket.statut || 'OUVERT') }}
            </span>
            <span class="category">{{ ticket.categorie || 'Non catégorisé' }}</span>
          </div>

          <p class="ticket-description">{{ truncateText(ticket.description, 100) }}</p>

          <div class="ticket-footer">
            <div class="creator-info">
              <strong>👤 Créé par:</strong> {{ ticket.createur?.prenom }} {{ ticket.createur?.nom }}
            </div>
            <div class="date-info">
              📅 {{ ticket.dateCreation ? formatDate(ticket.dateCreation) : 'Date inconnue' }}
            </div>
          </div>

          <!-- Actions de l'agent support -->
          <div class="actions">
            <button 
              class="btn btn-sm btn-view" 
              (click)="viewTicketDetails(ticket)"
              title="Voir les détails"
            >
              👁️ Voir
            </button>

            <!-- 1. Traiter un ticket -->
            <button 
              *ngIf="ticket.statut === 'OUVERT'"
              class="btn btn-sm btn-success" 
              (click)="traiterTicket(ticket)"
              title="Commencer le traitement"
            >
              ▶️ Traiter
            </button>

            <!-- 2. Escalader un ticket -->
            <button 
              *ngIf="ticket.statut === 'OUVERT' || ticket.statut === 'EN_COURS'"
              class="btn btn-sm btn-warning" 
              (click)="openActionModal(ticket, 'escalader')"
              title="Escalader au niveau supérieur"
            >
              ⬆️ Escalader
            </button>

            <!-- 3. Réouvrir un ticket -->
            <button 
              *ngIf="ticket.statut === 'FERME' || ticket.statut === 'RESOLU'"
              class="btn btn-sm btn-info" 
              (click)="openActionModal(ticket, 'reopen')"
              title="Réouvrir le ticket"
            >
              🔄 Réouvrir
            </button>

            <!-- 4. Consulter l'historique -->
            <button 
              class="btn btn-sm btn-secondary" 
              (click)="openActionModal(ticket, 'historique')"
              title="Voir l'historique des modifications"
            >
              📜 Historique
            </button>

            <!-- 5. Clôturer le ticket -->
            <button 
              *ngIf="ticket.statut === 'RESOLU' || ticket.statut === 'EN_COURS'"
              class="btn btn-sm btn-danger" 
              (click)="openActionModal(ticket, 'cloturer')"
              title="Clôturer définitivement"
            >
              ✅ Clôturer
            </button>
          </div>
        </div>
      </div>

      <!-- Modal pour les actions -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ getModalTitle() }}</h2>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <!-- Pour escalader -->
            <div *ngIf="currentAction === 'escalader'">
              <p><strong>Ticket:</strong> {{ selectedTicket?.numeroTicket }} - {{ selectedTicket?.titre }}</p>
              <div class="form-group">
                <label>Commentaire d'escalade: *</label>
                <textarea 
                  [(ngModel)]="actionCommentaire" 
                  rows="4" 
                  placeholder="Expliquez pourquoi ce ticket doit être escaladé..."
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <!-- Pour réouvrir -->
            <div *ngIf="currentAction === 'reopen'">
              <p><strong>Ticket:</strong> {{ selectedTicket?.numeroTicket }} - {{ selectedTicket?.titre }}</p>
              <div class="form-group">
                <label>Raison de réouverture: *</label>
                <textarea 
                  [(ngModel)]="actionCommentaire" 
                  rows="4" 
                  placeholder="Expliquez pourquoi ce ticket doit être réouvert..."
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <!-- Pour clôturer -->
            <div *ngIf="currentAction === 'cloturer'">
              <p><strong>Ticket:</strong> {{ selectedTicket?.numeroTicket }} - {{ selectedTicket?.titre }}</p>
              <div class="form-group">
                <label>Résolution finale: *</label>
                <textarea 
                  [(ngModel)]="actionResolution" 
                  rows="5" 
                  placeholder="Décrivez la résolution apportée au problème..."
                  class="form-control"
                ></textarea>
              </div>
            </div>

            <!-- Pour l'historique -->
            <div *ngIf="currentAction === 'historique'" class="historique-container">
              <p><strong>🎫 Ticket:</strong> {{ selectedTicket?.numeroTicket }} - {{ selectedTicket?.titre }}</p>
              
              <div *ngIf="loadingHistorique" class="loading-small">
                ⏳ Chargement de l'historique complet...
              </div>

              <div *ngIf="!loadingHistorique && historique.length === 0" class="no-historique">
                📭 Aucun historique disponible pour ce ticket
              </div>

              <div *ngIf="!loadingHistorique && historique.length > 0">
                <div class="historique-summary">
                  <strong>📊 Résumé:</strong> {{ historique.length }} action(s) enregistrée(s)
                </div>
                
                <div class="historique-timeline">
                  <div class="historique-item" *ngFor="let h of historique; let i = index">
                    <div class="historique-number">{{ historique.length - i }}</div>
                    <div class="historique-content">
                      <div class="historique-header">
                        <div class="historique-action-badge" [class]="getActionClass(h.action)">
                          {{ getActionLabel(h.action) }}
                        </div>
                        <span class="historique-date">📅 {{ formatDate(h.dateAction) }}</span>
                      </div>
                      
                      <div class="historique-user">
                        <strong>👤 Par:</strong> {{ h.utilisateurPrenom }} {{ h.utilisateurNom }}
                        <span class="user-email">({{ h.utilisateurEmail }})</span>
                      </div>

                      <!-- Affichage des changements de valeur -->
                      <div class="historique-changes" *ngIf="h.ancienneValeur || h.nouvelleValeur">
                        <div class="change-row">
                          <div class="change-label">📝 Modification:</div>
                          <div class="change-values">
                            <span class="old-value" *ngIf="h.ancienneValeur">
                              <strong>Avant:</strong> {{ h.ancienneValeur }}
                            </span>
                            <span class="arrow" *ngIf="h.ancienneValeur && h.nouvelleValeur">→</span>
                            <span class="new-value" *ngIf="h.nouvelleValeur">
                              <strong>Après:</strong> {{ h.nouvelleValeur }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Commentaire détaillé -->
                      <div class="historique-commentaire" *ngIf="h.commentaire">
                        <strong>💬 Détails:</strong>
                        <div class="commentaire-text">{{ h.commentaire }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">
              Annuler
            </button>
            <button 
              *ngIf="currentAction !== 'historique'"
              class="btn btn-primary" 
              (click)="executeAction()"
              [disabled]="!canExecuteAction()"
            >
              {{ getActionButtonLabel() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assignations-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #2e7d32;
      margin: 0;
      font-size: 1.8rem;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      font-size: 1.2rem;
      color: #666;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .no-tickets {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      font-size: 1.1rem;
      color: #666;
    }

    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
    }

    .filter-group select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .stats {
      margin-left: auto;
      display: flex;
      gap: 1rem;
    }

    .stat-badge {
      padding: 0.5rem 1rem;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .stat-badge.urgent {
      background: #ffebee;
      color: #c62828;
    }

    .stat-badge.open {
      background: #fff3e0;
      color: #f57c00;
    }

    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .ticket-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      border-left: 4px solid #2e7d32;
    }

    .ticket-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateY(-2px);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ticket-number {
      font-weight: bold;
      color: #2e7d32;
      font-size: 0.9rem;
    }

    .priority-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-faible {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .priority-moyenne {
      background: #fff3e0;
      color: #f57c00;
    }

    .priority-haute {
      background: #ffe0b2;
      color: #e65100;
    }

    .priority-urgente {
      background: #ffebee;
      color: #c62828;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .ticket-title {
      font-size: 1.1rem;
      color: #333;
      margin: 0.5rem 0;
      font-weight: 600;
    }

    .ticket-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-ouvert {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-encours {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-resolu {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-ferme {
      background: #f5f5f5;
      color: #616161;
    }

    .status-escalade {
      background: #ffebee;
      color: #c62828;
    }

    .category {
      padding: 0.25rem 0.75rem;
      background: #f5f5f5;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #666;
    }

    .ticket-description {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 1rem 0;
    }

    .ticket-footer {
      border-top: 1px solid #eee;
      padding-top: 1rem;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #666;
    }

    .creator-info {
      margin-bottom: 0.5rem;
    }

    .date-info {
      color: #999;
      font-size: 0.8rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .btn-view {
      background-color: #1976d2;
      color: white;
    }

    .btn-view:hover {
      background-color: #1565c0;
    }

    .btn-success {
      background-color: #2e7d32;
      color: white;
    }

    .btn-success:hover {
      background-color: #1b5e20;
    }

    .btn-warning {
      background-color: #f57c00;
      color: white;
    }

    .btn-warning:hover {
      background-color: #e65100;
    }

    .btn-info {
      background-color: #0288d1;
      color: white;
    }

    .btn-info:hover {
      background-color: #01579b;
    }

    .btn-secondary {
      background-color: #757575;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #616161;
    }

    .btn-danger {
      background-color: #d32f2f;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c62828;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .close-btn:hover {
      color: #c62828;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .historique-container {
      max-height: 500px;
      overflow-y: auto;
    }

    .loading-small {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .no-historique {
      text-align: center;
      padding: 2rem;
      color: #999;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .historique-summary {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      color: #1976d2;
      font-weight: 600;
    }

    .historique-timeline {
      position: relative;
      padding-left: 2rem;
    }

    .historique-timeline::before {
      content: '';
      position: absolute;
      left: 1.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }

    .historique-item {
      position: relative;
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #1976d2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .historique-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      transform: translateX(2px);
      transition: all 0.3s ease;
    }

    .historique-number {
      position: absolute;
      left: -2.8rem;
      top: 1.5rem;
      width: 2rem;
      height: 2rem;
      background: #1976d2;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.85rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .historique-content {
      margin-left: 1rem;
    }

    .historique-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .historique-action-badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
    }

    .action-creation {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .action-assignation {
      background: #e3f2fd;
      color: #1976d2;
    }

    .action-changement_statut,
    .action-changement-statut {
      background: #fff3e0;
      color: #f57c00;
    }

    .action-cloture {
      background: #f5f5f5;
      color: #616161;
    }

    .action-escalade {
      background: #ffebee;
      color: #c62828;
    }

    .action-commentaire {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .historique-date {
      color: #999;
      font-size: 0.85rem;
      font-weight: normal;
    }

    .historique-user {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .user-email {
      color: #999;
      font-size: 0.85rem;
      margin-left: 0.5rem;
    }

    .historique-changes {
      background: #fff8e1;
      padding: 1rem;
      border-radius: 4px;
      margin: 0.75rem 0;
      border-left: 3px solid #fbc02d;
    }

    .change-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .change-label {
      font-weight: 600;
      color: #f57c00;
      font-size: 0.9rem;
    }

    .change-values {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .old-value {
      padding: 0.4rem 0.8rem;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .new-value {
      padding: 0.4rem 0.8rem;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .arrow {
      color: #666;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .historique-commentaire {
      margin-top: 0.75rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
      border-left: 3px solid #1976d2;
    }

    .commentaire-text {
      margin-top: 0.5rem;
      color: #333;
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  `]
})
export class MesAssignationsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = false;
  error = '';
  filterStatus = '';
  filterPriority = '';

  // Modal
  showModal = false;
  selectedTicket: Ticket | null = null;
  currentAction: 'traiter' | 'escalader' | 'reopen' | 'cloturer' | 'historique' | null = null;
  actionCommentaire = '';
  actionResolution = '';

  // Historique
  historique: any[] = [];
  loadingHistorique = false;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAssignations();
  }

  loadAssignations(): void {
    this.loading = true;
    this.error = '';
    
    this.ticketService.getMesAssignations().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des tickets assignés';
        console.error('Error loading assignations:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const statusMatch = !this.filterStatus || ticket.statut === this.filterStatus;
      const priorityMatch = !this.filterPriority || ticket.priorite === this.filterPriority;
      return statusMatch && priorityMatch;
    });
  }

  countUrgent(): number {
    return this.filteredTickets.filter(t => t.priorite === 'URGENTE').length;
  }

  countEnCours(): number {
    return this.filteredTickets.filter(t => t.statut === 'EN_COURS').length;
  }

  viewTicketDetails(ticket: Ticket): void {
    if (ticket.numeroTicket) {
      this.router.navigate(['/ticket', ticket.numeroTicket]);
    }
  }

  // 1. Traiter un ticket
  traiterTicket(ticket: Ticket): void {
    if (!ticket.id) return;
    
    if (confirm('Voulez-vous commencer le traitement de ce ticket ?')) {
      this.ticketService.updateTicketStatus(ticket.id, 'EN_COURS', 'Prise en charge du ticket').subscribe({
        next: () => {
          alert('✅ Ticket pris en charge avec succès !');
          this.loadAssignations();
        },
        error: (err) => {
          console.error('Error:', err);
          alert('❌ Erreur lors de la mise à jour du statut');
        }
      });
    }
  }

  // Ouvrir le modal pour une action
  openActionModal(ticket: Ticket, action: 'escalader' | 'reopen' | 'cloturer' | 'historique'): void {
    this.selectedTicket = ticket;
    this.currentAction = action;
    this.actionCommentaire = '';
    this.actionResolution = '';
    this.showModal = true;

    // Charger l'historique si nécessaire
    if (action === 'historique' && ticket.id) {
      this.loadHistorique(ticket.id);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTicket = null;
    this.currentAction = null;
    this.actionCommentaire = '';
    this.actionResolution = '';
    this.historique = [];
  }

  getModalTitle(): string {
    switch (this.currentAction) {
      case 'escalader': return '⬆️ Escalader le ticket';
      case 'reopen': return '🔄 Réouvrir le ticket';
      case 'cloturer': return '✅ Clôturer le ticket';
      case 'historique': return '📜 Historique du ticket';
      default: return '';
    }
  }

  getActionButtonLabel(): string {
    switch (this.currentAction) {
      case 'escalader': return 'Escalader';
      case 'reopen': return 'Réouvrir';
      case 'cloturer': return 'Clôturer';
      default: return 'Confirmer';
    }
  }

  canExecuteAction(): boolean {
    switch (this.currentAction) {
      case 'escalader':
      case 'reopen':
        return this.actionCommentaire.trim().length > 0;
      case 'cloturer':
        return this.actionResolution.trim().length > 0;
      default:
        return false;
    }
  }

  executeAction(): void {
    if (!this.selectedTicket?.id || !this.canExecuteAction()) return;

    switch (this.currentAction) {
      case 'escalader':
        this.escaladerTicket();
        break;
      case 'reopen':
        this.reopenTicket();
        break;
      case 'cloturer':
        this.cloturerTicket();
        break;
    }
  }

  // 2. Escalader un ticket
  escaladerTicket(): void {
    if (!this.selectedTicket?.id) return;

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put(
      `http://localhost:8080/api/tickets/${this.selectedTicket.id}/escalade`,
      { commentaire: this.actionCommentaire },
      { headers }
    ).subscribe({
      next: () => {
        alert('✅ Ticket escaladé avec succès !');
        this.closeModal();
        this.loadAssignations();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('❌ Erreur lors de l\'escalade du ticket');
      }
    });
  }

  // 3. Réouvrir un ticket
  reopenTicket(): void {
    if (!this.selectedTicket?.id) return;

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put(
      `http://localhost:8080/api/tickets/${this.selectedTicket.id}/reopen`,
      { commentaire: this.actionCommentaire },
      { headers }
    ).subscribe({
      next: () => {
        alert('✅ Ticket réouvert avec succès !');
        this.closeModal();
        this.loadAssignations();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('❌ Erreur lors de la réouverture du ticket');
      }
    });
  }

  // 5. Clôturer le ticket
  cloturerTicket(): void {
    if (!this.selectedTicket?.id) return;

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put(
      `http://localhost:8080/api/tickets/${this.selectedTicket.id}/cloturer`,
      { resolution: this.actionResolution },
      { headers }
    ).subscribe({
      next: () => {
        alert('✅ Ticket clôturé avec succès !');
        this.closeModal();
        this.loadAssignations();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('❌ Erreur lors de la clôture du ticket');
      }
    });
  }

  // 4. Consulter l'historique
  loadHistorique(ticketId: number): void {
    this.loadingHistorique = true;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(
      `http://localhost:8080/api/tickets/${ticketId}/historique`,
      { headers }
    ).subscribe({
      next: (data) => {
        this.historique = data;
        this.loadingHistorique = false;
      },
      error: (err) => {
        console.error('Error loading historique:', err);
        this.historique = [];
        this.loadingHistorique = false;
      }
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'OUVERT': 'Ouvert',
      'EN_COURS': 'En cours',
      'RESOLU': 'Résolu',
      'FERME': 'Fermé',
      'ESCALADE': 'Escaladé'
    };
    return labels[status] || status;
  }

  getActionLabel(action: string): string {
    const labels: { [key: string]: string } = {
      'CREATION': '✨ Création',
      'ASSIGNATION': '👤 Assignation',
      'CHANGEMENT_STATUT': '🔄 Changement de statut',
      'CLOTURE': '✅ Clôture',
      'ESCALADE': '⬆️ Escalade',
      'COMMENTAIRE': '💬 Commentaire',
      'REOUVERTURE': '🔓 Réouverture'
    };
    return labels[action] || action;
  }

  getActionClass(action: string): string {
    return 'action-' + action.toLowerCase().replace('_', '-');
  }

  retour(): void {
    this.router.navigate(['/dashboard']);
  }
}
