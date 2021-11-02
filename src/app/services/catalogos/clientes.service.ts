import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import { Vendedor } from '../../Models/catalogos/vendedores.model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteLogin } from '../../Models/ClienteLogin/clienteLogin-model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient) { }
  formData = new Cliente();
  formDatalogin = new ClienteLogin();
  formDataV: Vendedor;
  prospEstatus = "";
  Idclienteservicio;

  contactoCliente = new Cliente();

  //Expedientes

objetoCliente = new Cliente();

  //Expedientes

  
  
  APIUrl = environment.APIUrl;
  

  getClientesList(): Observable <Cliente[]> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
  }
  getClientesListID(): Observable <Cliente[]> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente/ID');
  }
  getClientesListIDN(): Observable <Cliente[]> {
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente/IDN');
  }
  getClientesContactoList(): Observable <any[]> {
    return this.http.get<any[]>(this.APIUrl + '/cliente/Contacto');
  }

  getVendedoresList(): Observable <Vendedor[]> {
    return this.http.get<Vendedor[]>(this.APIUrl + '/vendedor');
  }

  addCliente(cliente: Cliente) {
    return this.http.post(this.APIUrl + '/cliente', cliente);
 }
  addCliente2(cliente: Cliente) {
    return this.http.post(this.APIUrl + '/cliente2', cliente);
 }
 addCliente3(cliente: Cliente) {
  return this.http.post(this.APIUrl + '/cliente3', cliente);
}
  addVendedor(vendedor: Vendedor) {
    return this.http.post(this.APIUrl + '/vendedor', vendedor);
 }

//  deleteCliente(id:number) {
//    return this.http.delete(this.APIUrl + '/cliente/' + id);
//  }
 deleteCliente(id:number) {
   return this.http.delete(this.APIUrl + '/cliente/DeleteCliente/' + id);
 }

 deleteVendedor(id:number) {
   return this.http.delete(this.APIUrl + '/vendedor/' + id);
 }

 updateCliente(cliente: Cliente) {
 return this.http.put(this.APIUrl+ '/cliente', cliente);
 }
 updateCliente2(cliente: Cliente) {
 return this.http.put(this.APIUrl+ '/cliente2', cliente);
 }
 updateCliente3(cliente: Cliente) {
  return this.http.put(this.APIUrl+ '/cliente3', cliente);
  }
 updateVendedor(vendedor: Vendedor) {
 return this.http.put(this.APIUrl+ '/vendedor', vendedor);
 }
 updateUIDCliente(datos:string) {
  console.log(datos);
  
 return this.http.put(this.APIUrl+ '/cliente/UID', datos);
 }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


  getLogin(cliente: ClienteLogin) {
    return this.http.post(this.APIUrl+ '/cliente/login/',cliente);
    }
    checadas():Observable <any[]>{
      return this.http.get<any[]>(this.APIUrl+'/cliente/login');
    }

    getIDCLienteRFC(rfc: string): Observable <Cliente[]> {
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente/rfc/'+ rfc);
    }

    addContactoCliente(cliente: Cliente) {
      return this.http.post(this.APIUrl + '/cliente/AgregarContacto', cliente);
   }
}
