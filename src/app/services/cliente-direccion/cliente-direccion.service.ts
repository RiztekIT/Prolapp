import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ClienteDireccion } from '../../Models/cliente-direccion/clienteDireccion-model';
import {Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteDireccionService {

  constructor(private http:HttpClient) { }
 
  
  formData = new ClienteDireccion();

  IdCliente: number;

  readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  //Obtener list Clientes Direccion
  getClientesDireccionList(): Observable <ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/ClienteDireccion');
  }

  //Obtener Direcciones por IdCliente
  getDireccionIdCliente(id:number): Observable <ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/ClienteDireccion/DireccionIdCliente/' + id);
  }

  //Join DireccionesCliente con Cliente por IdCliente
  getJoinDireccionCliente(id:number): Observable <any[]> {
    return this.http.get<any[]>(this.APIUrl + '/ClienteDireccion/JoinDireccionCliente/' + id);
  }
  addClienteDireccion(clientedireccion: ClienteDireccion) {
    return this.http.post(this.APIUrl + '/ClienteDireccion', clientedireccion);
 }

 deleteClienteDireccion(id:number) {
   return this.http.delete(this.APIUrl + '/ClienteDireccion/' + id);

 }

 updateClienteDireccion(clientedireccion: ClienteDireccion) {
 return this.http.put(this.APIUrl+ '/ClienteDireccion', clientedireccion);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}
