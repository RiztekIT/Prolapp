import { Component, OnInit, ViewChild } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Factura } from '../../../Models/facturacioncxc/factura-model';
import { FacturaService } from '../../../services/facturacioncxc/factura.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FacturacioncxcAddComponent } from './facturacioncxc-add/facturacioncxc-add.component';
import { FacturacioncxcEditComponent } from './facturacioncxc-edit/facturacioncxc-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturacioncxc',
  templateUrl: './facturacioncxc.component.html',
  styleUrls: ['./facturacioncxc.component.css'],
})
export class FacturacioncxcComponent implements OnInit {
  IdFactura: any;
  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['Id', 'Folio', 'Cliente', 'FechaExpedicion', 'Subtotal', 'IVA', 'Total', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshFacturaList();
      });

   }

  ngOnInit() {
    this.refreshFacturaList();
    this.Folio();
    this.ObtenerUltimaFactura();
  }

  refreshFacturaList() {

    this.service.getFacturasList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    });

  }

  onDelete( id:number){
    // console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteFactura(id).subscribe(res => {
      this.refreshFacturaList();
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top'
      });

      });
    }

  }
  //Generar Factura en Blanco
  public FacturaBlanco: Factura = 
    {
      Id:0,
      IdCliente:0,
      Serie: "",
      Folio: this.Folio(),
      Tipo: "",
      FechaDeExpedicion: new Date(),
      LugarDeExpedicion: "",
      Certificado: "",
      NumeroDeCertificado: "",
      UUID: "",
      UsoDelCFDI: "",
      Subtotal: "",
      Descuento: "",
      ImpuestosRetenidos: "",
      ImpuestosTrasladados: "",
      Total: "",
      FormaDePago: "",
      MetodoDePago: "",
      Cuenta: "",
      Moneda: "",
      CadenaOriginal: "",
      SelloDigitalSAT: "",
      SelloDigitalCFDI: "",
      NumeroDeSelloSAT: "",
      RFCdelPAC: "",
      Observaciones: "",
      FechaVencimiento:  new Date(),
      OrdenDeCompra: "",
      TipoDeCambio: "",
      FechaDeEntrega:  new Date(),
      CondicionesDePago: "",
      Vendedor: "",
      Estatus: "",
      Version: "",
      Usuario: ""
  }

  Folio() {
    let folio = "200";
    return folio;
    // this.service.getFolio().subscribe(data => {
    // console.log(this.folio);
    // this.service.formData.Folio = this.folio;
    // console.log(this.service.formData.Folio);
    // });
  }



  onAdd(){
    this.service.addFactura(this.FacturaBlanco).subscribe(res => {
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      let Id = this.IdFactura;
      console.log(Id);
      this.router.navigate(['/facturacionCxcAdd', Id]);
    }
    );
  }
 
ObtenerUltimaFactura(){
  this.service.getUltimaFactura().subscribe(data => {
    console.log(data);
    this.IdFactura = data[0].Id;
    // console.log(this.IdFactura);
    return this.IdFactura;
    // console.log(this.IdFactura);
    });

}
  onEdit(factura: Factura){
// console.log(factura);
this.service.formData = factura;
let Id = factura.Id;
    console.log(Id);
    this.router.navigate(['/facturacionCxcAdd', Id]);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }
  
  onExportClick() {
    const option = {
      margin: [0,0,0,0],
      filename: 'FacturaPDF.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: {scale: 2, logging: true},
      jsPDF: {orientation: 'portrait'}


    };
    const content: Element = document.getElementById('element-to-PDF');

    html2pdf()
   .from(content)
   .set(option)
   .save();
}


}
