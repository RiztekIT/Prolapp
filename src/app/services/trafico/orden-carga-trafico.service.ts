import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Producto } from "../../Models/catalogos/productos-model";
import { DetallePedido } from '../../Models/Pedidos/detallePedido-model';
import {Observable,Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Pedido } from '../../Models/Pedidos/pedido-model';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';
import { environment } from 'src/environments/environment';
import { Fleteras } from '../../Models/trafico/fleteras-model';
import { OrdenCarga } from '../../Models/almacen/OrdenCarga/ordencarga.model';
import { FacturaFlete } from '../../Models/trafico/facturaflete-model';
import { facturafletedata } from 'src/app/Models/trafico/facturafletedata-model';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaTraficoService {
  
  
  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }
  
   APIUrl = environment.APIUrl;
  
  

 formrow: any;
 formData = new OrdenCarga();
 formDataselect = new Fleteras();
 formDatafactura = new FacturaFlete();
 facturafletedata = new Array<facturafletedata>();
 


  
  
  getDepDropDownValues(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/trafico/fletera');
  }

  getFacturaFlete(): Observable<FacturaFlete[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/FacturaFlete');
  }

  getFacturaFleteID(id: number): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/FacturaFlete/'+ id);
  }

  // updateFacturaFlete(facturaflete: FacturaFlete) {
  //   return this.http.put(this.APIUrl+ '/FacturaFlete', facturaflete);
  // }

  updateFacturaFlete(facturaflete: FacturaFlete) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/FacturaFlete', facturaflete);
  }
  updateFacturaFlete2(facturaflete: FacturaFlete) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/FacturaFlete/Actualizar', facturaflete);
  }


  //^ -------  reportesTrafico -----------

  //^ Obtener Reporte Trafico sin filtros
  getTraficoGeneral(): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTrafico');
  }
  //^ Obtener Reporte Trafico Fletera
  getTraficoFletera(fletera: string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoFletera/'+fletera);
  }
  //^ Obtener Reporte Trafico Id Orden Carga
  getTraficoOC(id: number): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoOC/'+id);
  }
  //^ Obtener Reporte Trafico Estatus
  getTraficoEstatus(estatus: string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoEstatus/'+estatus);
  }
  //^ Obtener Reporte Trafico Fletera, Estatus
  getTraficoFleteraEstatus(fletera:string , estatus: string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoFleteraEstatus/'+fletera+'/'+estatus);
  }
  //^ Obtener Reporte Trafico IdOC Fletera
  getTraficoOCFletera(id:number , fletera: string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoOCFletera/'+id+'/'+fletera);
  }
  //^ Obtener Reporte Trafico IdOC Estatus
  getTraficoOCEstatus(id:number , estatus: string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoOCEstatus/'+id+'/'+estatus);
  }
  //^ Obtener Reporte Trafico IdOC Estatus Fletera
  getTraficoOCEstatusFletera(id:number , estatus: string, fletera:string): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoOCEstatusFletera/'+id+'/'+estatus+'/'+fletera);
  }
  //^ Obtener grafico Trafico IdCliente
  GetTraficoIdCliente(id:number ): Observable<any> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/Reportes/GetTraficoIdCliente/'+id);
  }


  //^ -------  reportesTrafico -----------
  

}
