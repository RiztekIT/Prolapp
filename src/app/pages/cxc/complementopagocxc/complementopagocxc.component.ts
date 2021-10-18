import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MatTableDataSource, MatSort, MatPaginator, MatTable, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReciboPagoService } from '../../../services/complementoPago/recibo-pago.service';
import { ReciboPago } from '../../../Models/ComplementoPago/recibopago';
import { PagoCFDI } from '../../../Models/ComplementoPago/pagocfdi';
import { ReciboPagoMasterPagoCFDI } from '../../../Models/ComplementoPago/recibopagoMasterpagoCFDI';
import { ComplementoPagoComponent } from 'src/app/components/complemento-pago/complemento-pago.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { MessageService } from 'src/app/services/message.service';
import { EmailComponent } from 'src/app/components/email/email/email.component';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';


import { ConnectionHubServiceService } from './../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxc", "titulo": 'Complemento'}
]


@Component({
  selector: 'app-complementopagocxc',
  templateUrl: './complementopagocxc.component.html',
  styleUrls: ['./complementopagocxc.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility:'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComplementopagocxcComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  
  constructor(private service: ReciboPagoService, private router: Router, 
    private dialog: MatDialog, 
    public enviarfact: EnviarfacturaService, 
    public _MessageService: MessageService, 
    public serviceEmpresa: EmpresaService, 
    public servicefactura: FacturaService,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService,) {
    
    this.service.listen().subscribe((m: any) => {
      // this.refreshReciboPagoList();
      // this.detallesFactura();
    });
 /*    this.ConnectionHubService.listenComplemento().subscribe((m:any)=>{
      this.refreshReciboPagoList();
      }); */
    
  }
  
  ngOnInit() {
   /*  this.ConnectionHubService.ConnectionHub(origen[0]); */
    this.listaempresas()
    this.refreshReciboPagoList();
    // this.detallesFactura();
    // this.Folio();
    // this.ObtenerUltimaFactura();
    // this.listData.connect();

  //^ **** PRIVILEGIOS POR USUARIO *****
  this.obtenerPrivilegios();
  //^ **** PRIVILEGIOS POR USUARIO *****
  }


  
  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Cuentas por Cobrar';
  area = 'Complemento de Pago';

  //^ VARIABLES DE PERMISOS
  Agregar: boolean = false;
  Editar: boolean = false;
  Borrar: boolean = false;
  //^ VARIABLES DE PERMISOS


  obtenerPrivilegios() {
    let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
    console.log(arrayPermisosMenu);
    let arrayPrivilegios: any;
    try {
      arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
      // console.log(arrayPrivilegios);
      arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
      // console.log(arrayPrivilegios);
      this.privilegios = [];
      arrayPrivilegios.privilegios.forEach(element => {
        this.privilegios.push(element.nombreProceso);
        this.verificarPrivilegio(element.nombreProceso);
      });
      // console.log(this.privilegios);
    } catch {
      console.log('Ocurrio algun problema');
    }
  }

  verificarPrivilegio(privilegio) {
    switch (privilegio) {
      case ('Agregar Nuevo Pago'):
        this.Agregar = true;
        break;
      case ('Editar Pago'):
        this.Editar = true;
        break;
      case ('Borrar Pago'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  folioparam;
  idparam;
  loadtable = true;
  IdReciboPago: any;
  listData: MatTableDataSource<any>;
  MasterDetalle = new Array<ReciboPagoMasterPagoCFDI>();
  listDetalleData;
  displayedColumns: string[] = ['Folio', 'Nombre', 'FechaPago', 'Cantidad', 'Estado', 'Options'];
  displayedColumnsVersion: string[] = ['Cantidad'];
  folio: string;
  fileUrl;
  xmlparam;
  expandedElement: any;
  listEmpresa;
  detalle = new Array<PagoCFDI>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  a = document.createElement('a');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listaempresas(){
    this.serviceEmpresa.getEmpresaList().subscribe(data =>{
      console.log(data);
      this.listEmpresa = data;
      
      console.log(this.enviarfact.empresa);
     /*  this.enviarfact.empresa = data[0];
      this.service.rfcempresa = this.enviarfact.empresa.RFC; */
      // this.enviarfact.rfc = data[0].RFC;
    })
  }


  //Obtener lista de Recibo de pagos y pagos de CFDI 
  refreshReciboPagoList() {
    this.loadtable = true;
    this.listData = new MatTableDataSource();
    this.service.master = []
    //this.service.deleteReciboCreado().subscribe(data=>{

    this.service.getReciboPagoClienteList().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i]
        this.service.master[i].pagoCFDI = [];
        this.service.getPagoCFDIFacturaList(data[i].Id).subscribe(res => {
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].pagoCFDI.push(res[l]);
          }
          this.listData = new MatTableDataSource(this.service.master);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Recibos de Pago por Pagina';
        });
      }
     
      this.loadtable = false;
      // console.log(this.service.master);
    });
  //})


  }

  //Obtener un solo PagoCFDI por ID
  getPagoCFDI(id) {

  }

  //Obtener lista de PagosCFDI
  getPagosCFDIList() {

  }

  cambioEmpresa(event){
    

    this.enviarfact.empresa = event;
    this.enviarfact.rfc = event.RFC;
    this.servicefactura.rfcempresa=event.RFC;
      this.service.rfcempresa = event.RFC;
      this.servicefactura.rfcempresa = event.RFC;
      localStorage.setItem('Empresa',JSON.stringify(this.enviarfact.empresa))

      console.clear();
      console.log(this.enviarfact.empresa);
      console.log(this.service.rfcempresa);

      //this.refreshFacturaList();
      // this.detallesFactura();
      //this.Folio();
      this.refreshReciboPagoList();
  }

  //Generar Recibo Pago en Blanco
  public ReciboPagoBlanco: ReciboPago =
    {
      Id: 0,
      IdCliente: 0,
      FechaExpedicion: new Date(),
      FechaPago: new Date(),
      FormaPago: "",
      Moneda: "",
      TipoCambio: "",
      Cantidad: "0",
      Referencia: "",
      UUID: "",
      Tipo: "Pago",
      Certificado: "",
      NoCertificado: "",
      Cuenta: "",
      CadenaOriginal: "",
      SelloDigitalSAT: "",
      SelloDigitalCFDI: "",
      NoSelloSAT: "",
      RFCPAC: "",
      Estatus: "Creada",
      folio:""
    }

  //Agregar
  onAdd() {

    this.service.addReciboPago(this.ReciboPagoBlanco).subscribe(res => {
      
  /*     this.ConnectionHubService.on(origen[0]); */
      this.service.getUltimoReciboPago().subscribe(data => {
        this.service.IdReciboPago = data[0].Id;
        this.IdReciboPago = this.service.IdReciboPago
        console.log(this.service.IdReciboPago);
        console.log(this.ReciboPagoBlanco);
        console.log(this.IdReciboPago);
        
        this.eventosService.movimientos('Generar Pago')
        localStorage.setItem('IdRecibo', this.IdReciboPago.toString());
        this.router.navigate(['/recibopago']);
      });
    });

  }
  ObtenerUltimaFactura() {
    // this.service.getUltimaFactura().subscribe(data => {
    //   // console.log(data);
    //   this.IdFactura = data[0].Id;
    //   if (!this.IdFactura){
    //     this.IdFactura='1';
    //   }
    //   // console.log(this.IdFactura);
    //   return this.IdFactura;
    //   // console.log(this.IdFactura);
    //   });

    this.service.getUltimoReciboPago().subscribe(data => {
      this.service.IdReciboPago = data[0].Id;
      this.IdReciboPago = this.service.IdReciboPago
      console.log(this.service.IdReciboPago);
    });

  }

  //Editar
  onEdit(reciboPago) {
    localStorage.removeItem('rowpago')    
    this.service.row = reciboPago;
    localStorage.setItem('rowpago',JSON.stringify(reciboPago));
    let Id = reciboPago.Id;
    localStorage.setItem('IdRecibo', Id.toString());
    
    this.eventosService.movimientos('Editar Pago')
    this.router.navigate(['/recibopago']);
    // console.log(Id);

    // this.router.navigate(['/facturacionCxcAdd', Id]);

  }

  //Eliminar
  onDelete(reciboPago: ReciboPago) {

    Swal.fire({
      title: '¿Seguro de Borrar Pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        // console.log(reciboPago);
        this.service.deleteReciboPago(reciboPago.Id).subscribe(data => {
          this.refreshReciboPagoList();
          
      /*     this.ConnectionHubService.on(origen[0]); */
          console.log(data);
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        });



      }
    })



  }

  openrep(row){

    console.log(row);
    this.service.formt = row;
    localStorage.setItem('rowpago',JSON.stringify(row));
    console.log(this.service.formt);
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="80%";
    this.dialog.open(ComplementoPagoComponent, dialogConfig);

  }

  applyFilter(filtervalue: string) {
    // console.log(this.listData);
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter);
      // return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
     };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    // console.log(this.listData);
  }

  pdf(row){
    console.log(row);
    this.service.formt = row;
    localStorage.setItem('rowpago',JSON.stringify(row));
    console.log(this.service.formt);
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="80%";
    this.dialog.open(ComplementoPagoComponent, dialogConfig);

    setTimeout(()=>{
      this.onExportClick(row.Id);    
      this.dialog.closeAll();
      
     },1000)
    
  }

  onExportClick(folio?:string) {
    const content: Element = document.getElementById('ComprobanteDePago-PDF');
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

  xml(row){
    this.enviarfact.xml(row.UUID).subscribe(data => {
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-'+row.Id+'.xml';     
      document.body.appendChild(this.a);
      this.a.click();
      localStorage.removeItem('xml')
      localStorage.setItem('xml',data)
      this.xmlparam = localStorage.getItem('xml');
      return this.fileUrl;
    });


  }

  email(row){
    localStorage.removeItem('xml'+row.Id);
localStorage.removeItem('pdf'+row.Id);
localStorage.setItem('rowpago',JSON.stringify(row));
// document.getElementById('enviaremail').click();

  this.folioparam = row.Id;
  this.idparam = row.UUID;
  this._MessageService.correo='';
  this._MessageService.cco='';
  this._MessageService.asunto='Envio Complemento de Pago '+row.Id;
  this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+row.Id;
  this._MessageService.nombre='Abarrotodo';
    this.enviarfact.xml(row.UUID).subscribe(data => {
      localStorage.setItem('xml' + row.Id, data)
    })

    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.autoFocus = false;
    dialogConfig2.width = "0%";    
    let dialogFact = this.dialog.open(ComplementoPagoComponent, dialogConfig2); 
    

    setTimeout(()=>{

      // this.xmlparam = folio;
        const content: Element = document.getElementById('ComprobanteDePago-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'F-' + row.Id + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: 0 },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
          localStorage.setItem('pdf'+row.Id, pdfAsString);
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
        foliop: row.Id,
        idp: row.UUID,
        status: true
      }
      this.dialog.open(EmailComponent, dialogConfig);
      


 


  }


}
