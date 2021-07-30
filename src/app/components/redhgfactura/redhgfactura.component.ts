import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Prefactura } from 'src/app/Models/facturacioncxc/prefactura-model';
import { RedhgfacturacionService } from '../../services/redholding/redhgfacturacion.service';

declare function cantidad(n);

@Component({
  selector: 'app-redhgfactura',
  templateUrl: './redhgfactura.component.html',
  styleUrls: ['./redhgfactura.component.css']
})
export class RedhgfacturaComponent implements OnInit {

  factura = new Prefactura();
  cfdiNombre: string;
  xmlString: any;
  xml: string;
  certificado: string;
  serie: string;
  folio: string;
  fecha: string;
  formaDePago: string;
  nocertificado: string;
  subtotal: string;
  moneda: string;
  total: string;
  tipoDeComprobante: string;
  metodoPago: string;
  lugarExpedicion: string;
  selloCFDI: string;
  rfcE: string;
  nombreE: string;
  regimen: string;
  rfcR: string;
  nombreR: string;
  usoCFDI: string;
  cantidad: string;
  unidad: string;
  claveUnidad: string;
  descripcionConcepto: string;
  valorUnitario: string;
  importeConcepto: string;
  version: string;
  uuid: string;
  noCertificadoSAT: string;
  selloSAT: string;
  iva: string;
  RetIva: string;
  monedaT: string;
  claveCliente: number;
  calle;
  numeroext;
  colonia;
  codigopostal;
  ciudad
  estado;
  numeroint;

  // Por Definir
  vendedor: string;
  ordenCompra: string;
  fechaVencimiento: string;
  fechaEntrega: string;
  tipoCambio: string; 
  condicionesPago: string;
  direccionCalle: string;
  observaciones: string;
  // xml
  textnum: string;
  textnum2: string;


  con : string| number;
  arrcon: Array<any> = [];
  arrcon2: Array<any> = [];

  objconc: any; 
  objconc2: any; 


  title = 'xmljson';
  public xmlItems: any;
  fileUrl: any;

  totalT
  ivaT
  RetIvaT
  subtotalT

  myAngularxQrCode: string;
  QRsize:number;
  //logo = '../../../assets/images/ProLactoLogo.png'
  logo;
  seriefactura;
  QRString = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.asp?id=28c751ac-b6f3-4293-b35e-9ce78b4eb4b8&re=CIN960904FQ2&rr=CUOA880131Q85&tt=0000002578.930000&fe=nfsuQW==';

  @Input() xmlparametros;
  constructor(
    public dialogRef: MatDialogRef<RedhgfacturaComponent>,
    private sanitizer: DomSanitizer,
    public redhgSVC: RedhgfacturacionService
  ) { 
    this.QRsize = 125;
    // assign a value
    this.myAngularxQrCode = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.asp?id=28c751ac-b6f3-4293-b35e-9ce78b4eb4b8&re=CIN960904FQ2&rr=CUOA880131Q85&tt=0000002578.930000&fe=nfsuQW==';
    
  }

