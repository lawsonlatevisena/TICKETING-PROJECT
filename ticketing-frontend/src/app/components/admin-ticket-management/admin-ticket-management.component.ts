import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

@Component({
  selector: 'app-admin-ticket-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-ticket-management">
      <h2>Gestion des Tickets - Administration</h2>

      <!-- Filtres -->
      <div class="filters">
        <select [(ngModel)]="filterStatus" (change)="filterTickets()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="OUVERT">Ouvert</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESOLU">Résolu</option>
          <option value="CLOS">Clos</option>
          <option value="ESCALADE">Escaladé</option>
        </select>

        <select [(ngModel)]="filterPriority" (change)="filterTickets()" class="filter-select">
          <option value="">Toutes les priorités</option>
          <option value="BASSE">Basse</option>
          <option value="MOYENNE">Moyenne</option>
          <option value="HAUTE">Haute</option>
          <option value="URGENTE">Urgente</option>
        </select>

        <select [(ngModel)]="filterAssignment" (change)="filterTickets()" class="filter-select">
          <option value="">Assignation</option>
          <option value="unassigned">Non assigné</option>
          <option value="assigned">Assigné</option>
        </select>
      </div>

      <!-- Liste des tickets -->
      <div class="tickets-list">
        <table class="tickets-table">
          <thead>
            <tr>
              <th>N° Ticket</th>
              <th>Titre</th>
              <th>Créateur</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Assigné à</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ticket of filteredTickets">
              <td><strong>{{ ticket.numeroTicket }}</strong></td>
              <td>{{ ticket.titre }}</td>
              <td>{{ ticket.createur?.nom }} {{ ticket.createur?.prenom }}</td>
              <td>
                <span class="badge priority-{{ ticket.priorite?.toLowerCase() }}">
                  {{ ticket.priorite }}
                </span>
              </td>
              <td>
                <span class="badge status-{{ ticket.statut?.toLowerCase() }}">
                  {{ ticket.statut }}
                </span>
              </td>
              <td>
                <span *ngIf="ticket.assigneA" class="assigned-to">
                  {{ ticket.assigneA.nom }} {{ ticket.assigneA.prenom }}
                </span>
                <span *ngIf="!ticket.assigneA" class="unassigned">Non assigné</span>
              </td>
              <td>{{ ticket.dateCreation ? formatDate(ticket.dateCreation) : '-' }}</td>
              <td>
                <button 
                  (click)="openAssignModal(ticket)" 
                  class="btn-assign"
                  title="Assigner / Réassigner">
                  <span *ngIf="!ticket.assigneA">📌 Assigner</span>
                  <span *ngIf="ticket.assigneA">🔄 Réassigner</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredTickets.length === 0" class="no-tickets">
          <p>Aucun ticket à afficher</p>
        </div>
      </div>

      <!-- Modal d'assignation -->
      <div *ngIf="showAssignModal" class="modal-overlay" (click)="closeAssignModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>{{ selectedTicket?.assigneA ? 'Réassigner' : 'Assigner' }} le ticket</h3>
          
          <div class="ticket-info">
            <p><strong>N° Ticket:</strong> {{ selectedTicket?.numeroTicket }}</p>
            <p><strong>Titre:</strong> {{ selectedTicket?.titre }}</p>
            <p *ngIf="selectedTicket?.assigneA">
              <strong>Actuellement assigné à:</strong> 
              {{ selectedTicket?.assigneA?.nom }} {{ selectedTicket?.assigneA?.prenom }}
            </p>
          </div>

          <div class="form-group">
            <label for="agent-select">Sélectionner un agent:</label>
            <select 
              id="agent-select"
              [(ngModel)]="selectedAgentId" 
              class="form-control">
              <option value="">-- Choisir un agent --</option>
              <option *ngFor="let agent of agents" [value]="agent.id">
                {{ agent.nom }} {{ agent.prenom }} ({{ agent.email }})
              </option>
            </select>
          </div>

          <div class="modal-actions">
            <button 
              (click)="assignTicket()" 
              [disabled]="!selectedAgentId || isLoading"
              class="btn-primary">
              {{ isLoading ? 'Assignation...' : 'Confirmer' }}
            </button>
            <button (click)="closeAssignModal()" class="btn-secondary">
              Annuler
            </button>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-ticket-management {
      padding: 20px;
    }

    h2 {
      color: #1e40af;
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background: white;
    }

    .tickets-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .tickets-table th {
      background: #1e40af;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    .tickets-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .tickets-table tbody tr:hover {
      background: #f9fafb;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .priority-basse { background: #dbeafe; color: #1e40af; }
    .priority-moyenne { background: #fef3c7; color: #92400e; }
    .priority-haute { background: #fed7aa; color: #9a3412; }
    .priority-urgente { background: #fee2e2; color: #991b1b; }

    .status-ouvert { background: #dbeafe; color: #1e40af; }
    .status-en_cours { background: #fef3c7; color: #92400e; }
    .status-resolu { background: #d1fae5; color: #065f46; }
    .status-clos { background: #e5e7eb; color: #374151; }
    .status-escalade { background: #fee2e2; color: #991b1b; }

    .assigned-to {
      color: #059669;
      font-weight: 500;
    }

    .unassigned {
      color: #dc2626;
      font-style: italic;
    }

    .btn-assign {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      background: #1e40af;
      color: white;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
    }

    .btn-assign:hover {
      background: #1e3a8a;
    }

    .no-tickets {
      text-align: center;
      padding: 40px;
      color: #6b7280;
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
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content h3 {
      margin-top: 0;
      color: #1e40af;
    }

    .ticket-info {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .ticket-info p {
      margin: 5px 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .btn-primary {
      padding: 10px 20px;
      background: #1e40af;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1e3a8a;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      padding: 10px 20px;
      background: #e5e7eb;
      color: #374151;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .error-message {
      margin-top: 15px;
      padding: 10px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 6px;
    }
  `]
})
export class AdminTicketManagementComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  agents: User[] = [];
  
  filterStatus = '';
  filterPriority = '';
  filterAssignment = '';
  
  showAssignModal = false;
  selectedTicket: Ticket | null = null;
  selectedAgentId: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadTickets();
    this.loadAgents();
  }

  loadTickets() {
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filterTickets();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tickets:', error);
      }
    });
  }

  loadAgents() {
    const token = this.authService.getToken();
    this.http.get<User[]>('http://localhost:8080/api/admin/users/agents', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (agents) => {
        this.agents = agents;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des agents:', error);
      }
    });
  }

  filterTickets() {
    this.filteredTickets = this.tickets.filter(ticket => {
      const statusMatch = !this.filterStatus || ticket.statut === this.filterStatus;
      const priorityMatch = !this.filterPriority || ticket.priorite === this.filterPriority;
      
      let assignmentMatch = true;
      if (this.filterAssignment === 'unassigned') {
        assignmentMatch = !ticket.assigneA;
      } else if (this.filterAssignment === 'assigned') {
        assignmentMatch = !!ticket.assigneA;
      }
      
      return statusMatch && priorityMatch && assignmentMatch;
    });
  }

  openAssignModal(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.selectedAgentId = ticket.assigneA?.id.toString() || '';
    this.showAssignModal = true;
    this.errorMessage = '';
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.selectedTicket = null;
    this.selectedAgentId = '';
    this.errorMessage = '';
  }

  assignTicket() {
    if (!this.selectedTicket || !this.selectedAgentId || !this.selectedTicket.id) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.assignTicket(this.selectedTicket.id, parseInt(this.selectedAgentId))
      .subscribe({
        next: (updatedTicket) => {
          // Mettre à jour le ticket dans la liste
          const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
          if (index !== -1) {
            this.tickets[index] = updatedTicket;
            this.filterTickets();
          }
          
          this.isLoading = false;
          this.closeAssignModal();
          
          // Afficher un message de succès
          alert('Ticket assigné avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de l\'assignation:', error);
          this.errorMessage = 'Erreur lors de l\'assignation du ticket. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
