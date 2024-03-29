import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, observable } from 'rxjs';
import { Cotizacion } from '../../Models/ventas/cotizacion-model';
import { DomSanitizer } from '@angular/platform-browser';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { Prospecto } from '../../Models/ventas/prospecto-model';
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
    'Access-Control-Allow-Origin': '*',
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
  
  constructor(private http:HttpClient, private sanitizer: DomSanitizer) {
 
   }
  
  formprosp= new Prospecto();
  formcotped: any;
  formt: any;
  formData = new Cliente();
  formProd = new Producto();
  formDataDP = new DetalleCotizacion();
  formDataCotizacion = new Cotizacion();
  master = new Array<cotizacionMaster>();
  Moneda: string;
  IdCotizacion: number;
  IdCliente : number;
  //readonly APIUrl = environment.APIUrl;
  APIUrl = environment.APIUrl
  
  
  updateVentasPedido(pedido: any) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Pedido', pedido);
  }

    // updateVentasPedido(pedido: any) {
    //   return this.http.put(this.APIUrl + '/Pedido', pedido);
    // }
    //get Direcciones en base a ID CLIENTE
    getDireccionesCliente(id: number): Observable<ClienteDireccion[]> {
      this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionCliente/' + id);
    } 

    GetCliente(id:number): Observable <Cliente[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any>(this.APIUrl + '/Cliente/id/' + id);
    }
    
    getDepDropDownValues(): Observable<any> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Cliente[]>(this.APIUrl + '/cliente');
    }
    getDepDropDownValues2(): Observable<any> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Cliente[]>(this.APIUrl + '/producto');
    }
    //Get Unidades De Medida
    unidadMedida(): Observable<any>{
      let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
      return this.http.get(rootURLUM,httpOptions2);
    }
    //get Direcciones en base a ID CLIENTE
 getDireccionID(id: number): Observable<ClienteDireccion[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<ClienteDireccion[]>(this.APIUrl + '/Pedido/DireccionID/' + id);
    }

    getCotizacionId(id: number): Observable <Cotizacion[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Cotizacion[]>(this.APIUrl + '/Cotizacion/CotizacionId/' + id);
    }

    GetProductoDetalleCotizacion(claveProducto:string, Id:number): Observable<any>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any>(this.APIUrl + '/Cotizacion/ProductoDetalleProducto/' + claveProducto + '/'+ Id)
    }

    //Get Ultimo pedido
    getUltimaCotizacion(): Observable <any>{
      this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/UltimaCotizacion');
    }

    OnEditDetalleCotizacion(dp: DetalleCotizacion){
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.put(this.APIUrl + '/Cotizacion/EditDetallecotizacion', dp)
    }

    onDeleteDetalleCotizacion(id: number){
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.delete(this.APIUrl + '/Cotizacion/DeleteDetalleCotizacion/' + id);
    }

    //Get Detalle Cotizacion Por ID
  GetDetalleCotizacionId(id:number): Observable<any>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleCotizacion[]>(this.APIUrl + '/Cotizacion/DetalleCotizacionesId/' + id)
  }
  
  GetSumaImporte(Id:number): Observable<any>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/SumaImporte/' + Id)
  }

  addDetalleCotizacion(detalle: DetalleCotizacion){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Cotizacion/InsertDetalleCotizacion', detalle );
  }


  GetFolio(): Observable<any>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/Folio')
  }
  
  //Eliminar ALL Detalle Pedido
  onDeleteAllDetalleCotizacion(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Cotizacion/DeleteDetalleCotizacion/' + id);
  }

    /////////////////////////////////////////////////
    onDeleteCotizacion(id: number){
      this.APIUrl = sessionStorage.getItem('API')
        return this.http.delete(this.APIUrl + '/Cotizacion/BorrarCotizacion/' + id);
    }


    addCotizacion(cotizacion: Cotizacion){
      this.APIUrl = sessionStorage.getItem('API')
        return this.http.post(this.APIUrl + '/Cotizaciones', cotizacion)
    }
    
   

  getCotizaciones(): Observable<any[]> {
    console.log(this.APIUrl,'APIURL');
    console.log(environment.APIUrl,'APIURL');
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizaciones');
  }

  //Obtener Vendedores
  GetVendedor(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/Vendedor')
  }

    //Get Detalles cotizaciones en base a IdCotizacion
    getDetalleCotizacionesId(id: number): Observable <any>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any>(this.APIUrl + '/Cotizaciones/DetalleCotizacionesId/'+ id);
    }

  /////////////////////////////////////////////////

  onEditCotizacion(ct: Cotizacion) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Cotizaciones', ct)
  }

  getProspectos(): Observable<any>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/GetProspecto')
  }

  getProspecto(id: number): Observable <any>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any>(this.APIUrl + '/Cotizacion/GetProspectoId/' + id);
  }

  addProspecto(prospecto : Prospecto){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Cotizacion/InsertProspecto', prospecto);
  }

  editProspecto(prospecto: Prospecto){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl + '/Cotizacion/UpdateProspecto', prospecto);
  }
  
  deleteProspecto(id:number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Cotizacion/BorrarProspecto/'+id);    
  }


  subirImagen(datos:any):Observable<any>{
    return this.http.post('https://riztek.com.mx/php/Prolacto/POST_SubirArchivo.php', datos);
  }



  // *******************   REPORTES COTIZACION ************************* //

    //obtener lista de Clientes
    //acceder al metodo getDepDropDownValues

    //Obtener Cliente por Id
    //Acceder al metodo getCliente

    //Obtener reporte Cotizacion por cliente ID
    getReporteClienteId(id: number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/CotizacionesJoinCliente/'+id);
    }
//obtener reporte Cotizacion por cliente ID y por estatus de la cotizacion
    getReporteClienteIdEstatus(id:number, estatus:string):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/ReporteCotizacionesClienteEstatus/'+id+'/'+estatus);
    }
//obtener reporte cotizacion por Fecha Inicial / final y  cliente ID
    getReporteFechasClienteId(fechaini, fechafinal, id:number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/CotizacionesFechasCliente/'+fechaini+'/'+fechafinal+'/'+id);
    }
//obtener reporte cotizacion por Fecha Inicial / final ,  cliente ID y estatus
    getReporteFechasClienteIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/CotizacionesFechasClienteEstatus/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
    }

  // *******************   REPORTES COTIZACION ************************* //


  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}