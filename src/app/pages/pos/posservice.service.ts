import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class Producto {
  idProductos:number;
  nombre:string;
  precioVenta:string;
  precioCosto:string;
  Clave:string;
  descripcion:string;
  Estatus:string;
  UnidadMedida:string;
  unidadMedidaSAT:string;
  codigoBarras:string;
  ClaveSAT:string;
  categoria1:string;
  categoria2:string;
  categoria3:string;
  tipo:string;
  fechalta:Date;
  fechabaja:Date;
  iva:string;
  campoextra1:string;
  campoextra2:string;
  campoextra3:string;

}


export class Entrada {
  idEntrada:number;
  idProveedor:number;
  nombreProveedor:string;    
  folio:string;
  descripcion:string;
  estatus:string;
  categoria1:string;
  categoria2:string;
  categoria3:string;
  tipo:string;
  fechaexpedicion:Date;
  campoextra1:string;
  campoextra2:string;
  campoextra3:string;
  subtotal:string;
  iva:string;
  total:string;
  subtotaldlls:string;
  ivadlls:string;
  totaldlls:string;    
  sucursal:string;
  DetalleEntrada?: DetalleEntrada[];

  


}

export class DetalleEntrada {
  iddetalleentrada:number;
  identrada:number;
  idproducto:number;
  nombreproducto:string;
  claveproducto:string;
  precioProducto:string;
  cantidad:string;
  subtotal:string;
  iva:string;
  total:string;
  observaciones:string;
  tipodecambio:string;
  precioProductodlls:string;
  subtotaldlls:string;
  ivadlls:string;
  totaldlls:string;   
  
  


}

export class Inventarios {
  idinventario:number;
  iddocorigen:number;
  iddetalleorigen:number;    
  claveproducto:string;
  nombreproducto:string;
  precio:string;
  cantidad:string;
  subtotal:string;
  iva:string;
  total:string;
  tipocambio:string;
  subtotaldlls:string;
  ivadlls:string;
  totaldlls:string;
  sucursal:string;
  tipo:string;
  fecha:Date;
 
  


}

export class Ventas {
  idVentas:number;
  idCliente:number;
  nombreCliente:string;
  precioVenta:string;
  folio:string;
  descripcion:string;
  estatus:string;
  categoria1:string;
  categoria2:string;
  categoria3:string;
  tipo:string;
  fechaexpedicion:Date;  
  campoextra1:string;
  campoextra2:string;
  campoextra3:string;
  subtotal:string;
  iva:string;
  total:string;
  subtotaldlls:string;
  ivadlls:string;
  totaldlls:string;
  clasificacion1:string;
  clasificacion2:string;
  clasificacion3:string;  
sucursal:string;
  DetalleVentas?: DetalleVentas[];

  


}

export class DetalleVentas {
  iddetalleventas:number;
  idventas:number;
  idproducto:number;
  nombreservicio:string;
  claveservicio:string;
  nombreproducto:string;
  claveproducto:string;
  precioProducto:string;
  cantidad:string;
  subtotal:string;
  iva:string;
  total:string;
  Observaciones:string;
  tipocambio:string;
  precioProductodlls:string;
  cantidaddlls:string;
  subtotaldlls:string;
  ivadlls:string;
  totaldlls:string;   
  
  


}

export class Cliente {
  idCLiente:number;
  Clave:string;
  nombre:string;
  RFC:string;
  RazonSocial:string;
  Calle:string;
  NoInt:string;
  NoExt:string;
  Colonia:string;
  CP:string;
  Ciudad:string;
  Estado:string;
  estatus:string;
  limitecredito:string;
  diascredito:string;
  metodopago:string;
  usocfdi:string;
  campoextra1:string;
  campoextra2:string;
  campoextra3:string;
  fechaalta:Date;
  fechabaja:Date;
  clasificacion1:string;
  clasificacion2:string;
  clasificacion3:string;
  


}

export class Pagos {
      idpago: number;
      idventas: number;
      folio: string;
      cantidad: string;
      campoextra1: string;
      campoextra2: string;
      campoextra3: string;
      fechapago: Date;
      metodopago: string;
}



@Injectable({
  providedIn: 'root'
})
export class PosserviceService {
  readonly APIUrl = environment.APIUrl;
  productosForm = new Producto();
  entradaForm = new Entrada();
  masterEntrada;
  addedit;
  addeditdetalleEntrada;
  addeditpago;
  addeditclientes;
  detalleentradaForm = new DetalleEntrada();
  inventarioForm = new Inventarios();
  inventarioMaster;
  ventasForm = new Ventas()
  clientesForm = new Cliente();
  detallesventasForm = new DetalleVentas();
  master = new Array<Ventas>();
  pagosForm = new Pagos();
  masterventas;
  mastersaldos;
  constructor(private http:HttpClient) { }

  generarConsulta(consulta){
    

    return this.http.post(this.APIUrl + '/POS/consulta',consulta)
  }
}
