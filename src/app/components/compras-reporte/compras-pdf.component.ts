import { Component, Inject, OnInit } from '@angular/core';
import { CompraService } from '../../services/compras/compra.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { ProveedoresService } from '../../services/catalogos/proveedores.service';
import { Proveedor } from '../../Models/catalogos/proveedores-model';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';


declare function cantidad(n);


@Component({
  selector: 'app-compras-pdf',
  templateUrl: './compras-pdf.component.html',
  styleUrls: ['./compras-pdf.component.css']
})
export class ComprasPdfComponent implements OnInit {

  logo;
  OrigenConsulta: string
  datosODH;

  constructor(public ComprasService: CompraService, public dialogbox: MatDialogRef<ComprasPdfComponent>, public router: Router,
    public ProveedorService: ProveedoresService, public empresaSVC: EmpresaService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.OrigenConsulta = null
    console.log('%c%s', 'color: #8c0038', this.data);
    if (this.data) {
      
      this.datosODH = this.data.datos;      
      this.OrigenConsulta = this.data.OrigenConsulta;
    }
// console.log(this.ComprasService.formt);
this.ver();
  }

  con : string| number;
    arrcon: Array<any> = [];
    unidad: Array<any> = [];
    TotalProducto: Array<any> = [];
  
    objconc: any; 
    
    rfcE;
  nombreE;
  calle;
    numeroext;
    colonia;
    codigopostal;
    ciudad;
    estado;
    numeroint;
    textnum: string;
  total: string;

  onClose() {
    this.dialogbox.close();
}

ver(){

  this.logo = '../../../assets/images/'+this.empresaSVC.empresaActual.RFC+'.png'
  this.rfcE = this.empresaSVC.empresaActual.RFC;
this.nombreE = this.empresaSVC.empresaActual.RazonSocial;
this.calle = this.empresaSVC.empresaActual.Calle
  this.numeroext = this.empresaSVC.empresaActual.NumeroExterior
  this.colonia = this.empresaSVC.empresaActual.Colonia
  this.codigopostal = this.empresaSVC.empresaActual.CP
  this.ciudad = this.empresaSVC.empresaActual.Ciudad
  this.estado = this.empresaSVC.empresaActual.Estado
  this.numeroint = this.empresaSVC.empresaActual.NumeroInterior

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
if(this.OrigenConsulta){

  this.objconc = this.ComprasService.formt.OrdenDescargaDODCompras;
} else{
  
  this.objconc = this.ComprasService.formt.detalleCompra;
}

this.arrcon = [];
this.unidad = []
console.log('%c⧭', 'color: #514080', this.datosODH);
for (this.con in this.objconc){
  var conceptos = this.objconc[this.con];
  
            if(this.OrigenConsulta){
              this.arrcon.push({
                IdDetalleCompra: conceptos.IdDetalleCompra,
                IdCompra: conceptos.IdCompra,
                ClaveProducto: conceptos.ClaveProducto,
                Producto: conceptos.Producto,
                PesoxSaco: conceptos.PesoxSaco,
                CostoTotal: conceptos.CostoTotal,
                IVA: conceptos.IVA,
                Observaciones: conceptos.Observaciones,
                CostoTotalDlls: conceptos.CostoTotalDlls,
                IVADlls: conceptos.IVADlls,
                
                PrecioUnitario: this.datosODH[this.con].PrecioUnitario,
                Unidad: this.datosODH[this.con].Unidad,
                Cantidad: this.datosODH[this.con].Cantidad,
                PrecioUnitarioDlls: this.datosODH[this.con].PrecioUnitarioDlls,
              });
            

            } else{

              this.arrcon.push({
                IdDetalleCompra: conceptos.IdDetalleCompra,
                IdCompra: conceptos.IdCompra,
                ClaveProducto: conceptos.ClaveProducto,
                Producto: conceptos.Producto,
                PesoxSaco: conceptos.PesoxSaco,
                CostoTotal: conceptos.CostoTotal,
                IVA: conceptos.IVA,
                Observaciones: conceptos.Observaciones,
                CostoTotalDlls: conceptos.CostoTotalDlls,
                IVADlls: conceptos.IVADlls,
                
                PrecioUnitario: conceptos.PrecioUnitario,
                Unidad: conceptos.Unidad,
                Cantidad: conceptos.Cantidad,
                PrecioUnitarioDlls: conceptos.PrecioUnitarioDlls,
              });
            }
              // ^ Guarda la unidad para cada producto, que luego se desplegara en el pfd
              if(this.OrigenConsulta){
                this.unidad[this.con] = this.datosODH[this.con].Unidad;
                this.TotalProducto[this.con] = this.datosODH[this.con].Cantidad * this.datosODH[this.con].PrecioUnitario;

              } else{
                this.unidad[this.con] = conceptos.Unidad;
                this.TotalProducto[this.con] = conceptos.Cantidad * conceptos.PrecioUnitario;

              }
      }
    this.total = this.ComprasService.formt.Total
    this.textnum = cantidad(this.total);
    console.log('this.unidad : ', this.unidad );
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
