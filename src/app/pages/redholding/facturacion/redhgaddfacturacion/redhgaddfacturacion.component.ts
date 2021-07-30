import { Component, OnInit, ViewChild } from '@angular/core';
import { RedhgfacturacionService } from 'src/app/services/redholding/redhgfacturacion.service';
import { DatePipe, Location } from '@angular/common';
import { FormControl, NgForm } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, NativeDateAdapter } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { DetalleFactura, redhgDetalleFactura } from 'src/app/Models/facturacioncxc/detalleFactura-model';
import { RedhgfacturaComponent } from '../../../../components/redhgfactura/redhgfactura.component';
import { MessageService } from 'src/app/services/message.service';
import xml2js from 'xml2js';
import { processors } from 'xml2js'
import { AcusecancelacionComponent } from 'src/app/components/acusecancelacion/acusecancelacion.component';
import { FacturaTimbre } from 'src/app/Models/facturacioncxc/facturatimbre-model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { TipoCambioService } from 'src/app/services/tipo-cambio.service';
import { RedhgaddeditclientesComponent } from '../../clientes/redhgaddeditclientes/redhgaddeditclientes.component';
import { RedhgaddeditproductosfacturaComponent } from '../redhgaddeditproductosfactura/redhgaddeditproductosfactura.component';
import { RedhgaddeditproductostercerosComponent } from '../redhgaddeditproductosterceros/redhgaddeditproductosterceros.component';


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
  selector: 'app-redhgaddfacturacion',
  templateUrl: './redhgaddfacturacion.component.html',
  styleUrls: ['./redhgaddfacturacion.component.css']
})
export class RedhgaddfacturacionComponent implements OnInit {

