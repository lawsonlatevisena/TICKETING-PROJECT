import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-ticket-container">
      <div class="create-card">
        <h2>Créer un nouveau ticket</h2>
        
        <form (ngSubmit)="onSubmit()" #ticketForm="ngForm">
          <div class="form-group">
            <label for="titre">Titre *</label>
            <input 
              type="text" 
              id="titre" 
              name="titre"
              [(ngModel)]="ticket.titre" 
              required
              class="form-control"
              placeholder="Titre du ticket"
            >
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="ticket.description" 
              required
              rows="5"
              class="form-control"
              placeholder="Description détaillée du problème"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="type">Type *</label>
              <select 
                id="type" 
                name="type"
                [(ngModel)]="ticket.type" 
                required
                class="form-control"
              >
                <option value="RECLAMATION">Réclamation</option>
                <option value="INCIDENT">Incident</option>
                <option value="DEMANDE">Demande</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priorite">Priorité *</label>
              <select 
                id="priorite" 
                name="priorite"
                [(ngModel)]="ticket.priorite" 
                required
                class="form-control"
              >
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
                <option value="CRITIQUE">Critique</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="categorie">Catégorie</label>
            <input 
              type="text" 
              id="categorie" 
              name="categorie"
              [(ngModel)]="ticket.categorie" 
              class="form-control"
              placeholder="Ex: Casier judiciaire, Certificat de nationalité..."
            >
          </div>

          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>

          <div *ngIf="success" class="alert alert-success">
            {{ success }}
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="goBack()"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="!ticketForm.valid || submitting"
            >
              {{ submitting ? 'Création...' : 'Créer le ticket' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-ticket-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .create-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h2 {
      color: #1976d2;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
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
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

    .alert-success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #66bb6a;
    }
  `]
})
export class CreateTicketComponent {
  ticket: Ticket = {
    titre: '',
    description: '',
    type: 'RECLAMATION',
    priorite: 'MOYENNE',
    categorie: ''
  };

  error = '';
  success = '';
  submitting = false;

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.submitting = true;

    this.ticketService.createTicket(this.ticket).subscribe({
      next: (response) => {
        this.success = 'Ticket créé avec succès!';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/tickets']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        this.error = err.error?.message || 'Erreur lors de la création du ticket';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
