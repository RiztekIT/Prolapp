import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { Notificaciones } from '../Models/Notificaciones/notificaciones-model';
import { DetalleNotificacion } from '../Models/Notificaciones/detalleNoticacion-model';

// export const APIUrl = environment.APIUrl;
 export const APIUrl = "https://localhost:44361/api";
// export const APIUrl = "https://localhost:44361/api";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) { }

   
   getNotificaciones(): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(APIUrl + '/Notificaciones');    
  }
   getDetallesNotificacion(): Observable<DetalleNotificacion[]> {
    return this.http.get<DetalleNotificacion[]>(APIUrl + '/Notificaciones/GetDetalleNotificacion');    
  }
   getNotificacionId(id: number): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(APIUrl + '/Notificaciones/GetNotificacionId/'+id);    
  }
   getDetalleNotificacionId(id: number): Observable<DetalleNotificacion[]> {
    return this.http.get<DetalleNotificacion[]>(APIUrl + '/Notificaciones/GetDetalleNotificacionId/'+id);    
  }
   getDetalleNotificacionIdUsuario(id: number): Observable<DetalleNotificacion[]> {
    return this.http.get<DetalleNotificacion[]>(APIUrl + '/Notificaciones/GetDetalleNotificacionIdUsuario/'+id);    
  }
   getDetalleNotificacionIdUsuarioBandera(id: number, bandera: number): Observable<DetalleNotificacion[]> {
    return this.http.get<DetalleNotificacion[]>(APIUrl + '/Notificaciones/GetDetalleNotificacionIdUsuarioBandera/'+id+'/'+bandera);    
  }

  addNotificacion(noti: Notificaciones){
    return this.http.post(APIUrl + '/Notificaciones', noti)
  }
  updateNotificacion(noti: Notificaciones){
    return this.http.put(APIUrl + '/Notificaciones', noti)
  }  
  deleteNotificacion(id: number) {
    return this.http.delete(APIUrl + '/Notificaciones/BorrarNotificacion/' + id)
  }
  addDetalleNotificacion(noti: DetalleNotificacion){
    return this.http.post(APIUrl + '/Notificaciones/AddDetalleNotificacion', noti)
  }
  updateDetalleNotificacion(noti: Notificaciones){
    return this.http.put(APIUrl + '/Notificaciones/UpdateDetalleNotificacion', noti)
  }  
  deleteDetalleNotificacion(id: number) {
    return this.http.delete(APIUrl + '/Notificaciones/BorrarDetalleNotificacion/' + id)
  }

    // ! MENSAJES

    mensajesData: any = [];

    GetNotificacionJNDetalleNotificacionIdUsuario(id: number){
    return this.http.get<any[]>(APIUrl + '/Notificaciones/GetNotificacionJNDetalleNotificacionIdUsuario/'+id); 
    }

    GetMensajesLogIdDestinoIdUsuario(idDestino: number, idUsuario:number){
    return this.http.get<any[]>(APIUrl + '/Notificaciones/GetMensajesLogIdDestinoIdUsuario/'+idDestino+ '/' + idUsuario); 
    }


    private _listeners = new Subject<any>(); 
    listen(): Observable<any> {
      return this._listeners.asObservable();
    }
    filter(filterBy: string) {
      this._listeners.next(filterBy);
    }

}
