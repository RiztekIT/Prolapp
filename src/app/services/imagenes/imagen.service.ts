import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Imagenes } from '../../Models/Imagenes/imagenes-model';




@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  APIUrl = environment.APIUrl;

  constructor(private http:HttpClient) { }

 //Obtener Imagenes
 getImagenes(): Observable <Imagenes[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.get<Imagenes[]>(this.APIUrl + '/Imagenes');
}
 //Obtener Imagen por Folio, Tipo y nombre
 getImagenFTN(imagen: Imagenes):Observable<Imagenes[]>{
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post<Imagenes[]>(this.APIUrl + '/Imagenes/GetImagenFTN', imagen);
}
//Insert Imagen
addImagen(imagen: Imagenes) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.post(this.APIUrl + '/Imagenes', imagen);
}
//Update Imagen
updateImagen(imagen: Imagenes) {
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl+ '/Imagenes', imagen);
  }
  //Eliminar Imagen
  deleteImagen(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl+ '/Imagenes/BorrarImagen/' + id);
  }
  //Eliminar imagen por Tipo, Folio y Nombre
  // deleteImagenTipoFolioNombre(tipo: string, folio: string, nombre: string){
  //   return this.http.delete(this.APIUrl+ '/Imagenes/BorrarImagenOC/'+tipo+'/'+folio+'/'+nombre);
  // }
  deleteImagenOC(imagen: Imagenes) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Imagenes/BorrarImagenOC', imagen);
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

    //Guardar Imagen Servidor
      saveImagenServidor(body, url){
        console.log(body);
        // return this.http.post(this.URLApiImagenes+"/guardarImagenOrdenCarga", body)
        return this.http.post(this.URLApiImagenes+"/"+url, body)
        
        }
    //Borrar Imagen Servidor
      deleteImagenServidor(body, url){
        console.log(body);
        // return this.http.post(this.URLApiImagenes+"/borrarImagenOrdenCarga", body)
        return this.http.post(this.URLApiImagenes+"/"+url, body)
        
        }
        //Regresa las imagenes
          readImagenesServidor(body, url){
            console.log(body)
            let headers = new HttpHeaders();
            headers = headers.set('Accept','application/pdf');
            // return this.http.post<any>(this.URLApiImagenes+"/ObtenerImagenOrdenCarga",body,{headers:headers, responseType:'arrayBuffer' as 'json'})
            return this.http.post<any>(this.URLApiImagenes+"/"+url,body,{headers:headers, responseType:'arrayBuffer' as 'json'})
          }
        
        //regresa el nombre de las imagenes
          readDirImagenesServidor(body, url){
            // return this.http.post<any>(this.URLApiImagenes+"/cargarNombreImagenesOrdenCarga",body);
            return this.http.post<any>(this.URLApiImagenes+"/"+url,body);
          }

      //Conectar con el servidor NODEJS para guardar, obtener Imagen(es)

      
}
