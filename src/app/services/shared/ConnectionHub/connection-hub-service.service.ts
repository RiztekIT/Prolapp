import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import * as signalr from 'signalr' 

import { DetalleNotificacion } from 'src/app/Models/Notificaciones/detalleNoticacion-model';

import { Notificaciones } from 'src/app/Models/Notificaciones/notificaciones-model';

import { NotificacionesService } from '../../notificaciones.service';

import { StorageServiceService } from '../storage-service.service';

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
  
  


  constructor(private notificacionService:NotificacionesService, private storageService: StorageServiceService) { }

// ! Notificaciones
generarNotificacion(notificacionData, datosExtra?) {
  console.log(notificacionData);
  // notificacionData.titulo = 'Notificacion'

  let noti = new Notificaciones()
  noti.Folio = 0;
  noti.IdNotificacion = 0;
  noti.IdUsuario = this.storageService.currentUser.IdUsuario;
  noti.Usuario = this.storageService.currentUser.NombreUsuario;
  // ^se condiciona si la notificacion viene con folio, para tener mensajes especificos para con/sin folio
  if (notificacionData.Folio) {
    noti.Mensaje = notificacionData.titulo + ' Creado/a Folio ' + notificacionData.Folio
  }else{
    noti.Mensaje = notificacionData.titulo+ ' '+ datosExtra + ' Creado/a'
  }
  noti.ModuloOrigen = notificacionData.origen
  noti.FechaEnvio = new Date();
  
  let detallenoti = new DetalleNotificacion()
  console.log('%c⧭', 'color: #aa00ff', noti);

  this.notificacionService.addNotificacion(noti).subscribe(resp => {
    console.log(resp, 'Respuesta de notificacion');
    detallenoti.IdDetalleNotificacion = 0;
    detallenoti.IdNotificacion = resp[0].IdNotificacion;
    detallenoti.IdUsuarioDestino = 1;
    detallenoti.UsuarioDestino = 'IvanTa';
    detallenoti.BanderaLeido = 0;
    detallenoti.FechaLeido = new Date(10 / 10 / 10);
    this.notificacionService.addDetalleNotificacion(detallenoti).subscribe(res => {
      console.log(res, 'Respuesta de detalle de notificacion');
      console.log('%c⧭', 'color: #733d00', notificacionData);
      this.on(notificacionData);
    })


  })
}




