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
  // readonly APIUrl = "https://localhost:44361/api";
  // readonly APIUrl = "http://192.168.1.67:32767/api";
  readonly APIUrl = environment.APIUrl;
  //readonly APIUrl = "http://riztekserver.ddns.net:44361/api";
  

 formrow: any;
 formData = new OrdenCarga();
 formDataselect = new Fleteras();
 formDatafactura = new FacturaFlete();
 facturafletedata = new Array<facturafletedata>();
 


  
  
  getDepDropDownValues(): Observable<any> {
    return this.http.get<any[]>(this.APIUrl + '/trafico/fletera');
  }

  getFacturaFlete(): Observable<FacturaFlete[]> {
    return this.http.get<any[]>(this.APIUrl + '/FacturaFlete');
  }

  getFacturaFleteID(id: number): Observable<any> {
    return this.http.get<any[]>(this.APIUrl + '/FacturaFlete/'+ id);
  }

  // updateFacturaFlete(facturaflete: FacturaFlete) {
  //   return this.http.put(this.APIUrl+ '/FacturaFlete', facturaflete);
  // }

  updateFacturaFlete(facturaflete: FacturaFlete) {
    return this.http.post(this.APIUrl + '/FacturaFlete', facturaflete);
  }
  updateFacturaFlete2(facturaflete: FacturaFlete) {
    return this.http.post(this.APIUrl + '/FacturaFlete/Actualizar', facturaflete);
  }

  

}
