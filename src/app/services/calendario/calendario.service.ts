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

  DetalleCalendarioData :  detalleCalendario = {
    IdDetalleCalendario: 0,
    IdCalendario : 0,
    Folio : 0,
    Documento: '',
    Descripcion: '',
    Start: new Date(),
    Endd: new Date(),
    Title: '',
    Color:'',
    AllDay: 0,
    ResizableBeforeEnd: 0,
    ResizableBeforeStart: 0,
    Draggable: 0 
  }

  //variable para guardar la informacion del evento
  eventoInfo: any;

  //objeto tipo compras
  formDataCompras: Compras;

  //Obtener Calendario por Modulo
  getCalendarioCompras(modulo: string): Observable <Calendario[]> {
    return this.http.get<Calendario[]>(APIUrl + '/calendario/getCalendarioModulo/'+modulo);
  }
  //Obtener Calendario por Usuario y Modulo
  getCalendarioComprasUsuarioModulo(usuario: string, modulo: string): Observable <Calendario[]> {
    return this.http.get<Calendario[]>(APIUrl + '/calendario/getCalendarioUsuarioModulo/'+usuario+'/'+modulo);  
  }
  //Obtener DetallesCalendario por IdCalendario
  getDetallesCalendarioId(id:number): Observable<detalleCalendario[]>{
    return this.http.get<detalleCalendario[]>(APIUrl + '/calendario/getDetalleCalendario/'+id);
  }
  //Obtener DetallesCalendario por IdDetalleCalendario
  getDetallesCalendarioIdDetalle(id:number): Observable<detalleCalendario[]>{
    return this.http.get<detalleCalendario[]>(APIUrl + '/calendario/getDetalleCalendarioIdDetalle/'+id);
  }
  //Obtener Calendario JOIN Proceso
  getCalendarioProceso(id: number, modulo: string, proceso:string): Observable<any[]>{
    return this.http.get<any[]>(APIUrl + '/calendario/getCalendarioProceso/'+id+'/'+modulo+'/'+proceso);
  }
  //Obtener Usuario por ID
  getUsuarioId(id: number): Observable<any[]>{
    return this.http.get<any[]>(APIUrl + '/calendario/getCalendarioUsuarioId/'+id);
  }
  //agregar Calendario
  addCalendario(calendario: Calendario){
    return this.http.post(APIUrl + '/calendario', calendario);
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
