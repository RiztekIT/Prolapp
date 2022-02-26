import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { environment } from 'src/environments/environment';
import { Compras } from '../../Models/Compras/compra-model';
import { DetalleCompra } from '../../Models/Compras/detalleCompra-model';
import { MasterCompra } from '../../Models/Compras/masterCompra-model';
import { ComprasHistorial } from 'src/app/Models/Compras/comprahistorial-model';



 

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

    // Master de historial
    compraInfo = new Array<ComprasHistorial>();

    compra;

    APIUrl = environment.APIUrl;


//Obtener Compras
generarConsulta(consulta) {
  let query = {
    'consulta':consulta
  };
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Compras/consulta', query);
}
    getComprasList(): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/Compras');
    }
    //Obtener Compra por ID
    getComprasId(id:number): Observable<Compras[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Compras[]>(this.APIUrl + '/compras/getComprasID/'+id);
    }
    //Obtener Compra por Folio
    getComprasFolio(folio:number): Observable<Compras[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Compras[]>(this.APIUrl + '/compras/getComprasFolio/'+folio);
    }
    //Obtener Detalles Compra por IdCompra
    getDetalleComprasID(id:number): Observable<DetalleCompra[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<DetalleCompra[]>(this.APIUrl + '/compras/getDetalleComprasID/'+id);
    }
//Obtener FolioCompra +1
getNewFolio():Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/compras/CompraFolio');
}
//Obtener Id Ultima Compra
getUltimoIdCompra():Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/compras/GetUltimoIdCompra');
}
//Obtener sumatoria de totales en base a IdCompra
getSumatoriaIdCompra(id: number):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/compras/GetDCsumatoria/'+id);
}

    addCompra(compra: Compras) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.post(this.APIUrl + '/Compras', compra)
    }
    deleteCompra(id: number) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.delete(this.APIUrl + '/Compras/DeleteCompra/' + id)
    }
    updateCompra(compra:Compras) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.put(this.APIUrl + '/Compras',compra);
    }
    addDetalleCompra(dcompra: DetalleCompra) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.post(this.APIUrl + '/Compras/AddDetalleCompra', dcompra)
    }
    deleteDetalleCompra(id: number) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.delete(this.APIUrl + '/Compras/DeleteDetalleCompra/' + id)
    }
    //Eliminar todos los detalles compra por IDCompra
    deleteDetalleCompraID(id: number) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.delete(this.APIUrl + '/Compras/DeleteAllDetalleCompras/' + id)
    }
    updateDetalleCompra(dcompra:DetalleCompra) {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.put(this.APIUrl + '/Compras/EditDetalleCompra',dcompra);
    }

    //^ Obtener Compra por Estatus
    getCompraEstatus(estatus):Observable<Compras[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Compras[]>(this.APIUrl + '/Compras/GetCompraEstatus/'+estatus);
    }


    //  ------------ REPORTES ------------------  //

    //obtener lista de proveedores
    getProveedoresList():Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/proveedor');
    }

    //Obtener Proveedor por Id
    getProveedorId(id: number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/proveedor/getProveedorId/'+id);
    }

    //Obtener reporte compras por proveedor ID
    getReporteProveedorId(id: number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/ReporteCompras/'+id);
    }
    //obtener reporte compras por proveedor ID y por estatus de la compra
    getReporteProveedorIdEstatus(id:number, estatus:string):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/ReporteComprasStatus/'+id+'/'+estatus);
    }
    //obtener reporte compras por Fecha Inicial / final y  proveedor ID
    getReporteFechasProveedorId(fechaini, fechafinal, id:number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/ComprasFechas/'+fechaini+'/'+fechafinal+'/'+id);
    }
    //obtener reporte compras por Fecha Inicial / final ,  proveedor ID y estatus
    getReporteFechasProveedorIdEstatus(fechaini, fechafinal, id:number, estatus: string):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/reportes/ComprasFechas/'+fechaini+'/'+fechafinal+'/'+id+'/'+estatus);
    }

    //!  ------------ Historial ------------------  //
    
    // ^ get compras que esten relacionadas con OD
    getComprasHistorialList(): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/Compras/GetComprasHistorial');
    }
    GetComprasOrderFolio(): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/Compras/GetComprasOrderFolio');
    }
    // ^ Obtener Compra por rango de Fechas y que esten relacionadas con OD
    getComprasFecha(fecha, fecha1): Observable<Compras[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<Compras[]>(this.APIUrl + '/compras/GetComprasFecha/'+fecha+'/'+fecha1);
    }
    
    //Obtener reporte compras por proveedor ID
    GetComprasODDIdProveedor(id: number):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/compras/GetComprasODDIdProveedor/'+id);
    }

    //Obtener reporte compras por Estatus
    GetComprasODDEstatus(estatus: string):Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/compras/GetComprasODDEstatus/'+estatus);
    }












  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}
