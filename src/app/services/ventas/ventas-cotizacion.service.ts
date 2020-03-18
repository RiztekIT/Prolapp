import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable,Subject } from 'rxjs';
import { Cotizacion } from '../../Models/ventas/cotizacion-model';

const httpOptions2 = {
    headers: new HttpHeaders({
      // 'F-Api-Key':'JDJ5JDEwJGZOWTRnNkdvSjBPTEdiRlRBNWZocE81d3dJRU52WUtNWU9SaU16MHcwbFV5MzIuVWVGTlBT',
      'F-Api-Key':'JDJ5JDEwJDdRdWdpL05PMW5qb2M0c3BmdXpSZC5SdFVDd0JTT2RCeHguQ2FEdUZud0JNSXFoOC5DR25x',
      // 'F-Secret-Key':'JDJ5JDEwJGhVemxJbXUyTzhUREVTTEVvODkySk91aEI4a3Y0Rjhqd3ltWHo0a0QyTktTdkhldEp2c29X',
      'F-Secret-Key':'JDJ5JDEwJHJ0ZWRaRVhNU3cwQ1B2VzRZc2ZaRWV5c3ZNTWs3WFhoZThOOFg0YkdmQUZsQWc3UzQxZ25t',
      'Access-Control-Allow-Origin': 'http://192.168.1.180:4200',
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Headers': 'F-Secret-Key,Accept, Accept-Encoding, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }),
    responseType: 'text' as 'json'
  }

  @Injectable({
    providedIn: 'root'
  })
  export class VentasCotizacionService {

    formdata = new Cotizacion();
    formrow: any;

    constructor(private http:HttpClient) { }
    readonly APIUrl = "http://riztekserver.ddns.net:44361/api";
    

    getCotizaciones(): Observable<Cotizacion[]>{
        return this.http.get<any>(    this.APIUrl + '/Cotizaciones');
    }

    onDeleteCotizacion(id: number){
        return this.http.delete(this.APIUrl + '/Cotizaciones/BorrarCotizacion/' + id);
    }

    onEditCotizacion(ct : Cotizacion){
        return this.http.put(this.APIUrl + '/Cotizacion/', ct)
    }

    addCotizacion(cotizacion: Cotizacion){
        return this.http.post(this.APIUrl + '/Cotizacion', cotizacion)
    }
    
    private _listeners = new Subject<any>(); 
    listen(): Observable<any> {
      return this._listeners.asObservable();
    }

  }