  public listFP = [
    { 'FormaDePago': "01", 'text': "01-Efectivo" },
    { 'FormaDePago': "02", 'text': "02-Cheque nominativo" },
    { 'FormaDePago': "03", 'text': "03-Transferencia electrónica de fondos" },
    { 'FormaDePago': "04", 'text': "04-Tarjeta de crédito" },
    { 'FormaDePago': "05", 'text': "05-Monedero electrónico" },
    { 'FormaDePago': "06", 'text': "06-Dinero electrónico" },
    { 'FormaDePago': "08", 'text': "08-Vales de despensa" },
    { 'FormaDePago': "12", 'text': "12-Dación en pago" },
    { 'FormaDePago': "13", 'text': "13-Pago por subrogación" },
    { 'FormaDePago': "14", 'text': "14-Pago por consignación" },
    { 'FormaDePago': "15", 'text': "15-Condonación" },
    { 'FormaDePago': "17", 'text': "17-Compensación" },
    { 'FormaDePago': "23", 'text': "23-Novación" },
    { 'FormaDePago': "24", 'text': "24-Confusión" },
    { 'FormaDePago': "25", 'text': "25-Remisión de deuda" },
    { 'FormaDePago': "26", 'text': "26-Prescripción o caducidad" },
    { 'FormaDePago': "27", 'text': "27-A satisfacción del acreedor" },
    { 'FormaDePago': "28", 'text': "28-Tarjeta de débito" },
    { 'FormaDePago': "29", 'text': "29-Tarjeta de servicios" },
    { 'FormaDePago': "30", 'text': "30-Aplicación de anticipos" },
    { 'FormaDePago': "31", 'text': "31-Intermediario pagos" },
    { 'FormaDePago': "99", 'text': "99-Por definir" }
  ];
  public listFP2: Array<Object> = [
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

  public listCFDI = [
    {'UsoDelCFDI': 'G01', 'text':'G01-Adquisición de mercancias'},
    { 'UsoDelCFDI': "G02", 'text': "G02-Devoluciones, descuentos o bonificaciones" },
    { 'UsoDelCFDI': "G03", 'text': "G03-Gastos en general" },
    { 'UsoDelCFDI': "I01", 'text': "I01-Construcciones" },
    { 'UsoDelCFDI': "I02", 'text': "I02-Mobilario y equipo de oficina por inversiones" },
    { 'UsoDelCFDI': "I03", 'text': "I03-Equipo de transporte" },
    { 'UsoDelCFDI': "I04", 'text': "I04-Equipo de computo y accesorios" },
    { 'UsoDelCFDI': "I05", 'text': "I05-Dados, troqueles, moldes, matrices y herramental" },
    { 'UsoDelCFDI': "I06", 'text': "I06-Comunicaciones telefónicas" },
    { 'UsoDelCFDI': "I07", 'text': "I07-Comunicaciones satelitales" },
    { 'UsoDelCFDI': "I08", 'text': "I08-Otra maquinaria y equipo" },
    { 'UsoDelCFDI': "D01", 'text': "D01-Honorarios médicos, dentales y gastos hospitalarios" },
    { 'UsoDelCFDI': "D02", 'text': "D02-Gastos médicos por incapacidad o discapacidad" },
    { 'UsoDelCFDI': "D03", 'text': "D03-Gastos funerales" },
    { 'UsoDelCFDI': "D04", 'text': "D04-Donativos" },
    { 'UsoDelCFDI': "D05", 'text': "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
    { 'UsoDelCFDI': "D06", 'text': "D06-Aportaciones voluntarias al SAR" },
    { 'UsoDelCFDI': "D07", 'text': "D07-Primas por seguros de gastos médicos" },
    { 'UsoDelCFDI': "D08", 'text': "D08-Gastos de transportación escolar obligatoria" },
    { 'UsoDelCFDI': "D09", 'text': "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
    { 'UsoDelCFDI': "D10", 'text': "D10-Pagos por servicios educativos (colegiaturas)" },
    { 'UsoDelCFDI': "P01", 'text': "P01-Por definir" }
  ] 


  public listCFDI2: Array<Object> = [
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

  public listMP = [
    { 'MetodoDePago': 'PUE', 'text': 'PUE-Pago en una sola exhibicion' },
    { 'MetodoDePago': 'PPD', 'text': 'PPD-Pago en parcialidades o diferido' }
  ];

  /* list Metodo Pago */
  public listMoneda= [
    { 'Moneda': 'MXN' },
    { 'Moneda': 'USD' }
  ];

  public listMP2: Array<Object> = [
    { MetodoDePago: 'PUE', text: 'PUE-Pago en una sola exhibicion' },
    { MetodoDePago: 'PPD', text: 'PPD-Pago en parcialidades o diferido' }
  ];

  /* list Metodo Pago */
  public listMoneda2: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];

  clienteLogin;
  Estatus: string;
  EstatusNota: string;
  FolioNotaCredito: number;
  Cdolar: string;
  ClienteNombre: any;
  IdApi: any;
  Moneda: string;

  subtotal: any;
  iva: any;
  total: any;
  ivaDlls: any;
  subtotalDlls: any;
  totalDlls: any;
  retiva: any;
  retivadlls: any
 
  subtotalT: any;
  ivaT: any;
  totalT: any;
  ivaDllsT: any;
  subtotalDllsT: any;
  totalDllsT: any;

  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;

  fechaVenc = new Date();
  listClientes: Cliente[] = [];

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;

  listDataTerceros: MatTableDataSource<any>;
  displayedColumnsTerceros: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sortterceros: MatSort;

  

  public loading = false;
  public loading2 = false;
  fileUrl;
  a = document.createElement('a');

  proceso: string;
  folioparam;
  idparam;
  xmlparam;

  json1 = new FacturaTimbre();
  numfact;
  estatusfact;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(
    public redhgSVC: RedhgfacturacionService,
    public location: Location,
    private dialog: MatDialog,
    public _MessageService: MessageService,
    private tipoCambio: TipoCambioService,
    public datepipe: DatePipe
  ) {
    this.redhgSVC.Moneda = 'MXN';
    console.log('Constr ' + this.redhgSVC.Moneda);
    this.redhgSVC.formData.Id = +localStorage.getItem('FacturaID')
   }

  ngOnInit() {
    console.log(localStorage.getItem("inicioCliente"));
    this.clienteLogin = localStorage.getItem("inicioCliente");
    console.log('this.clienteLogin: ', this.clienteLogin);
        // this.idFactura();
        // console.log(this.IdFactura);
        //this.listaempresas();
        this.resetForm();
        this.setfacturatimbre();
        this.dropdownRefresh();
        this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
        this.tipoDeCambio();
        //this.ObtenerUltimaNotaCreditoFactura();
        this.IniciarSaldo();
        //this.refreshNotaList();
        //this.refreshPagoCFDIList();
    
        console.log(this.redhgSVC.SaldoFacturaMXN +' || '+ this.redhgSVC.SaldoFacturaDLLS);
    
       /*  if (this.redhgSVC.Pedido=="1"){
          let event = {
            isUserInput: true
          }
    
          let query
    
          if (this.redhgSVC.rfcempresa==='PLA11011243A'){
    
            query = 'select * from cliente2 where IdClientes='+this.redhgSVC.formData.IdCliente
          }
          else if (this.redhgSVC.rfcempresa=='AIN140101ME3'){
            query = 'select * from cliente where IdClientes='+this.redhgSVC.formData.IdCliente
          }
    
          let consulta = {
            'consulta':query
          };
    
          this.redhgSVC.consultaRedhg(consulta).subscribe((res:any)=>{
            if (res.length>0){
    
              this.onSelectionChange(res[0], event)
            }
          })
    
    
          query = "insert into ovfactura values("+this.redhgSVC.formData.Id+","+this.redhgSVC.formData.OrdenDeCompra+")"
    
          consulta = {
            'consulta':query
          };
    
          this.redhgSVC.consultaRedhg(consulta).subscribe((res:any)=>{
           console.log(res);
          })
    
          
    
        } */
  }

  IniciarSaldo(){
    this.redhgSVC.SaldoFacturaDLLS = 0;
    this.redhgSVC.SaldoFacturaMXN = 0;
    // this.TipoCambioFactura = +this.service.formData.TipoDeCambio;
    // console.log(this.TipoCambioFactura);

  }

  tipoDeCambio() {
    // this.traerApi().subscribe(data => {
    this.Cdolar = this.tipoCambio.TipoCambio;
    // })
  }

  Regresar() {
    console.log(this.clienteLogin);
    this.location.back();
  /*   if (this.clienteLogin == 'true') {
      console.log('soy true');
      this.router.navigateByUrl('/facturacion');
      
    } else {
      console.log('soy false');      
      this.router.navigateByUrl('/facturacionCxc');
    } */
  }

  onSubmit(form: NgForm) {
    this.redhgSVC.formData.Tipo = 'Ingreso';
    this.redhgSVC.formData.Estatus = 'Guardada';
    this.redhgSVC.formData.Version = '3.3';
    // this.service.formData.Id = this.IdFactura;
    if (this.redhgSVC.formData.Moneda == 'USD') {
      this.redhgSVC.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.redhgSVC.formData.TipoDeCambio = '0';
    }
  
//updateFactura this.service.formData
let factura = this.redhgSVC.formData;

let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

let consulta = 'update redhgFactura2 set '+

"IdCliente = '"+factura.IdCliente+"',"+
"Serie= '"+factura.Serie +"',"+
"Folio= '"+factura.Folio +"',"+
"Tipo= '"+factura.Tipo +"',"+
"FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
"LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
"Certificado= '"+factura.Certificado +"',"+
"NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
"UUID= '"+factura.UUID +"',"+
"UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
"Subtotal= '"+factura.Subtotal +"',"+
"SubtotalDlls= '"+factura.SubtotalDlls +"',"+
"Descuento= '"+factura.Descuento +"',"+
"ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
"ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
"ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
"Total= '"+factura.Total +"',"+
"TotalDlls= '"+factura.TotalDlls +"',"+
"FormaDePago= '"+factura.FormaDePago +"',"+
"MetodoDePago= '"+factura.MetodoDePago +"',"+
"Cuenta= '"+factura.Cuenta +"',"+
"Moneda= '"+factura.Moneda +"',"+
"CadenaOriginal= '"+factura.CadenaOriginal +"',"+
"SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
"SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
"NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
"RFCDelPAC= '"+factura.RFCdelPAC +"',"+
"Observaciones= '"+factura.Observaciones +"',"+
"FechaVencimiento= '"+FechaVencimiento +"',"+
"OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
"TipoDeCambio= '"+factura.TipoDeCambio +"',"+
"FechaDeEntrega= '"+FechaDeEntrega +"',"+
"CondicionesDePago= '"+factura.CondicionesDePago +"',"+
"Vendedor = '"+factura.Vendedor +"',"+
"Estatus = '"+factura.Estatus +"',"+
"Ver ='', "+
"Usuario = '"+factura.Usuario+"'"+

"where "+
"Id ='"+ factura.Id+"';"
    this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
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

  resetForm(form?: NgForm) {
    // console.log(this.IdFactura);
    console.log('Empresa antes if',typeof(this.redhgSVC.empresa));
    if (typeof (this.redhgSVC.empresa)=== "undefined"){
      console.log('Entra');
      this.redhgSVC.empresa = JSON.parse(localStorage.getItem('Empresa'))
      this.redhgSVC.rfcempresa = this.redhgSVC.empresa.RFC;
    }
console.log('formdata',this.redhgSVC.formData);
console.log('RFC',this.redhgSVC.rfcempresa);
console.log('EMPRESA',this.redhgSVC.empresa);
let consulta = 'select * from redhgFactura2 where Id='+this.redhgSVC.formData.Id
/* getFacturaID  this.redhgSVC.formData.Id*/
    this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
      console.log(res[0]);

      this.redhgSVC.formData = res[0];
      //OBTENER LA INFORMACION DEL CLIENTE, EN ESPECIFICO EL NOMBRE DEL CLIENTE PARA PINTARLO EN EL FORMULARIO
      if (this.redhgSVC.formData.IdCliente != 0) {
        let consulta2 = 'select * from redhgCliente where IdClientes ='+this.redhgSVC.formData.IdCliente
        /* getfacturaclienteid  this.redhgSVC.formData.IdCliente*/
        this.redhgSVC.consultaRedhg(consulta2).subscribe(res => {
          this.ClienteNombre = res[0].Nombre;
          this.IdApi = res[0].IdApi;
        });
      }

      this.Estatus = this.redhgSVC.formData.Estatus;
      if (this.Estatus === 'Timbrada' || this.Estatus === 'Cancelada') {
        let nodes = document.getElementById('div1').getElementsByTagName('*');
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].setAttribute('disabled', 'true')
        }
      }

      this.onMoneda();
    });

  }

  onMoneda() {
    this.Moneda = this.redhgSVC.formData.Moneda;
    this.redhgSVC.Moneda = this.Moneda;
    console.log(this.redhgSVC.Moneda);
  }

  IniciarTotales() {
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.subtotalDlls = 0;
    this.totalDlls = 0;
    this.ivaDlls = 0;
    this.retiva = 0;
    this.retivadlls = 0;

  }

  IniciarTotalesT() {
    this.subtotalT = 0;
    this.ivaT = 0;
    this.totalT = 0;
    this.subtotalDllsT = 0;
    this.totalDllsT = 0;
    this.ivaDllsT = 0;

  }

