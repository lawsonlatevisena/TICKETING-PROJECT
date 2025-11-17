import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id?: number;
  numeroTicket?: string;
  titre: string;
  description: string;
  type: string;
  statut?: string;
  priorite: string;
  categorie?: string;
  createur?: UserSummary;
  assigneA?: UserSummary;
  dateCreation?: string;
  dateModification?: string;
  dateCloture?: string;
  resolution?: string;
}

export interface UserSummary {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface TicketStatistics {
  totalTickets: number;
  ticketsOuverts: number;
  ticketsEnCours: number;
  ticketsClos: number;
  ticketsEscalades: number;
  ticketsParType: { [key: string]: number };
  ticketsParPriorite: { [key: string]: number };
  ticketsParCategorie: { [key: string]: number };
  tempsResolutionMoyen: number;
  ticketsCeJour: number;
  ticketsCetteSemaine: number;
  ticketsCeMois: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = '/api/tickets';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/create`, ticket, {
      headers: this.getHeaders()
    });
  }

  getMesTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/mes-tickets`, {
      headers: this.getHeaders()
    });
  }

  getMesAssignations(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/mes-assignations`, {
      headers: this.getHeaders()
    });
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getTicketByNumero(numeroTicket: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/numero/${numeroTicket}`, {
      headers: this.getHeaders()
    });
  }

  updateTicketStatus(id: number, status: string, commentaire?: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}/status`, 
      { status, commentaire }, 
      { headers: this.getHeaders() }
    );
  }

  assignTicket(ticketId: number, agentId: number): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${ticketId}/assign/${agentId}`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }

  addComment(ticketId: number, contenu: string, isInternal: boolean = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/comment`, 
      { contenu, isInternal }, 
      { headers: this.getHeaders() }
    );
  }

  escaladeTicket(id: number, commentaire?: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}/escalade`, 
      { commentaire }, 
      { headers: this.getHeaders() }
    );
  }

  reopenTicket(id: number, commentaire?: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}/reopen`, 
      { commentaire }, 
      { headers: this.getHeaders() }
    );
  }

  cloturerTicket(id: number, resolution: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}/cloturer`, 
      { resolution }, 
      { headers: this.getHeaders() }
    );
  }

  getStatistics(): Observable<TicketStatistics> {
    return this.http.get<TicketStatistics>(`${this.apiUrl}/statistics`, {
      headers: this.getHeaders()
    });
  }

  exportTickets(format: string = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export?format=${format}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
