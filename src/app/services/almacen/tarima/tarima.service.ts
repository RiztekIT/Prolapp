import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { TraspasoTarima } from '../../../Models/almacen/Tarima/traspasoTarima-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { Usuario } from 'src/app/Models/catalogos/usuarios-model';
import { MasterDetalleTarima } from 'src/app/Models/almacen/OrdenDescarga/cuu/masterDetalleTarima-model';
import { Producto } from 'src/app/Models/catalogos/productos-model';

 



@Injectable({
  providedIn: 'root'
})
export class TarimaService {

  constructor(private http:HttpClient) { }

  APIUrl = environment.APIUrl;

  tarimaData = new Tarima();
  dataTarima: any;
  tarimaDetalleData = new DetalleTarima();
  tarimaDetalleDOD = new Array<DetalleOrdenDescarga>();
  formDataDrop = new Tarima();
  tarimaTrafico;

  master;
  masterlotes;

  /* Movimiento de Inventario */
  formProd= new Producto();
  /* Movimiento de Inventario */

  //^Tarima proviniente de un traspaso de OrdenCarga
  trapasoOrdenCarga: boolean;
  //^Tarima proviniente de un traspaso de OrdenDescarga
  trapasoOrdenDescarga: boolean;
  //^IdTarima a traspasar;
  idTarimaOrdenCarga: number;
  //^IdTarima a traspasar;
  idTarimaOrdenDescarga: number;
  //^Detalle tarima a traspasar de OrdenCarga
  detalleTarimaOrdenCarga: DetalleTarima;
  //^Detalle tarima a traspasar de OrdenDescarga
  detalleTarimaOrdenDescarga: DetalleTarima;
  QrOrigen: string;
  QrDestino: string;
  
  masterT = new Array<any>();
  //^ masterT = new Array<any>();
//^ master para tarima escaneada
  masterTE = new Array<any>();

  //^Bodega Origen/Destino
  bodega: string;

  //^Variable para saber si el traspaso es de orden descarga o no
  TraspasoDescarga:boolean;

  compra;
  detalleTarima;

  getTarima(): Observable <Tarima[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Tarima[]>(this.APIUrl + '/Tarima');
  }

  //^Obtener detalles de Tarima por IdTarima
getDetalleTarimaID(id: number): Observable <DetalleTarima[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<DetalleTarima[]>(this.APIUrl + '/Tarima/GetDetalleTarimaID/'+ id);
}
 //^Obtener detalles de Tarima por IdDetalleTarima
 getDetalleTarimaIDdetalle(id: number): Observable <DetalleTarima[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<DetalleTarima[]>(this.APIUrl + '/Tarima/GetDetalleTarimaIDdetalle/'+ id);
}
  //^Obtener Tarima por IdTarima
getTarimaID(id: number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaID/'+ id);
}
  //^Obtener Ultima Tarima
  getUltimaTarima(): Observable <Tarima[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Tarima[]>(this.APIUrl + '/Tarima/GetUltimaTarima');
  }
  //^Obtener Tarima por QR code
  getTarimaQR(qr : string): Observable <any[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaQR/'+ qr);
  }
  //^Obtener detalle tarima por IdTarima, claveProducto, lote
  getDetalleTarimaIdClaveLote(id: number, clave: string, lote: string): Observable <DetalleTarima[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleTarima[]>(this.APIUrl + '/Tarima/GetDetalleTarimaIdClaveLote/' + id + '/' + clave + '/' + lote);
  }

//^Insert Tarima
addTarima(t: Tarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Tarima', t);
}
//^Update Tarima
updateTarima(t: Tarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Tarima', t);
  }
  //^Update Tarima ( Sacos y peso Total)
  updateTarimaSacosPeso(id: number, sacos: string, peso: string) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl+ '/Tarima/UpdateTarimaSacosPeso/' + id + '/' + sacos + '/' + peso , null);
    }
    //^Update Tarima ( Sacos y peso Total)
  updateDetalleTarimaIdSacos(iddt:number, sacos: string, peso, lote) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl+ '/Tarima/UpdateDetalleTarimaIdSacos/' + iddt + '/' + sacos + '/' + peso  +'/'+ lote, null);
    }
//^Insert Detalle Tarima
addDetalleTarima(dt: DetalleTarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Tarima/AddDetalleTarima', dt);
}
//^Update Detalle Tarima
updateDetalleTarima(dt: DetalleTarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Tarima/UpdateDetalleTarima', dt);
  }
//^Insert Traspaso Tarima
addTraspasoTarima(tt: TraspasoTarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/TraspasoTarima', tt);
}
//^Update Traspaso Tarima
updateTraspasoTarima(tt: TraspasoTarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/TraspasoTarima', tt);
  }
  //^Eliminar detalle tarima
  deleteDetalleTarima(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/Tarima/BorrarDetalleTarima/' + id);
  }
