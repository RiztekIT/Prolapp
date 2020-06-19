import { Component, OnInit, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider, MAT_DATE_LOCALE } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import { Cliente } from '../../../../Models/catalogos/clientes-model';
import { Router, ActivatedRoute } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { FacturacioncxcProductoComponent } from '../facturacioncxc-producto/facturacioncxc-producto.component';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DetalleFactura } from '../../../../Models/facturacioncxc/detalleFactura-model';
import { FacturacioncxcEditProductoComponent } from '../facturacioncxc-edit-producto/facturacioncxc-edit-producto.component';
import { FacturaTimbre } from '../../../../Models/facturacioncxc/facturatimbre-model';
import { Observable } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';
import { MessageService } from '../../../../services/message.service';
import { NativeDateAdapter, MAT_DATE_FORMATS, DateAdapter } from "@angular/material"
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
//Importacion para utilizar Pipe
import { map, startWith, retry } from 'rxjs/operators';
import { Prefactura } from '../../../../Models/facturacioncxc/prefactura-model';
import { FoliosService } from '../../../../services/direccion/folios.service';
import { NotaCredito } from '../../../../Models/nota-credito/notaCredito-model';
import { NotaCreditoService } from '../../../../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';
import { DetalleNotaCreditoComponent } from '../../nota-creditocxc/detalle-nota-credito/detalle-nota-credito.component';
import { TipoCambioService } from 'src/app/services/tipo-cambio.service';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { DetalleNotaCredito } from 'src/app/Models/nota-credito/detalleNotaCredito-model';
import { NotaCreditoMaster } from 'src/app/Models/nota-credito/notaCreditoMaster-model';
import { FacturaComponent } from 'src/app/components/factura/factura.component';
import { AddClienteComponent } from 'src/app/pages/administracion/catalogos/clientes/add-cliente/add-cliente.component';
import { AcusecancelacionComponent } from 'src/app/components/acusecancelacion/acusecancelacion.component';
import xml2js from 'xml2js';
import { processors } from 'xml2js'

/* Headers para el envio de la factura */
const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}




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


