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

  ngOnInit() {
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
}

ver(){

  console.log(this.service.formrow.DetalleCotizacion);
  
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
  }
}

onExportClick(Folio?:string) {
  const content: Element = document.getElementById('OrdenCarga-PDF');
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
