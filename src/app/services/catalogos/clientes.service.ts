import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Cliente } from '../../Models/catalogos/clientes-model';
import { Vendedor } from '../../Models/catalogos/vendedores.model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteLogin } from '../../Models/ClienteLogin/clienteLogin-model';
import { FacturaService } from '../facturacioncxc/factura.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http:HttpClient, public facturaSVC: FacturaService) { }
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
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
  }
  getClientesListID(): Observable <Cliente[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente/ID');
  }
  getClientesListIDN(): Observable <Cliente[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Cliente[]>(this.APIUrl + '/cliente/IDN');
  }
  getClientesContactoList(): Observable <any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/cliente/Contacto');
  }

  getVendedoresList(): Observable <Vendedor[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Vendedor[]>(this.APIUrl + '/vendedor');
  }

  addCliente(cliente: Cliente) {

    this.APIUrl = sessionStorage.getItem('API')


    if (this.facturaSVC.rfcempresa==='PLA11011243A'){
      return this.http.post(this.APIUrl + '/cliente2', cliente);
  
    
    }
    else if (this.facturaSVC.rfcempresa=='AIN140101ME3'){
      return this.http.post(this.APIUrl + '/cliente', cliente);
    
      
    }
    else if (this.facturaSVC.rfcempresa=='DTM200220KRA'){
      return this.http.post(this.APIUrl + '/cliente3', cliente);
    
      
    }


    
 }
  addCliente2(cliente: Cliente) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/cliente2', cliente);
 }
 addCliente3(cliente: Cliente) {
   this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/cliente3', cliente);
}
  addVendedor(vendedor: Vendedor) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/vendedor', vendedor);
 }

//  deleteCliente(id:number) {
//    return this.http.delete(this.APIUrl + '/cliente/' + id);
//  }
 deleteCliente(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/cliente/DeleteCliente/' + id);
 }

 deleteVendedor(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/vendedor/' + id);
 }

 updateCliente(cliente: Cliente) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/cliente', cliente);
 }
 updateCliente2(cliente: Cliente) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/cliente2', cliente);
 }
 updateCliente3(cliente: Cliente) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/cliente3', cliente);
  }
 updateVendedor(vendedor: Vendedor) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/vendedor', vendedor);
 }
 updateUIDCliente(datos:string) {
  console.log(datos);
  this.APIUrl = sessionStorage.getItem('API')
  
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
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl+ '/cliente/login/',cliente);
    }
    checadas():Observable <any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/cliente/login');
    }

    getIDCLienteRFC(rfc: string): Observable <Cliente[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente/rfc/'+ rfc);
    }

    addContactoCliente(cliente: Cliente) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.post(this.APIUrl + '/cliente/AgregarContacto', cliente);
   }
}
