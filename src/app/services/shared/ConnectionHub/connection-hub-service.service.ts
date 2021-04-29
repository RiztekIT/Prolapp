import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import * as signalr from 'signalr' 

declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class ConnectionHubServiceService {

  private connection: any;
  private proxy: any;  
  private proxyName: string = 'AlertasHub'; 

  private hubconnection: signalr;  
  notihub = 'https://riztekserver.ddns.net:44361/signalr'
  
  


  constructor() { }


  ConnectionHub(origen){
    console.log('%c⧭', 'color: #cc7033', origen);
    
    this.connection = $.hubConnection(this.notihub);
    
    this.proxy = this.connection.createHubProxy(this.proxyName); 
    
    this.proxy.on('AlertasHub', (data) => {  
      console.log('received in SignalRService: ', data); 
      console.log('%c%s', 'color: #ff0000', origen.titulo);
      switch (origen.titulo) {
        case 'Usuario':
          this.filterUsuarios('Register click');
          break;
        case 'Producto':
          this.filterProductos('Register click');
          break;
        case 'Marca':
          this.filterMarca('Register click');
          break;
        case 'Proveedor':
          this.filterProveedores('Register click');
          break;
        case 'Proveedor':
          this.filterProveedores('Register click');
          break;
        case 'Cliente':
          this.filterCliente('Register click');
          break;
        case 'Vendedor':
          this.filterVendedor('Register click');
          break;
        case 'Bodega':
          this.filterBodega('Register click');
          break;
      
        default:

          console.log('%c%s', 'color: #86bf60', 'error en connectionhub');
          break;
      } 
      
  }); 
  
    this.connection.start().done((data: any) => {  
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
      /* this.connectionEstablished.emit(true);  */ 
      /* this.connectionExists = true;   */
  })
  }

  public on(origen) {
    switch (origen.titulo) {
      case 'Usuario':
        let mensaje = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensaje);
        break;
      case 'Producto':
        let mensajeProductos = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeProductos);
        break;
      case 'Marca':
        let mensajeMarca = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeMarca);
        break;
      case 'Proveedor':
        let mensajeProveedor = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeProveedor);
        break;
      case 'Cliente':
        let mensajeCliente = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeCliente);
        break;
      case 'Vendedor':
        let mensajeVendedor = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeVendedor);
        break;
      case 'Bodega':
        let mensajeBodega = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeBodega);
        break;
    
      default:

        console.log('%c%s', 'color: #ff6600', 'error en funcion ON');
        break;
    }
     /*  
    // server side hub method using proxy.invoke with method name pass as param  
       */
    /* this.proxy.invoke('NuevaNotificacion');   */
} 


// ^LISTENERS
//////////////////////////////////// & CATALOGOS /////////////////////////////////////////////////////////////////
// ! Listener Usuarios
  private _listeners = new Subject<any>(); 
  listenUsuarios(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterUsuarios(filterBy: string) {
    this._listeners.next(filterBy);
  }
  
// ! Listener Productos
  private _listenersProductos = new Subject<any>(); 
  listenProductos(): Observable<any> {
    return this._listenersProductos.asObservable();
  }
  filterProductos(filterBy: string) {
    this._listenersProductos.next(filterBy);
  }

// ! Listener Marcas
  private _listenersMarca = new Subject<any>(); 
  listenMarca(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterMarca(filterBy: string) {
    this._listenersMarca.next(filterBy);
  }

// ! Listener Proveedores
  private _listenersProveedores = new Subject<any>(); 
  listenProveedores(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterProveedores(filterBy: string) {
    this._listenersProveedores.next(filterBy);
  }

// ! Listener Cliente
  private _listenersCliente = new Subject<any>(); 
  listenCliente(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterCliente(filterBy: string) {
    this._listenersCliente.next(filterBy);
  }

// ! Listener Vendedor
  private _listenersVendedor = new Subject<any>(); 
  listenVendedor(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterVendedor(filterBy: string) {
    this._listenersVendedor.next(filterBy);
  }

// ! Listener Bodega
  private _listenersBodega = new Subject<any>(); 
  listenBodega(): Observable<any> {
    return this._listeners.asObservable();
  }
  filterBodega(filterBy: string) {
    this._listenersBodega.next(filterBy);
  }
//////////////////////////////////// & FIN CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////


}
