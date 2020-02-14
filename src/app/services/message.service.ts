import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



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
  // sendMessage2(body,files){
  //   console.log(body);
    
  //   return this._http.post("http://riztekserver.ddns.net:3000/formulario", body,files)
  // }
}
