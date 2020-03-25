import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../../Models/catalogos/usuarios-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';
import { Proceso } from '../../Models/proceso-model';
import { procesoMasterDetalle } from '../../Models/procesomaster-model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuariosServieService {

  constructor(private http:HttpClient) { }
  formData: Usuario;
  areaData: Proceso;
  master = new Array<procesoMasterDetalle>();

  // readonly APIUrl = "https://localhost:44361/api";
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";


  getUsuariosList(): Observable <Usuario[]> {
    return this.http.get<Usuario[]>(this.APIUrl + '/usuario');
  }

  addUsuario(usuario: Usuario) {
    return this.http.post(this.APIUrl + '/usuario', usuario);
 }

 deleteUsuario(id:number) {
   return this.http.delete(this.APIUrl + '/usuario/' + id);

 }

 updateUsuario(usuario: Usuario) {
 return this.http.put(this.APIUrl+ '/usuario', usuario);
 }

 showAreaPrivilegio(id:number): Observable <Proceso[]>{
  return this.http.get<any>(this.APIUrl + '/proceso/ProcesoArea/');
 }

 GetProcesoNombre(area: any): Observable <any[]>{
  return this.http.get<procesoMasterDetalle[]>(this.APIUrl + '/proceso/ProcesoNombre/' + area);
 }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  getLogin(usuario: Usuario) {
    return this.http.post(this.APIUrl+ '/usuario/login/',usuario);
    }

}
