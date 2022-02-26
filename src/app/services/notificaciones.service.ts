import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { Notificaciones } from '../Models/Notificaciones/notificaciones-model';
import { DetalleNotificacion } from '../Models/Notificaciones/detalleNoticacion-model';




@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) { }

  APIUrl = environment.APIUrl;

   
   getNotificaciones(): Observable<Notificaciones[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Notificaciones[]>(this.APIUrl + '/Notificaciones');    
  }
   getDetallesNotificacion(): Observable<DetalleNotificacion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleNotificacion[]>(this.APIUrl + '/Notificaciones/GetDetalleNotificacion');    
  }
   getNotificacionId(id: number): Observable<Notificaciones[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Notificaciones[]>(this.APIUrl + '/Notificaciones/GetNotificacionId/'+id);    
  }
   getDetalleNotificacionId(id: number): Observable<DetalleNotificacion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleNotificacion[]>(this.APIUrl + '/Notificaciones/GetDetalleNotificacionId/'+id);    
  }
   getDetalleNotificacionIdUsuario(id: number): Observable<DetalleNotificacion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleNotificacion[]>(this.APIUrl + '/Notificaciones/GetDetalleNotificacionIdUsuario/'+id);    
  }
   getDetalleNotificacionIdUsuarioBandera(id: number, bandera: number): Observable<DetalleNotificacion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleNotificacion[]>(this.APIUrl + '/Notificaciones/GetDetalleNotificacionIdUsuarioBandera/'+id+'/'+bandera);    
  }

  addNotificacion(noti: Notificaciones){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Notificaciones', noti)
  }
  updateNotificacion(noti: Notificaciones){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Notificaciones', noti)
  }  
  deleteNotificacion(id: number) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Notificaciones/BorrarNotificacion/' + id)
  }
  addDetalleNotificacion(noti: DetalleNotificacion){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Notificaciones/AddDetalleNotificacion', noti)
  }
  updateDetalleNotificacion(noti: Notificaciones){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Notificaciones/UpdateDetalleNotificacion', noti)
  }  
  deleteDetalleNotificacion(id: number) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Notificaciones/BorrarDetalleNotificacion/' + id)
  }

    // ! MENSAJES

    mensajesData: any = [];

    GetNotificacionJNDetalleNotificacionIdUsuario(id: number){
      this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Notificaciones/GetNotificacionJNDetalleNotificacionIdUsuario/'+id); 
    }

    GetMensajesLogIdDestinoIdUsuario(idDestino: number, idUsuario:number){
      this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Notificaciones/GetMensajesLogIdDestinoIdUsuario/'+idDestino+ '/' + idUsuario); 
    }


    private _listeners = new Subject<any>(); 
    listen(): Observable<any> {
      return this._listeners.asObservable();
    }
    filter(filterBy: string) {
      this._listeners.next(filterBy);
    }

}
