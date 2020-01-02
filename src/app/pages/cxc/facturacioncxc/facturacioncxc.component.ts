import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Factura } from '../../../Models/facturacioncxc/factura-model';
import { FacturaService } from '../../../services/facturacioncxc/factura.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FacturacioncxcAddComponent } from './facturacioncxc-add/facturacioncxc-add.component';
import { FacturacioncxcEditComponent } from './facturacioncxc-edit/facturacioncxc-edit.component';
import { Router } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';

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
  fileUrl;
  xmlparam;
  
  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router, public enviarfact: EnviarfacturaService) {
  
    this.service.listen().subscribe((m:any)=>{
      // console.log(m);
      this.refreshFacturaList();
      });

   }

  ngOnInit() {
    this.refreshFacturaList();
    this.Folio();
    this.ObtenerUltimaFactura();
    localStorage.removeItem('pdf');
    localStorage.removeItem('xml');


    
  }

  refreshFacturaList() {
  

    this.service.getFacturasListCLiente().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      console.log(this.listData);
      this.listData.sort = this.sort;

    
      this.listData.paginator = this.paginator;
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
      console.log(data);
      // this.folio = data;
      this.FacturaBlanco.Folio = data
      if (!this.FacturaBlanco.Folio){
        this.FacturaBlanco.Folio='1';
      }
      // console.log(this.FacturaBlanco.Folio);
      // console.log(data);
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
    console.log(data);
    this.IdFactura = data[0].Id;
    if (!this.IdFactura){
      this.IdFactura='1';
    }
    console.log(this.IdFactura);
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
  
//   onExportClick() {
//     const option = {
//       margin: [0,0,0,0],
//       filename: 'FacturaPDF.pdf',
//       image: {type: 'jpeg', quality: 1},
//       html2canvas: {scale: 2, logging: true},
//       jsPDF: {orientation: 'portrait'}


//     };
//     const content: Element = document.getElementById('element-to-PDF');

//     html2pdf()
//    .from(content)
//    .set(option)
//    .save();
// }

onExportClick(folio?:string) {
  // this.proceso='xml';
  const content: Element = document.getElementById('element-to-PDF');

  const option = {
    
    margin: [0,0,0,0],
    filename: 'F-'+folio+'.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true, scrollY: content.scrollHeight},
    jsPDF: {format: 'letter', orientation: 'portrait'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
//  this.proceso='';
}

generar(id: string, folio:string) {
  
  // this.proceso='xml';
  let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
  this.enviarfact.xml(id).subscribe(data => {
    const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.fileUrl = window.URL.createObjectURL(blob);
    
    
    this.a.href = this.fileUrl;
    this.a.target = '_blank';
    // this.a.download = 'F-'+folio+'.xml';
    
    document.body.appendChild(this.a);
//      console.log(this.fileUrl);
    //console.log(this.a);
    //console.log('blob:'+this.a.href);
    
    //this.a.click();
    localStorage.removeItem('xml')
    localStorage.setItem('xml',data)
    this.xmlparam = localStorage.getItem('xml');
    //this.onExportClick(folio);    
    //console.log(this.xmlparam);
    
    
    return this.fileUrl;
    
    // console.log(this.fileUrl);
    
    
  });
  document.getElementById('abrirpdf').click();
}

xml(id: string, folio:string){
   // this.proceso='xml';
   let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
   this.enviarfact.xml(id).subscribe(data => {
     const blob = new Blob([data as BlobPart], { type: 'application/xml' });
     // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
     this.fileUrl = window.URL.createObjectURL(blob);
     
     
     this.a.href = this.fileUrl;
     this.a.target = '_blank';
     this.a.download = 'F-'+folio+'.xml';
     
     document.body.appendChild(this.a);
 //      console.log(this.fileUrl);
     //console.log(this.a);
     //console.log('blob:'+this.a.href);
     
     this.a.click();
     localStorage.removeItem('xml')
     localStorage.setItem('xml',data)
     this.xmlparam = localStorage.getItem('xml');
     //this.onExportClick(folio);    
     //console.log(this.xmlparam);
     
     
     return this.fileUrl;
     
     // console.log(this.fileUrl);
     
     
   });
}

pdf(id: string, folio:string){
   // this.proceso='xml';
   let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
   this.enviarfact.xml(id).subscribe(data => {
     const blob = new Blob([data as BlobPart], { type: 'application/xml' });
     // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
     this.fileUrl = window.URL.createObjectURL(blob);
     
     
     this.a.href = this.fileUrl;
     this.a.target = '_blank';
    //  this.a.download = 'F-'+folio+'.xml';
     
     document.body.appendChild(this.a);
 //      console.log(this.fileUrl);
     //console.log(this.a);
     //console.log('blob:'+this.a.href);
     
    //  this.a.click();
     localStorage.removeItem('xml')
     localStorage.setItem('xml',data)
     this.xmlparam = localStorage.getItem('xml');
     this.onExportClick(folio);    
     //console.log(this.xmlparam);
     
     
     return this.fileUrl;
     
     // console.log(this.fileUrl);
     
     
   });
}


}
