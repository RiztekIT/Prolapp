import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable } from 'rxjs';


import {Subject} from 'rxjs';
import { Empresa } from '../../Models/Empresas/empresa-model';
import { environment } from 'src/environments/environment';






@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  
  

  constructor(private http:HttpClient) { }

  empresaActual;

  formData = new Empresa();

  EmpresaFoto: Empresa;

  APIUrl = environment.APIUrl;

  getEmpresaList(): Observable <Empresa[]> {
    return this.http.get<Empresa[]>(this.APIUrl + '/empresa');
  }

  getEmpresaFoto():Observable <any[]>{
    return this.http.get<any[]>(this.APIUrl + '/empresa/EmpresaFoto');
  }

  getLastEmpresa(): Observable <any> {
    return this.http.get<any>(this.APIUrl + '/empresa/LastEmpresa');
  }

  updateEmpresa(empresa: Empresa) {
    return this.http.put(this.APIUrl+ '/empresa', empresa);
    }    
  
  updateEmpresaFoto(fotofinal) {
   
   return this.http.put( this.APIUrl + '/Empresa/EditarEmpresaFoto/', fotofinal)
  }
  
  addEmpresa(empresa: Empresa){
    return this.http.post(this.APIUrl + '/empresa', empresa )
  }

  deleteEmpresa(id: number){
    return this.http.delete(this.APIUrl +'/empresa/BorrarEmpresa/'+ id)
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

