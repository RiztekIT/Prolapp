import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, Inject } from '@angular/core';
import xml2js from 'xml2js';
import { processors } from 'xml2js'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
import { Prefactura } from 'src/app/Models/facturacioncxc/prefactura-model';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


// export interface parametros{
//   foliop: string
// }

declare function cantidad(n);



@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {


  myAngularxQrCode: string;
  QRsize:number;


  @Input() xmlparametros;

  constructor(private _http: HttpClient, private sanitizer: DomSanitizer, public service: FacturaService, public dialogRef: MatDialogRef<FacturaComponent>) {
    this.QRsize = 125;
    // assign a value
    this.myAngularxQrCode = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.asp?id=28c751ac-b6f3-4293-b35e-9ce78b4eb4b8&re=CIN960904FQ2&rr=CUOA880131Q85&tt=0000002578.930000&fe=nfsuQW==';
    // this.loadXML();
  }
  // XML
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


  con : string| number;
  arrcon: Array<any> = [];

  objconc: any; 


  title = 'xmljson';
  public xmlItems: any;
  fileUrl: any;

  QRString = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.asp?id=28c751ac-b6f3-4293-b35e-9ce78b4eb4b8&re=CIN960904FQ2&rr=CUOA880131Q85&tt=0000002578.930000&fe=nfsuQW==';
  // loadXML(){
  //   this._http.get('/assets/F-1.xml',
  //   {
  //     headers: new HttpHeaders()
  //     .set('Content-Type', 'text/xml')
  //     .append('Access-Control-Allow-Methods', 'GET')
  //     .append('Access-Control-Allow-Origin', '*')
  //     .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
  //   responseType: 'text'
  //   })
  //   .subscribe((data) =>{
  //     this.parseXML(data)
  //     .then((data) => {
  //       this.xmlItems = data;
  //     });
  //   });
  // }

  // parseXML(data){
  //   return new Promise(resolve => {
  //     let k: string | number,
  //     arr = [],
  //     parser = new xml2js.Parser(
  //       {
  //         trim:true,
  //         explicitArray: true
  //       }); 
  //       parser.parseString(data, function (err, result){
  //         var obj = result.Comprobante;
  //         for (k in obj.Comprobante) {
  //           var item = obj.Comprobante[k];
  //           arr.push({
  //             certificado: item.Certificado[0],
  //           //   id: item.id[0],  
  //           // name: item.name[0],  
  //           // gender: item.gender[0],  
  //           // mobile: item.mobile[0]

  //           });
  //         }
  //         resolve(arr);
  //       })
  //   })


  // }

  onClose(){
    this.dialogRef.close();
  }

  pdfDB(){
     let row = JSON.parse(localStorage.getItem('rowfact'));
    console.log(row.Certificado);
    console.log(row.detalle[0].Cantidad);
    console.log(row.detalle);

this.certificado = row.Certificado;
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
this.rfcE = 'PLA11011243A'
this.nombreE = 'PRO LACTOINGREDIENTES S DE RL MI DE CV';
this.nombreR = row.Nombre;
this.rfcR = row.RFC;
this.usoCFDI = row.UsoCFDI;
this.regimen = '601';
this.cantidad = row.detalle[0].Cantidad;
this.claveUnidad = row.detalle[0].ClaveProducto;
this.unidad = row.detalle[0].Unidad;
this.descripcionConcepto = row.detalle[0].Producto;
this.valorUnitario = row.detalle[0].PrecioUnitario;
this.importeConcepto = row.detalle[0].Importe;
this.uuid = row.UUID;
this.noCertificadoSAT = row.NumeroDeSelloSAT;
this.iva = row.ImpuestosTrasladados;
this.RetIva = row.ImpuestosRetenidos;
this.selloSAT = row.SelloDigitalSAT;


this.objconc = row.detalle;

switch (this.moneda) {
  case "MXN":
    this.monedaT = "MXN"
    this.total = row.Total;
    this.subtotal = row.Subtotal;
    this.textnum = cantidad(this.total);
    break;
  case "USD":
    this.monedaT = "USD"
    this.total = row.TotalDlls;
    this.subtotal = row.SubtotalDlls;
    this.textnum = cantidad(this.total);
}

this.arrcon = [];

if(this.moneda === 'MXN'){
  for (this.con in this.objconc){
    var conceptos = this.objconc[this.con];
    this.arrcon.push({
      cantidad: conceptos.Cantidad,
      claveunidad: conceptos.ClaveProducto,
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
      claveunidad: conceptos.ClaveProducto,
      unidad: conceptos.Unidad,
      descripcion: conceptos.Producto,
      valorunitario: conceptos.PrecioUnitarioDlls,
      importe: conceptos.ImporteDlls,
      observaciones: conceptos.Observaciones
    });
}
}
console.log(this.objconc);
console.log(this.arrcon);

this.service.getFacturasClienteFolio(this.folio).subscribe(data=>{
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

  leerxml(folio:string) {
   
    // this.PdfPreliminar();
    // this._http.get('/assets/F-1.xml',
    // this._http.get(localStorage.getItem('xml'),
    // {
    //   headers: new HttpHeaders()
    //   .set('Content-Type', 'text/xml')
    //   .append('Access-Control-Allow-Methods', 'GET')
    //   .append('Access-Control-Allow-Origin', '*')
    //   .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
    // responseType: 'text'
    // })
    // .subscribe(data =>{
    // this.xmlString = data;
    // this.xmlString = this.xmlparametro;
    // console.log(this.xmlString);

    // this.xmlString = localStorage.getItem('xml');
    // console.log('XMLSTRIng'+this.xmlString);
    // const parser = new xml2js.Parser({strict: false, trim: true});


    const p = new xml2js.parseString(localStorage.getItem('xml'+folio), { tagNameProcessors: [processors.stripPrefix] }, (err, result) => {

     console.log(result);

      
      
      this.certificado = result.Comprobante.$.Certificado;
      this.serie = result.Comprobante.$.Serie;
      this.folio = result.Comprobante.$.Folio;
      this.fecha = result.Comprobante.$.Fecha;
      this.formaDePago = result.Comprobante.$.FormaPago;
      this.nocertificado = result.Comprobante.$.NoCertificado;
      this.moneda = result.Comprobante.$.Moneda;
      this.subtotal = result.Comprobante.$.SubTotal;
      this.total = result.Comprobante.$.Total;
      this.textnum = cantidad(this.total);
      this.tipoDeComprobante = result.Comprobante.$.TipoDeComprobante;
      this.metodoPago = result.Comprobante.$.MetodoPago;
      this.lugarExpedicion = result.Comprobante.$.LugarExpedicion;
      this.selloCFDI = result.Comprobante.$.Sello;
      this.rfcE = result.Comprobante.Emisor[0].$.Rfc;
      this.nombreE = result.Comprobante.Emisor[0].$.Nombre;
      this.nombreR = result.Comprobante.Receptor[0].$.Nombre;
      this.rfcR = result.Comprobante.Receptor[0].$.Rfc;
      this.usoCFDI = result.Comprobante.Receptor[0].$.UsoCFDI;
      this.regimen = result.Comprobante.Emisor[0].$.RegimenFiscal;
      this.cantidad = result.Comprobante.Conceptos[0].Concepto[0].$.Cantidad;
      this.claveUnidad = result.Comprobante.Conceptos[0].Concepto[0].$.ClaveUnidad;
      this.unidad = result.Comprobante.Conceptos[0].Concepto[0].$.Unidad;
      this.descripcionConcepto = result.Comprobante.Conceptos[0].Concepto[0].$.Descripcion;
      this.valorUnitario = result.Comprobante.Conceptos[0].Concepto[0].$.ValorUnitario;
      this.importeConcepto = result.Comprobante.Conceptos[0].Concepto[0].$.Importe;
      this.uuid = result.Comprobante.Complemento[0].TimbreFiscalDigital[0].$.UUID;
      this.noCertificadoSAT = result.Comprobante.Complemento[0].TimbreFiscalDigital[0].$.NoCertificadoSAT;
      this.iva = result.Comprobante.Impuestos[0].Traslados[0].Traslado[0].$.Importe;
      this.selloSAT = result.Comprobante.Complemento[0].TimbreFiscalDigital[0].$.SelloSAT;


      this.objconc = result.Comprobante.Conceptos[0].Concepto;

      this.arrcon = [];
      for (this.con in this.objconc){
        var conceptos = this.objconc[this.con];
        this.arrcon.push({
        cantidad: conceptos.$.Cantidad,
        claveunidad: conceptos.$.NoIdentificacion,
        unidad: conceptos.$.Unidad,
        descripcion: conceptos.$.Descripcion,
        valorunitario: conceptos.$.ValorUnitario,
        importe: conceptos.$.Importe
        });
      }
      console.log(this.objconc);
      console.log(this.arrcon);
      
      // Por Definir

      this.service.getFacturasClienteFolio(folio).subscribe(data=>{
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

      switch (this.moneda) {
        case "MXN":
          this.monedaT = "MXN"
          break;
        case "USD":
          this.monedaT = "USD"
      }
this.xmlparametros='';
    })
    // const p = new xml2js.parseString(data, (err, result) => {
    //   console.log(result);

    //   this.xml = result.COMPROBANTE;
    // })

    //si funciona
    // parser.parseString(data, {tagNameProcessors: [processors.stripPrefix]}, (err, result) => {
    //   console.log(result.COMPROBANTE);

    //   this.xml = result;
    // })
    // console.log(this.xml);


    // });






  }

  PdfPreliminar(datos:any) {
    console.log(datos);
    
    this.certificado = "este sigue siendo una prueba 2";
    this.serie = " ";
    this.folio = "";
    this.fecha = "";
    this.formaDePago = "";
    this.nocertificado = "";
    this.moneda = "";
    this.subtotal = "";
    this.total = "";
    this.textnum = "";
    this.metodoPago = "";
    this.lugarExpedicion = "";
    this.selloCFDI = "";
    this.rfcE = "";
    this.nombreE = "";
    this.nombreR = "";
    this.rfcR = "";
    this.usoCFDI = "";
    this.regimen = "";
    this.cantidad = "";
    this.claveUnidad = "";
    this.unidad = "";
    this.descripcionConcepto = datos.Conceptos[0].Descripcion;
    this.valorUnitario = "";
    this.importeConcepto
    this.uuid
    this.noCertificadoSAT = "";
    this.iva = "";
    this.selloSAT = "";

  }


  cantidadLetra() {
    console.log(cantidad(6765));

  }


  ngOnInit() {

    



    // this.leerxml();

    const blob = new Blob(['/assets/js/F-1.xml'], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

    this.pdfDB();
  }
  QRstring = "";

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this.xmlparametros);
   /*  if (this.xmlparametros!='' && this.xmlparametros!='undefined'){
      console.log('1');
      console.log(this.xmlparametros);
      this.leerxml(this.xmlparametros);
      
    } */

    // if (!this.xmlparametros){
    //   console.log('2');
      
    // }else{
    //   console.log(this.xmlparametros);
    //   this.pdfDB(this.xmlparametros);
    // }
    // this.PdfPreliminar();
     
  }


}
