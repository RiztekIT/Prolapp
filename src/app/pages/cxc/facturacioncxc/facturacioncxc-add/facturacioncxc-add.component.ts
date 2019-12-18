import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import {  NgForm } from '@angular/forms';
import { Cliente } from '../../../../Models/catalogos/clientes-model';
import { Router } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { Usuario } from '../../../../Models/catalogos/usuarios-model';

let datosfact = JSON.stringify( 
  {
    "Receptor": {
      "UID": "5de771f1a1203"
    },
    "TipoDocumento":"factura",
     "Conceptos": [
      {
        "ClaveProdServ": "43232408",
        "NoIdentificacion": "WEBDEV10",
        "Cantidad": "1.000000",
        "ClaveUnidad": "E48",
        "Unidad": "Unidad de servicio",
        "Descripcion": "Desarrollo web a la medida",
        "ValorUnitario": "15000.000000",
        "Importe": "15000.000000",
        "Descuento": "0",
        "tipoDesc": "porcentaje",
        "honorarioInverso": "",
        "montoHonorario": "0",
        "Impuestos": {
          "Traslados": [
            {
              "Base": "15000.000000",
              "Impuesto": "002",
              "TipoFactor": "Tasa",
              "TasaOCuota": "0.16",
              "Importe": "2400.000000"
            }
          ],
          "Retenidos": [],
          "Locales": []
        },
        "NumeroPedimento": "",
        "Predial": "",
        "Partes": "0",
        "Complemento": "0"
      }
    ],
    "Impuestos": {
    "Traslados": [
      {
        "Base": "15000.000000",
        "Impuesto": "002",
        "TipoFactor": "Tasa",
        "TasaOCuota": "0.16",
        "Importe": "2400.000000"
      }
    ],
    "Retenidos": [],
    "Locales": []
   },
  "UsoCFDI": "G03",
        "Serie": 5352,
        "FormaPago": "03",
        "MetodoPago": "PUE",
        "Moneda": "MXN",
        "EnviarCorreo": false
  });




@Component({
  selector: 'app-facturacioncxc-add',
  templateUrl: './facturacioncxc-add.component.html'
})
export class FacturacioncxcAddComponent implements OnInit {
  folio: string;

  constructor( 
    public service: FacturaService, private snackBar: MatSnackBar,  private router:Router, public enviarfact: EnviarfacturaService) { }
    
  
    listClientes: Cliente[]  = [];
  

    estatusfact;
    numfact;
    xml;

  ngOnInit() {
    this.resetForm();
    this.dropdownRefresh();
    this.Folio();
  }


  dropdownRefresh(){
    this.service.getDepDropDownValues().subscribe((data) =>{
    // console.log(data);
    for (let i = 0; i < data.length; i++){
      let client=data[i];
      this.listClientes.push(client);
    }
    });
  }
  
  Regresar(){
    this.router.navigateByUrl('/facturacionCxc');
  }
  Folio(){
    this.folio = "200"; 
    // this.service.getFolio().subscribe(data => {
      console.log(this.folio);
      // console.log(this.folio);
      this.service.formData.Folio = this.folio;
      console.log(this.service.formData.Folio);
      // this.service.formData.Folio = this.folio;
      // console.log(this.service.formData.Folio);
    // });
  }

  



  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();
   this.service.formData = {
     //Factura
    Id: 0,
    ClienteId: 0,
    Serie: '',
    Folio: '',
    Tipo: '',
    FechaDeExpedicion: '',
    LugarDeExpedicion: '',
    Certificado: '',
    NumeroDeCertificado: '',
    UUID: '',
    UsoDelCFDI: '',
    Subtotal: '',
    Descuento: '',
    ImpuestosRetenidos: '',
    ImpuestosTrasladados: '',
    Total: '',
    FormaDePago: '',
    MetodoDePago: '',
    Cuenta: '',
    Moneda: '',
    CadenaOriginal: '',
    SelloDigitalSAT: '',
    SelloDigitalCFDI: '',
    NumeroDeSelloSAT: '',
    RFCdelPAC: '',
    Observaciones: '',
    FechaVencimiento: '',
    OrdenDeCompra: '',
    TipoDeCambio: '',
    FechaDeEntrega: '',
    CondicionesDePago: '',
    Vendedor: '',
    Estatus: '',
    Version: '',
    Usuario: '',
    //Detalle Factura
    IdDetalle: 0,
    IdFactura: 0,
    ClaveProducto: '',
    Producto: '',
    Unidad: '',
    ClaveSat: '',
    PrecioUnitario: '',
    Cantidad: '',
    Importe: '',
    ObservacionesConcepto: '',
    TextoExtra: ''
   }

  }


onSubmit(form: NgForm) {
  // console.log(form.value);
  // this.service.addProducto(form.value).subscribe( res =>
  //   {
  //     this.resetForm(form);
  //     this.snackBar.open(res.toString(),'',{
  //       duration: 5000,
  //       verticalPosition: 'top'
  //     });
  //   }
  //   );
  console.log(form.value);
}

enviar(){
  this.enviarfact.enviarFactura(datosfact).subscribe(data => {
    console.log(data);
    if (data.response === 'success'){
      console.log('Factura Creada');
      this.numfact=data.invoice_uid;
      // this.xml = 'devfactura.in/admin/cfdi33/'+this.numfact+'xml';
      
      this.enviarfact.xml(this.xml);
      this.estatusfact= 'Factura Creada '+ data.invoice_uid;
      this.dxml(this.numfact);
      this.dpdf(this.numfact);
      
    }
    if (data.response === 'error') {
      console.log('error');
      this.estatusfact= data.response + ' ' + data.message;
      
    }


    
  })

  
// this.enviarfact.enviarFactura();
  // console.log(this.enviarfact.enviarFactura());
  
}

verfolios(){

    //5df9887b8fa49
}

dxml(id:string){
  // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/xml";
  let xml = window.open('http://devfactura.in/admin/cfdi33/'+id+'/xml','XML');
}

dpdf(id:string){
  // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/pdf";
  let pdf = window.open('http://devfactura.in/admin/cfdi33/'+id+'/pdf','PDF');
}

dpdfxml(){
  this.dxml('5df9887b8fa49');
  this.dpdf('5df9887b8fa49');
}


}
