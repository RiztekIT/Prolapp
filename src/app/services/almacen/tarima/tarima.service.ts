import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { TraspasoTarima } from '../../../Models/almacen/Tarima/traspasoTarima-model';

export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class TarimaService {

  constructor(private http:HttpClient) { }

  tarimaData = new Tarima();
  tarimaDetalleData = new DetalleTarima();

  //Obtener detalles de Tarima por IdTarima
getDetalleTarimaID(id: number): Observable <DetalleTarima[]>{
  return this.http.get<DetalleTarima[]>(APIUrl + '/Tarima/GetDetalleTarimaID/'+ id);
}
  //Obtener Tarima por IdTarima
getTarimaID(id: number): Observable <Tarima[]>{
  return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetTarimaID/'+ id);
}
  //Obtener Ultima Tarima
  getUltimaTarima(): Observable <Tarima[]>{
    return this.http.get<Tarima[]>(APIUrl + '/Tarima/GetUltimaTarima');
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
    return this.http.put(APIUrl+ '/Tarima/UpdateTarimaSacosPeso/' + idt + '/' + iddt + '/' + sacos , null);
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

  private _listeners = new Subject<any>(); 
      listen(): Observable<any> {
        return this._listeners.asObservable();
      }
      filter(filterBy: string) {
        this._listeners.next(filterBy);
      }
}
