import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Documento } from 'src/app/Models/documentos/documento-model';
import { OrdenDescarga } from 'src/app/Models/almacen/OrdenDescarga/ordenDescarga-model';
import { Compras } from '../../Models/Compras/compra-model';
import { DetalleCompra } from '../../Models/Compras/detalleCompra-model';
import { DetalleOrdenDescarga } from '../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';




export const URLApiEMail = environment.APIUrlEmail;

@Injectable({ 
  providedIn: 'root'
})
export class DocumentosImportacionService {

  constructor(private http:HttpClient) { }

  master = new Array<any>();

  //Se asigna al agregar documemnto
  folioOrdenDescarga: number;
  importacion = false;
  productosimportacion;

  folioCompras: number;

  fileUrl: any;
  APIUrl = environment.APIUrl;

  //Obtener Documentos
 getDocumentos(): Observable <Documento[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Documento[]>(this.APIUrl + '/Documentos');
}
 //Obtener Documento por Folio, Tipo y nombre
 getDocumentoFTN(documento: Documento):Observable<Documento[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post<Documento[]>(this.APIUrl + '/Documentos/GetDocumentoFTN', documento);
}
//Obtener Ordenes Descarga Descargadas
getOrdenesDescargadas(): Observable <OrdenDescarga[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<OrdenDescarga[]>(this.APIUrl + '/Documentos/GetOrdenesDescargadas');
}
//Obtener detalle Orden Descarga por IdOrdenDescarga
getDetalleOrdenDescargaId(id: number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Documentos/GetDetalleODId/'+id);
}
//Obtener Orden Descarga por Folio y estus Descargada
getOrdenDescargaFolio(folio: number): Observable <OrdenDescarga[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<OrdenDescarga[]>(this.APIUrl + '/Documentos/GetOrdenDescargaFolio/'+folio);
}
//Obtener Compra por Folio y estatus Terminada
getCompraFolio(folio: number): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Documentos/GetCompraFolio/'+folio);
}
//Obtener Documento por Folio, Tipo y Modulo
getDocumentoFolioTipoModulo(folio: number, tipo: string, modulo: string):Observable<Documento[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Documento[]>(this.APIUrl + '/Documentos/GetDocumentoFolioTipoModulo/'+folio+'/'+tipo+'/'+modulo);
}
//Obtener Join Ordenes Descargadas con Documento
getJoinDodD(id: number, clave:string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Documentos/GetJoinDodD/'+id+'/'+clave);
}
//Obtener Compras Terminadas
getComprasTerminadas(): Observable <Compras[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Compras[]>(this.APIUrl + '/Documentos/GetComprasTerminadas');
}
//Obtener detalleCompras por IdCompra
getDetalleCompraId(id: number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Documentos/GetDetalleCompraId/'+id);
}
//Obtener Join Compras Terminadas con Documento
getJoinDcD(id: number, clave: string):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Documentos/GetJoinDcD/'+id+'/'+clave);
}
//Obtener  Documento por tipo y modulo
getDocumentoTipoModulo(tipo, modulo):Observable<any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Documentos/GetDocumentosTipoModulo/'+tipo+'/'+modulo);
}
//Insert documento
addDocumento(documento: Documento) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Documentos', documento);
}
//Update Documento
updateDocumento(documento: Documento) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Documentos', documento);
  }
  //Eliminar documentopor IdDocumento
  deleteDocumento(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/Documentos/BorrarDocumento/' + id);
  }

  //Borrar documento por tipo, folio y nombre
  deleteDocumentoTFN(documento: Documento) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Documentos/BorrarDocumentoTFN', documento);
  }

  //Borrar Documento por Folio, Modulo, tipo, nombre documento e iddetalle
  borrarDocumentoFMTDID(documento: Documento) {
    this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Documentos/BorrarDocumentoFMTDID', documento);
}
  //get documento por Folio, Modulo, Tipo, Nombre documento e iddetalle
  getDocumentoFMTDID(documento: Documento):Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
  return this.http.post<any[]>(this.APIUrl + '/Documentos/GetDocumentoFMTDID', documento);
}
//Update USDA
updateUSDA(usda: string, id: number) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Documentos/updateUsda/'+usda+'/'+id, null);
  }
updateUSDADetalle(usda: string, id: number) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Documentos/updateUsdaDetalle/'+usda+'/'+id, null);
  }
//Update pedimento
updatePedimento(pedimento: string, id: number) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Documentos/updatePedimento/'+pedimento+'/'+id, null);
  }
updatePedimentoDetalle(pedimento: string, id: number) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Documentos/updatePedimentoDetalle/'+pedimento+'/'+id, null);
  }

  /******************** MANAGE SERVER'S DOCUMENTS ***********************/

//Guardar Archivos en el servidor
saveFileServer(body, url){
  console.log(body);
  return this.http.post(URLApiEMail+"/"+url, body)
  // return this._http.post(this.URLApiEMail+"/guardarDocumentoOrdenCarga", body)
}

//borrar Documento
deleteDocumentoServer(body,url){
  console.log(body);
  return this.http.post(URLApiEMail+"/"+url, body)
  // return this._http.post(this.URLApiEMail+"/borrarDocumentoOrdenCarga", body)
  
  }
  //Regresa los documentos
    readDocumentosServer(body, url){
      console.log(body)
      let headers = new HttpHeaders();
      headers = headers.set('Accept','application/pdf');
      return this.http.post<any>(URLApiEMail+"/"+url,body,{headers:headers, responseType:'arrayBuffer' as 'json'})
      // return this._http.post<any>(this.URLApiEMail+"/ObtenerDocumentoOrdenCarga",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
    }
  //Regresa el nombre de los archivos
  // readDirDocumentosServer(body, url){
  //   console.log(url);
  //   // return this.http.post<any>(URLApiEMail+"/ObtenerDocumentoImportacionOrdenDescarga",body);
  
  //   return this.http.post<any>(URLApiEMail+"/"+url,body);
  //   // return this._http.post<any>(this.URLApiEMail+"/cargarNombreDocuemntosOrdenCarga",body);
  // }
  
  readDirDocuemntosServer(body, url){
    // return this.http.post<any>(URLApiEMail+"/"+url,body);
    // console.log(body);
    return this.http.post<any>(URLApiEMail+"/cargarNombreDocumentos",body);
    // return this._http.post<any>(this.URLApiEMail+"/cargarNombreDocuemntosOrdenCarga",body);
  }

  /******************** MANAGE SERVER'S DOCUMENTS ***********************/


  /*****   REPORTES DOCUMENTOS   *** */

  //get documentos
  getReporteDocumentos():Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetDocumentos');
  }
  //get documentos tipo modulo folio
  getReporteDocumentosInfo():Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetDocumentoTipoModuloFolio');
  }
  //get documentos fecha vigencia
  getReporteDocumentoFechas(fecha1, fecha2):Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetDocumentoFechas/'+fecha1+'/'+fecha2);
  }
  //get documentos por modulo tipo folio
  getReporteDocumentoModuloTipoFolio(modulo, tipo, folio):Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetDocumentoModuloTipoFolio/'+modulo+'/'+tipo+'/'+folio);
  }
  //get documentos por modulo tipo folio y fecha vigencia
  getReporteDocumentoModuloTipoFolioFecha(modulo, tipo, folio, fecha1, fecha2):Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetDocumentoModuloTipoFolioFecha/'+modulo+'/'+tipo+'/'+folio+'/'+fecha1+'/'+fecha2);
  }

  /*****   REPORTES DOCUMENTOS   *** */





  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}
