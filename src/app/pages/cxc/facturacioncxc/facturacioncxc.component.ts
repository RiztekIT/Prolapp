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
  displayedColumns : string [] = ['Folio', 'Cliente', 'FechaExpedicion', 'Subtotal', 'IVA', 'Total', 'Estado', 'Options'];
  folio: string;
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router) {

    this.service.listen().subscribe((m:any)=>{
      // console.log(m);
      this.refreshFacturaList();
      });

   }

  ngOnInit() {
    this.refreshFacturaList();
    this.Folio();
    this.ObtenerUltimaFactura();


    
  }

  refreshFacturaList() {

    this.service.getFacturasListCLiente().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      // console.log(this.listData);
      this.listData.sort = this.sort;
    });

  }
//Eliminar Factura si no esta timbrada
  onDelete( factura: Factura){
    // console.log(factura.Estatus);
    if (factura.Estatus == 'Timbrada' || factura.Estatus == 'Cancelada'){
      // console.log('No se puede ELIMINAR BRO');
      this.snackBar.open('No se puede eliminar Factura', '', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }else{
      // console.log('Se puede eliminar');
          if ( confirm('Are you sure to delete?')) {
            this.service.deleteFactura(factura.Id).subscribe(res => {
            this.refreshFacturaList();
            this.snackBar.open(res.toString(), '', {
              duration: 3000,
              verticalPosition: 'top'
            });
      
            });
          }
    }
    // console.log(id);

  }
  //Generar Factura en Blanco
  public FacturaBlanco: Factura = 
    {
      Id:0,
      IdCliente:1,
      Serie: "",
      Folio: "",
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
      Estatus: "Creada",
      Version: "",
      Usuario: ""
  }

  Folio() {
    this.service.getFolio().subscribe(data => {
      // console.log(data + "ESTE ES EL FOLIO");
      // this.folio = data;
      this.FacturaBlanco.Folio = data
      console.log(this.FacturaBlanco.Folio);
      // this.service.formData.Folio = this.folio;
      // console.log(this.service.formData.Folio);
    });
    // console.log(this.folio);
    // return folio;
  }



  onAdd(){
    // console.log(this.FacturaBlanco);
    this.service.addFactura(this.FacturaBlanco).subscribe(res => {
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      let Id = this.IdFactura;
      // console.log(Id);
      this.router.navigate(['/facturacionCxcAdd', Id]);
    }
    );
  }
 
ObtenerUltimaFactura(){
  this.service.getUltimaFactura().subscribe(data => {
    // console.log(data);
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
    // console.log(Id);
    this.router.navigate(['/facturacionCxcAdd', Id]);
  }

  applyFilter(filtervalue: string){  
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      // console.log(data);
      // return true;
     };
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