//^Eliminar tarima
deleteTarima(id: number){
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.delete(this.APIUrl+ '/Tarima/BorrarTarima/' + id);
}

//^Obtener Informacion de Usuario por NombreUsuario
//^Obtener Tarima por QR code
getUsuario(nombreUsuario : string): Observable <Usuario[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Usuario[]>(this.APIUrl + '/usuario/userinfo/'+ nombreUsuario);
}

GetTarimaDttqr(qr: string): Observable<Tarima[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Tarima[]>(this.APIUrl + '/Tarima/GetTarimaDttqr/' + qr);

}
GetTarimaBodegaQR(qr: string, bodega:string): Observable<Tarima[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Tarima[]>(this.APIUrl + '/Tarima/GetTarimaBodegaQR/'+qr+'/'+bodega);
}
GetTarimaOC(idoc): Observable<Tarima[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Tarima[]>(this.APIUrl + '/Tarima/TarimaOC/'+idoc);
}

GetTarimaBodega(): Observable<any[]> {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaBodega');
}

updateBodegaTarima(bodega:string, qr:string) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Tarima/UpdateBodega/'+bodega+'/'+qr,null);
  }

  getProductos(){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Producto');
  }
  getProductosMarcas(){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Producto/ProductosMarcas');
  }
  
  getProductoClave(producto){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetProductoClaveProducto/'+producto);
  }

  GetTarimaProducto(producto: string, bodega: string): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaProducto?producto='+ producto+ '&bodega='+bodega);
  }
  GetTarimaProductoAllBodegas(producto: string): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaProductoAllBodegas/'+producto);
  }
  GetTarimaProductoD(producto: string, lote: string): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetTarimaProductoD?producto='+ producto+'&lote='+lote);
  }
  GetSumatoriaAllBodegas(): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetSumatoriaAllBodegas');
  }
  GetSumatoriaBodega(bodega: string): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetSumatoriaBodega/'+bodega);
  }
  

  getTarimaCompra(id): Observable <any[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetCompraTarima/'+id);
  }


  //^Actualizacion Almacen 

  //^Obtener Informacion Producto en base a Clave, Lote y Bodega
  GetGetProductoInformacionBodega(ClaveProducto: string, Lote: string, bodega: string): Observable <DetalleTarima[]>{
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleTarima[]>(this.APIUrl + '/Tarima/GetProductoInformacionBodega/'+ClaveProducto+'/'+Lote+'/'+bodega);
  }

  //^Update campos detalle tarima
updateDetalleTarimaSacosPesoTarimasBodega(dt: DetalleTarima) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Tarima/UpdateDetalleTarimaSacosPesoTarimasBodega', dt);
  }

  //^Obtener Ultimo Detalle Tarima 
  getUltimoDetalleTarima(){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetUltimoDetalleTarima');
  }

  //^Obtener Detalle Tarima por Bodega 
  getDetalleTarimaBodega(bodega: string){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetDetalleTarimaBodega/'+bodega);
  }
  //^Obtener Detalle Tarima por Bodega (ORDENADO POR CLAVE PRODUCTO)
  getDetalleTarimaBodegaOrdenado(bodega: string){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetDetalleTarimaBodegaOrdernado/'+bodega);
  }
  //^Obtener JOIN Compra con detalle Tarima (para obtener los Documentos)
  getJOINCompraDetalleTarima(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetJOINCompraDetalleTarima/'+id);
  }
  getDetalleTarimaOT(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/DetalleTarimaOT/'+id);
  }
  //^Obtener Detalle Compra por Id Compra y por Clave Producto (para obtener los Documentos)
  GetDetalleCompraIdClave(id: number, clave:string){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetDetalleCompraIdClave/'+id+'/'+clave);
  }
  //^Obtener Detalle Tarima por Bodega 
  getDetalleTarimaClaveLoteBodega(Clave: string, Lote: string, bodega: string){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Tarima/GetDetalleTarimaClaveLoteBodega/'+Clave+'/'+Lote+'/'+bodega);
  }
  //^Actualizar Detalle Tarima por Bodega 
  getUpdateDetalleTarimaBodega(id: number, bodega: string){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put<any[]>(this.APIUrl + '/Tarima/UpdateDetalleTarimaBodega/'+id+'/'+bodega, null);
  }


  generarConsulta(consulta){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Tarima/consulta',consulta)
  }


  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
      
  private _listenerDt = new Subject<any>(); 
      listenDt(): Observable<any> {
        return this._listenerDt.asObservable();
      }
      filterDt(filterBy: string) {
        this._listenerDt.next(filterBy);
      }

  private _listenerSc = new Subject<any>(); 
  listenerScan(): Observable<any> {
        return this._listenerSc.asObservable();
      }
      filterScan(filterBy: string) {
        this._listenerDt.next(filterBy);
      }
}
