import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TicketService, TicketStatistics, Ticket } from '../../services/ticket.service';

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  actif: boolean;
  roles: any[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>🔐 Administration - Dashboard</h2>
        <button class="btn btn-secondary" (click)="goToDashboard()">← Retour</button>
      </div>

      <!-- Onglets -->
      <div class="tabs">
        <button 
          [class]="activeTab === 'stats' ? 'tab active' : 'tab'"
          (click)="activeTab = 'stats'"
        >
          📊 Tableau de bord
        </button>
        <button 
          [class]="activeTab === 'tickets' ? 'tab active' : 'tab'"
          (click)="activeTab = 'tickets'; loadTickets()"
        >
          🎫 Gestion des tickets
        </button>
        <button 
          [class]="activeTab === 'users' ? 'tab active' : 'tab'"
          (click)="activeTab = 'users'"
        >
          👥 Gestion des comptes
        </button>
        <button 
          [class]="activeTab === 'notifications' ? 'tab active' : 'tab'"
          (click)="activeTab = 'notifications'"
        >
          🔔 Notifications
        </button>
      </div>

      <!-- 3. TABLEAU DE BORD -->
      <div *ngIf="activeTab === 'stats'" class="tab-content">
        <div class="stats-grid" *ngIf="statistics">
          <div class="stat-card">
            <h3>{{ statistics.totalTickets }}</h3>
            <p>📝 Total Tickets</p>
          </div>
          <div class="stat-card">
            <h3>{{ statistics.ticketsOuverts }}</h3>
            <p>📂 Ouverts</p>
          </div>
          <div class="stat-card">
            <h3>{{ statistics.ticketsEnCours }}</h3>
            <p>⚙️ En cours</p>
          </div>
          <div class="stat-card">
            <h3>{{ statistics.ticketsClos }}</h3>
            <p>✅ Clôturés</p>
          </div>
          <div class="stat-card">
            <h3>{{ statistics.ticketsEscalades }}</h3>
            <p>🔺 Escaladés</p>
          </div>
          <div class="stat-card">
            <h3>{{ statistics.tempsResolutionMoyen.toFixed(1) }}h</h3>
            <p>⏱️ Temps moyen</p>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-card">
            <h4>Distribution par type</h4>
            <div *ngIf="statistics">
              <div *ngFor="let item of getObjectEntries(statistics.ticketsParType)" class="chart-bar">
                <span class="chart-label">{{ item.key }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="(item.value / statistics.totalTickets) * 100">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h4>Distribution par priorité</h4>
            <div *ngIf="statistics">
              <div *ngFor="let item of getObjectEntries(statistics.ticketsParPriorite)" class="chart-bar">
                <span class="chart-label">{{ item.key }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="(item.value / statistics.totalTickets) * 100">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. EXPORTER LES TICKETS + 2. ASSIGNER/RÉASSIGNER -->
      <div *ngIf="activeTab === 'tickets'" class="tab-content">
        <div class="section-header">
          <h3>Gestion des Tickets</h3>
          <button class="btn btn-success" (click)="exportTickets()">
            📥 Exporter les tickets (CSV)
          </button>
        </div>

        <div class="tickets-table" *ngIf="allTickets.length > 0">
          <table>
            <thead>
              <tr>
                <th>N° Ticket</th>
                <th>Titre</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Créateur</th>
                <th>Assigné à</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ticket of allTickets">
                <td>{{ ticket.numeroTicket }}</td>
                <td>{{ ticket.titre }}</td>
                <td>
                  <span [class]="'badge badge-' + ticket.statut">{{ ticket.statut }}</span>
                </td>
                <td>{{ ticket.priorite }}</td>
                <td>{{ ticket.createur?.prenom }} {{ ticket.createur?.nom }}</td>
                <td>
                  <span *ngIf="ticket.assigneA">
                    {{ ticket.assigneA.prenom }} {{ ticket.assigneA.nom }}
                  </span>
                  <span *ngIf="!ticket.assigneA" class="text-muted">Non assigné</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-primary" (click)="openAssignModal(ticket)">
                    {{ ticket.assigneA ? '🔄 Réassigner' : '➕ Assigner' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="allTickets.length === 0" class="no-data">
          <p>Aucun ticket disponible</p>
        </div>
      </div>

      <!-- 4. DÉSACTIVER LES COMPTES + 5. GÉRER LES COMPTES ET RÔLES -->
      <div *ngIf="activeTab === 'users'" class="tab-content">
        <div class="section-header">
          <h3>Gestion des Utilisateurs</h3>
          <button class="btn btn-primary" (click)="showCreateUserModal()">
            ➕ Créer un utilisateur
          </button>
        </div>

        <div class="users-table" *ngIf="users.length > 0">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Rôles</th>
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
                  <span *ngFor="let role of user.roles" class="role-badge">
                    {{ getRoleLabel(role.name) }}
                  </span>
                </td>
                <td>
                  <span [class]="user.actif ? 'badge-success' : 'badge-danger'">
                    {{ user.actif ? '✅ Actif' : '❌ Inactif' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm" 
                    (click)="toggleUserStatus(user)"
                    [class.btn-danger]="user.actif"
                    [class.btn-success]="!user.actif"
                  >
                    {{ user.actif ? '🚫 Désactiver' : '✅ Activer' }}
                  </button>
                  <button 
                    class="btn btn-sm btn-secondary" 
                    (click)="openRoleModal(user)"
                    style="margin-left: 0.5rem;"
                  >
                    🔧 Modifier rôles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 6. PARAMÉTRER LES NOTIFICATIONS -->
      <div *ngIf="activeTab === 'notifications'" class="tab-content">
        <div class="section-header">
          <h3>Paramètres des Notifications</h3>
        </div>

        <div class="notification-settings">
          <div class="setting-card">
            <h4>📧 Notifications par email</h4>
            <div class="setting-option">
              <label>
                <input type="checkbox" [(ngModel)]="notifSettings.emailOnCreate" (change)="saveNotifSettings()">
                Notifier lors de la création d'un ticket
              </label>
            </div>
            <div class="setting-option">
              <label>
                <input type="checkbox" [(ngModel)]="notifSettings.emailOnStatusChange" (change)="saveNotifSettings()">
                Notifier lors du changement de statut
              </label>
            </div>
            <div class="setting-option">
              <label>
                <input type="checkbox" [(ngModel)]="notifSettings.emailOnAssignment" (change)="saveNotifSettings()">
                Notifier lors de l'assignation
              </label>
            </div>
            <div class="setting-option">
              <label>
                <input type="checkbox" [(ngModel)]="notifSettings.emailOnComment" (change)="saveNotifSettings()">
                Notifier lors d'un nouveau commentaire
              </label>
            </div>
          </div>

          <div class="setting-card">
            <h4>⏰ Fréquence des notifications</h4>
            <div class="setting-option">
              <label>
                <input type="radio" name="frequency" value="instant" [(ngModel)]="notifSettings.frequency" (change)="saveNotifSettings()">
                Instantané
              </label>
            </div>
            <div class="setting-option">
              <label>
                <input type="radio" name="frequency" value="hourly" [(ngModel)]="notifSettings.frequency" (change)="saveNotifSettings()">
                Toutes les heures
              </label>
            </div>
            <div class="setting-option">
              <label>
                <input type="radio" name="frequency" value="daily" [(ngModel)]="notifSettings.frequency" (change)="saveNotifSettings()">
                Quotidien
              </label>
            </div>
          </div>

          <div class="alert alert-info">
            ℹ️ Les paramètres de notification sont sauvegardés automatiquement
          </div>
        </div>
      </div>

      <!-- Modal pour assigner un ticket -->
      <div class="modal-overlay" *ngIf="showAssignModal" (click)="closeAssignModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ selectedTicket?.assigneA ? 'Réassigner' : 'Assigner' }} le ticket</h3>
            <button class="close-btn" (click)="closeAssignModal()">✕</button>
          </div>
          <div class="modal-body">
            <p><strong>Ticket:</strong> {{ selectedTicket?.numeroTicket }} - {{ selectedTicket?.titre }}</p>
            <div class="form-group">
              <label>Sélectionner un agent:</label>
              <select [(ngModel)]="selectedAgentId" class="form-control">
                <option value="">-- Choisir un agent --</option>
                <option *ngFor="let agent of agents" [value]="agent.id">
                  {{ agent.prenom }} {{ agent.nom }} ({{ agent.email }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeAssignModal()">Annuler</button>
            <button 
              class="btn btn-primary" 
              (click)="confirmAssignment()"
              [disabled]="!selectedAgentId"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>

      <!-- Modal pour modifier les rôles -->
      <div class="modal-overlay" *ngIf="showRoleModal" (click)="closeRoleModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Modifier les rôles</h3>
            <button class="close-btn" (click)="closeRoleModal()">✕</button>
          </div>
          <div class="modal-body">
            <p><strong>Utilisateur:</strong> {{ selectedUser?.email }}</p>
            <div class="form-group">
              <div *ngFor="let role of availableRoles" class="role-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    [checked]="isRoleSelected(role.name)"
                    (change)="toggleRole(role.name)"
                  >
                  {{ getRoleLabel(role.name) }} - {{ role.description }}
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeRoleModal()">Annuler</button>
            <button class="btn btn-primary" (click)="saveUserRoles()">
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <!-- Modal pour créer un utilisateur -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="closeCreateModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Créer un nouvel utilisateur</h3>
            <button class="close-btn" (click)="closeCreateModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="newUser.email" class="form-control" placeholder="email@example.com">
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" [(ngModel)]="newUser.nom" class="form-control" placeholder="Nom">
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" [(ngModel)]="newUser.prenom" class="form-control" placeholder="Prénom">
            </div>
            <div class="form-group">
              <label>Mot de passe *</label>
              <input type="password" [(ngModel)]="newUser.password" class="form-control" placeholder="••••••••">
            </div>
            <div *ngIf="createError" class="alert alert-error">{{ createError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeCreateModal()">Annuler</button>
            <button class="btn btn-primary" (click)="createUser()">
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
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

    h2 {
      color: #2c3e50;
      margin: 0;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .tab {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .tab:hover {
      color: #2c3e50;
      background: #f5f5f5;
    }

    .tab.active {
      color: #3498db;
      border-bottom-color: #3498db;
      font-weight: 600;
    }

    .tab-content {
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
      border-radius: 12px;
      color: white;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .stat-card h3 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
    }

    .stat-card p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .chart-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-card h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .chart-bar {
      margin-bottom: 1rem;
    }

    .chart-label {
      display: inline-block;
      width: 120px;
      font-size: 0.9rem;
      color: #555;
    }

    .progress-bar {
      display: inline-block;
      width: calc(100% - 130px);
      height: 30px;
      background: #f0f0f0;
      border-radius: 15px;
      overflow: hidden;
      vertical-align: middle;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.85rem;
      transition: width 0.5s;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    thead {
      background: #3498db;
      color: white;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    tbody tr:hover {
      background: #f5f5f5;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-OUVERT {
      background: #3498db;
      color: white;
    }

    .badge-EN_COURS {
      background: #f39c12;
      color: white;
    }

    .badge-RESOLU, .badge-CLOTURE {
      background: #2ecc71;
      color: white;
    }

    .badge-ESCALADE {
      background: #e74c3c;
      color: white;
    }

    .badge-success {
      background: #2ecc71;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .badge-danger {
      background: #e74c3c;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .role-badge {
      display: inline-block;
      background: #9b59b6;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }

    .text-muted {
      color: #999;
      font-style: italic;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #999;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .notification-settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .setting-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .setting-card h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .setting-option {
      margin-bottom: 1rem;
    }

    .setting-option label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .setting-option input[type="checkbox"],
    .setting-option input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .alert-info {
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
    }

    .alert-error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      animation: slideUp 0.3s;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f0f0f0;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .role-checkbox {
      margin-bottom: 1rem;
    }

    .role-checkbox label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .role-checkbox label:hover {
      background: #f5f5f5;
    }

    .role-checkbox input[type="checkbox"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #7f8c8d;
    }

    .btn-success {
      background: #2ecc71;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #27ae60;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c0392b;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  statistics: TicketStatistics | null = null;
  users: User[] = [];
  allTickets: Ticket[] = [];
  agents: User[] = [];
  availableRoles: Role[] = [];

  // Tab management
  activeTab: 'stats' | 'tickets' | 'users' | 'notifications' = 'stats';

  // Modal states
  showAssignModal = false;
  showRoleModal = false;
  showCreateModal = false;

  selectedTicket: Ticket | null = null;
  selectedAgentId: string = '';
  selectedUser: User | null = null;
  selectedRoles: string[] = [];

  newUser = {
    email: '',
    nom: '',
    prenom: '',
    password: ''
  };
  createError = '';

  // Notification settings
  notifSettings = {
    emailOnCreate: true,
    emailOnStatusChange: true,
    emailOnAssignment: true,
    emailOnComment: false,
    frequency: 'instant'
  };

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private ticketService: TicketService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStatistics();
    this.loadUsers();
    this.loadAgents();
    this.loadRoles();
    this.loadNotifSettings();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Statistics
  loadStatistics() {
    this.ticketService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (error) => {
        console.error('Erreur chargement statistiques:', error);
      }
    });
  }

  getObjectEntries(obj: any): Array<{key: string, value: number}> {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: value as number
    }));
  }

  // Users management
  loadUsers() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>(`${this.apiUrl}/admin/users`, { headers }).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs:', error);
      }
    });
  }

  toggleUserStatus(user: User) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(
      `${this.apiUrl}/admin/users/${user.id}/toggle-active`,
      {},
      { headers }
    ).subscribe({
      next: () => {
        user.actif = !user.actif;
        alert(`Utilisateur ${user.actif ? 'activé' : 'désactivé'} avec succès`);
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la modification du statut');
      }
    });
  }

  // Tickets management
  loadTickets() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Ticket[]>(`${this.apiUrl}/tickets/all`, { headers }).subscribe({
      next: (data) => {
        this.allTickets = data;
      },
      error: (error) => {
        console.error('Erreur chargement tickets:', error);
      }
    });
  }

  loadAgents() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>(`${this.apiUrl}/admin/users/agents`, { headers }).subscribe({
      next: (data) => {
        this.agents = data;
      },
      error: (error) => {
        console.error('Erreur chargement agents:', error);
      }
    });
  }

  openAssignModal(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.selectedAgentId = ticket.assigneA?.id?.toString() || '';
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.selectedTicket = null;
    this.selectedAgentId = '';
  }

  confirmAssignment() {
    if (!this.selectedTicket || !this.selectedAgentId) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(
      `${this.apiUrl}/tickets/${this.selectedTicket.id}/assign/${this.selectedAgentId}`,
      {},
      { headers }
    ).subscribe({
      next: () => {
        alert('Ticket assigné avec succès');
        this.closeAssignModal();
        this.loadTickets();
      },
      error: (error) => {
        console.error('Erreur assignation:', error);
        alert('Erreur lors de l\'assignation du ticket');
      }
    });
  }

  exportTickets() {
    const token = localStorage.getItem('token');
    
    this.http.get(`${this.apiUrl}/tickets/export`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      responseType: 'text'
    }).subscribe({
      next: (csv) => {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `tickets_export_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Export réussi!');
      },
      error: (error) => {
        console.error('Erreur export:', error);
        alert('Erreur lors de l\'export des tickets');
      }
    });
  }

  // Roles management
  loadRoles() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Role[]>(`${this.apiUrl}/admin/roles`, { headers }).subscribe({
      next: (data) => {
        this.availableRoles = data;
      },
      error: (error) => {
        console.error('Erreur chargement rôles:', error);
        // Fallback to hardcoded roles
        this.availableRoles = [
          { id: 1, name: 'ROLE_CITOYEN', description: 'Utilisateur citoyen' },
          { id: 2, name: 'ROLE_AGENT_SUPPORT', description: 'Agent de support' },
          { id: 3, name: 'ROLE_AGENT_TRAITEMENT', description: 'Agent de traitement' },
          { id: 4, name: 'ROLE_ADMIN_SUPPORT', description: 'Administrateur' }
        ];
      }
    });
  }

  openRoleModal(user: User) {
    this.selectedUser = user;
    this.selectedRoles = user.roles.map(r => r.name);
    this.showRoleModal = true;
  }

  closeRoleModal() {
    this.showRoleModal = false;
    this.selectedUser = null;
    this.selectedRoles = [];
  }

  isRoleSelected(roleName: string): boolean {
    return this.selectedRoles.includes(roleName);
  }

  toggleRole(roleName: string) {
    const index = this.selectedRoles.indexOf(roleName);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(roleName);
    }
  }

  saveUserRoles() {
    if (!this.selectedUser) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(
      `${this.apiUrl}/admin/users/${this.selectedUser.id}/roles`,
      this.selectedRoles,
      { headers }
    ).subscribe({
      next: () => {
        alert('Rôles mis à jour avec succès');
        this.closeRoleModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur mise à jour rôles:', error);
        alert('Erreur lors de la mise à jour des rôles');
      }
    });
  }

  getRoleLabel(roleName: string): string {
    const labels: { [key: string]: string } = {
      'ROLE_CITOYEN': 'Citoyen',
      'ROLE_AGENT_SUPPORT': 'Agent Support',
      'ROLE_AGENT_TRAITEMENT': 'Agent Traitement',
      'ROLE_ADMIN_SUPPORT': 'Administrateur'
    };
    return labels[roleName] || roleName;
  }

  // Create user
  showCreateUserModal() {
    this.newUser = { email: '', nom: '', prenom: '', password: '' };
    this.createError = '';
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createUser() {
    if (!this.newUser.email || !this.newUser.nom || !this.newUser.prenom || !this.newUser.password) {
      this.createError = 'Tous les champs sont obligatoires';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.apiUrl}/admin/users`, this.newUser, { headers }).subscribe({
      next: () => {
        alert('Utilisateur créé avec succès');
        this.closeCreateModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur création utilisateur:', error);
        this.createError = error.error?.message || 'Erreur lors de la création de l\'utilisateur';
      }
    });
  }

  // Notification settings
  loadNotifSettings() {
    const saved = localStorage.getItem('notifSettings');
    if (saved) {
      this.notifSettings = JSON.parse(saved);
    }
  }

  saveNotifSettings() {
    localStorage.setItem('notifSettings', JSON.stringify(this.notifSettings));
    // You can also send to backend here if needed
  }
}