@Component({
  selector: 'app-facturacioncxc-add',
  templateUrl: './facturacioncxc-add.component.html',
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand2', [
      state('collapsed', style({ height: '0px', minHeight: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./facturacioncxc-add.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-MX'
    }
  ]

})
export class FacturacioncxcAddComponent implements OnInit {
  /* variable para los tipos de animacion del cargando */
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  folioparam;
  idparam;
  statusparam;
  json1 = new FacturaTimbre();
  json2 = new Prefactura();
  folio: string;
  xmlparam;
  fileUrl;
  filepdf;
  fechaVenc = new Date();
  a = document.createElement('a');
  public loading = false;
  public loading2 = false;

  constructor(
    public service: FacturaService, private snackBar: MatSnackBar, private dialog: MatDialog,
    private router: Router, public enviarfact: EnviarfacturaService,
    private activatedRoute: ActivatedRoute, public _MessageService: MessageService, private http: HttpClient, public servicefolios: FoliosService, private tipoCambio: TipoCambioService, public serviceNota: NotaCreditoService) {
    this.service.Moneda = 'MXN';
    console.log('Constr ' + this.service.Moneda);
    this.service.formData.Id = +localStorage.getItem('FacturaID')



    /* Metodo para obtener los parametros de la pantalla anterior  */
    // this.activatedRoute.params.subscribe(params => {
    //   this.IdFactura = params['id'];
    //   this.service.IdFactura = this.IdFactura;
    //   this.service.formData.Id = this.IdFactura;
    //   this.proceso = '';
    // });

    //Observable para actualizar tabla de Detalles Factura


    this.service.listen().subscribe((m: any) => {
      console.log('listen1');
      console.log(m);



      // this.idFactura();
      this.refreshDetallesFacturaList();
    });

    // this.service.listen().toPromise().then(m=>{
    //   this.refreshDetallesFacturaList();
    // })

    this.serviceNota.listen().subscribe((m: any) => {
      console.log('listen2');
      // this.idFactura();
      this.refreshNotaList();
      this.ObtenerUltimaNotaCreditoFactura();
    });

    this.resetForm();
  }

  ngOnInit() {
    // this.idFactura();
    // console.log(this.IdFactura);
    this.resetForm();
    this.setfacturatimbre();
    this.dropdownRefresh();
    this.refreshDetallesFacturaList();
    this.tipoDeCambio();
    this.ObtenerUltimaNotaCreditoFactura();
    this.IniciarSaldo();
    this.refreshNotaList();
    this.refreshPagoCFDIList();

    console.log(this.service.SaldoFacturaMXN +' || '+ this.service.SaldoFacturaDLLS);
  }




  IdFactura: any;
  listClientes: Cliente[] = [];
  proceso: string;
  Moneda: string;
  estatusfact;
  numfact;
  xml;
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: string;
  Estatus: string;
  /* Nombre del Cliente a Facturar  */
  ClienteNombre: any;
  IdApi: any;
  ClienteVendedor: any;
  ClienteMetodoDePagoCliente: any;

  //Variable Saldo
  // SaldoFacturaMXN: number;
  // SaldoFacturaDLLS: number;
  // TipoCambioFactura: number;

  /* list Metodo Pago */
  public listMP: Array<Object> = [
    { MetodoDePago: 'PUE', text: 'PUE-Pago en una sola exhibicion' },
    { MetodoDePago: 'PPD', text: 'PPD-Pago en parcialidades o diferido' }
  ];

  /* list Metodo Pago */
  public listMoneda: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];


  IniciarSaldo(){
    this.service.SaldoFacturaDLLS = 0;
    this.service.SaldoFacturaMXN = 0;
    // this.TipoCambioFactura = +this.service.formData.TipoDeCambio;
    // console.log(this.TipoCambioFactura);

  }


  // INICIO NOTA DE PAGO----------------------------------------------------------------------->

  EstatusNota: string;
  FolioNotaCredito: number;


  //Metodo Generar Nota Pago
  GenerarNota() {

    this.serviceNota.Timbrada = false;


    //Obtener ultimo Folio Nota Credito y asignarlo a NotaBlanco
    this.serviceNota.getUltimoFolio().subscribe(data => {
      console.log('---------------------------------------');
      console.log(data);
      console.log('---------------------------------------');
      if (data[0].Folio == null) {
        this.FolioNotaCredito = 1;
      } else {
        this.FolioNotaCredito = data[0].Folio;
      }
      console.log(this.FolioNotaCredito);



      console.log(this.service.formData);
      /*  Generar Nota en Blanco */
      let NotaBlanco: NotaCredito =
      {
        IdNotaCredito: 0,
        IdCliente: +this.service.formData.IdCliente,
        IdFactura: +this.service.formData.Id,
        Serie: "",
        Folio: this.FolioNotaCredito,
        Tipo: "Egreso",
        FechaDeExpedicion: new Date(),
        LugarDeExpedicion: "",
        Certificado: "",
        NumeroDeCertificado: "",
        UUID: "",
        UsoDelCFDI: "",
        Subtotal: "0",
        Descuento: "0",
        ImpuestosRetenidos: "0",
        ImpuestosTrasladados: "0",
        Total: "0",
        FormaDePago: "",
        MetodoDePago: "",
        Cuenta: "",
        Moneda: this.service.formData.Moneda,
        CadenaOriginal: "",
        SelloDigitalSAT: "",
        SelloDigitalCFDI: "",
        NumeroDeSelloSAT: "",
        RFCDelPAC: "",
        Observaciones: "",
        FechaVencimiento: new Date(),
        OrdenDeCompra: "",
        TipoDeCambio: "0",
        FechaDeEntrega: new Date(),
        CondicionesDePago: "",
        Vendedor: "",
        Estatus: "Creada",
        Ver: "",
        Usuario: "",
        SubtotalDlls: "0",
        ImpuestosTrasladadosDlls: "0",
        TotalDlls: "0",
        Relacion: "",
      }
      console.log(NotaBlanco);


      console.log(this.listData.data);
      NotaBlanco.TipoDeCambio = this.service.formData.TipoDeCambio;
      this.serviceNota.addNotaCredito(NotaBlanco).subscribe(res => {
        this.serviceNota.formData = NotaBlanco;
        // console.log(res);
console.log(this.service.formData.Id);
        this.serviceNota.IdFactura = this.service.formData.Id;

        
          this.serviceNota.Moneda = this.Moneda;
          this.serviceNota.TipoCambio = this.service.formData.TipoDeCambio;
          this.ObtenerUltimaNotaCreditoCreada();
        })
    });
  }

  ObtenerUltimaNotaCreditoCreada() {
    this.serviceNota.getUltimaNotaCredito().subscribe(data => {
      console.log(data[0]);
      this.serviceNota.idNotaCredito = data[0].Id
      this.serviceNota.ClienteNombre = this.ClienteNombre;
      this.serviceNota.IdApi = this.IdApi;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      this.dialog.open(DetalleNotaCreditoComponent, dialogConfig);
      console.log(this.serviceNota.DetalleFactura);
    });
  }


  //Editar Nota Credito
  onVerNC(row) {
    console.log(row);
    console.log(row.Estatus);
    //Verificar Estatus de Nota Credito
    if (row.Estatus == 'Timbrada' || row.Estatus == 'Cancelada') {
      this.serviceNota.Timbrada = true;
    } else {
      this.serviceNota.Timbrada = false;
    }
    console.log(this.serviceNota.Timbrada);


    this.serviceNota.formData = row;
    // this.serviceNota.DetalleFactura = row.DetalleNotaCredito;
    this.serviceNota.IdFactura = this.service.formData.Id;

    // for (let i = 0; i <= row.DetalleNotaCredito.length - 1; i++) {
    //   console.log(row.DetalleNotaCredito[i]);
    //   this.serviceNota.getSumaCantidades(row.IdFactura, row.DetalleNotaCredito[i].ClaveProducto).subscribe(data2 => {
    //     console.log(data2[0].Cantidad);
    //     if (data2 !== null) {
    //       console.log(+this.serviceNota.DetalleFactura[i].Cantidad);
    //       console.log(+data2[0].Cantidad);
    //       this.serviceNota.DetalleFactura[i].Cantidad = (+this.serviceNota.DetalleFactura[i].Cantidad - +data2[0].Cantidad).toString();
    //     }
    //     console.log(this.serviceNota.DetalleFactura);
    //   })
    // }
    this.serviceNota.Moneda = this.Moneda;
    this.serviceNota.TipoCambio = this.service.formData.TipoDeCambio;

    this.serviceNota.idNotaCredito = row.IdNotaCredito
    this.serviceNota.ClienteNombre = this.ClienteNombre;
    this.serviceNota.IdApi = this.IdApi;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    this.dialog.open(DetalleNotaCreditoComponent, dialogConfig);
  }

  
  //Obtener ultima nota de credito de cierta Factura en especifico verificar si existen o no, para mostrat la tabla
  ObtenerUltimaNotaCreditoFactura() {
    // console.log(this.IdFactura);
    this.serviceNota.getUltimaNotaCreditoFacturaID(this.service.formData.Id).subscribe(data => {
      if (data.length > 0) {
        this.EstatusNota = data[0].Estatus;
        console.log(this.EstatusNota);
      } else {
        this.EstatusNota = 'NoHay';
        console.log(this.EstatusNota);
      }
      console.log(data);
    });
  }

  // INICIO TABLA DETALLE Y NOTA CREDITO ------------------------------------------------------------>

  listData2: MatTableDataSource<any>;

  displayedColumns2: string[] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['IdDetalleNotaCredito', 'IdNotaCredito', 'ClaveProducto', 'Cantidad'];

  expandedElement2: any;
  detalle = new Array<DetalleNotaCredito>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  a2 = document.createElement('a2');
  @ViewChild(MatSort, null) sort2: MatSort;
  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  refreshNotaList() {

// this.IniciarSaldo();

    this.serviceNota.deleteNotaCreada().subscribe(res => {
      this.ObtenerUltimaNotaCreditoFactura();
      console.log(res);

      // this.service.deleteNotaCreada().subscribe(data =>{
      // console.log(data);
      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      // console.log(this.IdFactura);
      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      this.serviceNota.master = new Array<NotaCreditoMaster>();
      //this.detalle = new Array<DetalleNotaCredito>();
      this.serviceNota.getNotaCreditoFacturaID(this.service.formData.Id).subscribe(data => {
        // console.clear();
        console.log(data);
        for (let i = 0; i < data.length; i++) {

        // this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + +data[i].Total);
        // this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + +data[i].TotalDlls);

          console.log('SE EJECUTO ' + i);
          this.serviceNota.master[i] = data[i]
          console.log(this.serviceNota.master[i]);
          this.serviceNota.master[i].DetalleNotaCredito = [];
          console.log(data[i].IdNotaCredito);
          this.serviceNota.getNotaCreditoDetalles(data[i].IdNotaCredito).subscribe(res => {
            console.log(res);
            this.serviceNota.master[i].DetalleNotaCredito.pop();
            for (let l = 0; l < res.length; l++) {
              console.log('cualquier');
              console.log('ENTRANDO POR ' + l);
              this.serviceNota.master[i].DetalleNotaCredito.push(res[l]);
              console.log(this.serviceNota.master[i]);
            }
            this.listData2 = new MatTableDataSource(this.serviceNota.master);
            this.listData2.sort = this.sort2;
            console.log(this.listData2);
            // this.listData2.paginator = this.paginator;
            // this.listData2.paginator._intl.itemsPerPageLabel = 'Notas de Credito Por Pagina';
          })
        }
        this.SaldoSumatoria();
        // console.clear();
        console.log(this.serviceNota.master);
        console.log(this.service.SaldoFacturaMXN);
        console.log(this.service.SaldoFacturaDLLS);
      });
    });

    // })
  }

  // FIN TABLA DETALLE Y NOTA CREDITO  -------------------------------------------------------------->

  CancelarNota(row) {
    Swal.fire({
      title: '¿Segur@ de Cancelar la Factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Deshacer'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.enviarfact.cancelar(row.UUID).subscribe(data => {
          let data2 = JSON.parse(data);
          if (data2.response === 'success') {
            // this.service.updateCancelarFactura(this.service.formData.Id).subscribe(data => {
            //   this.loading = false;
            //   Swal.fire({
            //     title: 'Factura Cancelada',
            //     icon: 'success',
            //     timer: 1000,
            //     showCancelButton: false,
            //     showConfirmButton: false
            //   });
            // });
          }
          else if (data2.response === 'error') {
            this.loading = false;
            // this.resetForm();
            Swal.fire(
              'Error en Cancelacion',
              '' + data2.message + '',
              'error'
            )
          }
        })
      }

    })
    
  }

  onDeleteNC(notaCredito: any) {
    console.log(notaCredito);
    Swal.fire({
      title: '¿Segur@ de Borrar Nota Credito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.serviceNota.DeleteAllDetalleNotaCrediito(notaCredito.IdNotaCredito).subscribe(res => {
          this.serviceNota.deleteNotaCredito(notaCredito.IdNotaCredito).subscribe(res => {
            this.refreshNotaList();
            Swal.fire({
              title: 'Borrado',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
            });
          })
        })
      }
    })

  }

  // FIN NOTA DE PAGO----------------------------------------------------------------------->

