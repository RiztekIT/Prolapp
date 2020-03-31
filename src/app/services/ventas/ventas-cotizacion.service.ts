import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { Cotizacion } from '../../Models/ventas/cotizacion-model';
import { DomSanitizer } from '@angular/platform-browser';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { DetallePedido } from 'src/app/Models/Pedidos/detallePedido-model';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { cotizacionMaster } from '../../Models/ventas/cotizacion-master';
import { DetalleCotizacion } from '../../Models/ventas/detalleCotizacion-model';
import { environment } from 'src/environments/environment';

const httpOptions2 = {

  headers: new HttpHeaders({
    // 'F-Api-Key':'JDJ5JDEwJGZOWTRnNkdvSjBPTEdiRlRBNWZocE81d3dJRU52WUtNWU9SaU16MHcwbFV5MzIuVWVGTlBT',
    'F-Api-Key': 'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x',
    // 'F-Secret-Key':'JDJ5JDEwJGhVemxJbXUyTzhUREVTTEVvODkySk91aEI4a3Y0Rjhqd3ltWHo0a0QyTktTdkhldEp2c29X',
    'F-Secret-Key': 'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t',
    'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }),
  responseType: 'text' as 'json'
}


@Injectable({
  providedIn: 'root'
})
export class VentasCotizacionService {
  
  formdata = new Cotizacion();
  formrow: any;
  
  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }
  
  formt: any;
  formData = new Cliente();
  formProd = new Producto();
  formDataDP = new DetalleCotizacion();
  formDataCotizacion = new Cotizacion();
  master = new Array<cotizacionMaster>();
  Moneda: string;
  IdCotizacion: number;
  IdCliente : number;
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";
  
  updateVentasPedido(pedido: any) {
    return this.http.put(this.APIUrl + '/Pedido', pedido);
  }

    // updateVentasPedido(pedido: any) {
    //   return this.http.put(this.APIUrl + '/Pedido', pedido);
    // }
    //get Direcciones en base a ID CLIENTE
    getDireccionesCliente(id: number): Observable<ClienteDireccion[]> {
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionCliente/' + id);
    } 

    GetCliente(id:number): Observable <Cliente[]>{
      return this.http.get<any>(this.APIUrl + '/Cliente/id/' + id);
    }
    
    getDepDropDownValues(): Observable<any> {
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
    }
    getDepDropDownValues2(): Observable<any> {
      return this.http.get<Cliente[]>(this.APIUrl + '/producto');
    }
    //Get Unidades De Medida
    unidadMedida(): Observable<any>{
      let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
      return this.http.get(rootURLUM,httpOptions2);
    }
    //get Direcciones en base a ID CLIENTE
 getDireccionID(id: number): Observable<ClienteDireccion[]> {
  return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionID/' + id);
    }

    getCotizacionId(id: number): Observable <Cotizacion[]>{
      return this.http.get<Cotizacion[]>(this.APIUrl + '/Cotizacion/CotizacionId/' + id);
    }

    GetProductoDetalleCotizacion(claveProducto:string, Id:number): Observable<any>{
      return this.http.get<any>(this.APIUrl + '/Cotizacion/ProductoDetalleProducto/' + claveProducto + '/'+ Id)
    }

    //Get Ultimo pedido
    getUltimaCotizacion(): Observable <any>{
    return this.http.get<any>(this.APIUrl + '/Cotizacion/UltimaCotizacion');
    }

    OnEditDetalleCotizacion(dp: DetalleCotizacion){
      return this.http.put(this.APIUrl + '/Cotizacion/EditDetallecotizacion', dp)
    }

    onDeleteDetalleCotizacion(id: number){
      return this.http.delete(this.APIUrl + '/Cotizacion/DeleteDetalleCotizacion/' + id);
    }

    //Get Detalle Cotizacion Por ID
  GetDetalleCotizacionId(id:number): Observable<any>{
    return this.http.get<DetalleCotizacion[]>(this.APIUrl + '/Cotizacion/DetalleCotizacionesId/' + id)
  }
  
  GetSumaImporte(Id:number): Observable<any>{
    return this.http.get<any>(this.APIUrl + '/Cotizacion/SumaImporte/' + Id)
  }

  addDetalleCotizacion(detalle: DetalleCotizacion){
    return this.http.post(this.APIUrl + '/Cotizacion/InsertDetalleCotizacion', detalle );
  }


  GetFolio(): Observable<any>{
    return this.http.get<any>(this.APIUrl + '/Cotizacion/Folio')
  }
  
  //Eliminar ALL Detalle Pedido
  onDeleteAllDetalleCotizacion(id: number){
    return this.http.delete(this.APIUrl + '/Cotizacion/DeleteDetalleCotizacion/' + id);
  }

    /////////////////////////////////////////////////
    onDeleteCotizacion(id: number){
        return this.http.delete(this.APIUrl + '/Cotizacion/BorrarCotizacion/' + id);
    }


    addCotizacion(cotizacion: Cotizacion){
        return this.http.post(this.APIUrl + '/Cotizaciones', cotizacion)
    }
    
   

  getCotizaciones(): Observable<any[]> {
    return this.http.get<any>(this.APIUrl + '/Cotizaciones');
  }

  //Obtener Vendedores
  GetVendedor(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/Cotizacion/Vendedor')
  }

    //Get Detalles cotizaciones en base a IdCotizacion
    getDetalleCotizacionesId(id: number): Observable <any>{
      return this.http.get<any>(this.APIUrl + '/Cotizaciones/DetalleCotizacionesId/'+ id);
    }

  /////////////////////////////////////////////////

  onEditCotizacion(ct: Cotizacion) {
    return this.http.put(this.APIUrl + '/Cotizaciones', ct)
  }



  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}