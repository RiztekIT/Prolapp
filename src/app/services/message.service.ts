import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';



@Injectable({
  providedIn: 'root'
})
export class MessageService {

  URLApiEMail = environment.APIUrlEmail;
  
  

  constructor(private _http: HttpClient) { }
  nombre;
  correo;
  cco;
  asunto;
  cuerpo;
  sendMessage(body){
    console.log(body);
    
    return this._http.post(this.URLApiEMail+"/formulario", body)
  }

  enviarCorreo(body){
    return this._http.post(this.URLApiEMail+"/correo",body)
  }

  
  saveFile(body){
    console.log(body);
    
    return this._http.post(this.URLApiEMail+"/archivofact", body)
  }

  //regresa el archivo solicitado
  readFile(body){
    console.log(body);
    let headers = new HttpHeaders();
    headers = headers.set('Accept','application/pdf');

    
    // return this._http.get<any>("http://riztekserver.ddns.net:3000/cargarArchivo",{headers:headers, responseType:'arrayBuffer' as 'json'})
    return this._http.post<any>(this.URLApiEMail+"/cargarArchivo",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
  }

//regresa el nombre de los archivos
  readDir(body){
    return this._http.post<any>(this.URLApiEMail+"/cargarArchivo2",body);
  }
  // sendMessage2(body,files){
  //   console.log(body);
    
  //   return this._http.post("http://riztekserver.ddns.net:3000/formulario", body,files)
  // }
}
