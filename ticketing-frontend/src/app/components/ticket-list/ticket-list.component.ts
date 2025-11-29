import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="ticket-list-container">
      <div class="header">
        <h2>Mes Tickets</h2>
        <button class="btn btn-primary" (click)="navigateToCreate()">
          + Créer un ticket
        </button>
      </div>

      <div class="filters">
        <select [(ngModel)]="filterStatus" (change)="applyFilter()" class="form-control">
          <option value="">Tous les statuts</option>
          <option value="OUVERT">Ouvert</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESOLU">Résolu</option>
          <option value="CLOS">Clos</option>
          <option value="ESCALADE">Escaladé</option>
        </select>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>

      <div class="tickets-grid" *ngIf="!loading">
        <div *ngFor="let ticket of filteredTickets" class="ticket-card">
          <div class="ticket-header">
            <span class="ticket-numero">{{ ticket.numeroTicket }}</span>
            <span [class]="'badge badge-' + getStatusClass(ticket.statut!)">
              {{ ticket.statut }}
            </span>
          </div>
          <h3>{{ ticket.titre }}</h3>
          <p class="description">{{ ticket.description }}</p>
          <div class="ticket-meta">
            <span class="meta-item">Type: {{ ticket.type }}</span>
            <span class="meta-item">Priorité: {{ ticket.priorite }}</span>
          </div>
          <div class="ticket-footer">
            <span class="date">{{ formatDate(ticket.dateCreation!) }}</span>
            <button class="btn btn-sm" (click)="viewTicket(ticket.id!)">
              Voir détails
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && filteredTickets.length === 0" class="no-tickets">
        <p>Aucun ticket trouvé</p>
      </div>
    </div>
  `,
  styles: [`
    .ticket-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      color: #1976d2;
      margin: 0;
    }

    .filters {
      margin-bottom: 2rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      max-width: 300px;
    }

    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .ticket-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .ticket-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ticket-numero {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-OUVERT { background: #e3f2fd; color: #1976d2; }
    .badge-EN_COURS { background: #fff3e0; color: #f57c00; }
    .badge-RESOLU { background: #f3e5f5; color: #7b1fa2; }
    .badge-CLOS { background: #e8f5e9; color: #388e3c; }
    .badge-ESCALADE { background: #ffebee; color: #d32f2f; }

    h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }

    .description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .ticket-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #666;
    }

    .ticket-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .date {
      color: #999;
      font-size: 0.85rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #1976d2;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      background-color: #f5f5f5;
      color: #333;
      font-size: 0.85rem;
    }

    .btn-sm:hover {
      background-color: #e0e0e0;
    }

    .loading, .no-tickets {
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
      border: 1px solid #ef5350;
    }
  `]
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  filterStatus: string = '';
  loading = false;
  error = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = '';

    this.ticketService.getMesTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
        this.error = 'Erreur lors du chargement des tickets';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatus) {
      this.filteredTickets = this.tickets.filter(
        t => t.statut === this.filterStatus
      );
    } else {
      this.filteredTickets = this.tickets;
    }
  }

  getStatusClass(status: string): string {
    return status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  viewTicket(id: number): void {
    this.router.navigate(['/tickets', id]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/tickets/create']);
  }
}
