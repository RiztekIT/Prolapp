
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UnidadMedida } from '../../Models/Unidad-Medida/unidadmedida-model';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { UnidadMedidaDetalle } from '../../Models/Unidad-Medida/unidadmedidaDetalle-model';

//Import para obtener Datos API Unidad medida de SAT
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

//Variable
const httpUnidadMedidaSAT = {
  headers: new HttpHeaders({
    'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x',
    'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t',
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
export class UnidadMedidaService {

  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }
  formData: UnidadMedida;
  master = new Array<UnidadMedidaDetalle>();
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

//Get unidades medida API SAT
 //Get Unidades De Medida
 unidadMedidaAPISAT(): Observable<any>{
  let rootURLUM = "/api/v3/catalogo/ClaveUnidad";
  return this.http.get(rootURLUM, httpUnidadMedidaSAT);
}
//Get unidades medida API PROLAPP
GetUnidadesMedida(): Observable <UnidadMedida[]>{
  return this.http.get<any[]>(this.APIUrl + '/UnidadMedida');
}
// Obtener Unidades de medida en base a CLAVE SAT
GetUnidadMedidaClaveSAT(ClaveSAT: string): Observable <UnidadMedida[]>{
  return this.http.get<any[]>(this.APIUrl + '/UnidadMedida/Checkbox/' + ClaveSAT);
}
//Agregar Unidad Medida
addUnidadMedida(um: UnidadMedida) {
  return this.http.post(this.APIUrl + '/UnidadMedida', um);
}
//Actualziar Unidad Medida
//Eliminar Unidad Medida
deleteUnidadMedida(id:string) {
  return this.http.delete(this.APIUrl + '/UnidadMedida/' + id);
}
private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}

}
