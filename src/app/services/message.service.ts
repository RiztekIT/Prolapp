import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  

  constructor(private _http: HttpClient) { }
  nombre;
  correo;
  cco;
  asunto;
  cuerpo;
  sendMessage(body){
    console.log(body);
    
    return this._http.post("http://riztekserver.ddns.net:3000/formulario", body)
  }
  saveFile(body){
    console.log(body);
    
    return this._http.post("http://riztekserver.ddns.net:3000/archivofact", body)
  }
  readFile(body){
    console.log(body);
    let headers = new HttpHeaders();
    headers = headers.set('Accept','application/pdf');

    
    // return this._http.get<any>("http://riztekserver.ddns.net:3000/cargarArchivo",{headers:headers, responseType:'arrayBuffer' as 'json'})
    return this._http.post<any>("http://riztekserver.ddns.net:3000/cargarArchivo",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
  }


  readDir(body){
    return this._http.post<any>("http://riztekserver.ddns.net:3000/cargarArchivo2",body);
  }
  // sendMessage2(body,files){
  //   console.log(body);
    
  //   return this._http.post("http://riztekserver.ddns.net:3000/formulario", body,files)
  // }
}
