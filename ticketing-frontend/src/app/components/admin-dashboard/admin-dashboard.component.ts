import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TicketService, TicketStatistics } from '../../services/ticket.service';

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  actif: boolean;
  roles: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Administration</h2>

      <div class="stats-grid" *ngIf="statistics">
        <div class="stat-card">
          <h3>{{ statistics.totalTickets }}</h3>
          <p>Total Tickets</p>
        </div>
        <div class="stat-card">
          <h3>{{ statistics.ticketsOuverts }}</h3>
          <p>Ouverts</p>
        </div>
        <div class="stat-card">
          <h3>{{ statistics.ticketsEnCours }}</h3>
          <p>En cours</p>
        </div>
        <div class="stat-card">
          <h3>{{ statistics.ticketsClos }}</h3>
          <p>Clôturés</p>
        </div>
        <div class="stat-card">
          <h3>{{ statistics.ticketsEscalades }}</h3>
          <p>Escaladés</p>
        </div>
        <div class="stat-card">
          <h3>{{ statistics.tempsResolutionMoyen.toFixed(1) }}h</h3>
          <p>Temps moyen</p>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>Gestion des utilisateurs</h3>
          <button class="btn btn-primary" (click)="exportTickets()">
            Exporter les tickets
          </button>
        </div>

        <div class="users-table" *ngIf="users.length > 0">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.email }}</td>
                <td>{{ user.nom }}</td>
                <td>{{ user.prenom }}</td>
                <td>
                  <span [class]="user.actif ? 'badge-success' : 'badge-danger'">
                    {{ user.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm" 
                    (click)="toggleUserStatus(user)"
                  >
                    {{ user.actif ? 'Désactiver' : 'Activer' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 2rem;
    }

    h3 {
      margin: 0;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-card h3 {
      color: #1976d2;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .stat-card p {
      color: #666;
      margin: 0;
      font-size: 0.9rem;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .users-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 1rem;
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    .badge-success {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .badge-danger {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background-color: #ffebee;
      color: #c62828;
      border-radius: 12px;
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
  `]
})
export class AdminDashboardComponent implements OnInit {
  statistics: TicketStatistics | null = null;
  users: User[] = [];

  constructor(
    private ticketService: TicketService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUsers();
  }

  loadStatistics(): void {
    this.ticketService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      }
    });
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<User[]>('/api/admin/users', { headers }).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  toggleUserStatus(user: User): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put(`/api/admin/users/${user.id}/toggle-active`, {}, { headers })
      .subscribe({
        next: () => {
          user.actif = !user.actif;
        },
        error: (err) => {
          console.error('Error toggling user status:', err);
        }
      });
  }

  exportTickets(): void {
    this.ticketService.exportTickets('csv').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tickets-export.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting tickets:', err);
      }
    });
  }
}
