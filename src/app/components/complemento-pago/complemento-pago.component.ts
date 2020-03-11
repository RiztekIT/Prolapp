import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-complemento-pago',
  templateUrl: './complemento-pago.component.html',
  styleUrls: ['./complemento-pago.component.css']
})
export class ComplementoPagoComponent implements OnInit {

  myAngularxQrCode: string;
  QRsize:number;
  
  // constructor(public dialogbox: MatDialogRef<ComplementoPagoComponent>, public router: Router, private _formBuilder: FormBuilder, 
  constructor(public router: Router, private _formBuilder: FormBuilder, 
    public service: ReciboPagoService) { 
      this.QRsize = 125;
      // assign a value to QR
      this.myAngularxQrCode = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.asp?id=28c751ac-b6f3-4293-b35e-9ce78b4eb4b8&re=CIN960904FQ2&rr=CUOA880131Q85&tt=0000002578.930000&fe=nfsuQW==';
      
    }

    con : string| number;
  arrcon: Array<any> = [];

  objconc: any; 

  SaldoAnterior: any;

  ngOnInit() {
    this.ver();
  }

  QRString = 'www.facebook.com';

  onClose() {
    // this.dialogbox.close();
    // document.getElementById('cerrarmodal').click();
    this.service.filter('Register click');
}
  ver(){
    this.service.formt = JSON.parse(localStorage.getItem('rowpago'));
    
    console.log(this.service.formt)


    this.objconc = this.service.formt.pagoCFDI;

    this.arrcon = [];
    for (this.con in this.objconc){
      var conceptos = this.objconc[this.con];  
      this.arrcon.push({
        Id: conceptos.Id,
        IdReciboPago: conceptos.IdReciboPago,
        IdFactura: conceptos.IdFactura, 
        UUID: conceptos.UUID, 
        Cantidad: conceptos.Cantidad,
        NoParcialidad: conceptos.NoParcialidad, 
        Saldo: conceptos.Saldo, 
        Id1: conceptos.Id1, 
        IdCliente: conceptos.IdCliente, 
        Serie: conceptos.Serie,
        Folio: conceptos.Folio,
        Tipo: conceptos.Tipo, 
        FechaDeExpedicion: conceptos.FechaDeExpedicion,
        LugarDeExpedicion: conceptos.LugarDeExpedicion,
        Certificado: conceptos.Certificado,
        NumeroDeCertificado: conceptos.NumeroDeCertificado,
        UUID1: conceptos.UUID1,
        UsoDelCFDI: conceptos.UsoDelCFDI,
        Subtotal: conceptos.Subtotal,
        Descuento: conceptos.Descuento,
        ImpuestosRetenidos: conceptos.ImpuestosRetenidos,
        ImpuestosTrasladados: conceptos.ImpuestosTrasladados,
        Total: conceptos.Total,
        FormaDePago: conceptos.FormaDePago,
        MetodoDePago: conceptos.MetodoDePago,
        Cuenta: conceptos.Cuenta,
        Moneda: conceptos.Moneda,
        CadenaOriginal: conceptos.CadenaOriginal,
        SelloDigitalSAT: conceptos.SelloDigitalSAT,
        SelloDigitalCFDI: conceptos.SelloDigitalCFDI,
        NumeroDeSelloSAT: conceptos.NumeroDeSelloSAT,
        RFCDelPAC: conceptos.RFCdelPAC,
        Observaciones: conceptos.Observaciones,
        FechaVencimiento: conceptos.FechaVencimiento,
        OrdenDeCompra: conceptos.OrdenCompra,
        TipoDeCambio: conceptos.TipoCambio,
        FechaDeEntrega: conceptos.FechaDeEntrega,
        CondicionesDePago: conceptos.CondicionesDePago,
        Vendedor: conceptos.Vendedor,
        Estatus: conceptos.Estatus,
        Ver: conceptos.Ver,
        Usuario: conceptos.Usuario,
        SubtotalDlls: conceptos.SubtotalDlls,
        ImpuestosTrasladadosDlls: conceptos.ImpuestosTrasladadosDlls,
        TotalDlls: conceptos.TotalDlls,
      });
    }

    console.log(this.arrcon);

    this.SaldoAnterior = conceptos.Cantidad + conceptos.Saldo;

    console.log(this.SaldoAnterior);

    switch(this.service.formt.FormaPago){

     case "01": this.service.formt.FormaPago = "01-Efectivo"
     break;
     case "02": this.service.formt.FormaPago = "02-Cheque nominativo"
     break;
     case "03": this.service.formt.FormaPago = "03-Transferencia electrónica de fondos"
     break;
     case "04": this.service.formt.FormaPago = "04-Tarjeta de crédito"
     break;
     case "05": this.service.formt.FormaPago = "05-Monedero electrónico"
     break;
     case "06": this.service.formt.FormaPago = "06-Dinero electrónico"
     break;
     case "08": this.service.formt.FormaPago = "08-Vales de despensa"
     break;
     case "12": this.service.formt.FormaPago = "12-Dación en pago"
     break;
     case "13": this.service.formt.FormaPago = "13-Pago por subrogación"
     break;
     case "14": this.service.formt.FormaPago = "14-Pago por consignación"
     break;
     case "15": this.service.formt.FormaPago = "15-Condonación"
     break;
     case "17": this.service.formt.FormaPago = "17-Compensación"
     break;
     case "23": this.service.formt.FormaPago = "23-Novación"
     break;
     case "24": this.service.formt.FormaPago = "24-Confusión"
     break;
     case "25": this.service.formt.FormaPago = "25-Remisión de deuda"
     break;
     case "26": this.service.formt.FormaPago = "26-Prescripción o caducidad"
     break;
     case "27": this.service.formt.FormaPago = "27-A satisfacción del acreedor"
     break;
     case "28": this.service.formt.FormaPago = "28-Tarjeta de débito"
     break;
     case "29": this.service.formt.FormaPago = "29-Tarjeta de servicios"
     break;
     case "30": this.service.formt.FormaPago = "30-Aplicación de anticipos"
     break;
     case "31": this.service.formt.FormaPago = "31-Intermediario pagos"
     break;
     case "99": this.service.formt.FormaPago = "99-Por definir"
     break;

    }
    
  }
      
  onExportClick(Folio?:string) {
    const content: Element = document.getElementById('ComprobanteDePago-PDF');
    const option = {    
      margin: [.5,0,0,0],
      filename: 'F-'+this.service.formt.Folio+'.pdf',
      // image: {type: 'jpeg', quality: 1},
      html2canvas: {scale: 2, logging: true, scrollY: 0},
      jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
      pagebreak:{ avoid: '.pgbreak'}
    };
  
    html2pdf()
   .from(content)
   .set(option)
   .save();
  }

}