// SUMATORIA DE SALDO

SaldoSumatoria(){
this.service.SaldoFacturaMXN = 0;
this.service.SaldoFacturaDLLS = 0;

console.log('---------------------------------------');
console.log(this.serviceNota.master);
if(this.serviceNota.master.length > 0){
  for (let i = 0; i < this.serviceNota.master.length; i++) {
  
    this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + +this.serviceNota.master[i].Total);
    this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + +this.serviceNota.master[i].TotalDlls);
  
  }
}
if (this.PagoCFDI){
if(this.listDataPagosCFDI.data.length > 0){
console.log(this.listDataPagosCFDI.data);

for (let i = 0; i < this.listDataPagosCFDI.data.length; i++) {

if(this.service.formData.Moneda == 'MXN'){
this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + +this.listDataPagosCFDI.data[i].Cantidad);
this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + (+this.listDataPagosCFDI.data[i].Cantidad / +this.service.formData.TipoDeCambio));
}else{
  this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + +this.listDataPagosCFDI.data[i].Cantidad);
  this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + (+this.listDataPagosCFDI.data[i].Cantidad * +this.service.formData.TipoDeCambio));

}

        }
}
}
this.service.SaldoFacturaMXN = +this.service.formData.Total - this.service.SaldoFacturaMXN;
this.service.SaldoFacturaDLLS = +this.service.formData.TotalDlls - this.service.SaldoFacturaDLLS;

if(this.service.SaldoFacturaMXN<0){
  this.service.SaldoFacturaMXN=0;
}
if(this.service.SaldoFacturaDLLS<0){
  this.service.SaldoFacturaDLLS=0

}



console.log('--------------------');
console.log(this.service.SaldoFacturaMXN);
console.log(this.service.SaldoFacturaDLLS);
console.log('--------------------');



}

CFDISumatoria(){

}

