import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import {MatTableDataSource, MatPaginator, MatTable} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Factura } from '../../../Models/facturacioncxc/factura-model';
import { FacturaService } from '../../../services/facturacioncxc/factura.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FacturacioncxcAddComponent } from './facturacioncxc-add/facturacioncxc-add.component';
import { FacturacioncxcEditComponent } from './facturacioncxc-edit/facturacioncxc-edit.component';
import { Router } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { DetalleFactura } from '../../../Models/facturacioncxc/detalleFactura-model';
import { Observable } from 'rxjs';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-facturacioncxc',
  templateUrl: './facturacioncxc.component.html',
  styleUrls: ['./facturacioncxc.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FacturacioncxcComponent implements OnInit {
  IdFactura: any;
  listData: MatTableDataSource<any>;
  MasterDetalle = new Array<facturaMasterDetalle>();
  listDetalleData;
  displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estado', 'Options'];
  displayedColumnsVersion : string [] = ['ClaveProducto'];
  folio: string;
  fileUrl;
  xmlparam;
  expandedElement: any;
  detalle = new Array<DetalleFactura>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  
  //Collapse Informacion Detalle Facutura


  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ViewChild('tabla', null) tabla: MatTable<any>;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router, public enviarfact: EnviarfacturaService) {
  
    this.service.listen().subscribe((m:any)=>{
      // console.log(m);
      this.refreshFacturaList();
      this.detallesFactura();
      });

   }

  ngOnInit() {

    this.refreshFacturaList();
    this.detallesFactura();
    this.Folio();
    this.ObtenerUltimaFactura();
    this.listData.connect();
    
    // localStorage.removeItem('pdf');
    // localStorage.removeItem('xml');


    
  }



  

  ref(){
    // this.applyFilter('32534543343454353453');
    // this.applyFilter('');
    
    
    
    console.log('ref');
    // this.listData._updateChangeSubscription();
    // this.listData.filteredData;
  }

 

  getDetalleFactura(id: number){
    this.service.getDetallesFacturaList(id).subscribe(data =>{
      data[0].Producto;

      return data;
      
      
      
    })
  }

  detallesFactura(){
    this.service.getDetallesFactura().subscribe(data =>{
      this.listDetalleData = data;
      // console.log(this.listDetalleData);
      this.applyFilter('');
      
    })
  }



  refreshFacturaList() {
  
    // this.listData = new MatTableDataSource(this.MasterDetalle);
    
    
    
    this.service.getFacturasListCLiente().subscribe(data => {
      // this.MasterDetalle = data;
      // console.log('longitud data '+data.length);
      
      
      for (let i = 0; i <= data.length-1; i++){
        this.service.master[i] = data[i]
        this.service.master[i].detalle = [];
        // console.log(this.MasterDetalle);
        if (data[i].IdCliente != 1){
          
          this.service.getDetallesFacturaList(data[i].Id).subscribe(res => {
            for (let l = 0; l <=res.length-1; l++){
              // this.MasterDetalle[i].detalle.pop();
              // console.log(this.MasterDetalle[0].detalle);
              this.service.master[i].detalle.push(res[l]);
            }
            // this.detalle = res;
            // console.log(this.d);
            this.listData = new MatTableDataSource(this.service.master);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina';
          })
        }}
        
        // let detalle = [];
        // rows = data;
        // data.forEach(factura => rows.push(factura, { detailRow: true, factura}))
        
        
        
      });
      // this.listData.filter = 'R';
      
      // this.listData.data = this.MasterDetalle;

      
      
      // this.expandedElement = this.listData

      // this.tabla.renderRows();
      // this.tabla.dataSource = this.listData;
      console.log(this.listData);
      
      

  }