  onSelectionChange(cliente: Cliente, event: any) {
    console.log(event);
    if (event.isUserInput) {

      /* this.service.formData.IdCliente = cliente.id */

      this.fechaVenc = new Date(this.redhgSVC.formData.FechaDeExpedicion)
      console.log(this.fechaVenc);

      console.log(cliente);
      this.redhgSVC.formData.IdCliente = cliente.IdClientes;
      console.log(this.redhgSVC.formData);
      this.ClienteNombre = cliente.Nombre;
      this.IdApi = cliente.IdApi;
      this.redhgSVC.formData.UsoDelCFDI = cliente.UsoCFDI;
      this.redhgSVC.formData.FormaDePago = cliente.MetodoPago;
      this.redhgSVC.formData.CondicionesDePago = cliente.DiasCredito + ' Dias Credito';
      this.fechaVenc.setDate(this.fechaVenc.getDate() + parseInt(cliente.DiasCredito))
      this.redhgSVC.formData.FechaVencimiento = new Date(this.fechaVenc)
      // this.service.formData.FechaVencimiento.setDate(this.service.formData.FechaVencimiento.getDate()+parseFloat(cliente.DiasCredito))
      console.log(this.fechaVenc);
      // this.service.formData.Vendedor = cliente.Vendedor
      let consulta='select * from Vendedor where IdVendedor = '+cliente.Vendedor
      /* getvendedor cliente.Vendedpr */
      this.redhgSVC.consultaRedhg(consulta).subscribe(data => {
        console.log(data);

        this.redhgSVC.formData.Vendedor = data[0].Nombre;

      })


      if (this.redhgSVC.formData.FormaDePago == '99' || this.redhgSVC.formData.FormaDePago == '') {
        this.redhgSVC.formData.MetodoDePago = 'PPD';
      } else {
        this.redhgSVC.formData.MetodoDePago = 'PUE';
      }
    }

  }


  nuevoCliente(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    let dl = this.dialog.open(RedhgaddeditclientesComponent, dialogConfig);

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

  dropdownRefresh() {
    let consulta="select * from redhgCliente where IdApi <> '' and Estatus ='Activo' order by Nombre"
    /* getDepDropDownValues */

    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
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

  private _filter(value: any): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.ClaveCliente.toString().includes(filterValue));
  }

  MonedaSelected(event: any) {
    this.Moneda = event.target.selectedOptions[0].text;
    this.redhgSVC.Moneda = this.Moneda;
    this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
  }

  refreshDetallesFacturaList() {
    // this.idFactura();
    this.IniciarTotales();
    let tasa;
    // console.log(this.IdFactura+'XXXXXXXXXXXX');
    console.log(this.redhgSVC.formData.Id + '-yyyyyyyyyyy');
    // this.service.getDetallesFacturaList(this.IdFactura).subscribe(data => {
      let consulta='select * from redhgDetalleFactura2 where IdFactura ='+this.redhgSVC.formData.Id
      /*  getDetallesFacturaList this.redhgSVC.formData.Id */
    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
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
        
        if (data[i].ImporteIVARet != 'NaN') {
          this.retiva = this.retiva + parseFloat(data[i].ImporteIVARet);
        } else {
          this.retiva = this.retiva + 0;
        }
        this.total = this.iva + this.subtotal - this.retiva;
      }
      console.log(this.subtotal);
      for (let i = 0; i < data.length; i++) {
        this.subtotalDlls = this.subtotalDlls + parseFloat(data[i].ImporteDlls);
        if (data[i].ImporteIVADlls != 'NaN') {
          this.ivaDlls = this.ivaDlls + parseFloat(data[i].ImporteIVADlls);
        } else {
          this.ivaDlls = this.ivaDlls + 0;
        }
        if (data[i].ImporteIVARetDlls != 'NaN') {
          this.retivadlls = this.retivadlls + parseFloat(data[i].ImporteIVARetDlls);
        } else {
          this.retivadlls = this.retivadlls + 0;
        }
        this.totalDlls = +this.ivaDlls + +this.subtotalDlls - +this.retivadlls;
      }
      console.log(this.iva);
      console.log(this.total);
      this.redhgSVC.formData.Subtotal = this.subtotal;
      this.redhgSVC.formData.ImpuestosTrasladados = (parseFloat(this.iva).toFixed(6));
      this.redhgSVC.formData.ImpuestosRetenidos = (parseFloat(this.retiva).toFixed(6));
      this.redhgSVC.formData.Total = (parseFloat(this.total).toFixed(6))
      this.redhgSVC.formData.SubtotalDlls = this.subtotalDlls;
      this.redhgSVC.formData.ImpuestosTrasladadosDlls = this.ivaDlls;
      
