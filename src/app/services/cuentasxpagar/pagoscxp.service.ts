import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagos } from '../../Models/Pagos/pagos-model';
import { Compras } from '../../Models/Compras/compra-model';
import { FacturaFlete } from '../../Models/trafico/facturaflete-model';
import { Pedido } from '../../Models/Pedidos/pedido-model';

export const APIUrl = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class PagoscxpService {

  constructor(private http:HttpClient) { }

//Obtener Pagos
 getPagos(): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(APIUrl + '/Pagos');
}
//Obtener Pagos
getNewFolio(): Observable <any[]>{
  return this.http.get<any[]>(APIUrl + '/Pagos/GetNewFolio');
}
getPagoId(id: number): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(APIUrl + '/Pagos/GetPagoId/'+id);
}
getPagoFolio(folio: number): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(APIUrl + '/Pagos/GetPagoFolio/'+folio);
}
getPagoTipo(tipo: string): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(APIUrl + '/Pagos/GetPagoTipo/'+tipo);
}
getPagoFolioTipo(folio:number, tipo: string): Observable <Pagos[]>{
  return this.http.get<Pagos[]>(APIUrl + '/Pagos/GetPagoFolioTipo/'+folio+'/'+tipo);
}

//Insert pago
addPago(pagos: Pagos) {
  return this.http.post(APIUrl + '/Pagos', pagos);
}
//Update Pago
updatePago(pago: Pagos) {
  return this.http.put(APIUrl+ '/Pagoss', Pagos);
  }
  //Eliminar Pago por IdPago
  deletePago(id: number){
    return this.http.delete(APIUrl+ '/Pagos/BorrarPago/' + id);
  }

  //*******  MODULOS RELACIONADOS A PAGOS *******// 

//Obtener Compras Adminsitrativas
getComprasAdministrativas(): Observable <Compras[]>{
  return this.http.get<Compras[]>(APIUrl + '/Pagos/GetComprasAdministrativas');
}
//Obtener Compras Materia Primas
getComprasMateriaPrima(): Observable <Compras[]>{
  return this.http.get<Compras[]>(APIUrl + '/Pagos/GetComprasMateriaPrima');
}
//Obtener Compras Materia Primas Estatus
getComprasMateriaPrimaEstatus(estatus: string ): Observable <Compras[]>{
  return this.http.get<Compras[]>(APIUrl + '/Pagos/GetComprasMateriaPrimaEstatus/'+estatus);
}
//Obtener Facturas Fletes
getFacturasFletes(): Observable <FacturaFlete[]>{
  return this.http.get<FacturaFlete[]>(APIUrl + '/Pagos/GetFletes');
}
//Obtener Facturas Fletes Estado
getFacturasFletesEstado(estado:string): Observable <FacturaFlete[]>{
  return this.http.get<FacturaFlete[]>(APIUrl + '/Pagos/GetFletesEstado/'+estado);
}
//Obtener Comisiones
getComisiones(): Observable <Pedido[]>{
  return this.http.get<Pedido[]>(APIUrl + '/Pagos/GetComisiones');
}
//Obtener Comisiones Estatus
getComisionesEstatus(estado: string): Observable <Pedido[]>{
  return this.http.get<Pedido[]>(APIUrl + '/Pagos/GetComisionesEstado/'+estado);
}


  //*******  MODULOS RELACIONADOS A PAGOS *******// 
}
