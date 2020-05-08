import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Imagenes } from '../../Models/Imagenes/imagenes-model';

export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private http:HttpClient) { }

 //Obtener Imagenes
 getImagenes(): Observable <Imagenes[]>{
  return this.http.get<Imagenes[]>(APIUrl + '/Imagenes');
}
//Insert Imagen
addImagen(imagen: Imagenes) {
  return this.http.post(APIUrl + '/Imagenes', imagen);
}
//Update Imagen
updateImagen(imagen: Imagenes) {
  return this.http.put(APIUrl+ '/Imagenes', imagen);
  }
  //Eliminar Imagen
  deleteImagen(id: number){
    return this.http.delete(APIUrl+ '/Imagen/BorrarImagen/' + id);
  }


  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }


      //Conectar con el servidor NODEJS para guardar, obtener Imagen(es)

      URLApiImagenes = environment.APIUrlEmail;

    //Guardar Imagen Orden Carga
      saveImagenOrdenCarga(body){
        console.log(body);
        return this.http.post(this.URLApiImagenes+"/guardarImagenOrdenCarga", body)
        
        }
    //Borrar Imagen Orden Carga
      deleteImagenOrdenCarga(body){
        console.log(body);
        return this.http.post(this.URLApiImagenes+"/borrarImagenOrdenCarga", body)
        
        }
        //Regresa las imagenes
          readImagenes(body){
            console.log(body)
            let headers = new HttpHeaders();
            headers = headers.set('Accept','application/pdf');
            return this.http.post<any>(this.URLApiImagenes+"/ObtenerImagenOrdenCarga",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
          }
        
        //regresa el nombre de las imagenes
          readDirImagenes(body){
            return this.http.post<any>(this.URLApiImagenes+"/cargarNombreImagenesOrdenCarga",body);
          }

      //Conectar con el servidor NODEJS para guardar, obtener Imagen(es)
}
