import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../services/compras/compra.service';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { ProveedoresService } from '../../services/catalogos/proveedores.service';
import { Proveedor } from '../../Models/catalogos/proveedores-model';
@Component({
  selector: 'app-compras-pdf',
  templateUrl: './compras-pdf.component.html',
  styleUrls: ['./compras-pdf.component.css']
})
export class ComprasPdfComponent implements OnInit {

  constructor(public ComprasService: CompraService, public dialogbox: MatDialogRef<ComprasPdfComponent>, public router: Router,
    public ProveedorService: ProveedoresService) { }

  ngOnInit() {
// console.log(this.ComprasService.formt);
this.ver();
  }

  con : string| number;
    arrcon: Array<any> = [];
  
    objconc: any; 


  onClose() {
    this.dialogbox.close();
}

ver(){

  //Obtener datos del proveedor
  this.ProveedorService.getProveedorId(this.ComprasService.formt.IdProveedor).subscribe(dataP=>{
// console.log(dataP[0]);
if(dataP.length > 0){
this.ComprasService.formt.IdProveedor = dataP[0].IdProveedor
this.ComprasService.formt.Proveedor = dataP[0].Nombre
this.ComprasService.formt.Calle = dataP[0].Calle
this.ComprasService.formt.NumeroInterior = dataP[0].NumeroInterior
this.ComprasService.formt.NumeroExterior = dataP[0].NumeroExterior
this.ComprasService.formt.CP = dataP[0].CP
this.ComprasService.formt.Ciudad = dataP[0].Ciudad
this.ComprasService.formt.Estado = dataP[0].Estado
this.ComprasService.formt.RFC = dataP[0].RFC
} else{
  this.ComprasService.formt.IdProveedor = '';
  this.ComprasService.formt.Proveedor = '';
  this.ComprasService.formt.Calle = '';
  this.ComprasService.formt.NumeroInterior = '';
  this.ComprasService.formt.NumeroExterior = '';
  this.ComprasService.formt.CP = '';
  this.ComprasService.formt.Ciudad = '';
  this.ComprasService.formt.Estado = '';
  this.ComprasService.formt.RFC = '';
}   
    
    // console.log(this.ComprasService.formt.detalleCompra);
    
    this.objconc = this.ComprasService.formt.detalleCompra;
    
    this.arrcon = [];
    for (this.con in this.objconc){
      var conceptos = this.objconc[this.con];
      this.arrcon.push({
        IdDetalleCompra: conceptos.IdDetalleCompra,
        IdCompra: conceptos.IdCompra,
        ClaveProducto: conceptos.ClaveProducto,
        Producto: conceptos.Producto,
        Cantidad: conceptos.Cantidad,
        PesoxSaco: conceptos.PesoxSaco,
        PrecioUnitario: conceptos.PrecioUnitario,
        CostoTotal: conceptos.CostoTotal,
        IVA: conceptos.IVA,
        Unidad: conceptos.Unidad,
        Observaciones: conceptos.Observaciones,
        PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
        CostoTotalDlls: conceptos.CostoTotalDlls,
        IVADlls: conceptos.IVADlls,
      });
    }
    // console.log(this.arrcon);
    
    
  });
  }
  
onExportClick(Folio?:string) {
  const content: Element = document.getElementById('element-to-PDF');
  const option = {    
    margin: [.5,0,0,0],
    filename: 'F-'+this.ComprasService.formt.Folio+'.pdf',
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
