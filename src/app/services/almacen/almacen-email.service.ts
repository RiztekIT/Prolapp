import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlmacenEmailService {

  URLApiEMail = environment.APIUrlEmail;
  

  constructor( private _http: HttpClient ) { }

  nombre;
  correo;
  cco;
  asunto;
  cuerpo;
  folio: number;

  //Enviar Correo
  sendMessage(body){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/correo", body)
  }

  //Guardar Archivos en el servidor
  saveFile(body){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/guardarDocumentoOrdenCarga", body)
  }

  //borrar Documento
  deleteDocumentoOrdenCarga(body){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/borrarDocumentoOrdenCarga", body)
    
    }
    //Regresa los documentos
      readDocumentos(body){
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('Accept','application/pdf');
        return this._http.post<any>(this.URLApiEMail+"/ObtenerDocumentoOrdenCarga",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
      }
    

}