  ngOnInit() {
     



    // this.leerxml();

    const blob = new Blob(['/assets/js/F-1.xml'], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

    this.pdfDB();
  }

  onClose(){
    this.dialogRef.close();
  }

  pdfDB(){
    let row = JSON.parse(localStorage.getItem('rowfact'));
   console.log(row.Certificado);
   console.log(row.detalle[0].Cantidad);
   console.log(row.detalle);

this.certificado = row.CadenaOriginal;
this.serie = row.Serie;
this.folio = row.Folio;
// this.folio = '9104';
this.fecha = row.FechaDeExpedicion;
this.formaDePago = row.FormaDePago;
this.nocertificado = row.NumeroDeCertificado;
this.moneda = row.Moneda;
// this.subtotal = row.Subtotal;
// this.total = row.Total;

this.tipoDeComprobante = row.Tipo;
this.metodoPago = row.MetodoDePago;
this.lugarExpedicion = row.LugarDeExpedicion;
this.selloCFDI = row.SelloDigitalCFDI;

if (this.redhgSVC.empresa.RFC)
//this.rfcE = 'PLA11011243A'
//this.nombreE = 'PRO LACTOINGREDIENTES S DE RL MI DE CV';
this.rfcE = this.redhgSVC.empresa.RFC;
this.nombreE = this.redhgSVC.empresa.RazonSocial;
this.calle = this.redhgSVC.empresa.Calle
 this.numeroext = this.redhgSVC.empresa.NumeroExterior
 this.colonia = this.redhgSVC.empresa.Colonia
 this.codigopostal = this.redhgSVC.empresa.CP
 this.ciudad = this.redhgSVC.empresa.Ciudad
 this.estado = this.redhgSVC.empresa.Estado
 this.numeroint = this.redhgSVC.empresa.NumeroInterior
this.nombreR = row.Nombre;
this.rfcR = row.RFC;
this.usoCFDI = row.UsoDelCFDI;
this.regimen = '601';
this.cantidad = row.detalle[0].Cantidad;
this.claveUnidad = row.detalle[0].ClaveProducto;
this.unidad = row.detalle[0].Unidad;
this.descripcionConcepto = row.detalle[0].Producto;
this.valorUnitario = row.detalle[0].PrecioUnitario;
this.importeConcepto = row.detalle[0].Importe;
this.uuid = row.UUID;
this.noCertificadoSAT = row.NumeroDeSelloSAT;

this.RetIva = row.ImpuestosRetenidos;
this.selloSAT = row.SelloDigitalSAT;
this.logo = '../../../assets/images/'+this.rfcE+'.png'
if (this.rfcE==='PLA11011243A'){
this.seriefactura = 'B'
}else if(this.rfcE==='AIN140101ME3') {
 this.seriefactura = 'W'
}


this.objconc = row.detalle;
this.objconc2 = row.detalle2;

switch (this.moneda) {
 case "MXN":
   this.monedaT = "MXN"
   this.total = row.Total;
   this.subtotal = row.Subtotal;
   this.textnum = cantidad(this.total);
   this.iva = row.ImpuestosTrasladados;
   break;
 case "USD":
   this.monedaT = "USD"
   this.total = row.TotalDlls;
   this.subtotal = row.SubtotalDlls;
   this.textnum = cantidad(this.total);
   this.iva = row.ImpuestosTrasladadosDlls;
}

this.arrcon = [];

if(this.moneda === 'MXN'){
 for (this.con in this.objconc){
   var conceptos = this.objconc[this.con];
   this.arrcon.push({
     cantidad: conceptos.Cantidad,
     claveunidad: conceptos.ClaveSAT,
     unidad: conceptos.Unidad,
     descripcion: conceptos.Producto,
     valorunitario: conceptos.PrecioUnitario,
     importe: conceptos.Importe,
     observaciones: conceptos.Observaciones
   });
}
}else if(this.moneda === 'USD'){
 for (this.con in this.objconc){
   var conceptos = this.objconc[this.con];
   this.arrcon.push({
     cantidad: conceptos.Cantidad,
     claveunidad: conceptos.ClaveSAT,
     unidad: conceptos.Unidad,
     descripcion: conceptos.Producto,
     valorunitario: conceptos.PrecioUnitarioDlls,
     importe: conceptos.ImporteDlls,
     observaciones: conceptos.Observaciones
   });
}
}

this.arrcon2 = [];

this.subtotalT = 0
this.totalT = 0
this.RetIvaT = 0
this.ivaT = 0

if(this.moneda === 'MXN'){
 for (this.con in this.objconc2){
   var conceptos = this.objconc2[this.con];
   this.arrcon2.push({
     cantidad: conceptos.Cantidad,
     claveunidad: conceptos.ClaveSAT,
     unidad: conceptos.Unidad,
     descripcion: conceptos.Producto,
     valorunitario: conceptos.PrecioUnitario,
     importe: conceptos.Importe,
     observaciones: conceptos.Observaciones
   });
   this.ivaT = this.ivaT + parseFloat(conceptos.ImporteIVA);
   this.subtotalT = +this.subtotalT + +conceptos.Importe
}

}else if(this.moneda === 'USD'){
 for (this.con in this.objconc2){
   var conceptos = this.objconc2[this.con];
   this.arrcon2.push({
     cantidad: conceptos.Cantidad,
     claveunidad: conceptos.ClaveSAT,
     unidad: conceptos.Unidad,
     descripcion: conceptos.Producto,
     valorunitario: conceptos.PrecioUnitarioDlls,
     importe: conceptos.ImporteDlls,
     observaciones: conceptos.Observaciones
   });
   this.ivaT = this.ivaT + parseFloat(conceptos.ImporteIVA);
   this.subtotalT = +this.subtotalT + +conceptos.Importe
}
}
this.totalT = +this.ivaT + +this.subtotalT + +this.total
this.textnum2 = cantidad(this.totalT);

console.log(this.objconc);
console.log(this.arrcon);

let consulta ="Select redhgFactura2.* ,redhgCliente.* from redhgFactura2 LEFT JOIN redhgCliente ON redhgFactura2.IdCliente = redhgCliente.IdClientes where Folio ="+this.folio
/* getFacturasClienteFolio(this.folio) */

this.redhgSVC.consultaRedhg(consulta).subscribe(data=>{
 console.log(data);
 
 switch (data[0].Estado){
   case "NO APLICA":
     data[0].Estado = "NO APLICA ESTADO"
 }
 switch (data[0].CondicionesDePago){
   case "":
     data[0].CondicionesDePago = " N/A"
 }
  this.vendedor = data[0].Vendedor;
  this.ordenCompra = data[0].OrdenDeCompra
  this.fechaVencimiento = data[0].FechaVencimiento
  this.fechaEntrega = data[0].FechaDeEntrega
  this.tipoCambio = data[0].TipoDeCambio
  this.condicionesPago = data[0].CondicionesDePago
  this.direccionCalle = data[0].Calle + ' , ' + data[0].NumeroExterior + ' , ' + data[0].NumeroInterior + ' , ' + data[0].Colonia + ' , ' +  data[0].CP + ' , ' + data[0].Ciudad + ' , ' + data[0].Estado;
  this.observaciones = data[0].Observaciones;
  this.claveCliente = data[0].IdCliente;
  
})

//  console.log(this.uuid);


switch (this.metodoPago){

  case "PUE":
    this.metodoPago = "PUE (Pago de Unica Exhibición)"
    break;

  case "PPD":
    this.metodoPago = "PPD (Pago Parcial o Diferido)"
}

switch (this.usoCFDI) {
  case "G01":
    this.cfdiNombre = "Adquisición de Mercancías"
    break;
  case "G02":
    this.cfdiNombre = "Devoluciones, descuentos o bonificaciones"
    break;
  case "G03":
    this.cfdiNombre = "Gastos en General"
    break;
  case "I01":
    this.cfdiNombre = "Construcciones"
    break;
  case "I02":
    this.cfdiNombre = "Mobiliario y Equipo de Oficina por contrucciones"
    break;
  case "I03":
    this.cfdiNombre = "Equipo de transporte"
    break;
  case "I04":
    this.cfdiNombre = "Equipo de Cómputo y accesorios"
    break;
  case "I05":
    this.cfdiNombre = "Dados, troqueles, moldes, matrices y herramientas"
    break;
  case "I06":
    this.cfdiNombre = "Comunicaciones telefónicas"
    break;
  case "I07":
    this.cfdiNombre = "Comunicaciones satelitales"
    break;
  case "I08":
    this.cfdiNombre = "Otras máquinas y equipo"
  case "D01":
    this.cfdiNombre = "Honorarios médicos, dentales y hospitalarios"
    break;
  case "D02":
    this.cfdiNombre = "Gastos médicos por incapacidad o discapacidad"
    break;
  case "D03":
    this.cfdiNombre = "Gastos funerales"
    break;
  case "D04":
    this.cfdiNombre = "Donativos"
    break;
  case "D05":
    this.cfdiNombre = "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)"
    break;
  case "D06":
    this.cfdiNombre = "Aportaciones voluntarias SAR"
    break;
  case "D07":
    this.cfdiNombre = "Primas por seguros de gastos médicos"
    break;
  case "D08":
    this.cfdiNombre = "Gastos por transportación escolar obligatoria"
    break;
  case "D09":
    this.cfdiNombre = "Deposito en cuentas para ahorro, primas que tengan como base planes de pensiones"
    break;
  case "D10":
    this.cfdiNombre = "Pagos por servicios educativos"
    break;
  case "P01":
    this.cfdiNombre = "Por definir"
    break;
}


this.xmlparametros='';
 }

}
