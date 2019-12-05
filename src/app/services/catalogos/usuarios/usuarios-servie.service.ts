import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../../../Models/catalogos/usuarios-model/usuarios-model';
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


}
