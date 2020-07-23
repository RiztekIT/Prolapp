import { Injectable } from '@angular/core';
import { Session } from '../../Models/session-model';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/Models/catalogos/usuarios-model';
import { sessionCliente } from '../../Models/ClienteLogin/sessionCliente-model';
import { ClienteLogin } from '../../Models/ClienteLogin/clienteLogin-model';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  inicioCliente:boolean;

  private localStorageService;
  private currentSession : Session = null;
  private currentSessionCliente : sessionCliente = null;
  
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

  //login para clientes

  setCurrentSessionCliente(session: sessionCliente): void {
    this.currentSessionCliente = session;
    this.localStorageService.setItem('ProlappSessionCliente', JSON.stringify(session));
  }

  loadSessionDataCliente(): sessionCliente{
    var sessionStr = this.localStorageService.getItem('ProlappSessionCliente');
    return (sessionStr) ? <sessionCliente> JSON.parse(sessionStr) : null;
  }

  getCurrentSessionCliente(): sessionCliente {
    return this.currentSessionCliente;
  }
  removeCurrentSessionCliente(): void {
    this.localStorageService.removeItem('ProlappSessionCliente');
    localStorage.removeItem('ClienteId');
    localStorage.removeItem('inicioCliente');
    console.log(localStorage.removeItem('ProlappSessionCliente'));
    console.log(localStorage.removeItem('ClienteId'));
    console.log(localStorage.removeItem('inicioCliente'));
    this.currentSessionCliente = null;
  }
  getCurrentUserCliente(): ClienteLogin {
    var session: sessionCliente = this.getCurrentSessionCliente();
    return (session && session.user) ? session.user : null;
  };
  isAuthenticatedCliente(): boolean {    
    return (this.getCurrentTokenCliente() != null) ? true : false;
  };
  getCurrentTokenCliente(): string {
    var session = this.getCurrentSession();
    console.log(session);
    
    return (session && session.token) ? session.token : null;
  };

  logoutCliente(): void{
    this.removeCurrentSessionCliente();
    this.router.navigate(['/logincliente']);
  }
}
