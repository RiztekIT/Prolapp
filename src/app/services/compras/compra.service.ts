import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { environment } from 'src/environments/environment';
import { Compras } from '../../Models/Compras/compra-model';
import { DetalleCompra } from '../../Models/Compras/detalleCompra-model';
import { MasterCompra } from '../../Models/Compras/masterCompra-model';


export const APIUrl = environment.APIUrl;

// export const APIUrl = "https://localhost:44361/api";

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }
  //objeto para guardar datos del pdf
    formt: any;
    //form data para guardar los datos de Compras
    formData = new Compras();
    //form data para guardar los datos de los detalles de )compras
    formDataDC:DetalleCompra;
    //Id Compra
    IdCompra: number;
    //Master donde se guardara el master 
    master = new Array<MasterCompra>();


//Obtener Compras
    getComprasList(): Observable<Compras[]> {
      return this.http.get<Compras[]>(APIUrl + '/Compras');
    }
    //Obtener Compra por ID
    getComprasId(id:number): Observable<Compras[]> {
      return this.http.get<Compras[]>(APIUrl + '/compras/getComprasID/'+id);
    }
    //Obtener Compra por Folio
    getComprasFolio(folio:number): Observable<Compras[]> {
      return this.http.get<Compras[]>(APIUrl + '/compras/getComprasFolio/'+folio);
    }
    //Obtener Detalles Compra por IdCompra
    getDetalleComprasID(id:number): Observable<DetalleCompra[]> {
      return this.http.get<DetalleCompra[]>(APIUrl + '/compras/getDetalleComprasID/'+id);
    }
//Obtener FolioCompra +1
getNewFolio():Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/compras/CompraFolio');
}
//Obtener Id Ultima Compra
getUltimoIdCompra():Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/compras/GetUltimoIdCompra');
}
//Obtener sumatoria de totales en base a IdCompra
getSumatoriaIdCompra(id: number):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/compras/GetDCsumatoria/'+id);
}

    addCompra(compra: Compras) {
      return this.http.post(APIUrl + '/Compras', compra)
    }
    deleteCompra(id: number) {
      return this.http.delete(APIUrl + '/Compras/DeleteCompra/' + id)
    }
    updateCompra(compra:Compras) {
      return this.http.put(APIUrl + '/Compras',compra);
    }
    addDetalleCompra(dcompra: DetalleCompra) {
      return this.http.post(APIUrl + '/Compras/AddDetalleCompra', dcompra)
    }
    deleteDetalleCompra(id: number) {
      return this.http.delete(APIUrl + '/Compras/DeleteDetalleCompra/' + id)
    }
    //Eliminar todos los detalles compra por IDCompra
    deleteDetalleCompraID(id: number) {
      return this.http.delete(APIUrl + '/Compras/DeleteAllDetalleCompras/' + id)
    }
    updateDetalleCompra(dcompra:DetalleCompra) {
      return this.http.put(APIUrl + '/Compras/EditDetalleCompra',dcompra);
    }

    //  ------------ REPORTES ------------------  //

    //obtener lista de proveedores
    getProveedoresList():Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/proveedor');
    }

    //Obtener Proveedor por Id
    getProveedorId(id: number):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/proveedor/getProveedorId/'+id);
    }

    //Obtener reporte compras por proveedor ID
    getReporteProveedorId(id: number):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/ReporteCompras/'+id);
    }
//obtener reporte compras por proveedor ID y por estatus de la compra
    getReporteProveedorIdEstatus(id:number, estatus:string):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/ReporteComprasStatus/'+id+'/'+estatus);
    }
//obtener reporte compras por Fecha Inicial / final y  proveedor ID
    getReporteFechasProveedorId(fechaini, fechafinal, id:number):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/ComprasFechas/'+fechaini+'/'+fechafinal+'/'+id);
    }
//obtener reporte compras por Fecha Inicial / final ,  proveedor ID y estatus
    getReporteFechasProveedorIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
      return this.http.get<any[]>(APIUrl + '/reportes/ComprasFechas/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
    }

    //  ------------ REPORTES ------------------  //

  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}
