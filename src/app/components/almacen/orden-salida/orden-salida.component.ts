import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef } from '@angular/material';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';

@Component({
  selector: 'app-orden-salida',
  templateUrl: './orden-salida.component.html',
  styleUrls: ['./orden-salida.component.css']
})
export class OrdenSalidaComponent implements OnInit {
  usda: any;
  pesoTotal: any;
  constructor( public dialogbox: MatDialogRef<OrdenSalidaComponent>, public service: OrdenDescargaService) { }

  objconc: any; 
  con : string| number;
  arrcon: Array<any> = [];

  ngOnInit() {
    
    this.ver();
  }

  onClose() {
    this.dialogbox.close();
}


ver(){

  
  // console.log(this.service.formrow.detalleOrdenDescarga);
  this.objconc = this.service.formrow.detalleOrdenDescarga;
  
  this.arrcon = [];
  for (this.con in this.objconc){
    var conceptos = this.objconc[this.con];
    this.arrcon.push({
      IdDetalleOrdenDescarga: conceptos.IdDetalleOrdenDescarga,
      IdOrdenDescarga: conceptos.IdOrdenDescarga,
      ClaveProducto: conceptos.ClaveProducto,
      Producto: conceptos.Producto,
      Sacos: conceptos.Sacos,
      PesoxSaco: conceptos.PesoxSaco,
      Lote: conceptos.Lote,
      IdProveedor: conceptos.IdProveedor,
      Proveedor: conceptos.Proveedor,
      PO: conceptos.PO,
      FechaMFG: conceptos.FechaMFG,
      FechaCaducidad: conceptos.FechaCaducidad,
      Shipper: conceptos.Shipper,      
      USDA: conceptos.USDA,      
      Pedimento: conceptos.Pedimento,      
      Saldo: conceptos.Saldo,        
    });
  }
  this.usda = conceptos.USDA;
  this.pesoTotal = +conceptos.Sacos * +conceptos.PesoxSaco;

}


  
onExportClick(Folio?:string) {
  const content: Element = document.getElementById('OrdenSalida-PDF');
  const option = {    
    margin: [.5,0,0,0],
    filename: 'F-'+'.pdf',
    // image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'landscape'}, 
    pagebreak:{ avoid: '.pgbreak'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
} 


}
