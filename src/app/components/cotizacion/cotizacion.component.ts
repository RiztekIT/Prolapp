import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';
import { VentasCotizacionService } from '../../services/ventas/ventas-cotizacion.service';
import { DetalleCotizacion } from '../../Models/ventas/detalleCotizacion-model';


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<CotizacionComponent>, public _MessageService: MessageService, public service: VentasCotizacionService) { }

  con : string| number;
  arrcon: Array<any> = [];
  objconc: any; 
  total:any;

  ngOnInit() {
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
}


ver(){
  
  this.objconc = this.service.formrow.DetalleCotizacion
  
  this.arrcon = [];
  for (this.con in this.objconc){
    var conceptos = this.objconc[this.con];
    this.arrcon.push({
      IdDetalleCotizacion: conceptos.IdDetalleCotizacion,
      IdCotizacion: conceptos.IdCotizacion,
      ClaveProducto: conceptos.ClaveProducto,
      Producto: conceptos.Producto,
      Unidad: conceptos.Unidad,
      PrecioUnitario: conceptos.PrecioUnitario,
      PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
      Cantidad: conceptos.Cantidad,
      Importe: conceptos.Importe,
      ImporteDlls: conceptos.ImporteDlls,
      Observaciones: conceptos.Observaciones,    
       
     });
//cuando se termine cotizaciones, asignar el valor al total

    // if (this.service.formrow.Moneda == "MXN") {
    //   this.total = +conceptos.PrecioUnitario * +conceptos.Cantidad;
    // } else {
    //   this.total = 
    // }
    
  }



  this.service.GetCliente(this.service.formrow.IdCliente).subscribe(data => {

    this.service.formData.Calle = data[0].Calle;
    this.service.formData.Colonia = data[0].Colonia;
    this.service.formData.CP = data[0].CP;
    this.service.formData.RFC = data[0].RFC;
    this.service.formData.Ciudad = data[0].Ciudad;
    this.service.formData.Estado = data[0].Estado;
    this.service.formData.NumeroExterior = data[0].NumeroExterior;
    this.service.formData.NumeroInterior = data[0].NumeroInterior;
  });
  
}

onExportClick(Folio?:string) {
  const content: Element = document.getElementById('Cotizacion-PDF');
  const option = {    
    margin: [.5,0,0,0],
    filename: 'F-'+'.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    pagebreak:{ avoid: '.pgbreak'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
}  

}

