import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource, NativeDateAdapter } from '@angular/material';
import { Router } from '@angular/router';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { RedhgfacturacionService } from '../../../services/redholding/redhgfacturacion.service';
import { ConnectionHubServiceService } from './../../../services/shared/ConnectionHub/connection-hub-service.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RedhgfacturaComponent } from '../../../components/redhgfactura/redhgfactura.component';
import { DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

/* Constante y variables para la transformacion de los meses en los datetimepicker */
// const months =['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day}/${months[month]}/${year}`
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS =
{
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    // monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    // monthYearA11yLabel: 'MMM YYYY',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
/* ----------------------------------------- */


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxc", "titulo": 'Facturacion'}
]
let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "CxC", 
  "titulo": 'Factura',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-redhgfacturacion',
  templateUrl: './redhgfacturacion.component.html',
  styleUrls: ['./redhgfacturacion.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class redhgFacturacionComponent implements OnInit {

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

  constructor(
    public redhgSVC: RedhgfacturacionService,
    private router:Router,
    private eventosService:EventosService,
    private dialog: MatDialog, 
    public _MessageService: MessageService,
    public datepipe: DatePipe
    ) { }

  IdFactura: any;
  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estado', 'Options'];
  expandedElement: any;
  fileUrl;
  xmlparam;
  a = document.createElement('a');
  folioparam;
  idparam;
  loadtable = true;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;


  ngOnInit() {
    //this.getFacturas();
    //this.listaempresas()
    //console.log(this.enviarfact.empresa);
    this.refreshFacturaList();
    // this.detallesFactura();
    this.Folio();
    //this.ObtenerUltimaFactura();
    // this.listData.connect();

     //^ **** PRIVILEGIOS POR USUARIO *****
    // this.obtenerPrivilegios();
  }

  Folio() {
    let consulta='select MAX ( redhgFactura2.Folio) + 1 as Folio from redhgFactura2'
    /* get folio */
    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
      this.FacturaBlanco.Folio = data[0].Folio
      if (!this.FacturaBlanco.Folio){
        this.FacturaBlanco.Folio='1';
      }      
    });
  }


  getFacturas(){
    let consulta='select * from redhgFactura2'
    this.redhgSVC.consultaRedhg(consulta).toPromise().then(resp=>{
      console.log(resp);
    })
  }

  onAdd(){
   /*  let fecha = new Date(this.FacturaBlanco.FechaDeEntrega)
    fecha.setHours(fecha.getHours()-6)
    this.FacturaBlanco.FechaDeEntrega = new Date(fecha)
    let fecha2 = new Date(this.FacturaBlanco.FechaDeExpedicion)
    fecha2.setHours(fecha2.getHours()-6)
    this.FacturaBlanco.FechaDeExpedicion = new Date(fecha2)
    let fecha3 = new Date(this.FacturaBlanco.FechaVencimiento)
    fecha3.setHours(fecha3.getHours()-6)
    this.FacturaBlanco.FechaVencimiento = new Date(fecha3) */


    

    console.log(this.FacturaBlanco);

    let factura = this.FacturaBlanco;

    
    
    

    let FechaDeExpedicion = this.datepipe.transform(this.FacturaBlanco.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
    let FechaVencimiento = this.datepipe.transform(this.FacturaBlanco.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
    let FechaDeEntrega = this.datepipe.transform(this.FacturaBlanco.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

    let consulta=

    'Insert into redhgFactura2  ('+

      'IdCliente,'+
      'Serie, '+
      'Folio, '+
      'Tipo, '+
      'FechaDeExpedicion, '+
      'LugarDeExpedicion, '+
      'Certificado, '+
      'NumeroDeCertificado, '+
      'UUID, '+
      'UsoDelCFDI,'+
      'Subtotal,'+
      'SubtotalDlls, '+
      'Descuento, '+
      'ImpuestosRetenidos,'+
      'ImpuestosTrasladados, '+
      'ImpuestosTrasladadosDlls, '+
      'Total,'+
      'TotalDlls, '+
      'FormaDePago, '+
      'MetodoDePago, '+
      'Cuenta, '+
      'Moneda, '+
      'CadenaOriginal, '+
      'SelloDigitalSAT, '+
      'SelloDigitalCFDI,'+
      'NumeroDeSelloSAT, '+
      'RFCDelPAC,'+
      'Observaciones, '+
      'FechaVencimiento, '+
      'OrdenDeCompra, '+
      'TipoDeCambio, '+
      'FechaDeEntrega,'+
      'CondicionesDePago, '+
      'Vendedor, '+
      'Estatus, '+
      'Ver,'+
      'Usuario)'+ 'output inserted.* '+
      
                 'Values ('+
                   "'"+factura.IdCliente+"'"+','+
                   "'"+factura.Serie+"'"+','+
                   "'"+factura.Folio +"'"+','+
                   "'"+factura.Tipo +"'"+','+
                   "'"+FechaDeExpedicion +"'"+','+
                   "'"+factura.LugarDeExpedicion+"'"+','+
                   "'"+factura.Certificado +"'"+','+
                   "'"+factura.NumeroDeCertificado +"'"+','+
                   "'"+factura.UUID +"'"+','+
                   "'"+factura.UsoDelCFDI +"'"+','+
                   "'"+factura.Subtotal+"'"+','+
                   "'"+factura.SubtotalDlls +"'"+','+
                   "'"+factura.Descuento +"'"+','+
                     "'"+factura.ImpuestosRetenidos +"'"+','+
                     "'"+factura.ImpuestosTrasladados+"'"+','+
                     "'"+factura.ImpuestosTrasladadosDlls +"'"+','+
                     "'"+factura.Total+"'"+','+
                     "'"+factura.TotalDlls +"'"+','+
                     "'"+factura.FormaDePago +"'"+','+
                     "'"+factura.MetodoDePago +"'"+','+
                     "'"+factura.Cuenta +"'"+','+
                     "'"+factura.Moneda +"'"+','+
                     "'"+factura.CadenaOriginal +"'"+','+
                     "'"+factura.SelloDigitalSAT +"'"+','+
                     "'"+factura.SelloDigitalCFDI +"'"+','+
                     "'"+factura.NumeroDeSelloSAT +"'"+','+
                     "'"+factura.RFCdelPAC +"'"+','+
                     "'"+factura.Observaciones +"'"+','+
                     "'"+FechaVencimiento +"'"+','+
                     "'"+factura.OrdenDeCompra +"'"+','+
                     "'"+factura.TipoDeCambio +"'"+','+
                     "'"+FechaDeEntrega +"'"+','+
                     "'"+factura.CondicionesDePago +"'"+','+
                     "'"+factura.Vendedor +"'"+','+
                     "'"+factura.Estatus +"'"+','+
                     "''"+','+
                     "'"+factura.Usuario+"'"+')'

/* AGREGAR */
console.log(consulta);
    this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
      console.log(res,'RESPUESTA INSERTED');
      
      origenNotificacion[0].Folio = +this.FacturaBlanco.Folio





      
        this.IdFactura = res[0].Id;         
        if (!this.IdFactura){
          this.IdFactura='1';
          let Id = this.IdFactura;
          this.redhgSVC.formData.Id=Id;
          localStorage.setItem('FacturaID',this.redhgSVC.formData.Id.toString())
          /* CHECAR ESTA LINEA */
          this.router.navigate(['/redhgaddfacturacion', Id]);
        }
        let Id = this.IdFactura;
        this.redhgSVC.formData.Id=Id;
        localStorage.setItem('FacturaID',this.redhgSVC.formData.Id.toString())
        
        this.eventosService.movimientos('Factura Generada')
        /* CHECAR ESTA LINEA */
      this.router.navigate(['/redhgaddfacturacion', Id]);

        
      
    }
    );
  }

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

  onEdit(factura: Factura){
    this.redhgSVC.formData = factura;
    let Id = factura.Id;
    localStorage.setItem('rowfact',JSON.stringify(factura));
    localStorage.setItem('FacturaID',this.redhgSVC.formData.Id.toString())
    
    this.eventosService.movimientos('Editar Factura')
    /* CHECAR ESTA LINEA */
        this.router.navigate(['/redhgaddfacturacion', Id]);
      }

      generar(id: string, folio:string,row) {
        console.log(row);
        localStorage.setItem('rowfact',JSON.stringify(row));
      
        const dialogConfig = new MatDialogConfig();
            
            dialogConfig.autoFocus = false;
            dialogConfig.width = "80%";
            
           /* CHECAR ESTA LINEA */
            this.dialog.open(RedhgfacturaComponent, dialogConfig); 
        
      }

      pdf(id: string, folio:string,row){
      
        localStorage.setItem('rowfact',JSON.stringify(row));
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = false;
        dialogConfig.width = "80%";
        
       /* CHECAR ESTA LINEA */
        this.dialog.open(RedhgfacturaComponent, dialogConfig); 
        
        setTimeout(()=>{
              this.onExportClick(folio);    
              this.dialog.closeAll();
              
             },1000)
      
             
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

      xml(id: string, folio:string){
        let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
        this.redhgSVC.xml(id).subscribe(data => {
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


     email(id: string, folio:string,row){
      localStorage.removeItem('xml'+folio);
      localStorage.removeItem('pdf'+folio);
      localStorage.setItem('rowfact',JSON.stringify(row));
      // document.getElementById('enviaremail').click();
      
        this.folioparam = folio;
        this.idparam = id;
        this._MessageService.correo='';
        this._MessageService.cco='';
        this._MessageService.asunto='Envio Factura '+folio;
        this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+folio;
        this._MessageService.nombre='Abarrotodo';
          this.redhgSVC.xml(id).subscribe(data => {
            localStorage.setItem('xml' + folio, data)
          })
      
          const dialogConfig2 = new MatDialogConfig();
          dialogConfig2.autoFocus = false;
          dialogConfig2.width = "0%";    
          /* CHECAR ESTA LINEA */
          //let dialogFact = this.dialog.open(FacturaComponent, dialogConfig2); 
          
      
          setTimeout(()=>{
      
            
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
              /* CHECAR ESTA LINEA */
              //dialogFact.close()
              
            },1000)
            
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            
            dialogConfig.height = "90%";
            dialogConfig.data = {
              foliop: folio,
              idp: id,
              status: true
            }
            /* CHECAR ESTA LINEA */
            //this.dialog.open(EmailComponent, dialogConfig);
            
      
      
       
      
      }

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
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
              let consulta='delete from redhgFactura2 where Id = '+factura.Id
              /* DELETE */
              this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
                this.refreshFacturaList();
          
             /*    this.ConnectionHubService.on(origen[0]); */
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

      refreshFacturaList() {
        this.loadtable = true;
        this.listData = new MatTableDataSource();
        this.redhgSVC.master = [];
        
            /* this.service.deleteFacturaCreada().subscribe(data=>{
              console.log(data); */
              
          
        let consulta='Select redhgFactura2.* ,redhgCliente.* from redhgFactura2 LEFT JOIN redhgCliente ON redhgFactura2.IdCliente = redhgCliente.IdClientes order by FechaDeExpedicion DESC'
        /* get facturas list cliente */
          
            this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
        console.log(data)
              for (let i = 0; i <= data.length-1; i++){
                this.redhgSVC.master[i] = data[i]
                this.redhgSVC.master[i].detalle = [];
                this.redhgSVC.master[i].detalle2 = [];
                /* if (data[i].IdCliente != 0){ */

                  let consulta2 = 'select * from redhgDetalleFactura2 where IdFactura ='+data[i].Id
                  /* get detalles facturas list */
                  
                  this.redhgSVC.consultaRedhg(consulta2).subscribe((res:any) => {
                    this.redhgSVC.master[i].detalle.pop();
                    for (let l = 0; l <=res.length-1; l++){
                      this.redhgSVC.master[i].detalle.push(res[l]);
                    }

                    let consulta2 = 'select * from redhgDetalleFactura where IdFactura ='+data[i].Id
                    /* get detalles facturas list */
                    
                    this.redhgSVC.consultaRedhg(consulta2).subscribe((res:any) => {
                      this.redhgSVC.master[i].detalle2.pop();
                      for (let l = 0; l <=res.length-1; l++){
                        this.redhgSVC.master[i].detalle2.push(res[l]);
                      }
  
                      
                      
                      this.listData = new MatTableDataSource(this.redhgSVC.master);
                      this.listData.sort = this.sort;    
                      this.listData.paginator = this.paginator;
                      this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina';
                    })

                    
                 /*    
                    this.listData = new MatTableDataSource(this.redhgSVC.master);
                    this.listData.sort = this.sort;    
                    this.listData.paginator = this.paginator;
                    this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina'; */
                  })
                //}
              }
                this.loadtable = false;
                // console.log(this.listData);
              });
            /* }) */
              
          }

}
