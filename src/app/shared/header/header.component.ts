import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://192.168.1.67:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // parche: string = 'https://cors-anywhere.herokuapp.com/'
  // readonly rootURL = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF63528/datos/oportuno"
  readonly rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/oportuno"
  Cdolar: String;
  

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.tipoDeCambio();
  }

  // private setHeaders(): HttpHeaders {
  //   const headersConfig = {
  //     'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Content-type'

  //   };
  //   return new HttpHeaders(headersConfig);
  // }

  tipoDeCambio(){
    this.traerApi().subscribe(data => {
      this.Cdolar = data.bmx.series[0].datos[0].dato;
      
    })

  }

  traerApi(): Observable<any>{
    console.log(this.http.get(this.rootURL, httpOptions));
    
    return this.http.get(this.rootURL, httpOptions)

  }



}
