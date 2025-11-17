import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-card">
        <h2>Bienvenue, {{ user?.prenom }} {{ user?.nom }}</h2>
        <p>Email: {{ user?.email }}</p>
        <p>Rôles: {{ user?.roles.join(', ') }}</p>
        
        <div class="nav-buttons">
          <button class="btn btn-primary" (click)="navigateToTickets()">
            Mes Tickets
          </button>
          <button 
            *ngIf="isAdmin()" 
            class="btn btn-secondary" 
            (click)="navigateToAdmin()"
          >
            Administration
          </button>
        </div>
        
        <button class="btn btn-danger" (click)="logout()">
          Déconnexion
        </button>
      </div>
      
      <div class="info-card">
        <h3>✅ Système opérationnel</h3>
        <ul>
          <li>✅ Backend Spring Boot 3.3.6 connecté (PostgreSQL)</li>
          <li>✅ Authentification JWT fonctionnelle</li>
          <li>✅ Frontend Angular 17</li>
          <li>✅ Gestion complète des tickets</li>
          <li>✅ Dashboard administrateur</li>
          <li>✅ Notifications et historique</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .welcome-card, .info-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    h2 {
      color: #1976d2;
      margin-bottom: 1rem;
    }
    
    h3 {
      color: #2e7d32;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      margin: 0.5rem 0;
    }
    
    ul {
      margin-top: 1rem;
      padding-left: 1.5rem;
    }
    
    li {
      margin: 0.5rem 0;
      color: #666;
    }
    
    .nav-buttons {
      display: flex;
      gap: 1rem;
      margin: 1.5rem 0;
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
    
    .btn-primary:hover {
      background-color: #1565c0;
    }
    
    .btn-secondary {
      background-color: #7b1fa2;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #6a1b9a;
    }
    
    .btn-danger {
      background-color: #d32f2f;
      color: white;
      margin-top: 1rem;
    }
    
    .btn-danger:hover {
      background-color: #c62828;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.user = user;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToTickets(): void {
    this.router.navigate(['/tickets']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.user?.roles?.includes('ROLE_ADMIN_SUPPORT');
  }
}
