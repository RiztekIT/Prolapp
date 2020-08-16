import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styles: []
})
export class TipoCambioComponent implements OnInit {

  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: String;

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.tipoDeCambio();
  }

  tipoDeCambio(){
    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();
    

    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();

    let i;
if (hora>11){
  i=2;
}else{
  i=1;
}
    this.traerApi().subscribe(data => {
      let l;
      
      l = data.bmx.series[0].datos.length;
      // console.log(i);
      // console.log(l);
      // console.log(data.bmx.series[0].datos.length);
      // console.log(data.bmx.series[0].datos[l-i].dato);
      
      
      this.Cdolar = data.bmx.series[0].datos[l-i].dato;
      console.log('------CAMBIO------');
      console.log(this.Cdolar);
      console.log('------CAMBIO------');
    })

  }

  traerApi(): Observable<any>{

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }

}
