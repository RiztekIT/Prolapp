import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Incidencias } from '../../../Models/Incidencias/incidencias-model';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';

export const APIUrl = environment.APIUrl;
export const URLApiEMail = environment.APIUrlEmail;

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  constructor(private http:HttpClient) { }


  incidenciaObject: Incidencias;


//Obtener Incidencias
getIncidencias(): Observable <Incidencias[]>{
  return this.http.get<Incidencias[]>(APIUrl + '/Incidencias');
}
//Obtener Incidencia ID
getIncidenciaId(id: number): Observable <Incidencias[]>{
  return this.http.get<Incidencias[]>(APIUrl + '/Incidencias/GetIncidenciaId/'+id);
}
//Obtener Incidencia Folio
getIncidenciaFolio(folio: number): Observable <Incidencias[]>{
  return this.http.get<Incidencias[]>(APIUrl + '/Incidencias/GetIncidenciaFolio/'+folio);
}
//Obtener Incidencia Procedencia
getIncidenciaProcedencia(procedencia: string): Observable <Incidencias[]>{
  return this.http.get<Incidencias[]>(APIUrl + '/Incidencias/GetIncidenciaProcedencia/'+procedencia);
}
//Obtener Incidencia Estatus
getIncidenciaEstatus(estatus: string): Observable <Incidencias[]>{
  return this.http.get<Incidencias[]>(APIUrl + '/Incidencias/GetIncidenciaEstatus/'+estatus);
}
//Obtener Incidencia new Folio
getIncidenciaNewFolio(): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Incidencias/GetNewFolio');
}
//Obtener Orden Carga Folio
getOrdenCargaFolio(folio: number): Observable <OrdenCarga[]>{
  return this.http.get<OrdenCarga[]>(APIUrl + '/Incidencias/GetOrdenCargaFolio/'+folio);
}
//Obtener Orden Descarga Folio
getOrdenDescargaFolio(folio: number): Observable <OrdenDescarga[]>{
  return this.http.get<OrdenDescarga[]>(APIUrl + '/Incidencias/GetOrdenDescargaFolio/'+folio);
}
//Obtener List Orden Carga ID
getListOrdenCargaId(id: number): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Incidencias/GetListOrdenesCargaId/'+id);
}
//Obtener List Orden Descarga ID
getListOrdenDescargaId(id: number): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Incidencias/GetListOrdenesDescargaId/'+id);
}
//Obtener detalleOrdenCarga Id / Iddetalle
getDetalleOrdenCargaIddetalle(id: number, iddetalle:number): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Incidencias/GetDetalleCargaIdDetalle/'+id+'/'+iddetalle);
}
//Obtener detalleOrdenDescarga Id / Iddetalle
getDetalleOrdenDescargaIddetalle(id: number, iddetalle:number): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Incidencias/GetDetalleDescargaIdDetalle/'+id+'/'+iddetalle);
}


//Insert Incidencia
addIncidencia(incidencia: Incidencias) {
  return this.http.post(APIUrl + '/incidencias', incidencia);
}
//Update Incidencia
updateIncidencia(incidencia: Incidencias) {
  return this.http.put(APIUrl+ '/incidencias', incidencia);
  }
  //Eliminar Incidencia por IdIncidencia
  deleteIncidencia(id: number){
    return this.http.delete(APIUrl+ '/Incidencias/BorrarIncidencia/' + id);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


}
