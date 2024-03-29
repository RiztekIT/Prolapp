import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';
import { Evento } from '../../Models/eventos/evento-model';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private http:HttpClient, 
    private datePipe:DatePipe,) { }



  
  APIUrl = environment.APIUrl;
  
  

  getEventosList(): Observable <Evento[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Evento[]>(this.APIUrl + '/Eventos');
  }

  getEventoID(id:number): Observable <Evento[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<Evento[]>(this.APIUrl + '/Eventos/EventoID' + id);
  }

  deleteEvento(id:number) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/Eventos/DeleteEvento/' + id);
 
  }

  addEvento(evento: Evento) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/Eventos', evento);
 }

  updateEvento(evento: Evento) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.put(this.APIUrl+ '/Eventos', evento);
    }
 



    movimientos(movimiento?){

      console.log('%c%s', 'color: #4400ff', '-----------------------------------------');
      console.log('%c%s', 'color: #00ffee', movimiento);
      console.log('%c%s', 'color: #4400ff', '-----------------------------------------');
      let userData = JSON.parse(localStorage.getItem("userAuth"))
      let idUser = userData.IdUsuario
      let evento = new Evento();
      let fecha = new Date();
      evento.IdUsuario = idUser
      evento.Autorizacion = '0'
      evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
      evento.Movimiento = movimiento
      console.log(evento);
      if (movimiento) {
        this.addEvento(evento).subscribe(respuesta =>{
          console.log(respuesta);
        })      
      }
  }






}
