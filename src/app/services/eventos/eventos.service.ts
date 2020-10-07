import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import { Evento } from '../../Models/eventos/evento-model';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private http:HttpClient) { }



  // readonly APIUrl = "https://localhost:44361/api";
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";

  getEventosList(): Observable <Evento[]> {
    return this.http.get<Evento[]>(this.APIUrl + '/Eventos');
  }

  getEventoID(id:number): Observable <Evento[]> {
    return this.http.get<Evento[]>(this.APIUrl + '/Eventos/EventoID' + id);
  }

  deleteEvento(id:number) {
    return this.http.delete(this.APIUrl + '/Eventos/DeleteEvento/' + id);
 
  }

  addEvento(evento: Evento) {
    return this.http.post(this.APIUrl + '/Eventos', evento);
 }

  updateEvento(evento: Evento) {
    return this.http.put(this.APIUrl+ '/Eventos', evento);
    }
 









}
