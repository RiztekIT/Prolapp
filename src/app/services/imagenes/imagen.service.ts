import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
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
}
