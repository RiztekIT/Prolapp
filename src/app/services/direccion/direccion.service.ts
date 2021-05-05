import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PrecioLeche } from '../../Models/precioLeche-model';


// export const APIUrl = environment.APIUrl;
 export const APIUrl = "https://localhost:44361/api";
//export const APIUrl = "http://riztekserver.ddns.net:44361/api";


@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  PrecioL = new PrecioLeche();
  DiaLeche = new PrecioLeche();

   //Tabla previsualizacion OD
   PreHistoricoLeche = new Array<PrecioLeche>();




    constructor(private http:HttpClient) { }

    //obtener historico PrecioLeche
    GetHistorialLeche():  Observable <any[]>{
      return this.http.get<any[]>(APIUrl + '/Direccion');
    }

  //trae el precio de la leche dependiendo de la fecha seleccionada
  GetHistorialLecheFecha(fecha: string): Observable <PrecioLeche[]>{
    return this.http.get<PrecioLeche[]>(APIUrl + '/Direccion/'+ fecha);
  }

  addHistoricoLeche(precioleche: PrecioLeche) {
    return this.http.post(APIUrl + '/Direccion', precioleche)
  }



    


  //Conectar con el servidor NODEJS para obtener Historial
  URLApiImagenes = environment.APIUrlEmail;
  
  // obtener el precio de hoy de la pagina de historico leche
  readHistorico(){
    let headers = new HttpHeaders();
    headers = headers.set('Accept','application/pdf');

    
    return this.http.post<any>(this.URLApiImagenes+"/historicoLeche",{headers:headers, responseType:'arrayBuffer' as 'json'})
  }
  // obtener el dia de de hoy de la pagina de historico leche
  readHistoricoDia(){
    let headers = new HttpHeaders();
    headers = headers.set('Accept','application/pdf');

    
    return this.http.post<any>(this.URLApiImagenes+"/historicoLecheDia",{headers:headers, responseType:'arrayBuffer' as 'json'})
  }






  

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

}