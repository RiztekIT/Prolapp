import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { Usuario } from 'src/app/Models/catalogos/usuarios-model';
import { TipoCambioService } from '../../services/tipo-cambio.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': '19b7c18b48291872e37dbfd89ee7e4ea26743de4777741f90b79059950c34544',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
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
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: string;
  public usuario: Usuario;

  constructor(private http : HttpClient, private storageService: StorageServiceService, private tipoCambio:TipoCambioService) { }

  ngOnInit() {
    this.tipoDeCambio();
    this.usuario = this.storageService.getCurrentUser();
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
      this.tipoCambio.TipoCambio = this.Cdolar;
      this.tipoCambio.TC();
      // console.log('------CAMBIO------');
      // console.log(this.tipoCambio.TipoCambio);
      
    })

  }

  traerApi(): Observable<any>{

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }

  cerrarSesion(){
    this.storageService.logout();
  }



}
