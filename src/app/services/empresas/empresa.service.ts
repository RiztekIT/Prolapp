import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable } from 'rxjs';


import {Subject} from 'rxjs';
import { Empresa } from '../../Models/Empresas/empresa-model';

export const APIUrl = "http://riztekserver.ddns.net:44361/api";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  

  constructor(private http:HttpClient) { }

  formData: Empresa;

  EmpresaFoto: Empresa;

  getEmpresaList(): Observable <Empresa[]> {
    return this.http.get<Empresa[]>(APIUrl + '/empresa');
  }

  getEmpresaFoto():Observable <any>{
    return this.http.get<any>(APIUrl + '/empresa/EmpresaFoto');
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(APIUrl+ '/empresa', empresa);
    }    
  
    updateEmpresaFoto(empresa: Empresa) {
   
      return this.http.put( APIUrl + '/Empresa/EditarEmpresaFoto', empresa)
    }


  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
  
  // subirArchivo( archivo: string ) {

  //   return new Promise( (resolve, reject ) => {

  //     let formData = new FormData();
  //     let xhr = new XMLHttpRequest();

  //     formData.append( 'imagen', archivo );

  //     xhr.onreadystatechange = function() {

  //       if ( xhr.readyState === 4 ) {

  //         if ( xhr.status === 200 ) {
  //           console.log( 'Imagen subida' );
  //           resolve( JSON.parse( xhr.response ) );
  //         } else {
  //           console.log( 'Fallo la subida' );
  //           reject( xhr.response );
  //         }

  //       }
  //     };

  //     let url = APIUrl + '/empresa/EmpresaFoto/' + archivo

  //     xhr.open('POST', url, true );
  //     xhr.send( formData );

  //   });

  // }

  // cambiarImagen(archivo: string){
  //   this.subirArchivo(archivo)
  //   .then( resp => {
  //    console.log(resp)
  //   })
  //   .catch( resp => {
  //    console.log(resp)
  //   })
  // }



}

