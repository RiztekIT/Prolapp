import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
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
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/services/message.service';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';


@Component({
  selector: 'app-facturacioncxc',
  templateUrl: './facturacioncxc.component.html',
  styleUrls: ['./facturacioncxc.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FacturacioncxcComponent implements OnInit {
  /* variable para los tipos de animacion del cargando */
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  folioparam;
  idparam;
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
  public loading2 = false;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router, public enviarfact: EnviarfacturaService, public _MessageService: MessageService,public servicerecibo: ReciboPagoService) {
  
    this.service.listen2().subscribe((m:any)=>{
      // console.log(m);
      this.refreshFacturaList();
      // this.detallesFactura();
      });

   }

  ngOnInit() {
    this.refreshFacturaList();
    // this.detallesFactura();
    this.Folio();
    //this.ObtenerUltimaFactura();
    // this.listData.connect();
  }


/* Metodo para traer los detalles de una factura */
  getDetalleFactura(id: number){
    this.service.getDetallesFacturaList(id).subscribe(data =>{
      data[0].Producto;

      return data;
      

    })
  }


/* Metodo para traer todos los detalles de las facturas */
  detallesFactura(){
    this.service.getDetallesFactura().subscribe(data =>{
      this.listDetalleData = data;
      // console.log(this.listDetalleData);
      this.applyFilter('');
      
    })
  }

  /* Metodo para hacer el complemento de pago */
  comppago(factura){
    console.log(factura);
    
      this.service.formData = factura;      
      this.service.Cliente = factura.Nombre;
      this.servicerecibo.getFacturaPagoCFDI(factura.IdCliente,factura.Folio).subscribe((data2) => {
        if (data2.length>0){
          this.service.saldoF = data2[0].Saldo
        }else{
          if (factura.Moneda=='MXN'){
            this.service.saldoF = factura.Total
          }else if (factura.Moneda=='USD'){
            this.service.saldoF = factura.TotalDlls
          }
        }
      })
    document.getElementById('comppagobtn').click();
    


  }


/* Metodo para traer todas las facturas */
  refreshFacturaList() {

    this.service.deleteFacturaCreada().subscribe(data=>{
      console.log(data);
      
  

  
    this.service.getFacturasListCLiente().subscribe(data => {

      for (let i = 0; i <= data.length-1; i++){
        this.service.master[i] = data[i]
        this.service.master[i].detalle = [];
        if (data[i].IdCliente != 1){
          
          this.service.getDetallesFacturaList(data[i].Id).subscribe(res => {
            for (let l = 0; l <=res.length-1; l++){
              this.service.master[i].detalle.push(res[l]);
            }
            this.listData = new MatTableDataSource(this.service.master);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina';
          })
        }}
        // console.log(this.listData);
      });
    })
      
  }

   /* Eliminar Factura solo si no esta timbrada */
  onDelete( factura: Factura){
    if (factura.Estatus == 'Timbrada' || factura.Estatus == 'Cancelada'){
      Swal.fire({
        icon: 'error',
        title: 'No se puede Eliminar Factura',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false,
      })
    }else{
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
          
    }

  }

  /*  Generar Factura en Blanco */
  public FacturaBlanco: Factura = 
    {
      Id:0,
      IdCliente:0,
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

  /* Obteener el ultimo folio */

  Folio() {
    this.service.getFolio().subscribe(data => {
      this.FacturaBlanco.Folio = data
      if (!this.FacturaBlanco.Folio){
        this.FacturaBlanco.Folio='1';
      }      
    });
  }


/* Crear Factura y abrir nueva pantalla */
  onAdd(){
    this.service.addFactura(this.FacturaBlanco).subscribe(res => {
      this.service.getUltimaFactura().subscribe(data => {
        this.IdFactura = data[0].Id;
        this.service.formData.Id = this.IdFactura;//linea nueva
        if (!this.IdFactura){
          this.IdFactura='1';
          let Id = this.IdFactura;
      this.router.navigate(['/facturacionCxcAdd', Id]);
        }
        let Id = this.IdFactura;
      this.router.navigate(['/facturacionCxcAdd', Id]);

        });
      
    }
    );
  }
 
  /* Obtener el ultimo id para ponerlo en la nueva factura */
ObtenerUltimaFactura(){
  this.service.getUltimaFactura().subscribe(data => {
    this.IdFactura = data[0].Id;
    if (!this.IdFactura){
      this.IdFactura='1';
    }
    return this.IdFactura;
    });

}

/* Metodo para editar una factura y mostrar pantalla para editar */
  onEdit(factura: Factura){
this.service.formData = factura;
let Id = factura.Id;
    this.router.navigate(['/facturacionCxcAdd', Id]);
  }

  /* Metodo para el filtro de la tabla */
  applyFilter(filtervalue: string){  
    console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      if (data.Nombre){
        return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      } else{
        return data.Folio.toString().toLowerCase().includes(filter);
      }
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }
  
/* Metodo que descarga el pdf mediante la libreria html2pdf */
onExportClick(folio?:string) {
  const content: Element = document.getElementById('element-to-PDF');
  const option = {    
    margin: [.5,0,0,0],
    filename: 'F-'+folio+'.pdf',
    image: {type: 'jpeg', quality: 1},
    html2canvas: {scale: 2, logging: true, scrollY: content.scrollHeight},
    jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    pagebreak:{ avoid: '.pgbreak'}
  };

  html2pdf()
 .from(content)
 .set(option)
 .save();
}

/* Metodo para ver el pdf en el modal, primero descarga el xml */
generar(id: string, folio:string) {
  let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
  this.enviarfact.xml(id).subscribe(data => {
    const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    this.fileUrl = window.URL.createObjectURL(blob);
    this.a.href = this.fileUrl;
    this.a.target = '_blank';
    document.body.appendChild(this.a);
    localStorage.removeItem('xml'+folio)
    localStorage.setItem('xml'+folio,data)
    this.xmlparam = folio;
    return this.fileUrl;
  });
  setTimeout(()=>{
   },1000)
  document.getElementById('abrirpdf').click();  
  
}

/* Metodo para descargar el xml */
xml(id: string, folio:string){
   let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
   this.enviarfact.xml(id).subscribe(data => {
     const blob = new Blob([data as BlobPart], { type: 'application/xml' });
     this.fileUrl = window.URL.createObjectURL(blob);
     this.a.href = this.fileUrl;
     this.a.target = '_blank';
     this.a.download = 'F-'+folio+'.xml';     
     document.body.appendChild(this.a);
     this.a.click();
     localStorage.removeItem('xml')
     localStorage.setItem('xml',data)
     this.xmlparam = localStorage.getItem('xml');
     return this.fileUrl;
   });
}

/* Metodo para descargar el pdf */
pdf(id: string, folio:string){
   this.xmlparam = '';
   let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
   this.enviarfact.xml(id).subscribe(data => {
     const blob = new Blob([data as BlobPart], { type: 'application/xml' });
     localStorage.removeItem('xml'+folio)
     localStorage.setItem('xml'+folio,data)
     this.xmlparam = folio;
     this.fileUrl = window.URL.createObjectURL(blob);
     this.a.href = this.fileUrl;
     this.a.target = '_blank';
     document.body.appendChild(this.a);
     setTimeout(()=>{
      this.onExportClick(folio);    
     },1000)
     return this.fileUrl;
    });
}


/* Metodo para enviar por correo, abre el modal con los datos */
email(id: string, folio:string){
localStorage.removeItem('xml'+folio);
localStorage.removeItem('pdf'+folio);
  document.getElementById('enviaremail').click();
  this.folioparam = folio;
  this.idparam = id;
  this._MessageService.correo='ivan.talamantes@live.com';
  this._MessageService.cco='ivan.talamantes@riztek.com.mx';
  this._MessageService.asunto='Envio Factura '+folio;
  this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+folio;
  this._MessageService.nombre='ProlactoIngredientes';
    this.enviarfact.xml(id).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      this.xmlparam = folio;
      setTimeout(()=>{
        const content: Element = document.getElementById('element-to-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'F-' + folio + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
          localStorage.setItem('pdf'+folio, pdfAsString);
        })
      },1000)
  })

}

}
