import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Calendario } from '../../Models/calendario/calendario-model';
import { environment } from 'src/environments/environment';
import { detalleCalendario } from 'src/app/Models/calendario/detalleCalendario-model';
import { Compras } from '../../Models/Compras/compra-model';

export const APIUrl = environment.APIUrl;
// export const APIUrl = "https://localhost:44361/api";
@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(private http:HttpClient) { }
//variable para saber el origen del calendario
  origen: string;
  //variable para saber si se editara o agregara un evento
  accionEvento: string
  IdCalendario: number;
  formDataCalendario = new Calendario();
  formDataDetalleCalendario: detalleCalendario;

  //objeto tipo compras
  formDataCompras: Compras;

  //Obtener Calendario por Modulo
  getCalendarioCompras(modulo: string): Observable <Calendario[]> {
    return this.http.get<Calendario[]>(APIUrl + '/calendario/getCalendarioModulo/'+modulo);
  }
  //Obtener DetallesCalendario por IdCalendario
  getDetallesCalendarioId(id:number): Observable<detalleCalendario[]>{
    return this.http.get<detalleCalendario[]>(APIUrl + '/calendario/getDetalleCalendario/'+id);
  }
  //Obtener DetallesCalendario por IdDetalleCalendario
  getDetallesCalendarioIdDetalle(id:number): Observable<detalleCalendario[]>{
    return this.http.get<detalleCalendario[]>(APIUrl + '/calendario/getDetalleCalendarioIdDetalle/'+id);
  }
  //agregar detalle Calendario
  addDetalleCalendario(detalle: detalleCalendario){
    return this.http.post(APIUrl + '/calendario/AddDetalleCalendario', detalle);
  }
  //editar detalle Calendario
  editDetalleCalendario(detalle: detalleCalendario){
    return this.http.put(APIUrl + '/calendario/UpdateDetalleCalendario', detalle);
  }
  //elimina detalle Calendario
  deleteDetalleCalendario(id:number){
    return this.http.delete(APIUrl + '/calendario/DeleteDetalleCalendario/' + id);
  }

  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }


}
