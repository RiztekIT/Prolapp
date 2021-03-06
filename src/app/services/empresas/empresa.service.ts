import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable } from 'rxjs';


import {Subject} from 'rxjs';
import { Empresa } from '../../Models/Empresas/empresa-model';
import { environment } from 'src/environments/environment';

export const APIUrl = environment.APIUrl;



@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  

  constructor(private http:HttpClient) { }

  empresaActual;

  formData = new Empresa();

  EmpresaFoto: Empresa;

  getEmpresaList(): Observable <Empresa[]> {
    return this.http.get<Empresa[]>(APIUrl + '/empresa');
  }

  getEmpresaFoto():Observable <any[]>{
    return this.http.get<any[]>(APIUrl + '/empresa/EmpresaFoto');
  }

  getLastEmpresa(): Observable <any> {
    return this.http.get<any>(APIUrl + '/empresa/LastEmpresa');
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(APIUrl+ '/empresa', empresa);
    }    
  
  updateEmpresaFoto(fotofinal) {
   
   return this.http.put( APIUrl + '/Empresa/EditarEmpresaFoto/', fotofinal)
  }
  
  addEmpresa(empresa: Empresa){
    return this.http.post(APIUrl + '/empresa', empresa )
  }

  deleteEmpresa(id: number){
    return this.http.delete(APIUrl +'/empresa/BorrarEmpresa/'+ id)
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

