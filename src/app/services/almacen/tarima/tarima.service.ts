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

export const APIUrl = environment.APIUrl;
// export const APIUrl = 'https://localhost:44361/api';

@Injectable({
  providedIn: 'root'
})
export class TarimaService {

  constructor(private http:HttpClient) { }

  tarimaData = new Tarima();
  dataTarima: any;
  tarimaDetalleData = new DetalleTarima();
  tarimaDetalleDOD = new Array<DetalleOrdenDescarga>();
  formDataDrop = new Tarima();
  tarimaTrafico;

  master;

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
    return this.http.get<Tarima[]>(APIUrl + '/Tarima');
  }

  //^Obtener detalles de Tarima por IdTarima
getDetalleTarimaID(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaID/'+ id);
}
 //^Obtener detalles de Tarima por IdDetalleTarima
 getDetalleTarimaIDdetalle(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaIDdetalle/'+ id);
}
  //^Obtener Tarima por IdTarima
getTarimaID(id: number): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaID/'+ id);
}
  //^Obtener Ultima Tarima
  getUltimaTarima(): Observable <Tarima[]>{
    return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetUltimaTarima');
  }
  //^Obtener Tarima por QR code
  getTarimaQR(qr : string): Observable <any[]>{
    return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaQR/'+ qr);
  }
  //^Obtener detalle tarima por IdTarima, claveProducto, lote
  getDetalleTarimaIdClaveLote(id: number, clave: string, lote: string): Observable <DetalleTarima[]>{
    return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaIdClaveLote/' + id + '/' + clave + '/' + lote);
  }

//^Insert Tarima
addTarima(t: Tarima) {
  return this.http.post(APIUrl + '/Tarima', t);
}
//^Update Tarima
updateTarima(t: Tarima) {
  return this.http.put(APIUrl+ '/Tarima', t);
  }
  //^Update Tarima ( Sacos y peso Total)
  updateTarimaSacosPeso(id: number, sacos: string, peso: string) {
    return this.http.put(APIUrl+ '/Tarima/UpdateTarimaSacosPeso/' + id + '/' + sacos + '/' + peso , null);
    }
    //^Update Tarima ( Sacos y peso Total)
  updateDetalleTarimaIdSacos(idt: number, iddt:number, sacos: string) {
    return this.http.put(APIUrl+ '/Tarima/UpdateDetalleTarimaIdSacos/' + idt + '/' + iddt + '/' + sacos , null);
    }
//^Insert Detalle Tarima
addDetalleTarima(dt: DetalleTarima) {
  return this.http.post(APIUrl + '/Tarima/AddDetalleTarima', dt);
}
//^Update Detalle Tarima
updateDetalleTarima(dt: DetalleTarima) {
  return this.http.put(APIUrl+ '/Tarima', dt);
  }
//^Insert Traspaso Tarima
addTraspasoTarima(tt: TraspasoTarima) {
  return this.http.post(APIUrl + '/TraspasoTarima', tt);
}
//^Update Traspaso Tarima
updateTraspasoTarima(tt: TraspasoTarima) {
  return this.http.put(APIUrl+ '/TraspasoTarima', tt);
  }
  //^Eliminar detalle tarima
  deleteDetalleTarima(id: number){
    return this.http.delete(APIUrl+ '/Tarima/BorrarDetalleTarima/' + id);
  }
//^Eliminar tarima
deleteTarima(id: number){
  return this.http.delete(APIUrl+ '/Tarima/BorrarTarima/' + id);
}

//^Obtener Informacion de Usuario por NombreUsuario
//^Obtener Tarima por QR code
getUsuario(nombreUsuario : string): Observable <Usuario[]>{
  return this.http.get<Usuario[]>(APIUrl + '/usuario/userinfo/'+ nombreUsuario);
}

