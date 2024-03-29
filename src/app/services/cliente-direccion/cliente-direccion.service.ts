import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ClienteDireccion } from '../../Models/cliente-direccion/clienteDireccion-model';
import {Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteDireccionService {

  constructor(private http:HttpClient) { }
 
  
  formData = new ClienteDireccion();

  IdCliente: number;

  
  APIUrl = environment.APIUrl;
  

  //Obtener list Clientes Direccion
  getClientesDireccionList(): Observable <ClienteDireccion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/ClienteDireccion');
  }

  //Obtener Direcciones por IdCliente
  getDireccionIdCliente(id:number): Observable <ClienteDireccion[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/ClienteDireccion/DireccionIdCliente/' + id);
  }

  //Join DireccionesCliente con Cliente por IdCliente
  getJoinDireccionCliente(id:number): Observable <any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/ClienteDireccion/JoinDireccionCliente/' + id);
  }
  //Obtener cliente por ID CLiente
  getObtenerClienteID(id:number): Observable <any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/ClienteDireccion/ObtenerClienteID/' + id);
  }
  addClienteDireccion(clientedireccion: ClienteDireccion) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/ClienteDireccion', clientedireccion);
 }

 deleteClienteDireccion(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/ClienteDireccion/' + id);

 }

 updateClienteDireccion(clientedireccion: ClienteDireccion) {
  this.APIUrl = sessionStorage.getItem('API')
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
