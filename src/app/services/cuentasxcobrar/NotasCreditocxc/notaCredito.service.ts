import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { NotaCredito } from '../../../Models/nota-credito/notaCredito-model';
import { NotaCreditoMaster } from '../../../Models/nota-credito/notaCreditoMaster-model';
import { DetalleNotaCredito } from '../../../Models/nota-credito/detalleNotaCredito-model';
import { DetalleFactura } from '../../../Models/facturacioncxc/detalleFactura-model';
import { environment } from 'src/environments/environment';
import { EnviarfacturaService } from '../../facturacioncxc/enviarfactura.service';

export const APIUrl = environment.APIUrl;
 


@Injectable({
    providedIn: 'root'
  })

  export class NotaCreditoService {

    constructor(private http:HttpClient, public enviarfact: EnviarfacturaService) { }

    idNotaCredito: number;

    ClienteNombre: string;
    IdApi: string;

    //Master

    master = new Array<NotaCreditoMaster>();

    //form Data Nota Credito
    formData = new NotaCredito();

    //form Data Detalle Nota Credito
    DetalleformData = new DetalleNotaCredito();
    
    DetalleFactura = new Array<any>();

    //Moneda
    Moneda: string;

    //Tipo de Cambio
    TipoCambio: string;

    //Variable para saber si la nota esta timbrada o no
    Timbrada: boolean; 

    //Variable ID FACTURA
    IdFactura: number;

    
    
    APIUrl = environment.APIUrl;
  

    //Get Join Notas y Detalle Notas

  getNotasjoinDetalle(): Observable<any[]>{
    this.APIUrl = environment.APIUrl;
    this.APIUrl = sessionStorage.getItem('API')
   return this.http.get<[]>(this.APIUrl + '/NotaCredito');
  }

  //GetNotas de credito en base a id Factura
  getNotaCreditoFacturaID(id: number): Observable<any[]>{
    this.APIUrl = environment.APIUrl;
    this.APIUrl = sessionStorage.getItem('API')
    if (this.enviarfact.empresa.RFC==='PLA11011243A'){
      return this.http.get<[]>(this.APIUrl + '/NotaCredito/NotaCreditoID2/'+ id);
    }else  if (this.enviarfact.empresa.RFC==='AIN140101ME3'){
      return this.http.get<[]>(this.APIUrl + '/NotaCredito/NotaCreditoID/'+ id);
    }else  if (this.enviarfact.empresa.RFC==='DTM200220KRA'){
      return this.http.get<[]>(this.APIUrl + '/NotaCredito/NotaCreditoID3/'+ id);
    }
   
   }

  getNotaCreditoDetalles(id: number): Observable <DetalleNotaCredito[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleNotaCredito[]>(this.APIUrl + '/NotaCredito/GetDetalleNotaCredito/'+ id);
  }



     //Insertar nueva Nota Credito
  addNotaCredito(notaCredito: NotaCredito) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/NotaCredito', notaCredito);
  }
  //Insertar Detalle Nota Credito
  addDetalleNotaCredito(dnt: DetalleNotaCredito) {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.post(this.APIUrl + '/NotaCredito/InsertDetalleNotaCredito', dnt);
  }
  //Actualizar Nota Credito
updateNotaCredito(notaCredito: NotaCredito){
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl + '/NotaCredito', notaCredito)
}
  //Actualizar Detalle Nota Credito
updateDetalleNotaCredito(detalleNota: DetalleNotaCredito){
  this.APIUrl = sessionStorage.getItem('API')
  return this.http.put(this.APIUrl + '/NotaCredito/UpdateDetalleNotaCredito', detalleNota)
}
  //Eliminar Nota Credito
  DeleteNotaCredito(id:number){
    this.APIUrl = sessionStorage.getItem('API')
return this.http.delete(this.APIUrl + '/NotaCredito/'+ id)
  }
  //Eliminar Detalle Nota Credito
  DeleteDetalleNotaCredito(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/NotaCredito/DeleteDetalleNotaCredito/'+ id)
  }
  DeleteAllDetalleNotaCrediito(id:number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/NotaCredito/DeleteAllDetalleNotaCredito/'+ id)
  }

  //Obtener ultima Nota Pago
  getUltimaNotaCredito(): Observable<any[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<any[]>(this.APIUrl + '/NotaCredito/UltimaNotaCredito');
  }
  //Obtener Detalles Nota Credito en base a Id Nota Credito
    getDetalleNotaCreditoList(id: number): Observable<DetalleNotaCredito[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<DetalleNotaCredito[]>(this.APIUrl + '/NotaCredito/DetalleNotaCreditoID/' + id);
    }

    //Obtener ultima nota de credito de una factura en especifico por Id Factura
    getUltimaNotaCreditoFacturaID(id: number): Observable<NotaCredito[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<NotaCredito[]>(this.APIUrl + '/NotaCredito/UltimaNotaCreditoFacturaID/' + id);
    }

    //Obtener ultimo folio
    getUltimoFolio(): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/NotaCredito/GetUltimoFolio');
    }

    //Obtener suma de cantidaes de cierta factura y cierto producto
    getSumaCantidades(id:number, clave: string): Observable<any[]> {
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl + '/NotaCredito/SumaCantidades/'+ id +'/'+ clave);
    }
    getNCClienteFolio(id:string): Observable<any[]>{
      this.APIUrl = sessionStorage.getItem('API')
      return this.http.get<any[]>(this.APIUrl+ '/NotaCredito/NCClienteFolio/'+id)
    }

      //Obtener la Cantidad de cierto detalle Factura por IdFactura y Clave producto
  getDetalleFactura(id: number, clave: string):Observable <DetalleFactura[]> {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.get<DetalleFactura[]>(this.APIUrl + '/NotaCredito/GetDetalleFactura/'+ id +'/' + clave);
  }


  deleteNotaCredito(id: number){
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/NotaCredito/' + id);
  }  
  deleteNotaCreada() {
    this.APIUrl = sessionStorage.getItem('API')
    return this.http.delete(this.APIUrl + '/NotaCredito/DeleteNotaCreada');
  }

  updateCancelarNota(id){
    this.APIUrl = sessionStorage.getItem('API')
  

 
      return this.http.put(this.APIUrl+ '/NotaCredito/Cancelar/' + id, null);
  
  }

  private _listeners = new Subject<any>(); 
listen(): Observable<any> {
  return this._listeners.asObservable();
}
filter(filterBy: string) {
  this._listeners.next(filterBy);
}

}