// ! Tablas con Signal R

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
        case 'Cliente':
          this.filterCliente('Register click');
          break;
        case 'Vendedor':
          this.filterVendedor('Register click');
          break;
        case 'Bodega':
          this.filterBodega('Register click');
          break;
          case 'Empresa':
            this.filterEmpresa('Register click');
            break;
          case 'Expediente':
            this.filterExpediente('Register click');
            break;
            // !Almacen
            case 'OC':
              this.filterOC('Register Click')
              break;
            case 'OD':
              this.filterOD('Register Click')
              break;
            // case 'Importacion':
            //   this.filterImportacion('Register Click')
            //   break;
            case 'Inventario':
              this.filterInventario('Register Click')
              break;
            case 'Documento':
              this.filterDocumento('Register Click')
              break;
            case 'Incidencia':
              this.filterIncidencia('Register Click')
              // Calidad
              this.filterIncidencia('Register Click')
              break;
            // !FIN Almacen
            // !Calidad
            // case '':
            //   this.filter('Register Click')
            //   break;
            // case '':
            //   this.filter('Register Click')
            //   break;
            // !FIN Calidad
            // !Compras
            case 'Compra':
              this.filterCompra('Register Click')
              break;
            // !FIN Compras
            // !CxC
            case 'OCompra':
              this.filterOCompra('Register Click')
              break;
            case 'Facturacion':
              this.filterFacturacion('Register Click')
              break;
            case 'Complemento':
              this.filterComplemento('Register Click')
              break;
            case 'Nota':
              this.filterNota('Register Click')
              break;
            case 'Poliza':
              this.filterPoliza('Register Click')
              break;
            case 'Saldo':
              this.filterSaldo('Register Click')
              break;
            // !FIN CxC
            // !CxP
            case 'Pago':
              this.filterPago('Register Click')
              break;
            case 'Forward':
              this.filterForward('Register Click')
              break;
            // !FIN CxP
            // !Direccion
            // case '':
            //   this.filter('Register Click')
            //   break;
            // !FIN Direccion
            // !Importacion
            // case '':
            //   this.filter('Register Click')
            //   break;
            // !FIN Importacion
            // !POS
            case 'POSProducto':
              this.filterPOSProducto('Register Click')
              break;
            case 'POSCliente':
              this.filterPOSCliente('Register Click')
              break;
            case 'POSEntrada':
              this.filterPOSEntrada('Register Click')
              break;
            case 'POSInventario':
              this.filterPOSInventario('Register Click')
              break;
            case 'POSVenta':
              this.filterPOSVenta('Register Click')
              break;
            // !FIN POS
            // !Trafico
            case 'Fletera':
              this.filterFletera('Register Click')
              break;
            // !FIN Trafico
            // !Ventas
            case 'Prospecto':
              this.filterProspecto('Register Click')
              break;
            // !FIN Ventas
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
      case 'Empresa':
        let mensajeEmpresa = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeEmpresa);
        break;
      case 'Expediente':
        let mensajeExpediente = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeExpediente);
        break;
      case 'OC':
        let mensajeOC = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeOC);
        break;
      case 'OD':
        let mensajeOD = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeOD);
        break;
      case 'Traspaso':
        let mensajeTraspaso = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeTraspaso);
        break;
      case 'Inventario':
        let mensajeInventario = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeInventario);
        break;
      case 'Documento':
        let mensajeDocumento = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeDocumento);
        break;
      case 'Incidencia':
        let mensajeIncidencia = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeIncidencia);
        break;
      case 'Compra':
        let mensajeCompra = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeCompra);
        break;
      case 'OCompra':
        let mensajeOCompra = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeOCompra);
        break;
      case 'Facturacion':
        let mensajeFacturacion = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeFacturacion);
        break;
      case 'Complemento':
        let mensajeComplemento = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeComplemento);
        break;
      case 'Nota':
        let mensajeNota = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeNota);
        break;
      case 'Poliza':
        let mensajePoliza = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePoliza);
        break;
      case 'Saldo':
        let mensajeSaldo = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeSaldo);
        break;
      case 'Pago':
        let mensajePago = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePago);
        break;
      case 'Forward':
        let mensajeForward = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeForward);
        break;
      case 'POSProducto':
        let mensajePOSProducto = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePOSProducto);
        break;
      case 'POSCliente':
        let mensajePOSCliente = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePOSCliente);
        break;
      case 'POSEntrada':
        let mensajePOSEntrada = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePOSEntrada);
        break;
      case 'POSInventario':
        let mensajePOSInventario = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePOSInventario);
        break;
      case 'POSVenta':
        let mensajePOSVenta = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajePOSVenta);
        break;
      case 'Fletera':
        let mensajeFletera = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeFletera);
        break;
      case 'Prospecto':
        let mensajeProspecto = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeProspecto);
        break;

        // !NOTIFICACION
      case 'Notificacion':
        let mensajeNotificacion = {
            titulo: origen.titulo,
            descripcion: 'Mensaje desde '+ origen.origen +'',
            fecha: new Date()
          }
          this.proxy.invoke('NuevaNotificacion',mensajeNotificacion);
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
    return this._listenersMarca.asObservable();
  }
  filterMarca(filterBy: string) {
    this._listenersMarca.next(filterBy);
  }

// ! Listener Proveedores
  private _listenersProveedores = new Subject<any>(); 
  listenProveedores(): Observable<any> {
    return this._listenersProveedores.asObservable();
  }
  filterProveedores(filterBy: string) {
    this._listenersProveedores.next(filterBy);
  }

// ! Listener Cliente
  private _listenersCliente = new Subject<any>(); 
  listenCliente(): Observable<any> {
    return this._listenersCliente.asObservable();
  }
  filterCliente(filterBy: string) {
    this._listenersCliente.next(filterBy);
  }

// ! Listener Vendedor
  private _listenersVendedor = new Subject<any>(); 
  listenVendedor(): Observable<any> {
    return this._listenersVendedor.asObservable();
  }
  filterVendedor(filterBy: string) {
    this._listenersVendedor.next(filterBy);
  }

