import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        <p class="subtitle">Système de Gestion des Tickets - Ministère de la Justice</p>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="credentials.email" 
              required 
              email
              placeholder="votre.email@justice.gov"
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="credentials.password" 
              required
              placeholder="Votre mot de passe"
              class="form-control"
            >
          </div>
          
          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>
          
          <div *ngIf="loading" class="alert alert-info">
            Connexion en cours...
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!loginForm.valid || loading"
          >
            Se connecter
          </button>
        </form>
        
        <div class="test-accounts">
          <p><strong>Compte de test:</strong></p>
          <p>Email: admin&#64;justice.gov</p>
          <p>Mot de passe: Admin&#64;123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem;
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      color: #1976d2;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
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
    }
    
    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25,118,210,0.1);
    }
    
    .btn {
      width: 100%;
      padding: 0.75rem;
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
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .alert {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }
    
    .alert-info {
      background-color: #e3f2fd;
      color: #1565c0;
      border: 1px solid #42a5f5;
    }
    
    .test-accounts {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    
    .test-accounts p {
      margin: 0.25rem 0;
      color: #666;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        this.error = err.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
      }
    });
  }
}
