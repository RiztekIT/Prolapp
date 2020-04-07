import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatDialogRef } from '@angular/material';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
// import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
// import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';

@Component({
  selector: 'app-orden-carga',
  templateUrl: './orden-carga.component.html',
  styleUrls: ['./orden-carga.component.css']
})
export class OrdenCargaComponent implements OnInit {
  usda: any;
  pesoTotal: any;

  constructor(public dialogbox: MatDialogRef<OrdenCargaComponent>, public service: OrdenCargaService) { }

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

  console.log(this.service.formrow.detalleOrdenCarga);
  
  this.objconc = this.service.formrow.detalleOrdenCarga;
  console.log(this.objconc);
  
  this.arrcon = [];
  for (this.con in this.objconc){
    var conceptos = this.objconc[this.con];
    this.arrcon.push({
      IdDetalleOrdenCarga: conceptos.IdDetalleOrdenCarga,
      IdOrdenCarga: conceptos.IdOrdenCarga,
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
  console.log(this.arrcon);
  this.usda = conceptos.USDA;
  this.pesoTotal = +conceptos.Sacos * +conceptos.PesoxSaco;
}

  
onExportClick(Folio?:string) {
  const content: Element = document.getElementById('OrdenCarga-PDF');
  const option = {    
    margin: [.5,3,0,0],
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