// ! Listener Bodega
  private _listenersBodega = new Subject<any>(); 
  listenBodega(): Observable<any> {
    return this._listenersBodega.asObservable();
  }
  filterBodega(filterBy: string) {
    this._listenersBodega.next(filterBy);
  }
  //////////////////////////////////// &  Empresa /////////////////////////////////////////////////////////////////
  // ! Listener Empresa
  private _listenersEmpresa = new Subject<any>(); 
  listenEmpresa(): Observable<any> {
    return this._listenersEmpresa.asObservable();
  }
  filterEmpresa(filterBy: string) {
    this._listenersEmpresa.next(filterBy);
  }
  //////////////////////////////////// & FIN Empresa /////////////////////////////////////////////////////////////////
  
  //////////////////////////////////// & Expedientes  /////////////////////////////////////////////////////////////////
  // ! Listener Expediente
    private _listenersExpediente = new Subject<any>(); 
    listenExpediente(): Observable<any> {
      return this._listenersExpediente.asObservable();
    }
    filterExpediente(filterBy: string) {
      this._listenersExpediente.next(filterBy);
    }
//////////////////////////////////// & FIN Expedientes /////////////////////////////////////////////////////////////////
  //////////////////////////////////// & OC  /////////////////////////////////////////////////////////////////
  // ! Listener OC
    private _listenersOC = new Subject<any>(); 
    listenOC(): Observable<any> {
      return this._listenersOC.asObservable();
    }
    filterOC(filterBy: string) {
      this._listenersOC.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

  //////////////////////////////////// & OD  /////////////////////////////////////////////////////////////////
  // ! Listener OD
    private _listenersOD = new Subject<any>(); 
    listenOD(): Observable<any> {
      return this._listenersOD.asObservable();
    }
    filterOD(filterBy: string) {
      this._listenersOD.next(filterBy);
    }
//////////////////////////////////// & FIN OD /////////////////////////////////////////////////////////////////

  //////////////////////////////////// &  Traspaso /////////////////////////////////////////////////////////////////
  // ! Listener Traspaso
    private _listenersTraspaso = new Subject<any>(); 
    listenTraspaso(): Observable<any> {
      return this._listenersTraspaso.asObservable();
    }
    filterTraspaso(filterBy: string) {
      this._listenersTraspaso.next(filterBy);
    }
//////////////////////////////////// & FIN Traspaso /////////////////////////////////////////////////////////////////

  //////////////////////////////////// &  Inventario /////////////////////////////////////////////////////////////////
  // ! Listener Inventario
    private _listenersInventario = new Subject<any>(); 
    listenInventario(): Observable<any> {
      return this._listenersInventario.asObservable();
    }
    filterInventario(filterBy: string) {
      this._listenersInventario.next(filterBy);
    }
//////////////////////////////////// & FIN Inventario /////////////////////////////////////////////////////////////////

  //////////////////////////////////// &  Documento /////////////////////////////////////////////////////////////////
  // ! Listener Documento
    private _listenersDocumento = new Subject<any>(); 
    listenDocumento(): Observable<any> {
      return this._listenersDocumento.asObservable();
    }
    filterDocumento(filterBy: string) {
      this._listenersDocumento.next(filterBy);
    }
//////////////////////////////////// & FIN Documento /////////////////////////////////////////////////////////////////

  //////////////////////////////////// & Incidencia  /////////////////////////////////////////////////////////////////
  // ! Listener Incidencia
    private _listenersIncidencia = new Subject<any>(); 
    listenIncidencia(): Observable<any> {
      return this._listenersIncidencia.asObservable();
    }
    filterIncidencia(filterBy: string) {
      this._listenersIncidencia.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////


//////////////////////////////////// &  Compra /////////////////////////////////////////////////////////////////
  // ! Listener Compra
    private _listenersCompra = new Subject<any>(); 
    listenCompra(): Observable<any> {
      return this._listenersCompra.asObservable();
    }
    filterCompra(filterBy: string) {
      this._listenersCompra.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////


//////////////////////////////////// &  OCompra /////////////////////////////////////////////////////////////////
  // ! Listener OCompra
    private _listenersOCompra = new Subject<any>(); 
    listenOCompra(): Observable<any> {
      return this._listenersOCompra.asObservable();
    }
    filterOCompra(filterBy: string) {
      this._listenersOCompra.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Facturacion /////////////////////////////////////////////////////////////////
  // ! Listener Facturacion
    private _listenersFacturacion = new Subject<any>(); 
    listenFacturacion(): Observable<any> {
      return this._listenersFacturacion.asObservable();
    }
    filterFacturacion(filterBy: string) {
      this._listenersFacturacion.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Complemento /////////////////////////////////////////////////////////////////
  // ! Listener Complemento
    private _listenersComplemento = new Subject<any>(); 
    listenComplemento(): Observable<any> {
      return this._listenersComplemento.asObservable();
    }
    filterComplemento(filterBy: string) {
      this._listenersComplemento.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &   /////////////////////////////////////////////////////////////////
  // ! Listener Nota
    private _listenersNota = new Subject<any>(); 
    listenNota(): Observable<any> {
      return this._listenersNota.asObservable();
    }
    filterNota(filterBy: string) {
      this._listenersNota.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Poliza /////////////////////////////////////////////////////////////////
  // ! Listener Poliza
    private _listenersPoliza = new Subject<any>(); 
    listenPoliza(): Observable<any> {
      return this._listenersPoliza.asObservable();
    }
    filterPoliza(filterBy: string) {
      this._listenersPoliza.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// & Saldo  /////////////////////////////////////////////////////////////////
  // ! Listener Saldo
    private _listenersSaldo = new Subject<any>(); 
    listenSaldo(): Observable<any> {
      return this._listenersSaldo.asObservable();
    }
    filterSaldo(filterBy: string) {
      this._listenersSaldo.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Pago /////////////////////////////////////////////////////////////////
  // ! Listener Pago
    private _listenersPago = new Subject<any>(); 
    listenPago(): Observable<any> {
      return this._listenersPago.asObservable();
    }
    filterPago(filterBy: string) {
      this._listenersPago.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Forward /////////////////////////////////////////////////////////////////
  // ! Listener Forward
    private _listenersForward = new Subject<any>(); 
    listenForward(): Observable<any> {
      return this._listenersForward.asObservable();
    }
    filterForward(filterBy: string) {
      this._listenersForward.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  POSProducto /////////////////////////////////////////////////////////////////
  // ! Listener POSProducto
    private _listenersPOSProducto = new Subject<any>(); 
    listenPOSProducto(): Observable<any> {
      return this._listenersPOSProducto.asObservable();
    }
    filterPOSProducto(filterBy: string) {
      this._listenersPOSProducto.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  POSCliente /////////////////////////////////////////////////////////////////
  // ! Listener POSCliente
    private _listenersPOSCliente = new Subject<any>(); 
    listenPOSCliente(): Observable<any> {
      return this._listenersPOSCliente.asObservable();
    }
    filterPOSCliente(filterBy: string) {
      this._listenersPOSCliente.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  POSEntrada /////////////////////////////////////////////////////////////////
  // ! Listener POSEntrada
    private _listenersPOSEntrada = new Subject<any>(); 
    listenPOSEntrada(): Observable<any> {
      return this._listenersPOSEntrada.asObservable();
    }
    filterPOSEntrada(filterBy: string) {
      this._listenersPOSEntrada.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  POSInventario /////////////////////////////////////////////////////////////////
  // ! Listener POSInventario
    private _listenersPOSInventario = new Subject<any>(); 
    listenPOSInventario(): Observable<any> {
      return this._listenersPOSInventario.asObservable();
    }
    filterPOSInventario(filterBy: string) {
      this._listenersPOSInventario.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
//////////////////////////////////// &  CATALOGOS /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  POSVenta /////////////////////////////////////////////////////////////////
  // ! Listener POSVenta
    private _listenersPOSVenta = new Subject<any>(); 
    listenPOSVenta(): Observable<any> {
      return this._listenersPOSVenta.asObservable();
    }
    filterPOSVenta(filterBy: string) {
      this._listenersPOSVenta.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// &  Fletera /////////////////////////////////////////////////////////////////
  // ! Listener Fletera
    private _listenersFletera = new Subject<any>(); 
    listenFletera(): Observable<any> {
      return this._listenersFletera.asObservable();
    }
    filterFletera(filterBy: string) {
      this._listenersFletera.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////

//////////////////////////////////// & Prospecto  /////////////////////////////////////////////////////////////////
  // ! Listener Prospecto
    private _listenersProspecto = new Subject<any>(); 
    listenProspecto(): Observable<any> {
      return this._listenersProspecto.asObservable();
    }
    filterProspecto(filterBy: string) {
      this._listenersProspecto.next(filterBy);
    }
//////////////////////////////////// & FIN  /////////////////////////////////////////////////////////////////
}
