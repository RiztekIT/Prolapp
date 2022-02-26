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

 


export const URLApiEMail = environment.APIUrlEmail;

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  constructor(private http:HttpClient) { }
  APIUrl = environment.APIUrl;


  incidenciaObject: Incidencias;


//Obtener Incidencias
getIncidencias(): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias');
}
//Obtener Incidencia ID
getIncidenciaId(id: number): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias/GetIncidenciaId/'+id);
}
//Obtener Incidencia Folio
getIncidenciaFolio(folio: number): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias/GetIncidenciaFolio/'+folio);
}
//Obtener Incidencia Procedencia
getIncidenciaProcedencia(procedencia: string): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias/GetIncidenciaProcedencia/'+procedencia);
}
//Obtener Incidencia Por FolioProcedencia
GetIncidenciaFolioProcedencia(Folio: string, procedencia: string): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias/GetIncidenciaFolioProcedencia/'+Folio+ '/' +procedencia);
}
//Obtener Incidencia Estatus
getIncidenciaEstatus(estatus: string): Observable <Incidencias[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Incidencias[]>(this.APIUrl + '/Incidencias/GetIncidenciaEstatus/'+estatus);
}
//Obtener Incidencia new Folio
getIncidenciaNewFolio(): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Incidencias/GetNewFolio');
}
//Obtener Orden Carga Folio
getOrdenCargaFolio(folio: number): Observable <OrdenCarga[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<OrdenCarga[]>(this.APIUrl + '/Incidencias/GetOrdenCargaFolio/'+folio);
}
//Obtener Orden Descarga Folio
getOrdenDescargaFolio(folio: number): Observable <OrdenDescarga[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<OrdenDescarga[]>(this.APIUrl + '/Incidencias/GetOrdenDescargaFolio/'+folio);
}
//Obtener List Orden Carga ID
getListOrdenCargaId(id: number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Incidencias/GetListOrdenesCargaId/'+id);
}
//Obtener List Orden Descarga ID
getListOrdenDescargaId(id: number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Incidencias/GetListOrdenesDescargaId/'+id);
}
//Obtener detalleOrdenCarga Id / Iddetalle
getDetalleOrdenCargaIddetalle(id: number, iddetalle:number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Incidencias/GetDetalleCargaIdDetalle/'+id+'/'+iddetalle);
}
//Obtener detalleOrdenDescarga Id / Iddetalle
getDetalleOrdenDescargaIddetalle(id: number, iddetalle:number): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any[]>(this.APIUrl + '/Incidencias/GetDetalleDescargaIdDetalle/'+id+'/'+iddetalle);
}


//Insert Incidencia
addIncidencia(incidencia: Incidencias) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/incidencias', incidencia);
}
//Update Incidencia
updateIncidencia(incidencia: Incidencias) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/incidencias', incidencia);
  }
  //Eliminar Incidencia por IdIncidencia
  deleteIncidencia(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/Incidencias/BorrarIncidencia/' + id);
  }

  //REPORTES

  GetIncidenciasFechasProcedencia(fecha1, fecha2, procedencia){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasFechasProcedencia/'+fecha1+'/'+fecha2+'/'+procedencia);
  }
  GetIncidenciasFechas(fecha1, fecha2){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasFechas/'+fecha1+'/'+fecha2);
  }
  GetIncidenciasEstatusProcedencia(estatus, procedencia){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasEstatusProcedencia/'+estatus+'/'+procedencia);
  }
  GetIncidenciasEstatus(estatus){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasEstatus/'+estatus);
  }
  GetIncidenciasFechasProcedenciaEstatus(fecha1, fecha2, procedencia, estatus){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasFechasProcedenciaEstatus/'+fecha1+'/'+fecha2+'/'+procedencia+'/'+estatus);
  }
  GetIncidenciasFechasEstatus(fecha1, fecha2, estatus){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl+ '/Reportes/GetIncidenciasFechasEstatus/'+fecha1+'/'+fecha2+'/'+estatus);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


}