      this.redhgSVC.formData.TotalDlls = this.totalDlls;
      console.log(this.redhgSVC.formData);
      // console.log(this.service.formData);
     /*  let fecha = new Date(this.service.formData.FechaDeEntrega)
      fecha.setHours(fecha.getHours()-6)
      this.service.formData.FechaDeEntrega = new Date(fecha)
      let fecha2 = new Date(this.service.formData.FechaDeExpedicion)
      fecha2.setHours(fecha2.getHours()-6)
      this.service.formData.FechaDeExpedicion = new Date(fecha2)
      let fecha3 = new Date(this.service.formData.FechaVencimiento)
      fecha3.setHours(fecha3.getHours()-6)
      this.service.formData.FechaVencimiento = new Date(fecha3) */
let factura = this.redhgSVC.formData;

let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

let consulta2 = 'update redhgFactura2 set '+

"IdCliente = '"+factura.IdCliente+"',"+
"Serie= '"+factura.Serie +"',"+
"Folio= '"+factura.Folio +"',"+
"Tipo= '"+factura.Tipo +"',"+
"FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
"LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
"Certificado= '"+factura.Certificado +"',"+
"NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
"UUID= '"+factura.UUID +"',"+
"UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
"Subtotal= '"+factura.Subtotal +"',"+
"SubtotalDlls= '"+factura.SubtotalDlls +"',"+
"Descuento= '"+factura.Descuento +"',"+
"ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
"ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
"ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
"Total= '"+factura.Total +"',"+
"TotalDlls= '"+factura.TotalDlls +"',"+
"FormaDePago= '"+factura.FormaDePago +"',"+
"MetodoDePago= '"+factura.MetodoDePago +"',"+
"Cuenta= '"+factura.Cuenta +"',"+
"Moneda= '"+factura.Moneda +"',"+
"CadenaOriginal= '"+factura.CadenaOriginal +"',"+
"SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
"SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
"NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
"RFCDelPAC= '"+factura.RFCdelPAC +"',"+
"Observaciones= '"+factura.Observaciones +"',"+
"FechaVencimiento= '"+FechaVencimiento +"',"+
"OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
"TipoDeCambio= '"+factura.TipoDeCambio +"',"+
"FechaDeEntrega= '"+FechaDeEntrega +"',"+
"CondicionesDePago= '"+factura.CondicionesDePago +"',"+
"Vendedor = '"+factura.Vendedor +"',"+
"Estatus = '"+factura.Estatus +"',"+
"Ver ='', "+
"Usuario = '"+factura.Usuario+"'"+

"where "+
"Id ='"+ factura.Id+"';"
      

/*   updateFactura  this.redhgSVC.formData*/
console.log(consulta2);
      this.redhgSVC.consultaRedhg(consulta2).subscribe(res => {
        console.log(res);

      }
      );
      this.SaldoSumatoria();
    });

  }

  SaldoSumatoria(){
    this.redhgSVC.SaldoFacturaMXN = 0;
    this.redhgSVC.SaldoFacturaDLLS = 0;
    
    console.log('---------------------------------------');
   
    this.redhgSVC.SaldoFacturaMXN = +this.redhgSVC.formData.Total - this.redhgSVC.SaldoFacturaMXN;
    this.redhgSVC.SaldoFacturaDLLS = +this.redhgSVC.formData.TotalDlls - this.redhgSVC.SaldoFacturaDLLS;
    
    if(this.redhgSVC.SaldoFacturaMXN<0){
      this.redhgSVC.SaldoFacturaMXN=0;
    }
    if(this.redhgSVC.SaldoFacturaDLLS<0){
      this.redhgSVC.SaldoFacturaDLLS=0
    
    }

    
    
    
    }

 /*    SaldoSumatoriaT(){
      this.redhgSVC.SaldoFacturaMXNT = 0;
      this.redhgSVC.SaldoFacturaDLLST = 0;
      
      console.log('---------------------------------------');
     
      this.redhgSVC.SaldoFacturaMXNT = +this.redhgSVC.formData.Total - this.redhgSVC.SaldoFacturaMXNT;
      this.redhgSVC.SaldoFacturaDLLST = +this.redhgSVC.formData.TotalDlls - this.redhgSVC.SaldoFacturaDLLST;
      
      if(this.redhgSVC.SaldoFacturaMXN<0){
        this.redhgSVC.SaldoFacturaMXN=0;
      }
      if(this.redhgSVC.SaldoFacturaDLLS<0){
        this.redhgSVC.SaldoFacturaDLLS=0
      
      }
  
      
      
      
      }
 */
    onAddProducto() {

      this.redhgSVC.formData.Tipo = 'Ingreso';
      this.redhgSVC.formData.Estatus = 'Guardada';
      this.redhgSVC.formData.Version = '3.3';
      // this.service.formData.Id = this.IdFactura;
      if (this.redhgSVC.formData.Moneda == 'USD') {
        this.redhgSVC.formData.TipoDeCambio = this.Cdolar;
      } else {
        this.redhgSVC.formData.TipoDeCambio = '0';
      }
     /*  let fecha = new Date(this.service.formData.FechaDeEntrega)
      fecha.setHours(fecha.getHours()-6)
      this.service.formData.FechaDeEntrega = new Date(fecha)
      let fecha2 = new Date(this.service.formData.FechaDeExpedicion)
      fecha2.setHours(fecha2.getHours()-6)
      this.service.formData.FechaDeExpedicion = new Date(fecha2)
      let fecha3 = new Date(this.service.formData.FechaVencimiento)
      fecha3.setHours(fecha3.getHours()-6)
      this.service.formData.FechaVencimiento = new Date(fecha3) */

      let factura = this.redhgSVC.formData;
      let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

let consulta = 'update redhgFactura2 set '+

"IdCliente = '"+factura.IdCliente+"',"+
"Serie= '"+factura.Serie +"',"+
"Folio= '"+factura.Folio +"',"+
"Tipo= '"+factura.Tipo +"',"+
"FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
"LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
"Certificado= '"+factura.Certificado +"',"+
"NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
"UUID= '"+factura.UUID +"',"+
"UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
"Subtotal= '"+factura.Subtotal +"',"+
"SubtotalDlls= '"+factura.SubtotalDlls +"',"+
"Descuento= '"+factura.Descuento +"',"+
"ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
"ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
"ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
"Total= '"+factura.Total +"',"+
"TotalDlls= '"+factura.TotalDlls +"',"+
"FormaDePago= '"+factura.FormaDePago +"',"+
"MetodoDePago= '"+factura.MetodoDePago +"',"+
"Cuenta= '"+factura.Cuenta +"',"+
"Moneda= '"+factura.Moneda +"',"+
"CadenaOriginal= '"+factura.CadenaOriginal +"',"+
"SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
"SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
"NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
"RFCDelPAC= '"+factura.RFCdelPAC +"',"+
"Observaciones= '"+factura.Observaciones +"',"+
"FechaVencimiento= '"+FechaVencimiento +"',"+
"OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
"TipoDeCambio= '"+factura.TipoDeCambio +"',"+
"FechaDeEntrega= '"+FechaDeEntrega +"',"+
"CondicionesDePago= '"+factura.CondicionesDePago +"',"+
"Vendedor = '"+factura.Vendedor +"',"+
"Estatus = '"+factura.Estatus +"',"+
"Ver ='', "+
"Usuario = '"+factura.Usuario+"'"+

"where "+
"Id ='"+ factura.Id+"';"
      /*  updateFactura this.redhgSVC.formData*/
  
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        console.log(res);
  
      }
      );
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      /* checar esta linea */
      dialogConfig.data = {
        movimiento: 'Agregar'
      }
      let dl = this.dialog.open(RedhgaddeditproductosfacturaComponent, dialogConfig);

      dl.afterClosed().toPromise().then(resp=>{
        console.log(resp);
        this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
      })
    }

    onEdit(detalleFactura: redhgDetalleFactura) {
      this.redhgSVC.formDataDF = detalleFactura;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      /* checar esta linea */
      /* this.dialog.open(FacturacioncxcEditProductoComponent, dialogConfig); */
      dialogConfig.data = {
        movimiento: 'Editar'
      }
      let dl = this.dialog.open(RedhgaddeditproductosfacturaComponent, dialogConfig);

      dl.afterClosed().toPromise().then(resp=>{
        console.log(resp);
        this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
      })
    }

    onDelete(id: number) {
      Swal.fire({
        title: '¿Seguro de Borrar Concepto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          let consulta='delete from redhgDetalleFactura2 where IdDetalle = '+id
          /*  deleteDetalleFactura id*/
          this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
            this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
  
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


    dxml(id: string, folio: string) {
      this.loading = true;
      // document.getElementById('enviaremail').click();
      // let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
      this.redhgSVC.xml(id).subscribe(data => {
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
        
       
        this.dialog.open(RedhgfacturaComponent, dialogConfig);
  
        setTimeout(()=>{
          this.onExportClick(folio);    
          this.dialog.closeAll();
          
         },1000)
      
    
    }

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
        
       
        this.dialog.open(RedhgfacturaComponent, dialogConfig);
    }

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
          this.redhgSVC.cancelar(id).subscribe(data => {
            let data2 = JSON.parse(data);
            if (data2.response === 'success') {

              let consulta = "update redhgFactura2 set Estatus='Cancelada' where Id="+this.redhgSVC.formData.Id
              /*  updateCancelarFactura(this.service.formData.Id)*/
              
              this.redhgSVC.consultaRedhg(consulta).subscribe(data => {
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

    email(id: string, folio: string) {

      localStorage.removeItem('xml' + folio);
      localStorage.removeItem('pdf' + folio);
      document.getElementById('enviaremail2').click();
  
      this.folioparam = folio;
      this.idparam = id;
      this._MessageService.correo = '';
      this._MessageService.cco = '';
      this._MessageService.asunto = 'Envio Factura ' + folio;
      this._MessageService.cuerpo = 'Se ha enviado un comprobante fiscal digital con folio ' + folio;
      this._MessageService.nombre = 'Abarrotodo';
  
      this.redhgSVC.xml(id).subscribe(data => {
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


    acuse(fact){
      console.log(fact);
      /* const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width="70%";
      let dl = this.dialog.open(AcusecancelacionComponent, dialogConfig);
   */
      
  
  this.redhgSVC.acuseCancelacion(fact.UUID).subscribe((data:any)=>{
    console.log(data);
  
  
    let resp = data
    // let resp = JSON.parse(data)
    if (data.response=='success'){
      console.log(resp.respuestaapi.acuse);
      localStorage.setItem('xml',resp.respuestaapi.acuse)
    }else{
      console.log(resp.acuse);
      localStorage.setItem('xml',resp.acuse)
    }
    
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
      if (result.Acuse.Folios[0].EstatusUUID[0]=='201'){
        estatus='Cancelado'
      }else{
        estatus='Estimado cliente se ha enviado la solicitud de cancelación al receptor'
      }
      // estatus = resp.message;
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
      this.redhgSVC.formData.Estatus = 'Pagada'
  
      // console.log('fact',fact);
      // console.log('service',this.service.formData);

      let factura = this.redhgSVC.formData;

      let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

      let consulta = 'update redhgFactura2 set '+

      "IdCliente = '"+factura.IdCliente+"',"+
      "Serie= '"+factura.Serie +"',"+
      "Folio= '"+factura.Folio +"',"+
      "Tipo= '"+factura.Tipo +"',"+
      "FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
      "LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
      "Certificado= '"+factura.Certificado +"',"+
      "NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
      "UUID= '"+factura.UUID +"',"+
      "UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
      "Subtotal= '"+factura.Subtotal +"',"+
      "SubtotalDlls= '"+factura.SubtotalDlls +"',"+
      "Descuento= '"+factura.Descuento +"',"+
      "ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
      "ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
      "ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
      "Total= '"+factura.Total +"',"+
      "TotalDlls= '"+factura.TotalDlls +"',"+
      "FormaDePago= '"+factura.FormaDePago +"',"+
      "MetodoDePago= '"+factura.MetodoDePago +"',"+
      "Cuenta= '"+factura.Cuenta +"',"+
      "Moneda= '"+factura.Moneda +"',"+
      "CadenaOriginal= '"+factura.CadenaOriginal +"',"+
      "SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
      "SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
      "NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
      "RFCDelPAC= '"+factura.RFCdelPAC +"',"+
      "Observaciones= '"+factura.Observaciones +"',"+
      "FechaVencimiento= '"+FechaVencimiento +"',"+
      "OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
      "TipoDeCambio= '"+factura.TipoDeCambio +"',"+
      "FechaDeEntrega= '"+FechaDeEntrega +"',"+
      "CondicionesDePago= '"+factura.CondicionesDePago +"',"+
      "Vendedor = '"+factura.Vendedor +"',"+
      "Estatus = '"+factura.Estatus +"',"+
      "Ver ='', "+
      "Usuario = '"+factura.Usuario+"'"+
      
      "where "+
      "Id ='"+ factura.Id+"';"

      /*  updateFactura(this.redhgSVC.formData) */
  
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
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
      this.redhgSVC.formData.Estatus = 'Timbrada'
  
      // console.log('fact',fact);
      // console.log('service',this.service.formData);

      let factura = this.redhgSVC.formData;

      let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

      let consulta = 'update redhgFactura2 set '+

      "IdCliente = '"+factura.IdCliente+"',"+
      "Serie= '"+factura.Serie +"',"+
      "Folio= '"+factura.Folio +"',"+
      "Tipo= '"+factura.Tipo +"',"+
      "FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
      "LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
      "Certificado= '"+factura.Certificado +"',"+
      "NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
      "UUID= '"+factura.UUID +"',"+
      "UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
      "Subtotal= '"+factura.Subtotal +"',"+
      "SubtotalDlls= '"+factura.SubtotalDlls +"',"+
      "Descuento= '"+factura.Descuento +"',"+
      "ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
      "ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
      "ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
      "Total= '"+factura.Total +"',"+
      "TotalDlls= '"+factura.TotalDlls +"',"+
      "FormaDePago= '"+factura.FormaDePago +"',"+
      "MetodoDePago= '"+factura.MetodoDePago +"',"+
      "Cuenta= '"+factura.Cuenta +"',"+
      "Moneda= '"+factura.Moneda +"',"+
      "CadenaOriginal= '"+factura.CadenaOriginal +"',"+
      "SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
      "SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
      "NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
      "RFCDelPAC= '"+factura.RFCdelPAC +"',"+
      "Observaciones= '"+factura.Observaciones +"',"+
      "FechaVencimiento= '"+FechaVencimiento +"',"+
      "OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
      "TipoDeCambio= '"+factura.TipoDeCambio +"',"+
      "FechaDeEntrega= '"+FechaDeEntrega +"',"+
      "CondicionesDePago= '"+factura.CondicionesDePago +"',"+
      "Vendedor = '"+factura.Vendedor +"',"+
      "Estatus = '"+factura.Estatus +"',"+
      "Ver ='', "+
      "Usuario = '"+factura.Usuario+"'"+
      
      "where "+
      "Id ='"+ factura.Id+"';"

      /*  updateFactura(this.redhgSVC.formData) */
  
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
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

    timbrar(form: NgForm) {

      this.loading = true;
      document.getElementById('enviaremail').click();
      this.redhgSVC.formData.Tipo = 'Ingreso';
      this.redhgSVC.formData.Estatus = 'Guardada';
      this.redhgSVC.formData.Version = '3.3';
      //this.service.formData.Serie = '5628';
      
  
        this.redhgSVC.formData.Serie = '547096';
      
        
      
      
      
      if (this.redhgSVC.formData.Moneda == 'USD') {
        this.redhgSVC.formData.TipoDeCambio = this.Cdolar;
      } else {
        this.redhgSVC.formData.TipoDeCambio = '0';
      }
      // this.service.formData.Id = +this.IdFactura;
   /*    let fecha = new Date(this.service.formData.FechaDeEntrega)
      fecha.setHours(fecha.getHours()-6)
      this.service.formData.FechaDeEntrega = new Date(fecha)
      let fecha2 = new Date(this.service.formData.FechaDeExpedicion)
      fecha2.setHours(fecha2.getHours()-6)
      this.service.formData.FechaDeExpedicion = new Date(fecha2)
      let fecha3 = new Date(this.service.formData.FechaVencimiento)
      fecha3.setHours(fecha3.getHours()-6)
      this.service.formData.FechaVencimiento = new Date(fecha3) */

      let factura = this.redhgSVC.formData;

      let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

      let consulta = 'update redhgFactura2 set '+

      "IdCliente = '"+factura.IdCliente+"',"+
      "Serie= '"+factura.Serie +"',"+
      "Folio= '"+factura.Folio +"',"+
      "Tipo= '"+factura.Tipo +"',"+
      "FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
      "LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
      "Certificado= '"+factura.Certificado +"',"+
      "NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
      "UUID= '"+factura.UUID +"',"+
      "UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
      "Subtotal= '"+factura.Subtotal +"',"+
      "SubtotalDlls= '"+factura.SubtotalDlls +"',"+
      "Descuento= '"+factura.Descuento +"',"+
      "ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
      "ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
      "ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
      "Total= '"+factura.Total +"',"+
      "TotalDlls= '"+factura.TotalDlls +"',"+
      "FormaDePago= '"+factura.FormaDePago +"',"+
      "MetodoDePago= '"+factura.MetodoDePago +"',"+
      "Cuenta= '"+factura.Cuenta +"',"+
      "Moneda= '"+factura.Moneda +"',"+
      "CadenaOriginal= '"+factura.CadenaOriginal +"',"+
      "SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
      "SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
      "NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
      "RFCDelPAC= '"+factura.RFCdelPAC +"',"+
      "Observaciones= '"+factura.Observaciones +"',"+
      "FechaVencimiento= '"+FechaVencimiento +"',"+
      "OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
      "TipoDeCambio= '"+factura.TipoDeCambio +"',"+
      "FechaDeEntrega= '"+FechaDeEntrega +"',"+
      "CondicionesDePago= '"+factura.CondicionesDePago +"',"+
      "Vendedor = '"+factura.Vendedor +"',"+
      "Estatus = '"+factura.Estatus +"',"+
      "Ver ='', "+
      "Usuario = '"+factura.Usuario+"'"+
      
      "where "+
      "Id ='"+ factura.Id+"';"
      /*  updateFactura(this.redhgSVC.formData)*/


      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        console.log(this.redhgSVC.formData);
        this.resetForm(form);
        this.IniciarTotales();
        this.crearjsonfactura(this.redhgSVC.formData.Id);
  
  
        this.redhgSVC.saldos.Folio = this.redhgSVC.formData.Folio;
        this.redhgSVC.saldos.SaldoPendiente = this.redhgSVC.formData.Total;

        //let consulta2=''
  /* addSaldos(this.redhgSVC.saldos) */
        //this.redhgSVC.consultaRedhg(consulta2)
      }
  
      // this.service.addSaldos(  )
      );
  
    }


    crearjsonfactura(id: number): string {
      let cadena: string;
let consulta='Select redhgFactura2.* ,redhgCliente.* from redhgFactura2 LEFT JOIN redhgCliente ON redhgFactura2.IdCliente = redhgCliente.IdClientes where id ='+id

/* getFacturasClienteID(id) */

      this.redhgSVC.consultaRedhg(consulta).subscribe(data => {
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
          this.json1.Impuestos.Retenidos.pop();
          this.json1.Impuestos.Retenidos.push({
            "Base": data[0].Subtotal,
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.04",
            "Importe": data[0].ImpuestosRetenidos
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
          this.json1.Impuestos.Retenidos.pop();
          this.json1.Impuestos.Retenidos.push({
            "Base": data[0].SubtotalDlls,
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.04",
            "Importe": (+data[0].ImpuestosRetenidos * +data[0].TipoDeCambio).toFixed(4)
          });
  
        }
        this.json1.TipoDocumento = 'factura';
  
        
        this.json1.Impuestos.Locales.pop();
        this.json1.CfdiRelacionados.TipoRelacion = '';
        this.json1.CfdiRelacionados.UUID.push();
        this.json1.UsoCFDI = data[0].UsoDelCFDI;
        this.json1.Serie = data[0].Serie;
        this.json1.FormaPago = data[0].FormaDePago;
        this.json1.MetodoPago = data[0].MetodoDePago;
  
        this.json1.EnviarCorreo = false;

        let consulta2="select redhgDetalleFactura2.*, redhgProducto.* from redhgDetalleFactura2 LEFT JOIN redhgProducto on SUBSTRING(redhgDetalleFactura2.ClaveProducto,1,2)=redhgProducto.ClaveProducto where IdFactura ="+id

/* getDetallesFacturaListProducto(id) */

        this.redhgSVC.consultaRedhg(consulta2).subscribe((data:any) => {
          console.log('PRODUCTOS',data)
          let IVAproducto = '0';
          let RetIVAproducto = '0';
          this.json1.Conceptos.pop();
          if (this.json1.Moneda == 'MXN') {
            for (let i = 0; i < data.length; i++) {
              if (data[i].ImporteIVA=='0.0000'){
                IVAproducto = '0';
  
              }else{
                IVAproducto = '0.16'
              }
              if (data[i].ImporteIVARet=='0.0000'){
                RetIVAproducto = '0';
  
              }else{
                RetIVAproducto = '0.04'
              }
              this.json1.Conceptos.push({
                ClaveProdServ: data[i].ClaveSAT,
                NoIdentificacion: data[i].ClaveProducto,
                Cantidad: data[i].Cantidad,
                ClaveUnidad: data[i].Unidad,
                Unidad: data[i].Unidad,
                Descripcion: data[i].Producto + ' ' + data[i].Observaciones,
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
                    TasaOCuota: IVAproducto,
                    Importe: ((parseFloat(data[i].Importe) * parseFloat(IVAproducto)).toFixed(6)).toString()
                  }],
                  Retenidos: [{
                    Base: data[i].Importe,
                    Impuesto: '002',
                    TipoFactor: 'Tasa',
                    TasaOCuota: RetIVAproducto,
                    Importe: ((parseFloat(data[i].Importe) * parseFloat(RetIVAproducto)).toFixed(6)).toString()
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
              if (data[i].ImporteIVADlls=='0.0000'){
                IVAproducto = '0';
  
              }else{
                IVAproducto = '0.16'
              }
              if (data[i].ImporteIVARetDlls=='0.0000'){
                RetIVAproducto = '0';
  
              }else{
                RetIVAproducto = '0.04'
              }
              this.json1.Conceptos.push({
                ClaveProdServ: data[i].ClaveSAT,
                NoIdentificacion: data[i].ClaveProducto,
                Cantidad: data[i].Cantidad,
                ClaveUnidad: data[i].Unidad,
                Unidad: data[i].Unidad,
                Descripcion: data[i].Producto,
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
                    TasaOCuota: IVAproducto,
                    Importe: ((parseFloat(data[i].ImporteDlls) * parseFloat(IVAproducto)).toFixed(6)).toString()
                  }],
                  Retenidos: [{
                    Base: data[i].ImporteDlls,
                    Impuesto: '002',
                    TipoFactor: 'Tasa',
                    TasaOCuota: RetIVAproducto,
                    Importe: ((parseFloat(data[i].ImporteDlls) * parseFloat(RetIVAproducto)).toFixed(6)).toString()
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
          console.log(this.json1)
        })
      });
      return cadena;
    }

    enviar(cadena: string) {
      console.log(cadena);
      this.redhgSVC.enviarFactura(cadena).subscribe(resp => {
        let data = JSON.parse(resp)
        console.log(data);
        if (data.response === 'success') {
          this.redhgSVC.formData.LugarDeExpedicion = '31203';
          this.redhgSVC.formData.NumeroDeCertificado = '00001000000403628664';
          // tslint:disable-next-line: max-line-length
          this.redhgSVC.formData.Certificado = 'MIIGbDCCBFSgAwIBAgIUMDAwMDEwMDAwMDA0MDM2Mjg2NjQwDQYJKoZIhvcNAQELBQAwggGyMTgwNgYDVQQDDC9BLkMuIGRlbCBTZXJ2aWNpbyBkZSBBZG1pbmlzdHJhY2nDs24gVHJpYnV0YXJpYTEvMC0GA1UECgwmU2VydmljaW8gZGUgQWRtaW5pc3RyYWNpw7NuIFRyaWJ1dGFyaWExODA2BgNVBAsML0FkbWluaXN0cmFjacOzbiBkZSBTZWd1cmlkYWQgZGUgbGEgSW5mb3JtYWNpw7NuMR8wHQYJKoZIhvcNAQkBFhBhY29kc0BzYXQuZ29iLm14MSYwJAYDVQQJDB1Bdi4gSGlkYWxnbyA3NywgQ29sLiBHdWVycmVybzEOMAwGA1UEEQwFMDYzMDAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBEaXN0cml0byBGZWRlcmFsMRQwEgYDVQQHDAtDdWF1aHTDqW1vYzEVMBMGA1UELRMMU0FUOTcwNzAxTk4zMV0wWwYJKoZIhvcNAQkCDE5SZXNwb25zYWJsZTogQWRtaW5pc3RyYWNpw7NuIENlbnRyYWwgZGUgU2VydmljaW9zIFRyaWJ1dGFyaW9zIGFsIENvbnRyaWJ1eWVudGUwHhcNMTYwOTA4MjAyMTE0WhcNMjAwOTA4MjAyMTE0WjCCAQsxLzAtBgNVBAMTJlBSTyBMQUNUT0lOR1JFRElFTlRFUyBTIERFIFJMIE1JIERFIENWMS8wLQYDVQQpEyZQUk8gTEFDVE9JTkdSRURJRU5URVMgUyBERSBSTCBNSSBERSBDVjEvMC0GA1UEChMmUFJPIExBQ1RPSU5HUkVESUVOVEVTIFMgREUgUkwgTUkgREUgQ1YxJTAjBgNVBC0THFBMQTExMDExMjQzQSAvIE1FVlA3MTA3MTE0UTAxHjAcBgNVBAUTFSAvIE1FVlA3MTA3MTFIREZEWkQwMjEvMC0GA1UECxMmUFJPIExBQ1RPSU5HUkVESUVOVEVTIFMgREUgUkwgTUkgREUgQ1YwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCNOCY+J2gRGKuI+rAsJYWugQhC6urg8kBa1AYCBd7zWlV+U5QwJqBO3Ty7JEPZVlLIv1zVkee0oS/0f0XatowPcnsJcGNayK9ZzwbvZJ92jJ9Z5lVDbwAZB/LVuYZaqJTJLdkEtW8UOQgZmqxM4I4XE8J6PGXNYIcBlspDkKlAXHon6wUQo0MgXO+Ybq0eh5IileNTljVhldKJtQ/rkVYiWvTkmwl6vzvwynoYk7Otcldk66t5Mbrpkeq6C+gN+Tt/thduZLs9yA6yQYFzh6EwQrBWBTbgg9xLa+Y0whofI6miXzwJQVUwNzIdyCY3rmTKACAkBYkz0p/gB8+TRDV1AgMBAAGjHTAbMAwGA1UdEwEB/wQCMAAwCwYDVR0PBAQDAgbAMA0GCSqGSIb3DQEBCwUAA4ICAQAN083EEgMdigngBiQylCR+VxzzEDhcrKi/+T8zcMjhVd/lPBEP3Q6SpZQzU4lTpxksDMKPGTdFus0g28vHaeeGOeG0wXaLw0D/psVTdP8A8gDZdWLYeMqrIdyua9oIKKtILNiO54FXY7sTtyAkAFA3Ih3Pt8ad3WxYsNTHyixsaqpP5KqtjW92N3iUV7NmnsKoLKgt242dhGaFXJKtPNjdiNisOoCVqYMmgtoAmlzjQB9+gwgz75B1CMvm68UIh+B5THGppnWHbIc5zln7KC6d8W2OIVypmAhWirUOUVWZou41+lXqkAnNPSLYjv4LO/lFQi3eJo17qrVMRqGZZxduVgv709uqka+XqFe5eecfdxCt1/5VqbgPGoYs89bQI907YlzYeyBfhjymUlEOtcQpBg6i6ILp49FrxDnruq8Yj/Q+n/QaO20F3yfYULt73+mIaHqYQWqvpOfOA1QVQbAli6f4hZ1kwAoVpqwA2Wt1a0B2i5QoRKWvKDaSob3Mw4UePCNk+zwek44YqD60yL4jLHWny6gCLYYdApw2ZD18igJ2jcc2JzawBLiG/I7SruCg04PgeNOpzGeWiEGeVq7HUrOp6RS8apBOSFpAKhpu+6jGv9IXVZBKm8SBTVLf4BrcQqazUZcOxqSXV9QtyDHjHb3Sb8G3dmxCxt8l9mYNTA==';
          this.redhgSVC.formData.UUID = data.UUID;
          this.redhgSVC.formData.CadenaOriginal = '||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
          this.redhgSVC.formData.SelloDigitalSAT = data.SAT.SelloSAT;
          this.redhgSVC.formData.SelloDigitalCFDI = data.SAT.SelloCFD;
          this.redhgSVC.formData.NumeroDeSelloSAT = data.SAT.NoCertificadoSAT;
          this.redhgSVC.formData.RFCdelPAC = 'LSO1306189R5';
          this.redhgSVC.formData.Serie = data.INV.Serie;
          this.redhgSVC.formData.Folio = data.INV.Folio;
  
          if (this.redhgSVC.formData.MetodoDePago=='PUE'){
            this.redhgSVC.formData.Estatus = 'Pagada';
          }else{
  
            this.redhgSVC.formData.Estatus = 'Timbrada';
          }
  
          
          this.numfact = data.UUID;
          /* let fecha = new Date(this.service.formData.FechaDeEntrega)
          fecha.setHours(fecha.getHours()-6)
          this.service.formData.FechaDeEntrega = new Date(fecha)
          let fecha2 = new Date(this.service.formData.FechaDeExpedicion)
          fecha2.setHours(fecha2.getHours()-6)
          this.service.formData.FechaDeExpedicion = new Date(fecha2)
          let fecha3 = new Date(this.service.formData.FechaVencimiento)
          fecha3.setHours(fecha3.getHours()-6)
          this.service.formData.FechaVencimiento = new Date(fecha3)
          console.log(this.service.formData); */

          let factura = this.redhgSVC.formData;

          let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

          let consulta2 ='update redhgFactura2 set '+

          "IdCliente = '"+factura.IdCliente+"',"+
          "Serie= '"+factura.Serie +"',"+
          "Folio= '"+factura.Folio +"',"+
          "Tipo= '"+factura.Tipo +"',"+
          "FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
          "LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
          "Certificado= '"+factura.Certificado +"',"+
          "NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
          "UUID= '"+factura.UUID +"',"+
          "UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
          "Subtotal= '"+factura.Subtotal +"',"+
          "SubtotalDlls= '"+factura.SubtotalDlls +"',"+
          "Descuento= '"+factura.Descuento +"',"+
          "ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
          "ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
          "ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
          "Total= '"+factura.Total +"',"+
          "TotalDlls= '"+factura.TotalDlls +"',"+
          "FormaDePago= '"+factura.FormaDePago +"',"+
          "MetodoDePago= '"+factura.MetodoDePago +"',"+
          "Cuenta= '"+factura.Cuenta +"',"+
          "Moneda= '"+factura.Moneda +"',"+
          "CadenaOriginal= '"+factura.CadenaOriginal +"',"+
          "SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
          "SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
          "NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
          "RFCDelPAC= '"+factura.RFCdelPAC +"',"+
          "Observaciones= '"+factura.Observaciones +"',"+
          "FechaVencimiento= '"+FechaVencimiento +"',"+
          "OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
          "TipoDeCambio= '"+factura.TipoDeCambio +"',"+
          "FechaDeEntrega= '"+FechaDeEntrega +"',"+
          "CondicionesDePago= '"+factura.CondicionesDePago +"',"+
          "Vendedor = '"+factura.Vendedor +"',"+
          "Estatus = '"+factura.Estatus +"',"+
          "Ver ='', "+
          "Usuario = '"+factura.Usuario+"'"+
          
          "where "+
          "Id ='"+ factura.Id+"';"
          /* updateFactura(this.redhgSVC.formData) */

          console.log(consulta2,'CONSULTA');

          this.redhgSVC.consultaRedhg(consulta2).subscribe(data => {
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
          let consulta3=''
          /* updateFolios() */

        /*   this.redhgSVC.consultaRedhg(consulta3).subscribe(data => {
            console.log(data);
          }); */
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


    soloPDF(id: string, folio: string){
    
      this.loading = true;
      // document.getElementById('enviaremail').click();
      
      const dialogConfig = new MatDialogConfig();
        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = "80%";
        //dialogConfig.height = "80%"
        
       
        this.dialog.open(RedhgfacturaComponent, dialogConfig);
  
        setTimeout(()=>{
          this.onExportClick(folio);    
          this.dialog.closeAll();
          
         },1000)
    }

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


    refreshDetallesFacturaTerceros() {
      // this.idFactura();
      this.IniciarTotalesT();
      let tasa;
      
      // console.log(this.IdFactura+'XXXXXXXXXXXX');
      console.log(this.redhgSVC.formData.Id + '-yyyyyyyyyyy');
      // this.service.getDetallesFacturaList(this.IdFactura).subscribe(data => {
        let consulta='select * from redhgDetalleFactura where IdFactura ='+this.redhgSVC.formData.Id
        /*  getDetallesFacturaList this.redhgSVC.formData.Id */
      this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
        console.log(data);
        this.listDataTerceros = new MatTableDataSource(data);
        this.listDataTerceros.sort = this.sort;
        console.log(this.listDataTerceros);
        for (let i = 0; i < data.length; i++) {
          this.subtotalT = this.subtotalT + parseFloat(data[i].Importe);
          if (data[i].ImporteIVA != 'NaN') {
            this.ivaT = this.ivaT + parseFloat(data[i].ImporteIVA);
          } else {
            this.ivaT = this.ivaT + 0;
          }
          this.totalT = this.ivaT + this.subtotalT;
        }
        console.log(this.subtotalT);
        for (let i = 0; i < data.length; i++) {
          this.subtotalDllsT = this.subtotalDllsT + parseFloat(data[i].ImporteDlls);
          if (data[i].ImporteIVADlls != 'NaN') {
            this.ivaDllsT = this.ivaDllsT + parseFloat(data[i].ImporteIVADlls);
          } else {
            this.ivaDllsT = this.ivaDllsT + 0;
          }
          this.totalDllsT = this.ivaDllsT + this.subtotalDllsT;
        }
        console.log(this.ivaT);
        console.log(this.totalT);
      /*   this.redhgSVC.formData.Subtotal = this.subtotal;
        this.redhgSVC.formData.ImpuestosTrasladados = (parseFloat(this.iva).toFixed(6));
        this.redhgSVC.formData.Total = (parseFloat(this.total).toFixed(6))
        this.redhgSVC.formData.SubtotalDlls = this.subtotalDlls;
        this.redhgSVC.formData.ImpuestosTrasladadosDlls = this.ivaDlls;
        this.redhgSVC.formData.TotalDlls = this.totalDlls; */
        console.log(this.redhgSVC.formData);
        this.subtotalT = +this.subtotalT + +this.subtotal
        this.ivaT = +this.ivaT + +this.iva
        this.totalT = +this.totalT + +this.total

        this.subtotalDllsT = +this.subtotalDllsT + +this.subtotalDlls
        this.ivaDllsT = +this.ivaDllsT + +this.ivaDlls
        this.totalDllsT = +this.totalDllsT + +this.totalDlls 

        
 /*     
  let factura = this.redhgSVC.formData;
  
  let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
  let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
  let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');
  
  let consulta2 = 'update redhgFactura2 set '+
  
  "IdCliente = '"+factura.IdCliente+"',"+
  "Serie= '"+factura.Serie +"',"+
  "Folio= '"+factura.Folio +"',"+
  "Tipo= '"+factura.Tipo +"',"+
  "FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
  "LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
  "Certificado= '"+factura.Certificado +"',"+
  "NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
  "UUID= '"+factura.UUID +"',"+
  "UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
  "Subtotal= '"+factura.Subtotal +"',"+
  "SubtotalDlls= '"+factura.SubtotalDlls +"',"+
  "Descuento= '"+factura.Descuento +"',"+
  "ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
  "ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
  "ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
  "Total= '"+factura.Total +"',"+
  "TotalDlls= '"+factura.TotalDlls +"',"+
  "FormaDePago= '"+factura.FormaDePago +"',"+
  "MetodoDePago= '"+factura.MetodoDePago +"',"+
  "Cuenta= '"+factura.Cuenta +"',"+
  "Moneda= '"+factura.Moneda +"',"+
  "CadenaOriginal= '"+factura.CadenaOriginal +"',"+
  "SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
  "SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
  "NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
  "RFCDelPAC= '"+factura.RFCdelPAC +"',"+
  "Observaciones= '"+factura.Observaciones +"',"+
  "FechaVencimiento= '"+FechaVencimiento +"',"+
  "OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
  "TipoDeCambio= '"+factura.TipoDeCambio +"',"+
  "FechaDeEntrega= '"+FechaDeEntrega +"',"+
  "CondicionesDePago= '"+factura.CondicionesDePago +"',"+
  "Vendedor = '"+factura.Vendedor +"',"+
  "Estatus = '"+factura.Estatus +"',"+
  "Ver ='', "+
  "Usuario = '"+factura.Usuario+"'"+
  
  "where "+
  "Id ='"+ factura.Id+"';"
        
  
  
  console.log(consulta2);
        this.redhgSVC.consultaRedhg(consulta2).subscribe(res => {
          console.log(res);
  
        }
        ); */
        /* this.SaldoSumatoria(); */
      });
  
    }


    /* GASTOS TERCEROS */

    onAddProductoT() {
/* 
      this.redhgSVC.formData.Tipo = 'Ingreso';
      this.redhgSVC.formData.Estatus = 'Guardada';
      this.redhgSVC.formData.Version = '3.3';
      
      if (this.redhgSVC.formData.Moneda == 'USD') {
        this.redhgSVC.formData.TipoDeCambio = this.Cdolar;
      } else {
        this.redhgSVC.formData.TipoDeCambio = '0';
      } */
  
/* 
      let factura = this.redhgSVC.formData;
      let FechaDeExpedicion = this.datepipe.transform(factura.FechaDeExpedicion, 'yyyy-MM-dd hh:mm:ss');
let FechaVencimiento = this.datepipe.transform(factura.FechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
let FechaDeEntrega = this.datepipe.transform(factura.FechaDeEntrega, 'yyyy-MM-dd hh:mm:ss');

let consulta = 'update redhgFactura2 set '+

"IdCliente = '"+factura.IdCliente+"',"+
"Serie= '"+factura.Serie +"',"+
"Folio= '"+factura.Folio +"',"+
"Tipo= '"+factura.Tipo +"',"+
"FechaDeExpedicion = '"+FechaDeExpedicion +"',"+
"LugarDeExpedicion = '"+factura.LugarDeExpedicion +"',"+
"Certificado= '"+factura.Certificado +"',"+
"NumeroDeCertificado= '"+factura.NumeroDeCertificado +"',"+
"UUID= '"+factura.UUID +"',"+
"UsoDelCFDI= '"+factura.UsoDelCFDI +"',"+
"Subtotal= '"+factura.Subtotal +"',"+
"SubtotalDlls= '"+factura.SubtotalDlls +"',"+
"Descuento= '"+factura.Descuento +"',"+
"ImpuestosRetenidos= '"+factura.ImpuestosRetenidos +"',"+
"ImpuestosTrasladados= '"+factura.ImpuestosTrasladados +"',"+
"ImpuestosTrasladadosDlls= '"+factura.ImpuestosTrasladadosDlls +"',"+
"Total= '"+factura.Total +"',"+
"TotalDlls= '"+factura.TotalDlls +"',"+
"FormaDePago= '"+factura.FormaDePago +"',"+
"MetodoDePago= '"+factura.MetodoDePago +"',"+
"Cuenta= '"+factura.Cuenta +"',"+
"Moneda= '"+factura.Moneda +"',"+
"CadenaOriginal= '"+factura.CadenaOriginal +"',"+
"SelloDigitalSAT= '"+factura.SelloDigitalSAT +"',"+
"SelloDigitalCFDI= '"+factura.SelloDigitalCFDI +"',"+
"NumeroDeSelloSAT= '"+factura.NumeroDeSelloSAT +"',"+
"RFCDelPAC= '"+factura.RFCdelPAC +"',"+
"Observaciones= '"+factura.Observaciones +"',"+
"FechaVencimiento= '"+FechaVencimiento +"',"+
"OrdenDeCompra= '"+factura.OrdenDeCompra +"',"+
"TipoDeCambio= '"+factura.TipoDeCambio +"',"+
"FechaDeEntrega= '"+FechaDeEntrega +"',"+
"CondicionesDePago= '"+factura.CondicionesDePago +"',"+
"Vendedor = '"+factura.Vendedor +"',"+
"Estatus = '"+factura.Estatus +"',"+
"Ver ='', "+
"Usuario = '"+factura.Usuario+"'"+

"where "+
"Id ='"+ factura.Id+"';"

  
      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        console.log(res);
  
      }
      ); */
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      /* checar esta linea */
      dialogConfig.data = {
        movimiento: 'Agregar'
      }
      let dl = this.dialog.open(RedhgaddeditproductostercerosComponent, dialogConfig);

      dl.afterClosed().toPromise().then(resp=>{
        console.log(resp);
        this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
      })
    }

    onEditT(detalleFactura: DetalleFactura) {
      this.redhgSVC.formDataDFTerceros = detalleFactura;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      /* checar esta linea */
      /* this.dialog.open(FacturacioncxcEditProductoComponent, dialogConfig); */
      dialogConfig.data = {
        movimiento: 'Editar'
      }
      let dl = this.dialog.open(RedhgaddeditproductostercerosComponent, dialogConfig);

      dl.afterClosed().toPromise().then(resp=>{
        console.log(resp);
        this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
      })
    }

    onDeleteT(id: number) {
      Swal.fire({
        title: '¿Seguro de Borrar Concepto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          let consulta='delete from redhgDetalleFactura where IdDetalle = '+id
          /*  deleteDetalleFactura id*/
          this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
            this.refreshDetallesFacturaList();
        this.refreshDetallesFacturaTerceros();
  
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

}
