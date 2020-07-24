import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { facturaMasterDetalle } from 'src/app/Models/facturacioncxc/facturamasterdetalle';
import { DetalleFactura } from 'src/app/Models/facturacioncxc/detalleFactura-model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { Router } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { MessageService } from 'src/app/services/message.service';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import * as html2pdf from 'html2pdf.js';
import { FacturaComponent } from 'src/app/components/factura/factura.component';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { EmailComponent } from 'src/app/components/email/email/email.component';

@Component({
  selector: 'app-facturacioncliente',
  templateUrl: './facturacioncliente.component.html',
  styleUrls: ['./facturacioncliente.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class FacturacionclienteComponent implements OnInit {
  idCliente;
  fileUrl;
  xmlparam;
  folioparam;
  idparam;
  listData: MatTableDataSource<any>;
MasterDetalle = new Array<facturaMasterDetalle>();
listDetalleData;
displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estado', 'Options'];
displayedColumnsVersion : string [] = ['ClaveProducto'];
expandedElement: any;
  detalle = new Array<DetalleFactura>();
  public loading2 = false;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  a = document.createElement('a');
  @ViewChild("enviaremail",{static:false}) public btnemail: ElementRef;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router, public enviarfact: EnviarfacturaService, public _MessageService: MessageService,public servicerecibo: ReciboPagoService, private clienteService: ClientesService) {
  
  }
  ngOnInit() {
    console.log('localStorage.getItem("ClienteId"): ', localStorage.getItem("ClienteId"));
    this.idCliente=localStorage.getItem("ClienteId")
    this.refreshFacturaList()
  }

  refreshFacturaList(){
    console.log(this.idCliente);
    this.service.getFacturasListCLienteid(this.idCliente).subscribe(data => {
console.log(data);

      for (let i = 0; i <= data.length-1; i++){
        this.service.master[i] = data[i]
        this.service.master[i].detalle = [];
        if (data[i].IdCliente != 1){
          
          this.service.getDetallesFacturaList(data[i].Id).subscribe(res => {
            this.service.master[i].detalle.pop();
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
  }
  
  /* Metodo para traer todos los detalles de las facturas */
  detallesFactura(){
    this.service.getDetallesFactura().subscribe(data =>{
      this.listDetalleData = data;
      // console.log(this.listDetalleData);
      this.applyFilter('');
      
    })
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

  onExportClick(folio?:string) {
    const content: Element = document.getElementById('Factura-PDF');
    const option = {    
      margin: [.5,.5,.5,0],
      filename: 'F-'+folio+'.pdf',
      image: {type: 'jpeg', quality: 1},
      html2canvas: {scale: 2, logging: true, scrollY: -2, scrollX: -15},
      jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
      pagebreak:{ avoid: '.pgbreak'}
    };
  
    html2pdf()
   .from(content)
   .set(option).toPdf().get('pdf').then(function (pdf) {
    setTimeout(() => {}, 1000);
   })
   .save();
   
  }
  generar(id: string, folio:string,row) {
    console.log(row);
    localStorage.setItem('rowfact',JSON.stringify(row));
    // this.xmlparam = folio;
    
    // let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    // this.enviarfact.xml(id).subscribe(data => {
    //   const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    //   this.fileUrl = window.URL.createObjectURL(blob);
    //   this.a.href = this.fileUrl;
    //   this.a.target = '_blank';
    //   document.body.appendChild(this.a);
    //   localStorage.removeItem('xml'+folio)
    //   localStorage.setItem('xml'+folio,data)
    //   return this.fileUrl;
    // });
    // setTimeout(()=>{
    //  },1000)
    // document.getElementById('abrirpdf').click(); 
    const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = "80%";
        
       
        this.dialog.open(FacturaComponent, dialogConfig); 
    
  }

  pdf(id: string, folio:string,row){
    console.log(id);
    console.log(folio);
    //  this.xmlparam = '';
    //  let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    //  this.enviarfact.xml(id).subscribe(data => {
    //    const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    //    localStorage.removeItem('xml'+folio)
    //    localStorage.setItem('xml'+folio,data)
    //    this.xmlparam = folio;
    //    this.fileUrl = window.URL.createObjectURL(blob);
    //    this.a.href = this.fileUrl;
    //    this.a.target = '_blank';
    //    document.body.appendChild(this.a);
    //    setTimeout(()=>{
    //     this.onExportClick(folio);    
    //    },1000)
    //    return this.fileUrl;
    //   });
    localStorage.setItem('rowfact',JSON.stringify(row));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80%";
    
   
    this.dialog.open(FacturaComponent, dialogConfig); 
    
    setTimeout(()=>{
          this.onExportClick(folio);    
          this.dialog.closeAll();
          
         },1000)
  
         
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

onEdit(factura: Factura){
  this.service.formData = factura;
  let Id = factura.Id;
  localStorage.setItem('rowfact',JSON.stringify(factura));
  localStorage.setItem('FacturaID',this.service.formData.Id.toString())
      this.router.navigate(['/facturacionCxcAdd', Id]);
    }

    email(id: string, folio:string,row){
      localStorage.removeItem('xml'+folio);
      localStorage.removeItem('pdf'+folio);
      localStorage.setItem('rowfact',JSON.stringify(row));
      // document.getElementById('enviaremail').click();
      
        this.folioparam = folio;
        this.idparam = id;
        this._MessageService.correo='ivan.talamantes@live.com';
        this._MessageService.cco='ivan.talamantes@riztek.com.mx';
        this._MessageService.asunto='Envio Factura '+folio;
        this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+folio;
        this._MessageService.nombre='ProlactoIngredientes';
          this.enviarfact.xml(id).subscribe(data => {
            localStorage.setItem('xml' + folio, data)
          })
      
          const dialogConfig2 = new MatDialogConfig();
          dialogConfig2.autoFocus = false;
          dialogConfig2.width = "0%";    
          let dialogFact = this.dialog.open(FacturaComponent, dialogConfig2); 
          
      
          setTimeout(()=>{
      
            // this.xmlparam = folio;
              const content: Element = document.getElementById('Factura-PDF');
              const option = {
                margin: [0, 0, 0, 0],
                filename: 'F-' + folio + '.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, logging: true, scrollY: 0 },
                jsPDF: { format: 'letter', orientation: 'portrait' },
              };
              html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
                localStorage.setItem('pdf'+folio, pdfAsString);
                this.statusparam=true;          
                console.log(this.statusparam);                
              })
              dialogFact.close()
              
            },1000)
            
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            // dialogConfig.width = "90%";
            dialogConfig.height = "90%";
            dialogConfig.data = {
              foliop: folio,
              idp: id,
              status: true
            }
            this.dialog.open(EmailComponent, dialogConfig);
            
      
      
       
      
      }

}