// SUMATORIA DE SALDO


  // TABLA COMPLEMENTO PAGO (PAGOS CFDI) ----------------------------------------------------------------------->

  //Variable para verificar si existen pagos CFDI a esta factura y asi mostrat o no la tabla 
  PagoCFDI: boolean;

  listDataPagosCFDI: MatTableDataSource<any>;
  displayedColumnsPagosCFDI: string[] = ['IdReciboPago', 'FechaPago', 'Cantidad', 'Estado', 'Options'];
  @ViewChild(MatSort, null) sortPagoCFDI: MatSort;

  refreshPagoCFDIList() {

    console.log(this.service.SaldoFacturaMXN);
    // this.IniciarSaldo();
    this.PagoCFDI = false;

    this.service.getPagosCFDI(this.service.formData.Id).subscribe(data => {
      if (data.length > 0) {
        // console.clear();
        // console.log(this.service.formData.Id);
        console.log(data);
        this.PagoCFDI = true;
        // for (let i = 0; i < data.length; i++) {
          // this.SaldoFacturaMXN = this.SaldoFacturaMXN + data[i].
          // if(this.service.formData.Moneda == 'MXN'){
            // this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + +data[i].Cantidad);
            // this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + (+data[i].Cantidad / +this.service.formData.TipoDeCambio));
            // }else{
              //   this.service.SaldoFacturaDLLS = (this.service.SaldoFacturaDLLS + +data[i].Cantidad);
              //   this.service.SaldoFacturaMXN = (this.service.SaldoFacturaMXN + (+data[i].Cantidad * +this.service.formData.TipoDeCambio));
              
              // }
              
              // }
              this.listDataPagosCFDI = new MatTableDataSource(data);
              this.listDataPagosCFDI.sort = this.sortPagoCFDI;
              this.SaldoSumatoria();
        // this.listData.paginator = this.paginator;
        // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
        console.log(this.listDataPagosCFDI);
      } else {
        this.PagoCFDI = false;
      }
      console.log(this.PagoCFDI);
      console.log(this.service.SaldoFacturaMXN);
      console.log(this.service.SaldoFacturaDLLS);
    });

  }


  // FIN TABLA COMPLEMENTO PAGO (PAGOS CFDI) ----------------------------------------------------------------------->

  /* Metodo para cambiar los datetimepicker al formato deseado */
  onChange(val) {
    var d = new Date(val);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('01').slice(-2)].join('-')

  }


  /* Metodo que refresca la lista de detalles */
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.refreshDetallesFacturaList();
  // }

  /*Valores de saldos*/


  /* Valores de Totales */
  subtotal: any;
  iva: any;
  total: any;
  ivaDlls: any;
  subtotalDlls: any;
  totalDlls: any;

  /* Control para Search/Lista de Clientes  */
  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;


  /* Informacion para tabla de productos */
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;

  /* Metodo para obtener todos los clientes y ponerlos en el combobox */
  dropdownRefresh() {

    this.service.getDepDropDownValues().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });
  }

  /* Filter Clientes */
  private _filter(value: any): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
  }

  /* Metodo que se dispara al seleccionar clientes */
  onSelectionChange(cliente: Cliente, event: any) {
    console.log(event);
    if (event.isUserInput) {

      this.fechaVenc = new Date(this.service.formData.FechaDeExpedicion)
      console.log(this.fechaVenc);

      console.log(cliente);
      this.service.formData.IdCliente = cliente.IdClientes;
      console.log(this.service.formData);
      this.ClienteNombre = cliente.Nombre;
      this.IdApi = cliente.IdApi;
      this.service.formData.UsoDelCFDI = cliente.UsoCFDI;
      this.service.formData.FormaDePago = cliente.MetodoPago;
      this.service.formData.CondicionesDePago = cliente.DiasCredito + ' Dias Credito';
      this.fechaVenc.setDate(this.fechaVenc.getDate() + parseInt(cliente.DiasCredito))
      this.service.formData.FechaVencimiento = new Date(this.fechaVenc)
      // this.service.formData.FechaVencimiento.setDate(this.service.formData.FechaVencimiento.getDate()+parseFloat(cliente.DiasCredito))
      console.log(this.fechaVenc);
      // this.service.formData.Vendedor = cliente.Vendedor
      this.service.getvendedor(cliente.Vendedor).subscribe(data => {
        console.log(data);

        this.service.formData.Vendedor = data[0].Nombre;

      })


      if (this.service.formData.FormaDePago == '99' || this.service.formData.FormaDePago == '') {
        this.service.formData.MetodoDePago = 'PPD';
      } else {
        this.service.formData.MetodoDePago = 'PUE';
      }
    }

  }

  /* Metodo para obtener la moneda del servicio */
  onMoneda() {
    this.Moneda = this.service.formData.Moneda;
    this.service.Moneda = this.Moneda;
    console.log(this.service.Moneda);
  }
  /* Metodo para obtener el tipo de cambio y ponerlo en la variable a usar */
  tipoDeCambio() {
    // this.traerApi().subscribe(data => {
    this.Cdolar = this.tipoCambio.TipoCambio;
    // })
  }


  /* Metodo para obtener el tipo de cambio de la API de Banxico */
  // traerApi(): Observable<any> {
  //   let hora = new Date().getHours();
  //   let fechahoy = new Date();
  //   let fechaayer = new Date();
  //   fechaayer.setDate(fechahoy.getDate() - 1)
  //   let diaayer = new Date(fechaayer).getDate();
  //   let mesayer = new Date(fechaayer).getMonth();
  //   let añoayer = new Date(fechaayer).getFullYear();
  //   let diasemana = new Date(fechahoy).getDay();
  //   if (diasemana == 6 || diasemana == 0) {
  //     this.rootURL = this.rootURL + 'oportuno'
  //   } else {
  //     if (hora < 11) {
  //       this.rootURL = this.rootURL + 'oportuno'
  //     }
  //     else {
  //       if (diasemana == 1) {
  //         fechaayer.setDate(fechahoy.getDate() - 3)
  //         let diaayer = new Date(fechaayer).getDate();
  //         let mesayer = new Date(fechaayer).getMonth();
  //         let añoayer = new Date(fechaayer).getFullYear();
  //         mesayer = mesayer + 1;
  //         let fecha = añoayer + '-' + mesayer + '-' + diaayer;
  //         this.rootURL = this.rootURL + fecha + '/' + fecha

  //       } else {
  //         mesayer = mesayer + 1;
  //         let fecha = añoayer + '-' + mesayer + '-' + diaayer;
  //         this.rootURL = this.rootURL + fecha + '/' + fecha
  //       }
  //     }
  //   }
  //   return this.http.get(this.rootURL, httpOptions)
  // }

  traerApi(): Observable<any> {

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }

  /* Iniciar en 0 Valores de los Totales */
  IniciarTotales() {
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.subtotalDlls = 0;
    this.totalDlls = 0;
    this.ivaDlls = 0;

  }
  /* MEtodo que guarda el xml y el pdf en el localstorage */
  localstorage() {
    let id = this.service.formData.UUID
    let folio = this.service.formData.Folio
    this.enviarfact.xml(id).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      this.xmlparam = folio;
      setTimeout(() => {
        const content: Element = document.getElementById('element-to-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'F-' + folio + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function (pdfAsString) {
          localStorage.setItem('pdf' + folio, pdfAsString);
        })
      }, 1000)
    });
  }


  /* Funcion Refresh Tabla Detalles Factura */
  refreshDetallesFacturaList() {
    // this.idFactura();
    this.IniciarTotales();
    let tasa;
    // console.log(this.IdFactura+'XXXXXXXXXXXX');
    console.log(this.service.formData.Id + '-yyyyyyyyyyy');
    // this.service.getDetallesFacturaList(this.IdFactura).subscribe(data => {
    this.service.getDetallesFacturaList(this.service.formData.Id).subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      console.log(this.listData);
      for (let i = 0; i < data.length; i++) {
        this.subtotal = this.subtotal + parseFloat(data[i].Importe);
        if (data[i].ImporteIVA != 'NaN') {
          this.iva = this.iva + parseFloat(data[i].ImporteIVA);
        } else {
          this.iva = this.iva + 0;
        }
        this.total = this.iva + this.subtotal;
      }
      console.log(this.subtotal);
      for (let i = 0; i < data.length; i++) {
        this.subtotalDlls = this.subtotalDlls + parseFloat(data[i].ImporteDlls);
        if (data[i].ImporteIVADlls != 'NaN') {
          this.ivaDlls = this.ivaDlls + parseFloat(data[i].ImporteIVADlls);
        } else {
          this.ivaDlls = this.ivaDlls + 0;
        }
        this.totalDlls = this.ivaDlls + this.subtotalDlls;
      }
      console.log(this.iva);
      console.log(this.total);
      this.service.formData.Subtotal = this.subtotal;
      this.service.formData.ImpuestosTrasladados = (parseFloat(this.iva).toFixed(6));
      this.service.formData.Total = (parseFloat(this.total).toFixed(6))
      this.service.formData.SubtotalDlls = this.subtotalDlls;
      this.service.formData.ImpuestosTrasladadosDlls = this.ivaDlls;
      this.service.formData.TotalDlls = this.totalDlls;
      console.log(this.service.formData);
      // console.log(this.service.formData);

      this.service.updateFactura(this.service.formData).subscribe(res => {
        console.log(res);

      }
      );
      this.SaldoSumatoria();
    });

  }

  /* Filtro de Detalles Factura */
  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  /* Forma Pago */
  public listFP: Array<Object> = [
    { FormaDePago: "01", text: "01-Efectivo" },
    { FormaDePago: "02", text: "02-Cheque nominativo" },
    { FormaDePago: "03", text: "03-Transferencia electrónica de fondos" },
    { FormaDePago: "04", text: "04-Tarjeta de crédito" },
    { FormaDePago: "05", text: "05-Monedero electrónico" },
    { FormaDePago: "06", text: "06-Dinero electrónico" },
    { FormaDePago: "08", text: "08-Vales de despensa" },
    { FormaDePago: "12", text: "12-Dación en pago" },
    { FormaDePago: "13", text: "13-Pago por subrogación" },
    { FormaDePago: "14", text: "14-Pago por consignación" },
    { FormaDePago: "15", text: "15-Condonación" },
    { FormaDePago: "17", text: "17-Compensación" },
    { FormaDePago: "23", text: "23-Novación" },
    { FormaDePago: "24", text: "24-Confusión" },
    { FormaDePago: "25", text: "25-Remisión de deuda" },
    { FormaDePago: "26", text: "26-Prescripción o caducidad" },
    { FormaDePago: "27", text: "27-A satisfacción del acreedor" },
    { FormaDePago: "28", text: "28-Tarjeta de débito" },
    { FormaDePago: "29", text: "29-Tarjeta de servicios" },
    { FormaDePago: "30", text: "30-Aplicación de anticipos" },
    { FormaDePago: "31", text: "31-Intermediario pagos" },
    { FormaDePago: "99", text: "99-Por definir" }
  ];
  /* list CFDI */
  public listCFDI: Array<Object> = [
    { UsoDelCFDI: "G01", text: "G01-Adquisición de mercancias" },
    { UsoDelCFDI: "G02", text: "G02-Devoluciones, descuentos o bonificaciones" },
    { UsoDelCFDI: "G03", text: "G03-Gastos en general" },
    { UsoDelCFDI: "I01", text: "I01-Construcciones" },
    { UsoDelCFDI: "I02", text: "I02-Mobilario y equipo de oficina por inversiones" },
    { UsoDelCFDI: "I03", text: "I03-Equipo de transporte" },
    { UsoDelCFDI: "I04", text: "I04-Equipo de computo y accesorios" },
    { UsoDelCFDI: "I05", text: "I05-Dados, troqueles, moldes, matrices y herramental" },
    { UsoDelCFDI: "I06", text: "I06-Comunicaciones telefónicas" },
    { UsoDelCFDI: "I07", text: "I07-Comunicaciones satelitales" },
    { UsoDelCFDI: "I08", text: "I08-Otra maquinaria y equipo" },
    { UsoDelCFDI: "D01", text: "D01-Honorarios médicos, dentales y gastos hospitalarios" },
    { UsoDelCFDI: "D02", text: "D02-Gastos médicos por incapacidad o discapacidad" },
    { UsoDelCFDI: "D03", text: "D03-Gastos funerales" },
    { UsoDelCFDI: "D04", text: "D04-Donativos" },
    { UsoDelCFDI: "D05", text: "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
    { UsoDelCFDI: "D06", text: "D06-Aportaciones voluntarias al SAR" },
    { UsoDelCFDI: "D07", text: "D07-Primas por seguros de gastos médicos" },
    { UsoDelCFDI: "D08", text: "D08-Gastos de transportación escolar obligatoria" },
    { UsoDelCFDI: "D09", text: "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
    { UsoDelCFDI: "D10", text: "D10-Pagos por servicios educativos (colegiaturas)" },
    { UsoDelCFDI: "P01", text: "P01-Por definir" }
  ];

  /* Metodo para regresar a la pantalla anterior */
  Regresar() {
    this.router.navigateByUrl('/facturacionCxc');
  }

  /* Editar detalle factura */
  onEdit(detalleFactura: DetalleFactura) {
    this.service.formDataDF = detalleFactura;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FacturacioncxcEditProductoComponent, dialogConfig);
  }
  /* Eliminar Detalle Factura */
  onDelete(id: number) {
    Swal.fire({
      title: '¿Seguro de Borrar Concepto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteDetalleFactura(id).subscribe(res => {
          this.refreshDetallesFacturaList();

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

  /* Agregar Detalle Factura */
  onAddProducto() {

    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Guardada';
    this.service.formData.Version = '3.3';
    // this.service.formData.Id = this.IdFactura;
    if (this.service.formData.Moneda == 'USD') {
      this.service.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.service.formData.TipoDeCambio = '0';
    }
    console.log(this.service.formData);

    this.service.updateFactura(this.service.formData).subscribe(res => {
      console.log(res);

    }
    );
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FacturacioncxcProductoComponent, dialogConfig);
  }
  /* Metodo al seleccionar moneda y guardar el dato en el servicio */
  MonedaSelected(event: any) {
    this.Moneda = event.target.selectedOptions[0].text;
    this.service.Moneda = this.Moneda;
    this.refreshDetallesFacturaList();
  }

  /* Metodo para reinciar el form o iniciarlo con datos dependiendo del folio*/
  resetForm(form?: NgForm) {
    // console.log(this.IdFactura);


    this.service.getFacturaId(this.service.formData.Id).subscribe(res => {
      console.log(res[0]);

      this.service.formData = res[0];
      //OBTENER LA INFORMACION DEL CLIENTE, EN ESPECIFICO EL NOMBRE DEL CLIENTE PARA PINTARLO EN EL FORMULARIO
      if (this.service.formData.IdCliente != 0) {
        this.service.getFacturaClienteID(this.service.formData.IdCliente).subscribe(res => {
          this.ClienteNombre = res[0].Nombre;
          this.IdApi = res[0].IdApi;
        });
      }

      this.Estatus = this.service.formData.Estatus;
      if (this.Estatus === 'Timbrada' || this.Estatus === 'Cancelada') {
        let nodes = document.getElementById('div1').getElementsByTagName('*');
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].setAttribute('disabled', 'true')
        }
      }

      this.onMoneda();
    });

  }
  /* Metodo para crear el JSON de la factura */
  crearjsonfactura(id: number): string {
    let cadena: string;
    this.service.getFacturasClienteID(id).subscribe(data => {
console.log(data);
      this.json1.Receptor.UID = data[0].IdApi;
      this.json1.Moneda = data[0].Moneda;
      if (data[0].Moneda == 'MXN') {
        this.json1.Impuestos.Traslados.pop();
        this.json1.Impuestos.Traslados.push({
          "Base": data[0].Subtotal,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": data[0].ImpuestosTrasladados
        });
      } else if (data[0].Moneda == 'USD') {
        this.json1.TipoCambio = data[0].TipoDeCambio;
        this.json1.Impuestos.Traslados.pop();
        this.json1.Impuestos.Traslados.push({
          "Base": data[0].SubtotalDlls,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": data[0].ImpuestosTrasladadosDlls
        });

      }
      this.json1.TipoDocumento = 'factura';

      this.json1.Impuestos.Retenidos.pop();
      this.json1.Impuestos.Locales.pop();
      this.json1.CfdiRelacionados.TipoRelacion = '';
      this.json1.CfdiRelacionados.UUID.push();
      this.json1.UsoCFDI = data[0].UsoDelCFDI;
      this.json1.Serie = data[0].Serie;
      this.json1.FormaPago = data[0].FormaDePago;
      this.json1.MetodoPago = data[0].MetodoDePago;

      this.json1.EnviarCorreo = false;
      this.service.getDetallesFacturaListProducto(id).subscribe(data => {
        this.json1.Conceptos.pop();
        if (this.json1.Moneda == 'MXN') {
          for (let i = 0; i < data.length; i++) {
            this.json1.Conceptos.push({
              ClaveProdServ: data[i].ClaveSAT,
              NoIdentificacion: data[i].ClaveProducto,
              Cantidad: data[i].Cantidad,
              ClaveUnidad: data[i].Unidad,
              Unidad: data[i].Unidad,
              Descripcion: data[i].DescripcionProducto + ' ' + data[i].Observaciones,
              ValorUnitario: data[i].PrecioUnitario,
              Importe: data[i].Importe,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: data[i].Importe,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: data[i].IVA,
                  Importe: ((parseFloat(data[i].Importe) * parseFloat(data[i].IVA)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }

        }
        else if (this.json1.Moneda == 'USD') {
          for (let i = 0; i < data.length; i++) {
            this.json1.Conceptos.push({
              ClaveProdServ: data[i].ClaveSAT,
              NoIdentificacion: data[i].ClaveProducto,
              Cantidad: data[i].Cantidad,
              ClaveUnidad: data[i].Unidad,
              Unidad: data[i].Unidad,
              Descripcion: data[i].DescripcionProducto,
              ValorUnitario: data[i].PrecioUnitarioDlls,
              Importe: data[i].ImporteDlls,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: data[i].ImporteDlls,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: data[i].IVA,
                  Importe: ((parseFloat(data[i].ImporteDlls) * parseFloat(data[i].IVA)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });
          }
        }
        cadena = JSON.stringify(this.json1);
        this.enviar(cadena);
      })
    });
    return cadena;
  }


  /* Metodo que se dispara al guardar la factura */
  onSubmit(form: NgForm) {
    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Guardada';
    this.service.formData.Version = '3.3';
    // this.service.formData.Id = this.IdFactura;
    if (this.service.formData.Moneda == 'USD') {
      this.service.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.service.formData.TipoDeCambio = '0';
    }
    this.service.updateFactura(this.service.formData).subscribe(res => {
      this.resetForm(form);
      this.IniciarTotales();
      Swal.fire(
        'Factura Guardada',
        '',
        'success'
      )

    }
    );
  }
  /* Metodo para actualizar la factura despues de timbrarla */
  timbrar(form: NgForm) {

    this.loading = true;
    document.getElementById('enviaremail').click();
    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Guardada';
    this.service.formData.Version = '3.3';
    //this.service.formData.Serie = '5628';
    this.service.formData.Serie = '386447';
    
    if (this.service.formData.Moneda == 'USD') {
      this.service.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.service.formData.TipoDeCambio = '0';
    }
    // this.service.formData.Id = +this.IdFactura;
    this.service.updateFactura(this.service.formData).subscribe(res => {
      console.log(this.service.formData);
      this.resetForm(form);
      this.IniciarTotales();
      this.crearjsonfactura(this.service.formData.Id);


      this.service.saldos.Folio = this.service.formData.Folio;
      this.service.saldos.SaldoPendiente = this.service.formData.Total;

      this.service.addSaldos(this.service.saldos)
    }

    // this.service.addSaldos(  )
    );

  }

  /* Metodo que timbra la factura */
  enviar(cadena: string) {
    console.log(cadena);
    this.enviarfact.enviarFactura(cadena).subscribe(data => {
      console.log(data);
      if (data.response === 'success') {
        this.service.formData.LugarDeExpedicion = '31203';
        this.service.formData.NumeroDeCertificado = '00001000000403628664';
        // tslint:disable-next-line: max-line-length
        this.service.formData.Certificado = 'MIIGbDCCBFSgAwIBAgIUMDAwMDEwMDAwMDA0MDM2Mjg2NjQwDQYJKoZIhvcNAQELBQAwggGyMTgwNgYDVQQDDC9BLkMuIGRlbCBTZXJ2aWNpbyBkZSBBZG1pbmlzdHJhY2nDs24gVHJpYnV0YXJpYTEvMC0GA1UECgwmU2VydmljaW8gZGUgQWRtaW5pc3RyYWNpw7NuIFRyaWJ1dGFyaWExODA2BgNVBAsML0FkbWluaXN0cmFjacOzbiBkZSBTZWd1cmlkYWQgZGUgbGEgSW5mb3JtYWNpw7NuMR8wHQYJKoZIhvcNAQkBFhBhY29kc0BzYXQuZ29iLm14MSYwJAYDVQQJDB1Bdi4gSGlkYWxnbyA3NywgQ29sLiBHdWVycmVybzEOMAwGA1UEEQwFMDYzMDAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBEaXN0cml0byBGZWRlcmFsMRQwEgYDVQQHDAtDdWF1aHTDqW1vYzEVMBMGA1UELRMMU0FUOTcwNzAxTk4zMV0wWwYJKoZIhvcNAQkCDE5SZXNwb25zYWJsZTogQWRtaW5pc3RyYWNpw7NuIENlbnRyYWwgZGUgU2VydmljaW9zIFRyaWJ1dGFyaW9zIGFsIENvbnRyaWJ1eWVudGUwHhcNMTYwOTA4MjAyMTE0WhcNMjAwOTA4MjAyMTE0WjCCAQsxLzAtBgNVBAMTJlBSTyBMQUNUT0lOR1JFRElFTlRFUyBTIERFIFJMIE1JIERFIENWMS8wLQYDVQQpEyZQUk8gTEFDVE9JTkdSRURJRU5URVMgUyBERSBSTCBNSSBERSBDVjEvMC0GA1UEChMmUFJPIExBQ1RPSU5HUkVESUVOVEVTIFMgREUgUkwgTUkgREUgQ1YxJTAjBgNVBC0THFBMQTExMDExMjQzQSAvIE1FVlA3MTA3MTE0UTAxHjAcBgNVBAUTFSAvIE1FVlA3MTA3MTFIREZEWkQwMjEvMC0GA1UECxMmUFJPIExBQ1RPSU5HUkVESUVOVEVTIFMgREUgUkwgTUkgREUgQ1YwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCNOCY+J2gRGKuI+rAsJYWugQhC6urg8kBa1AYCBd7zWlV+U5QwJqBO3Ty7JEPZVlLIv1zVkee0oS/0f0XatowPcnsJcGNayK9ZzwbvZJ92jJ9Z5lVDbwAZB/LVuYZaqJTJLdkEtW8UOQgZmqxM4I4XE8J6PGXNYIcBlspDkKlAXHon6wUQo0MgXO+Ybq0eh5IileNTljVhldKJtQ/rkVYiWvTkmwl6vzvwynoYk7Otcldk66t5Mbrpkeq6C+gN+Tt/thduZLs9yA6yQYFzh6EwQrBWBTbgg9xLa+Y0whofI6miXzwJQVUwNzIdyCY3rmTKACAkBYkz0p/gB8+TRDV1AgMBAAGjHTAbMAwGA1UdEwEB/wQCMAAwCwYDVR0PBAQDAgbAMA0GCSqGSIb3DQEBCwUAA4ICAQAN083EEgMdigngBiQylCR+VxzzEDhcrKi/+T8zcMjhVd/lPBEP3Q6SpZQzU4lTpxksDMKPGTdFus0g28vHaeeGOeG0wXaLw0D/psVTdP8A8gDZdWLYeMqrIdyua9oIKKtILNiO54FXY7sTtyAkAFA3Ih3Pt8ad3WxYsNTHyixsaqpP5KqtjW92N3iUV7NmnsKoLKgt242dhGaFXJKtPNjdiNisOoCVqYMmgtoAmlzjQB9+gwgz75B1CMvm68UIh+B5THGppnWHbIc5zln7KC6d8W2OIVypmAhWirUOUVWZou41+lXqkAnNPSLYjv4LO/lFQi3eJo17qrVMRqGZZxduVgv709uqka+XqFe5eecfdxCt1/5VqbgPGoYs89bQI907YlzYeyBfhjymUlEOtcQpBg6i6ILp49FrxDnruq8Yj/Q+n/QaO20F3yfYULt73+mIaHqYQWqvpOfOA1QVQbAli6f4hZ1kwAoVpqwA2Wt1a0B2i5QoRKWvKDaSob3Mw4UePCNk+zwek44YqD60yL4jLHWny6gCLYYdApw2ZD18igJ2jcc2JzawBLiG/I7SruCg04PgeNOpzGeWiEGeVq7HUrOp6RS8apBOSFpAKhpu+6jGv9IXVZBKm8SBTVLf4BrcQqazUZcOxqSXV9QtyDHjHb3Sb8G3dmxCxt8l9mYNTA==';
        this.service.formData.UUID = data.UUID;
        this.service.formData.CadenaOriginal = '||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
        this.service.formData.SelloDigitalSAT = data.SAT.SelloSAT;
        this.service.formData.SelloDigitalCFDI = data.SAT.SelloCFD;
        this.service.formData.NumeroDeSelloSAT = data.SAT.NoCertificadoSAT;
        this.service.formData.RFCdelPAC = 'LSO1306189R5';

        if (this.service.formData.MetodoDePago=='PUE'){
          this.service.formData.Estatus = 'Pagada';
        }else{

          this.service.formData.Estatus = 'Timbrada';
        }

        
        this.numfact = data.UUID;
        console.log(this.service.formData);
        this.service.updateFactura(this.service.formData).subscribe(data => {
          this.loading = false;
          document.getElementById('cerrarmodal').click();
          Swal.fire(
            'Factura Creada',
            '' + this.numfact + '',
            'success'
          )
          this.resetForm();
          // this.dxml2(this.numfact, this.service.formData.Folio);
        });
        this.estatusfact = 'Factura Creada ' + data.invoice_uid;
        this.servicefolios.updateFolios().subscribe(data => {
          console.log(data);
        });
      } else
        if (data.response === 'error') {
          this.loading = false;
          document.getElementById('cerrarmodal').click();
          Swal.fire(
            'Error',
            '' + data.message + '',
            'error'
          )
        }
    })
  }

  /* Metodo que crear el xml y el pdf y los descargax */
  dxml(id: string, folio: string) {
    this.loading = true;
    // document.getElementById('enviaremail').click();
    // let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    this.enviarfact.xml(id).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';
      document.body.appendChild(this.a);
      this.a.click();
      
      
    });
    const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "80%";
      //dialogConfig.height = "80%"
      
     
      this.dialog.open(FacturaComponent, dialogConfig);

      setTimeout(()=>{
        this.onExportClick(folio);    
        this.dialog.closeAll();
        
       },1000)
    
  
  }

  soloPDF(id: string, folio: string){
    
    this.loading = true;
    // document.getElementById('enviaremail').click();
    
    const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "80%";
      //dialogConfig.height = "80%"
      
     
      this.dialog.open(FacturaComponent, dialogConfig);

      setTimeout(()=>{
        this.onExportClick(folio);    
        this.dialog.closeAll();
        
       },1000)
  }

  /* Metodo que guarda el xml en el localstorage para usarlo en el pdf */
  dxml2(id: string, folio: string) {
    // this.proceso = 'xml';
    // let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    // this.enviarfact.xml(id).subscribe(data => {
    //   localStorage.removeItem('xml' + folio)
    //   localStorage.setItem('xml' + folio, data)
    //   const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    //   this.fileUrl = window.URL.createObjectURL(blob);
    //   this.a.href = this.fileUrl;
    //   this.a.target = '_blank';
    //   this.a.download = 'F-' + folio + '.xml';
    //   document.body.appendChild(this.a);
    //   this.xmlparam = folio
    //   this.resetForm();
    //   return this.fileUrl;
    // });

const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "100%";
      dialogConfig.height = "80%"
      
     
      this.dialog.open(FacturaComponent, dialogConfig);
  }

  /* Metodo que crear el PDF */
  onExportClick(folio?: string) {
    this.proceso = 'xml';
    const content: Element = document.getElementById('Factura-PDF');
    const option = {
      margin: [.5, .5, .5, 0],
      filename: 'F-' + folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, logging: true, scrollY: -2, scrollX: -15 },
      //html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'cm', format: 'letter', orientation: 'p' },
      pagebreak: { avoid: '.pgbreak' }

    };

    html2pdf()
      .from(content)
      .set(option).toPdf().get('pdf').then(function (pdf) {
        setTimeout(() => { }, 1000);
      })
      .save();
    this.proceso = '';
    this.loading = false;
  }





  /* Metodo que obtiene el xml de la API */
  dpdfxml() {
    this.enviarfact.xml('http://devfactura.in/api/v3/cfdi33/5e06601d92802/xml')
  }

  /* Metodo para reiniciar el modelo de la factura */
  setfacturatimbre() {
    this.json1 = {
      Receptor: {
        UID: ''
      },
      TipoDocumento: '',
      Conceptos: [{
        ClaveProdServ: '',
        NoIdentificacion: '',
        Cantidad: '',
        ClaveUnidad: '',
        Unidad: '',
        Descripcion: '',
        ValorUnitario: '',
        Importe: '',
        Descuento: '',
        tipoDesc: '',
        honorarioInverso: '',
        montoHonorario: '',
        Impuestos: {
          Traslados: [
            {
              Base: '',
              Impuesto: '',
              TipoFactor: '',
              TasaOCuota: '',
              Importe: ''
            }],
          Retenidos: [{
            Base: '',
            Impuesto: '',
            TipoFactor: '',
            TasaOCuota: '',
            Importe: ''
          }],
          Locales: [{
            Impuesto: '',
            TasaOCuota: '',
          }],
        },
        NumeroPedimento: '',
        Predial: '',
        Partes: '',
        Complemento: ''
      }],
      Impuestos: {
        Traslados:
          [{
            Base: '',
            Impuesto: '',
            TipoFactor: '',
            TasaOCuota: '',
            Importe: ''
          }],
        Retenidos: [{
          Base: '',
          Impuesto: '',
          TipoFactor: '',
          TasaOCuota: '',
          Importe: '',
        }],
        Locales: [{
          Impuesto: '',
          TasaOCuota: '',
        }]
      },
      CfdiRelacionados: {
        TipoRelacion: '',
        UUID: []
      },
      UsoCFDI: '',
      Serie: 0,
      FormaPago: '',
      MetodoPago: '',
      Moneda: '',
      TipoCambio: '',
      EnviarCorreo: false,
    }
  }

  email(id: string, folio: string) {

    localStorage.removeItem('xml' + folio);
    localStorage.removeItem('pdf' + folio);
    document.getElementById('enviaremail2').click();

    this.folioparam = folio;
    this.idparam = id;
    this._MessageService.correo = 'ivan.talamantes@live.com';
    this._MessageService.cco = 'ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto = 'Envio Factura ' + folio;
    this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + folio;
    this._MessageService.nombre = 'ProlactoIngredientes';

    this.enviarfact.xml(id).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      this.xmlparam = folio;
      setTimeout(() => {
        const content: Element = document.getElementById('element-to-PDF');
        const option = {
          margin: [0, 0, 0, 0],
          filename: 'F-' + folio + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
          jsPDF: { format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(content).set(option).output('datauristring').then(function (pdfAsString) {
          localStorage.setItem('pdf' + folio, pdfAsString);
          this.statusparam = true;


        })
      }, 1000)

    })
  }

  /* Metodo para cancelar la factura */
  cancelar(id: string, folio: string) {
    Swal.fire({
      title: '¿Segur@ de Cancelar la Factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Deshacer'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.enviarfact.cancelar(id).subscribe(data => {
          let data2 = JSON.parse(data);
          if (data2.response === 'success') {
            this.service.updateCancelarFactura(this.service.formData.Id).subscribe(data => {
              this.loading = false;
              Swal.fire({
                title: 'Factura Cancelada',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            });
          }
          else if (data2.response === 'error') {
            this.loading = false;
            this.resetForm();
            Swal.fire(
              'Error en Cancelacion',
              '' + data2.message + '',
              'error'
            )
          }
        })
      }

    })
  }
  /* Maetodo para la prefactura */
  prefactura(folio: string) {
    this.crearjsonprefactura(this.service.formData.Id);
  }


  /* Metodo que crear el JSON para la Prefactura */
  crearjsonprefactura(id: number): string {
    let cadena: string;
    this.service.getFacturasClienteID(id).subscribe(data => {
      this.json2.Receptor.UID = data[0].IdApi;
      this.json2.Moneda = data[0].Moneda;
      if (data[0].Moneda == 'MXN') {
        this.json2.Impuestos.Traslados.pop();
        this.json2.Impuestos.Traslados.push({
          "Base": data[0].Subtotal,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": data[0].ImpuestosTrasladados
        });
      } else if (data[0].Moneda == 'USD') {
        this.json2.TipoCambio = data[0].TipoDeCambio;
        this.json2.Impuestos.Traslados.pop();
        this.json2.Impuestos.Traslados.push({
          "Base": data[0].SubtotalDlls,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": data[0].ImpuestosTrasladadosDlls
        });

      }
      this.json2.TipoDocumento = 'factura';
      this.json2.Impuestos.Retenidos.pop();
      this.json2.Impuestos.Locales.pop();
      this.json2.CfdiRelacionados.TipoRelacion = '';
      this.json2.CfdiRelacionados.UUID.push();
      this.json2.UsoCFDI = data[0].UsoDelCFDI;
      this.json2.Serie = data[0].Serie;
      this.json2.FormaPago = data[0].FormaDePago;
      this.json2.MetodoPago = data[0].MetodoDePago;

      this.json2.EnviarCorreo = false;
      this.service.getDetallesFacturaListProducto(id).subscribe(data => {
        this.json2.Conceptos.pop();
        if (this.json2.Moneda == 'MXN') {
          for (let i = 0; i < data.length; i++) {
            this.json2.Conceptos.push({
              ClaveProdServ: data[i].ClaveSAT,
              NoIdentificacion: data[i].ClaveProducto,
              Cantidad: data[i].Cantidad,
              ClaveUnidad: data[i].UnidadMedida,
              Unidad: data[i].Unidad,
              Descripcion: data[i].DescripcionProducto,
              ValorUnitario: data[i].PrecioUnitario,
              Importe: data[i].Importe,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: data[i].Importe,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: data[i].IVA,
                  Importe: ((parseFloat(data[i].Importe) * parseFloat(data[i].IVA)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }

        }
        else if (this.json2.Moneda == 'USD') {
          for (let i = 0; i < data.length; i++) {
            this.json2.Conceptos.push({
              ClaveProdServ: data[i].ClaveSAT,
              NoIdentificacion: data[i].ClaveProducto,
              Cantidad: data[i].Cantidad,
              ClaveUnidad: data[i].UnidadMedida,
              Unidad: data[i].Unidad,
              Descripcion: data[i].DescripcionProducto,
              ValorUnitario: data[i].PrecioUnitarioDlls,
              Importe: data[i].ImporteDlls,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: data[i].ImporteDlls,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: data[i].IVA,
                  Importe: ((parseFloat(data[i].ImporteDlls) * parseFloat(data[i].IVA)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }
        }
        cadena = JSON.stringify(this.json2);
        document.getElementById('abrirpdf').click();
        setTimeout(() => {
          this.onExportClick();
        }, 1000)
      })

    });
    return cadena;

  }


  nuevoCliente(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    let dl = this.dialog.open(AddClienteComponent, dialogConfig);

    dl.afterClosed().subscribe(res =>{
      this.dropdownRefresh();

      console.log(res);
      //
      let event = {
        isUserInput: true
      }
  
      let clien : Cliente;

      clien = res;
  
      
  
      this.onSelectionChange(clien, event);
    })

    

    
  }


  acuse(fact){
    console.log(fact);
    /* const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    let dl = this.dialog.open(AcusecancelacionComponent, dialogConfig);
 */
    

this.enviarfact.acuseCancelacion(fact.UUID).subscribe((data:any)=>{
  console.log(data);
  // let resp = JSON.parse(data)
  let resp = data
  console.log(resp.acuse);
  localStorage.setItem('xml',resp.acuse)
  const p = new xml2js.parseString(localStorage.getItem('xml'), { tagNameProcessors: [processors.stripPrefix] }, (err, result) => {
    console.log(result);
    let rfcemisor;
    let fechahorasolicitud;
    let fechahoracancel;
    let foliofiscal;
    let estatus;
    let sellodigitalsat;

    rfcemisor = result.Acuse.$.RfcEmisor;
    fechahorasolicitud = result.Acuse.$.Fecha;
    fechahoracancel = result.Acuse.$.Fecha;
    foliofiscal = result.Acuse.Folios[0].UUID[0];
    estatus = 'Cancelado';
    sellodigitalsat = result.Acuse.Signature[0].SignatureValue[0]


    /* console.log(rfcemisor);
    console.log(fechahorasolicitud);
    console.log(fechahoracancel);
    console.log(foliofiscal);
    console.log(estatus);
    console.log(sellodigitalsat); */

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      rfcemisor: rfcemisor,
    fechahorasolicitud:    fechahorasolicitud,
    fechahoracancel:    fechahoracancel,
    foliofiscal:    foliofiscal,
    estatus:    estatus,
    sellodigitalsat:    sellodigitalsat
    }
    let dl = this.dialog.open(AcusecancelacionComponent, dialogConfig);
    
    
    setTimeout(()=>{
      // this.proceso = 'xml';
      const content: Element = document.getElementById('Acuse-PDF');
      const option = {
        margin: [.5, .5, .5, 0],
        filename: 'Acuse-' + fact.UUID + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, logging: true, scrollY: -2, scrollX: -15 },
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'p' },
        pagebreak: { avoid: '.pgbreak' }
  
      };
  
      html2pdf()
        .from(content)
        .set(option).toPdf().get('pdf').then(function (pdf) {
          setTimeout(() => { }, 1000);
        })
        .save();

      dl.close();
      // this.dialog.closeAll();
      
     },1000)




  })
})

    

  }

  saldar(fact){

    // console.log('fact',fact);
    // console.log('service',this.service.formData);
    this.service.formData.Estatus = 'Pagada'

    // console.log('fact',fact);
    // console.log('service',this.service.formData);

    this.service.updateFactura(this.service.formData).subscribe(res => {
      // this.resetForm(fact);
      this.resetForm();
      this.IniciarTotales();
      Swal.fire(
        'Factura Saldada',
        '',
        'success'
      )

    }
    );


  }

  nosaldar(fact){

    // console.log('fact',fact);
    // console.log('service',this.service.formData);
    this.service.formData.Estatus = 'Timbrada'

    // console.log('fact',fact);
    // console.log('service',this.service.formData);

    this.service.updateFactura(this.service.formData).subscribe(res => {
      // this.resetForm(fact);
      this.resetForm();
      this.IniciarTotales();
      Swal.fire(
        'Factura Saldada',
        '',
        'success'
      )

    }
    );


  }




}
