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
  sendMessageAlmacen(body){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/correo", body)
  }

  //Guardar Archivos en el servidor
  saveFileAlmacen(body, url){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/"+url, body)
    // return this._http.post(this.URLApiEMail+"/guardarDocumentoOrdenCarga", body)
  }

  //borrar Documento
  deleteDocumentoAlmacen(body,url){
    console.log(body);
    return this._http.post(this.URLApiEMail+"/"+url, body)
    // return this._http.post(this.URLApiEMail+"/borrarDocumentoOrdenCarga", body)
    
    }
    //Regresa los documentos
      readDocumentosAlmacen(body, url){
        console.log(body)
        let headers = new HttpHeaders();
        headers = headers.set('Accept','application/pdf');
        return this._http.post<any>(this.URLApiEMail+"/"+url,body,{headers:headers, responseType:'arrayBuffer' as 'json'})
        // return this._http.post<any>(this.URLApiEMail+"/ObtenerDocumentoOrdenCarga",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
      }
    //Regresa el nombre de los archivos
    readDirDocuemntosAlmacen(body, url){
      return this._http.post<any>(this.URLApiEMail+"/"+url,body);
      // return this._http.post<any>(this.URLApiEMail+"/cargarNombreDocuemntosOrdenCarga",body);
    }
}
