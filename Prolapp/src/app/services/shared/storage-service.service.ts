import { Injectable } from '@angular/core';
import { Session } from '../../Models/session-model';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/Models/catalogos/usuarios-model';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  private localStorageService;
  private currentSession : Session = null;

  constructor(private router: Router) { 
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('ProlappSession', JSON.stringify(session));
  }
  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem('ProlappSession');
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }
  getCurrentSession(): Session {
    return this.currentSession;
  }
  removeCurrentSession(): void {
    this.localStorageService.removeItem('ProlappSession');
    this.currentSession = null;
  }
  getCurrentUser(): Usuario {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };
  isAuthenticated(): boolean {    
    return (this.getCurrentToken() != null) ? true : false;
  };
  getCurrentToken(): string {
    var session = this.getCurrentSession();
    console.log(session);
    
    return (session && session.token) ? session.token : null;
  };
  logout(): void{
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
}
