import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../../Models/catalogos/usuarios-model';
import {Observable } from 'rxjs';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServieService {

  constructor(private http:HttpClient) { }
  formData: Usuario;

  readonly APIUrl = "https://localhost:44361/api";


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


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}
