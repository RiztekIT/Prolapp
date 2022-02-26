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

  
  APIUrl = environment.APIUrl;
  


  getUsuariosList(): Observable <Usuario[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Usuario[]>(this.APIUrl + '/usuario');
  }
  getUsuarioNombreU(usuario: string): Observable <Usuario[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Usuario[]>(this.APIUrl + '/usuario/userinfo/' + usuario);
  }

  addUsuario(usuario: Usuario) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/usuario', usuario);
 }

 deleteUsuario(id:number) {
  this.APIUrl = sessionStorage.getItem('API')
   return this.http.delete(this.APIUrl + '/usuario/' + id);

 }

 updateUsuario(usuario: Usuario) {
  this.APIUrl = sessionStorage.getItem('API')
 return this.http.put(this.APIUrl+ '/usuario', usuario);
 }

 showAreaPrivilegio(id:number): Observable <Proceso[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<any>(this.APIUrl + '/proceso/ProcesoArea/');
 }

 GetProcesoNombre(area: any): Observable <any[]>{
  this.APIUrl = sessionStorage.getItem('API')
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
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl+ '/usuario/login/',usuario);
    }

    checadas(){
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get(this.APIUrl+'/usuario/login');
    }
    checadasfechas(fecha){
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get(this.APIUrl+'/usuario/login/'+fecha);
    }
    
    checadorSemanaFechas(fecha1, fecha2):Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/usuario/loginFechas/'+fecha1+'/'+fecha2);
    }
    checadorSemanaFechasIdUsuario(fecha1, fecha2, id):Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/usuario/loginFechasId/'+fecha1+'/'+fecha2+'/'+id);
    }
    //^ Traer usuario que se logearon durante una semana en especifico
    checadorFechasSemana(fecha1, fecha2):Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/usuario/loginSemana/'+fecha1+'/'+fecha2);
    }
    checadorSemanaFechasUsuario(fecha1, fecha2, usuario:string):Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/usuario/loginFechasUser/'+fecha1+'/'+fecha2+'/'+usuario);
    }

    //^ Obtener Earliest Inicio de Sesion dependiendo x fecha y por Usuario
    checadorEarliestDateUsuario(diaLimite, diaInicio, diaFin, mesInicio, mesFin, yearInicio, yearFin, usuario):Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+'/usuario/loginEarliestDatesUser/'+diaLimite+'/'+diaInicio+'/'+diaFin+'/'+mesInicio+'/'+mesFin+'/'+yearInicio+'/'+yearFin+'/'+usuario);
    }
}
