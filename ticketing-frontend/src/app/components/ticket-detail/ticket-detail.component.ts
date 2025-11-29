import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ticket-detail-container">
      <div *ngIf="loading" class="loading">Chargement...</div>
      
      <div *ngIf="!loading && ticket" class="detail-card">
        <div class="header">
          <div>
            <h2>{{ ticket.numeroTicket }}</h2>
            <span [class]="'badge badge-' + getStatusClass(ticket.statut!)">
              {{ ticket.statut }}
            </span>
          </div>
          <button class="btn btn-secondary" (click)="goBack()">
            ← Retour
          </button>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <div class="ticket-content">
          <div class="section">
            <div class="section-header">
              <h3>Informations du ticket</h3>
              <button 
                *ngIf="canEdit() && !editMode" 
                class="btn btn-sm btn-primary"
                (click)="enableEdit()"
              >
                ✏️ Modifier
              </button>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Titre</label>
                <input 
                  *ngIf="editMode"
                  type="text"
                  [(ngModel)]="editedTicket.titre"
                  class="form-control"
                >
                <p *ngIf="!editMode">{{ ticket.titre }}</p>
              </div>

              <div class="info-item full-width">
                <label>Description</label>
                <textarea 
                  *ngIf="editMode"
                  [(ngModel)]="editedTicket.description"
                  rows="4"
                  class="form-control"
                ></textarea>
                <p *ngIf="!editMode">{{ ticket.description }}</p>
              </div>

              <div class="info-item">
                <label>Type</label>
                <select 
                  *ngIf="editMode"
                  [(ngModel)]="editedTicket.type"
                  class="form-control"
                >
                  <option value="RECLAMATION">Réclamation</option>
                  <option value="INCIDENT">Incident</option>
                  <option value="DEMANDE">Demande</option>
                </select>
                <p *ngIf="!editMode">{{ ticket.type }}</p>
              </div>

              <div class="info-item">
                <label>Priorité</label>
                <select 
                  *ngIf="editMode"
                  [(ngModel)]="editedTicket.priorite"
                  class="form-control"
                >
                  <option value="BASSE">Basse</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="HAUTE">Haute</option>
                  <option value="CRITIQUE">Critique</option>
                </select>
                <p *ngIf="!editMode">{{ ticket.priorite }}</p>
              </div>

              <div class="info-item">
                <label>Catégorie</label>
                <input 
                  *ngIf="editMode"
                  type="text"
                  [(ngModel)]="editedTicket.categorie"
                  class="form-control"
                >
                <p *ngIf="!editMode">{{ ticket.categorie || 'Non spécifiée' }}</p>
              </div>

              <div class="info-item">
                <label>Statut</label>
                <p>{{ ticket.statut }}</p>
              </div>

              <div class="info-item">
                <label>Créé le</label>
                <p>{{ formatDate(ticket.dateCreation!) }}</p>
              </div>

              <div class="info-item">
                <label>Modifié le</label>
                <p>{{ formatDate(ticket.dateModification!) }}</p>
              </div>

              <div class="info-item" *ngIf="ticket.createur">
                <label>Créé par</label>
                <p>{{ ticket.createur.prenom }} {{ ticket.createur.nom }}</p>
              </div>

              <div class="info-item" *ngIf="ticket.assigneA">
                <label>Assigné à</label>
                <p>{{ ticket.assigneA.prenom }} {{ ticket.assigneA.nom }}</p>
              </div>
            </div>

            <div *ngIf="editMode" class="edit-actions">
              <button 
                class="btn btn-secondary"
                (click)="cancelEdit()"
              >
                Annuler
              </button>
              <button 
                class="btn btn-primary"
                (click)="saveChanges()"
                [disabled]="saving"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>

          <div class="section" *ngIf="ticket.resolution">
            <h3>Résolution</h3>
            <p class="resolution-text">{{ ticket.resolution }}</p>
          </div>

          <div class="section">
            <h3>Actions</h3>
            <div class="actions-grid">
              <button 
                *ngIf="canChangeStatus() && ticket.statut === 'OUVERT'"
                class="btn btn-info"
                (click)="changeStatus('EN_COURS')"
              >
                ▶️ Traiter (Passer en cours)
              </button>
              
              <button 
                *ngIf="canChangeStatus() && ticket.statut === 'EN_COURS'"
                class="btn btn-success"
                (click)="changeStatus('RESOLU')"
              >
                ✅ Marquer comme résolu
              </button>

              <button 
                *ngIf="canEscalade() && ticket.statut !== 'ESCALADE'"
                class="btn btn-warning"
                (click)="escalade()"
              >
                ⬆️ Escalader
              </button>

              <button 
                *ngIf="canReopen() && (ticket.statut === 'RESOLU' || ticket.statut === 'CLOS')"
                class="btn btn-warning"
                (click)="reopen()"
              >
                🔄 Réouvrir
              </button>

              <button 
                *ngIf="canChangeStatus() && (ticket.statut === 'RESOLU' || ticket.statut === 'EN_COURS')"
                class="btn btn-danger"
                (click)="openClotureModal()"
              >
                🔒 Clôturer
              </button>

              <button 
                class="btn btn-secondary"
                (click)="toggleHistorique()"
              >
                📜 {{ showHistorique ? 'Masquer' : 'Voir' }} Historique
              </button>
            </div>
          </div>

          <div class="section" *ngIf="showHistorique">
            <h3>📜 Historique des modifications</h3>
            <div *ngIf="loadingHistorique" class="loading">Chargement...</div>
            <div *ngIf="!loadingHistorique && historique.length === 0" class="no-data">
              Aucun historique disponible
            </div>
            <div class="historique-list" *ngIf="!loadingHistorique && historique.length > 0">
              <div class="historique-item" *ngFor="let item of historique">
                <div class="historique-header">
                  <span class="historique-action">{{ item.action }}</span>
                  <span class="historique-date">{{ formatDate(item.dateAction) }}</span>
                </div>
                <div class="historique-details">
                  <p *ngIf="item.utilisateur">
                    👤 Par: {{ item.utilisateur.prenom }} {{ item.utilisateur.nom }}
                  </p>
                  <p *ngIf="item.ancienneValeur && item.nouvelleValeur">
                    🔄 {{ item.ancienneValeur }} → {{ item.nouvelleValeur }}
                  </p>
                  <p *ngIf="item.commentaire" class="historique-comment">
                    💬 {{ item.commentaire }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="section" *ngIf="ticket.resolution">
            <h3>Résolution</h3>
            <p class="resolution-text">{{ ticket.resolution }}</p>
          </div>

          <div class="section">
            <h3>Ajouter un commentaire</h3>
            <textarea 
              [(ngModel)]="newComment"
              rows="3"
              class="form-control"
              placeholder="Votre commentaire..."
            ></textarea>
            <button 
              class="btn btn-primary"
              (click)="addComment()"
              [disabled]="!newComment || addingComment"
              style="margin-top: 1rem;"
            >
              {{ addingComment ? 'Ajout...' : 'Ajouter' }}
            </button>
          </div>

          <!-- Modal pour clôture -->
          <div class="modal-overlay" *ngIf="showClotureModal" (click)="closeClotureModal()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3>Clôturer le ticket</h3>
                <button class="close-btn" (click)="closeClotureModal()">✕</button>
              </div>
              <div class="modal-body">
                <label>Résolution finale: *</label>
                <textarea 
                  [(ngModel)]="resolutionText"
                  rows="4"
                  class="form-control"
                  placeholder="Décrivez comment le problème a été résolu..."
                ></textarea>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" (click)="closeClotureModal()">
                  Annuler
                </button>
                <button 
                  class="btn btn-danger" 
                  (click)="confirmCloture()"
                  [disabled]="!resolutionText || cloturant"
                >
                  {{ cloturant ? 'Clôture...' : 'Confirmer la clôture' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-detail-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .detail-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid #eee;
    }

    .header > div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    h2 {
      margin: 0;
      color: #1976d2;
    }

    h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .badge-OUVERT { background: #e3f2fd; color: #1976d2; }
    .badge-EN_COURS { background: #fff3e0; color: #f57c00; }
    .badge-RESOLU { background: #f3e5f5; color: #7b1fa2; }
    .badge-CLOS { background: #e8f5e9; color: #388e3c; }
    .badge-ESCALADE { background: #ffebee; color: #d32f2f; }

    .ticket-content {
      padding: 2rem;
    }

    .section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }

    .section:last-child {
      border-bottom: none;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #333;
      margin: 0;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25,118,210,0.1);
    }

    textarea.form-control {
      resize: vertical;
    }

    .resolution-text {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }

    .actions-grid {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .edit-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1565c0;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #d5d5d5;
    }

    .btn-success {
      background-color: #4caf50;
      color: white;
    }

    .btn-success:hover {
      background-color: #45a049;
    }

    .btn-info {
      background-color: #0288d1;
      color: white;
    }

    .btn-info:hover {
      background-color: #0277bd;
    }

    .btn-warning {
      background-color: #ff9800;
      color: white;
    }

    .btn-warning:hover {
      background-color: #f57c00;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
    }

    .alert-success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
    }

    .historique-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .historique-item {
      background: #f9f9f9;
      padding: 1rem;
      margin-bottom: 0.75rem;
      border-radius: 4px;
      border-left: 3px solid #1976d2;
    }

    .historique-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .historique-action {
      color: #1976d2;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .historique-date {
      color: #999;
      font-size: 0.85rem;
    }

    .historique-details p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .historique-comment {
      background: white;
      padding: 0.5rem;
      border-radius: 3px;
      margin-top: 0.5rem !important;
      font-style: italic;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 0;
      border-radius: 8px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .close-btn:hover {
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-body label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #eee;
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  editedTicket: Partial<Ticket> = {};
  loading = true;
  error = '';
  success = '';
  editMode = false;
  saving = false;
  addingComment = false;
  newComment = '';
  currentUser: any;
  
  // Nouvelles propriétés pour l'historique et la clôture
  showHistorique = false;
  historique: any[] = [];
  loadingHistorique = false;
  showClotureModal = false;
  resolutionText = '';
  cloturant = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(+id);
    }
  }

  loadTicket(id: number): void {
    this.loading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du ticket';
        this.loading = false;
      }
    });
  }

  canEdit(): boolean {
    if (!this.ticket || !this.currentUser) return false;
    // Le créateur peut modifier tant que le ticket n'est pas clos
    return this.ticket.createur?.id === this.currentUser.id && 
           this.ticket.statut !== 'CLOS';
  }

  canChangeStatus(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles?.includes('ROLE_AGENT_SUPPORT') ||
           this.currentUser.roles?.includes('ROLE_AGENT_TRAITEMENT');
  }

  canEscalade(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles?.includes('ROLE_AGENT_SUPPORT');
  }

  canReopen(): boolean {
    if (!this.ticket || !this.currentUser) return false;
    return this.ticket.createur?.id === this.currentUser.id;
  }

  enableEdit(): void {
    this.editMode = true;
    this.editedTicket = {
      titre: this.ticket!.titre,
      description: this.ticket!.description,
      type: this.ticket!.type,
      priorite: this.ticket!.priorite,
      categorie: this.ticket!.categorie
    };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editedTicket = {};
    this.error = '';
  }

  saveChanges(): void {
    if (!this.ticket) return;
    
    this.saving = true;
    this.error = '';
    this.success = '';

    this.ticketService.updateTicket(this.ticket.id!, this.editedTicket).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.editMode = false;
        this.saving = false;
        this.success = 'Ticket modifié avec succès!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification du ticket';
        this.saving = false;
      }
    });
  }

  changeStatus(newStatus: string): void {
    if (!this.ticket) return;

    this.ticketService.updateTicketStatus(this.ticket.id!, newStatus).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.success = 'Statut mis à jour!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors du changement de statut';
      }
    });
  }

  escalade(): void {
    if (!this.ticket) return;

    this.ticketService.escaladeTicket(this.ticket.id!).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.success = 'Ticket escaladé!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'escalade';
      }
    });
  }

  reopen(): void {
    if (!this.ticket) return;

    this.ticketService.reopenTicket(this.ticket.id!).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.success = 'Ticket réouvert!';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la réouverture';
      }
    });
  }

  addComment(): void {
    if (!this.ticket || !this.newComment) return;

    this.addingComment = true;
    this.ticketService.addComment(this.ticket.id!, this.newComment).subscribe({
      next: () => {
        this.success = 'Commentaire ajouté!';
        this.newComment = '';
        this.addingComment = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'ajout du commentaire';
        this.addingComment = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return status;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleHistorique(): void {
    this.showHistorique = !this.showHistorique;
    if (this.showHistorique && this.historique.length === 0) {
      this.loadHistorique();
    }
  }

  loadHistorique(): void {
    if (!this.ticket) return;
    
    this.loadingHistorique = true;
    this.ticketService.getTicketHistorique(this.ticket.id!).subscribe({
      next: (data) => {
        this.historique = data;
        this.loadingHistorique = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'historique';
        this.loadingHistorique = false;
      }
    });
  }

  openClotureModal(): void {
    this.showClotureModal = true;
    this.resolutionText = '';
  }

  closeClotureModal(): void {
    this.showClotureModal = false;
    this.resolutionText = '';
  }

  confirmCloture(): void {
    if (!this.ticket || !this.resolutionText) return;

    this.cloturant = true;
    this.ticketService.cloturerTicket(this.ticket.id!, this.resolutionText).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.success = 'Ticket clôturé avec succès!';
        this.cloturant = false;
        this.closeClotureModal();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la clôture du ticket';
        this.cloturant = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