//Eliminar Factura si no esta timbrada
  onDelete( factura: Factura){
    // console.log(factura.Estatus);
    if (factura.Estatus == 'Timbrada' || factura.Estatus == 'Cancelada'){
      // console.log('No se puede ELIMINAR BRO');
      // this.snackBar.open('No se puede eliminar Factura', '', {
      //   duration: 3000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'error',
        title: 'No se puede Eliminar Factura',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false,
      })
    }else{
      // console.log('Se puede eliminar');

      Swal.fire({
        title: '¿Segur@ de Borrar Factura?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.service.deleteFactura(factura.Id).subscribe(res => {
            this.refreshFacturaList();
      
            Swal.fire({
              title: 'Factura Eliminada',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
          });
            });
        }
      })
          // if ( confirm('Are you sure to delete?')) {
          //   this.service.deleteFactura(factura.Id).subscribe(res => {
          //   this.refreshFacturaList();
          //   this.snackBar.open(res.toString(), '', {
          //     duration: 3000,
          //     verticalPosition: 'top'
          //   });
      
          //   });
          // }
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
      Subtotal: "0",
      SubtotalDlls: "0",
      Descuento: "0",
      ImpuestosRetenidos: "0",
      ImpuestosTrasladados: "0",
      ImpuestosTrasladadosDlls: "0",
      Total: "0",
      TotalDlls: "0",
      FormaDePago: "",
      MetodoDePago: "",
      Cuenta: "",
      Moneda: "MXN",
      CadenaOriginal: "",
      SelloDigitalSAT: "",
      SelloDigitalCFDI: "",
      NumeroDeSelloSAT: "",
      RFCdelPAC: "",
      Observaciones: "",
      FechaVencimiento:  new Date(),
      OrdenDeCompra: "",
      TipoDeCambio: "0",
      FechaDeEntrega:  new Date(),
      CondicionesDePago: "",
      Vendedor: "",
      Estatus: "Creada",
      Version: "",
      Usuario: ""
  }

  Folio() {
    this.service.getFolio().subscribe(data => {
      // console.log(data);
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
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Factura Creada',
      //   showCancelButton: false,
      //   showConfirmButton: false,
      //   timer: 1000
      // })
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
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
    if (!this.IdFactura){
      this.IdFactura='1';
    }
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
      // console.log(data.Nombre);
      if (data.Nombre){
        return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      } else{
        return data.Folio.toString().toLowerCase().includes(filter);
      }
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    // console.log(this.listData);
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
    
    margin: [.5,0,0,0],
    filename: 'F-'+folio+'.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true, scrollY: content.scrollHeight},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    pagebreak:{ avoid: '.pgbreak'}
    // pagebreak:{ mode: ['', 'avoid']}
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
    localStorage.removeItem('xml'+folio)
    localStorage.setItem('xml'+folio,data)
    this.xmlparam = folio;
    //this.onExportClick(folio);    
    //console.log(this.xmlparam);
    
    
 
    return this.fileUrl;
    
    // console.log(this.fileUrl);
    
  });
  setTimeout(()=>{
   },1000)
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
   this.xmlparam = '';
   let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
   this.enviarfact.xml(id).subscribe(data => {
     const blob = new Blob([data as BlobPart], { type: 'application/xml' });
     // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
     localStorage.removeItem('xml'+folio)
     localStorage.setItem('xml'+folio,data)
     this.xmlparam = folio;
     this.fileUrl = window.URL.createObjectURL(blob);
     
     
     this.a.href = this.fileUrl;
     this.a.target = '_blank';
     //  this.a.download = 'F-'+folio+'.xml';
     
     document.body.appendChild(this.a);
     //      console.log(this.fileUrl);
     //console.log(this.a);
     //console.log('blob:'+this.a.href);
     setTimeout(()=>{
      this.onExportClick(folio);    
     },1000)
     
     //  this.a.click();
    
      //console.log(this.xmlparam);
     
     
     return this.fileUrl;
     
     // console.log(this.fileUrl);
     
     
    });
}

ngOnChanges(changes: SimpleChanges): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  this.ref();
}

}
