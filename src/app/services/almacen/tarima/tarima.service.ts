import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { TraspasoTarima } from '../../../Models/almacen/Tarima/traspasoTarima-model';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';

export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class TarimaService {

  constructor(private http:HttpClient) { }

  tarimaData = new Tarima();
  tarimaDetalleData = new DetalleTarima();
  tarimaDetalleDOD = new Array<DetalleOrdenDescarga>();

  //Tarima proviniente de un traspaso de OrdenCarga
  trapasoOrdenCarga: boolean;
  //IdTarima a traspasar;
  idTarimaOrdenCarga: number;
  //Detalle tarima a traspasar de OrdenCarga
  detalleTarimaOrdenCarga: DetalleTarima;
  QrOrigen: string;

  //Obtener detalles de Tarima por IdTarima
getDetalleTarimaID(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaID/'+ id);
}
 //Obtener detalles de Tarima por IdDetalleTarima
 getDetalleTarimaIDdetalle(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaIDdetalle/'+ id);
}
  //Obtener Tarima por IdTarima
getTarimaID(id: number): Observable <Tarima[]>{
  return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetTarimaID/'+ id);
}
  //Obtener Ultima Tarima
  getUltimaTarima(): Observable <Tarima[]>{
    return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetUltimaTarima');
  }
  //Obtener Tarima por QR code
  getTarimaQR(qr : string): Observable <Tarima[]>{
    return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetTarimaQR/'+ qr);
  }
  //Obtener detalle tarima por IdTarima, claveProducto, lote
  getDetalleTarimaIdClaveLote(id: number, clave: string, lote: string): Observable <DetalleTarima[]>{
    return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaIdClaveLote/' + id + '/' + clave + '/' + lote);
  }

//Insert Tarima
addTarima(t: Tarima) {
  return this.http.post(APIUrl + '/Tarima', t);
}
//Update Tarima
updateTarima(t: Tarima) {
  return this.http.put(APIUrl+ '/Tarima', t);
  }
  //Update Tarima ( Sacos y peso Total)
  updateTarimaSacosPeso(id: number, sacos: string, peso: string) {
    return this.http.put(APIUrl+ '/Tarima/UpdateTarimaSacosPeso/' + id + '/' + sacos + '/' + peso , null);
    }
    //Update Tarima ( Sacos y peso Total)
  updateDetalleTarimaIdSacos(idt: number, iddt:number, sacos: string) {
    return this.http.put(APIUrl+ '/Tarima/UpdateDetalleTarimaIdSacos/' + idt + '/' + iddt + '/' + sacos , null);
    }
//Insert Detalle Tarima
addDetalleTarima(dt: DetalleTarima) {
  return this.http.post(APIUrl + '/Tarima/AddDetalleTarima', dt);
}
//Update Detalle Tarima
updateDetalleTarima(dt: DetalleTarima) {
  return this.http.put(APIUrl+ '/Tarima', dt);
  }
//Insert Traspaso Tarima
addTraspasoTarima(tt: TraspasoTarima) {
  return this.http.post(APIUrl + '/TraspasoTarima', tt);
}
//Update Traspaso Tarima
updateTraspasoTarima(tt: TraspasoTarima) {
  return this.http.put(APIUrl+ '/TraspasoTarima', tt);
  }
  //Eliminar detalle tarima
  deleteDetalleTarima(id: number){
    return this.http.delete(APIUrl+ '/Tarima/BorrarDetalleTarima/' + id);
  }
//Eliminar tarima
deleteTarima(id: number){
  return this.http.delete(APIUrl+ '/Tarima/BorrarTarima/' + id);
}

  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}