GetTarimaDttqr(qr: string): Observable<Tarima[]> {
  return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetTarimaDttqr/' + qr);

}
GetTarimaBodegaQR(qr: string, bodega:string): Observable<Tarima[]> {
  return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetTarimaBodegaQR/'+qr+'/'+bodega);
}
GetTarimaOC(idoc): Observable<Tarima[]> {
  return this.http.get<Tarima[]>(APIUrl + '/Tarima/TarimaOC/'+idoc);
}

GetTarimaBodega(): Observable<any[]> {
  return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaBodega');
}

updateBodegaTarima(bodega:string, qr:string) {
  return this.http.put(APIUrl+ '/Tarima/UpdateBodega/'+bodega+'/'+qr,null);
  }

  getProductos(){
    return this.http.get<any[]>(APIUrl + '/Producto');
  }
  
  getProductoClave(producto){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetProductoClaveProducto/'+producto);
  }

  GetTarimaProducto(producto: string, bodega: string): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaProducto?producto='+ producto+ '&bodega='+bodega);
  }
  GetTarimaProductoAllBodegas(producto: string): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaProductoAllBodegas/'+producto);
  }
  GetTarimaProductoD(producto: string, lote: string): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/Tarima/GetTarimaProductoD?producto='+ producto+'&lote='+lote);
  }
  GetSumatoriaAllBodegas(): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/Tarima/GetSumatoriaAllBodegas');
  }
  GetSumatoriaBodega(bodega: string): Observable<any[]> {
    return this.http.get<any[]>(APIUrl + '/Tarima/GetSumatoriaBodega/'+bodega);
  }
  

  getTarimaCompra(id): Observable <any[]>{
    return this.http.get<any[]>(APIUrl + '/Tarima/GetCompraTarima/'+id);
  }


  //^Actualizacion Almacen 

  //^Obtener Informacion Producto en base a Clave, Lote y Bodega
  GetGetProductoInformacionBodega(ClaveProducto: string, Lote: string, bodega: string): Observable <DetalleTarima[]>{
    return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetProductoInformacionBodega/'+ClaveProducto+'/'+Lote+'/'+bodega);
  }

  //^Update campos detalle tarima
updateDetalleTarimaSacosPesoTarimasBodega(dt: DetalleTarima) {
  return this.http.put(APIUrl+ '/Tarima/UpdateDetalleTarimaSacosPesoTarimasBodega', dt);
  }

  //^Obtener Ultimo Detalle Tarima 
  getUltimoDetalleTarima(){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetUltimoDetalleTarima');
  }

  //^Obtener Detalle Tarima por Bodega 
  getDetalleTarimaBodega(bodega: string){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetDetalleTarimaBodega/'+bodega);
  }
  //^Obtener Detalle Tarima por Bodega (ORDENADO POR CLAVE PRODUCTO)
  getDetalleTarimaBodegaOrdenado(bodega: string){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetDetalleTarimaBodegaOrdernado/'+bodega);
  }
  //^Obtener JOIN Compra con detalle Tarima (para obtener los Documentos)
  getJOINCompraDetalleTarima(id: number){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetJOINCompraDetalleTarima/'+id);
  }
  getDetalleTarimaOT(id: number){
    return this.http.get<any[]>(APIUrl + '/Tarima/DetalleTarimaOT/'+id);
  }
  //^Obtener Detalle Compra por Id Compra y por Clave Producto (para obtener los Documentos)
  GetDetalleCompraIdClave(id: number, clave:string){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetDetalleCompraIdClave/'+id+'/'+clave);
  }
  //^Obtener Detalle Tarima por Bodega 
  getDetalleTarimaClaveLoteBodega(Clave: string, Lote: string, bodega: string){
    return this.http.get<any[]>(APIUrl + '/Tarima/GetDetalleTarimaClaveLoteBodega/'+Clave+'/'+Lote+'/'+bodega);
  }
  //^Actualizar Detalle Tarima por Bodega 
  getUpdateDetalleTarimaBodega(id: number, bodega: string){
    return this.http.get<any[]>(APIUrl + '/Tarima/UpdateDetalleTarimaBodega/'+id+'/'+bodega);
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
