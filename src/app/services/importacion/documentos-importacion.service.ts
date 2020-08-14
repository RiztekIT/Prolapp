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

export const APIUrl = environment.APIUrl;
export const URLApiEMail = environment.APIUrlEmail;

@Injectable({
  providedIn: 'root'
})
export class DocumentosImportacionService {

  constructor(private http:HttpClient) { }

  master = new Array<any>();

  //Se asigna al agregar documemnto
  folioOrdenDescarga: number;

  //Obtener Documentos
 getDocumentos(): Observable <Documento[]>{
  return this.http.get<Documento[]>(APIUrl + '/Documentos');
}
 //Obtener Documento por Folio, Tipo y nombre
 getDocumentoFTN(documento: Documento):Observable<Documento[]>{
  return this.http.post<Documento[]>(APIUrl + '/Documentos/GetDocumentoFTN', documento);
}
//Obtener Ordenes Descarga Descargadas
getOrdenesDescargadas(): Observable <OrdenDescarga[]>{
  return this.http.get<OrdenDescarga[]>(APIUrl + '/Documentos/GetOrdenesDescargadas');
}
//Obtener detalle Orden Descarga por IdOrdenDescarga
getDetalleOrdenDescargaId(id: number): Observable <DetalleOrdenDescarga[]>{
  return this.http.get<DetalleOrdenDescarga[]>(APIUrl + '/Documentos/GetDetalleODId/'+id);
}
//Obtener Orden Descarga por Folio y estus Descargada
getOrdenDescargaFolio(folio: number): Observable <OrdenDescarga[]>{
  return this.http.get<OrdenDescarga[]>(APIUrl + '/Documentos/GetOrdenDescargaFolio/'+folio);
}
//Obtener Documento por Folio, Tipo y Modulo
getDocumentoFolioTipoModulo(folio: number, tipo: string, modulo: string):Observable<Documento[]>{
  return this.http.get<Documento[]>(APIUrl + '/Documentos/GetDocumentoFolioTipo/'+folio+'/'+tipo+'/'+modulo);
}
//Obtener Join Ordenes Descargadas con Documento
getJoinDodD(id: number, clave:string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/Documentos/GetJoinDodD/'+id+'/'+clave);
}
//Obtener Compras Terminadas
getComprasTerminadas(): Observable <Compras[]>{
  return this.http.get<Compras[]>(APIUrl + '/Documentos/GetComprasTerminadas');
}
//Obtener detalleCompras por IdCompra
getDetalleCompraId(id: number): Observable <DetalleCompra[]>{
  return this.http.get<DetalleCompra[]>(APIUrl + '/Documentos/GetDetalleCompraId/'+id);
}
//Obtener Join Compras Terminadas con Documento
getJoinDcD(id: number, clave: string):Observable<any[]>{
  return this.http.get<any[]>(APIUrl + '/Documentos/GetJoinDcD/'+id+'/'+clave);
}
//Insert documento
addDocumento(documento: Documento) {
  return this.http.post(APIUrl + '/Documentos', documento);
}
//Update Documento
updateDocumento(documento: Documento) {
  return this.http.put(APIUrl+ '/Documentos', documento);
  }
  //Eliminar documentopor IdDocumento
  deleteDocumento(id: number){
    return this.http.delete(APIUrl+ '/Documentos/BorrarDocumento/' + id);
  }

  //Borrar documento por tipo, folio y nombre
  deleteDocumentoTFN(documento: Documento) {
    return this.http.post(APIUrl + '/Documentos/BorrarDocumentoTFN', documento);
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
  readDirDocuemntosServer(body, url){
    return this.http.post<any>(URLApiEMail+"/"+url,body);
    // return this._http.post<any>(this.URLApiEMail+"/cargarNombreDocuemntosOrdenCarga",body);
  }

  /******************** MANAGE SERVER'S DOCUMENTS ***********************/





  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}
