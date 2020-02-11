import { Component, OnInit, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatDivider } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import { Cliente } from '../../../../Models/catalogos/clientes-model';
import { Router, ActivatedRoute } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { FacturacioncxcProductoComponent } from '../facturacioncxc-producto/facturacioncxc-producto.component';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { MatTableDataSource, MatSort } from '@angular/material';
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

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}





// const months =['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day}/${months[month]}/${year}`
      // return `${months[month]} ${year}`;
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
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};


@Component({
  selector: 'app-facturacioncxc-add',
  templateUrl: './facturacioncxc-add.component.html',
  styleUrls: ['./facturacioncxc-add.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]

})
export class FacturacioncxcAddComponent implements OnInit {
  // json1: FacturaTimbre;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;




  json1 = new FacturaTimbre();
  json2 = new Prefactura();
  folio: string;
  xmlparam;
  fileUrl;
  a = document.createElement('a');
  public loading = false;
  public loading2 = false;






  constructor(
    public service: FacturaService, private snackBar: MatSnackBar, private dialog: MatDialog,
    private router: Router, public enviarfact: EnviarfacturaService,
    private activatedRoute: ActivatedRoute, public _MessageService: MessageService, private http: HttpClient, public servicefolios: FoliosService) {



    this.activatedRoute.params.subscribe(params => {
      this.IdFactura = params['id'];


      // console.log("El ID de la Factura es: "+this.IdFactura);
      // console.log(params['id']); 
      this.service.IdFactura = this.IdFactura;
      this.proceso = '';

      // this.resetForm();



    });

    //Observable para actualizar tabla de Detalles Factura
    this.service.listen().subscribe((m: any) => {
      // console.log(m);
      this.refreshDetallesFacturaList();
    });

  }

  ngOnInit() {
    this.resetForm();
    this.setfacturatimbre();
    this.dropdownRefresh();
    this.refreshDetallesFacturaList();
    this.tipoDeCambio();
    // this.onMoneda();
    // this.localstorage();


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

  //Nombre del Cliente a Facturar 
  ClienteNombre: any;
  ClienteVendedor: any;
  ClienteMetodoDePagoCliente: any;



  // list Metodo Pago
  public listMP: Array<Object> = [
    { MetodoDePago: 'PUE', text: 'PUE-Pago en una sola exhibicion' },
    { MetodoDePago: 'PPD', text: 'PPD-Pago en parcialidades o diferido' }
  ];

  // list Metodo Pago
  public listMoneda: Array<Object> = [
    { Moneda: 'MXN' },
    { Moneda: 'USD' }
  ];

  onChange(val) {
    var d = new Date(val);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('01').slice(-2)].join('-')
    // console.log(date);

  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.refreshDetallesFacturaList();
  }

  //Valores de Totales
  subtotal: any;
  iva: any;
  total: any;
  ivaDlls: any;
  subtotalDlls: any;
  totalDlls: any;

  //Control para Search/Lista de Clientes 
  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;


  //Informacion para tabla de productos
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'ClaveSAT', 'Producto', 'Cantidad', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;


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

  //Filter Clientes
  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
  }

  onSelectionChange(cliente: Cliente, event: any) {
    if (event.isUserInput) {

      console.log(cliente);
      this.service.formData.IdCliente = cliente.IdClientes;
      console.log(this.service.formData);
      this.ClienteNombre = cliente.Nombre;
      this.service.formData.UsoDelCFDI = cliente.UsoCFDI;
      this.service.formData.FormaDePago = cliente.MetodoPago;

      if (this.service.formData.FormaDePago == '99' || this.service.formData.FormaDePago == '') {
        this.service.formData.MetodoDePago = 'PPD';
      } else {
        this.service.formData.MetodoDePago = 'PUE';
      }
    }
    // console.log(cliente.IdClientes);



  }


  onMoneda() {
    // console.log(event);
    // console.log(this.service.formData);

    this.Moneda = this.service.formData.Moneda;
    // console.log(this.Moneda);
    this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }

  tipoDeCambio() {
    this.traerApi().subscribe(data => {
      this.Cdolar = data.bmx.series[0].datos[0].dato;

    })

  }

  traerApi(): Observable<any> {




    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();


    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();


    // console.log(fechaayer.getDay());
    // console.log(hora);
    // console.log('dia semana '+ diasemana);
    //2020-01-03/2020-01-03
    if (diasemana == 6 || diasemana == 0) {
      this.rootURL = this.rootURL + 'oportuno'
    } else {
      if (hora < 11) {
        this.rootURL = this.rootURL + 'oportuno'
      }
      else {
        if (diasemana == 1) {
          fechaayer.setDate(fechahoy.getDate() - 3)
          let diaayer = new Date(fechaayer).getDate();
          let mesayer = new Date(fechaayer).getMonth();
          let añoayer = new Date(fechaayer).getFullYear();
          mesayer = mesayer + 1;
          let fecha = añoayer + '-' + mesayer + '-' + diaayer;
          // console.log(fecha);
          this.rootURL = this.rootURL + fecha + '/' + fecha

        } else {
          mesayer = mesayer + 1;
          let fecha = añoayer + '-' + mesayer + '-' + diaayer;
          // console.log(fecha);
          this.rootURL = this.rootURL + fecha + '/' + fecha
        }
      }
    }






    // console.log(this.http.get(this.rootURL, httpOptions));

    return this.http.get(this.rootURL, httpOptions)

  }
  //Iniciar en 0 Valores de los Totales
  IniciarTotales() {
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.subtotalDlls = 0;
    this.totalDlls = 0;
    this.ivaDlls = 0;
  }

  localstorage(){
    let id = this.service.formData.UUID
    let folio = this.service.formData.Folio
    this.enviarfact.xml(id).subscribe(data => {
      // console.log(data);
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
  });
}


  //Funcion Refresh Tabla Detalles Factura
  refreshDetallesFacturaList() {
    this.IniciarTotales();
    let tasa;

    this.service.getDetallesFacturaList(this.IdFactura).subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;



      for (let i = 0; i < data.length; i++) {
        this.subtotal = this.subtotal + parseFloat(data[i].Importe);
        // console.log(subtotal);
        if (data[i].ImporteIVA != 'NaN') {
          this.iva = this.iva + parseFloat(data[i].ImporteIVA);
        } else {
          this.iva = this.iva + 0;
        }
        // console.log(iva);

        this.total = this.iva + this.subtotal;
      }
      console.log(this.subtotal);
      // console.log(iva);
      // console.log(parseFloat(iva).toFixed(6));
      // console.log(total);
      for (let i = 0; i < data.length; i++) {
        this.subtotalDlls = this.subtotalDlls + parseFloat(data[i].ImporteDlls);
        if (data[i].ImporteIVADlls != 'NaN') {
          this.ivaDlls = this.ivaDlls + (this.subtotalDlls * parseFloat(data[i].ImporteIVADlls));
        } else {
          this.ivaDlls = this.ivaDlls + 0;
        }
        this.totalDlls = this.ivaDlls + this.subtotalDlls;
      }
      // console.log(subtotal);
      console.log(this.iva);
      console.log(this.total);
      // console.log(iva);
      this.service.formData.Subtotal = this.subtotal;
      this.service.formData.ImpuestosTrasladados = (parseFloat(this.iva).toFixed(6));
      this.service.formData.Total = (parseFloat(this.total).toFixed(6))
      this.service.formData.SubtotalDlls = this.subtotalDlls;
      this.service.formData.ImpuestosTrasladadosDlls = this.ivaDlls;
      this.service.formData.TotalDlls = this.totalDlls;

      //console.log(this.listData);
    });

  }

  //Filtro de Detalles Factura
  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }




  //Forma Pago
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
  //list CFDI
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

  Regresar() {
    this.router.navigateByUrl('/facturacionCxc');
  }

  //Editar detalle factura
  onEdit(detalleFactura: DetalleFactura) {
    // console.log(detalleFactura);
    this.service.formDataDF = detalleFactura;
    // console.log(this.service.formDataDF);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FacturacioncxcEditProductoComponent, dialogConfig);
  }
  //Eliminar Detalle Factura
  onDelete(id: number) {
    // console.log(id);

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


    // if ( confirm('Are you sure to delete?')) {
    //   this.service.deleteDetalleFactura(id).subscribe(res => {
    //   this.refreshDetallesFacturaList();
    //   this.snackBar.open(res.toString(), '', {
    //     duration: 3000,
    //     verticalPosition: 'top'
    //   });

    //   });
    // }

  }
  //Agregar Detalle Factura
  onAddProducto() {

    // console.log(usuario);
    // this.service.formData = factura;
    // console.log(form.value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FacturacioncxcProductoComponent, dialogConfig);
  }

  MonedaSelected(event: any) {
    // console.log(event);
    this.Moneda = event.target.selectedOptions[0].text;
    // console.log(this.Moneda);
    this.service.Moneda = this.Moneda;
    // console.log(this.service.Moneda);
  }


  // applyFilter(filtervalue: string) {
  //   this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  // }

  resetForm(form?: NgForm) {
    // if (form != null)
    //   form.resetForm();
    // this.ClienteNombre = 'Juanito';


    this.service.getFacturaId(this.IdFactura).subscribe(res => {
      // console.log(this.IdFactura + "ESTE ES EL ID FACTURA");
      // console.log(res);
      // this.refreshDetallesFacturaList();
      this.service.formData = res[0];
      // console.log(this.service.formData);

      //OBTENER LA INFORMACION DEL CLIENTE, EN ESPECIFICO EL NOMBRE DEL CLIENTE PARA PINTARLO EN EL FORMULARIO
      this.service.getFacturaClienteID(this.service.formData.IdCliente).subscribe(res => {
        // console.log(res);
        this.ClienteNombre = res[0].Nombre;
      });

      this.Estatus = this.service.formData.Estatus;
      // console.log(this.Estatus);

      if (this.Estatus === 'Timbrada' || this.Estatus === 'Cancelada') {
        let nodes = document.getElementById('div1').getElementsByTagName('*');
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].setAttribute('disabled', 'true')
        }
        // console.log('1');

      }

      this.onMoneda();
      // console.log(this.service.formData);
    });

    //this.service.formData = {
    //Factura
    // Id: 0,
    // IdCliente: 0,
    // Serie: '',
    // Folio: '',
    // Tipo: '',
    // FechaDeExpedicion: new Date(),
    // LugarDeExpedicion: '',
    // Certificado: '',
    // NumeroDeCertificado: '',
    // UUID: '',
    // UsoDelCFDI: '',
    // Subtotal: '',
    // Descuento: '',
    // ImpuestosRetenidos: '',
    // ImpuestosTrasladados: '',
    // Total: '',
    // FormaDePago: '',
    // MetodoDePago: '',
    // Cuenta: '',
    // Moneda: '',
    // CadenaOriginal: '',
    // SelloDigitalSAT: '',
    // SelloDigitalCFDI: '',
    // NumeroDeSelloSAT: '',
    // RFCdelPAC: '',
    // Observaciones: '',
    // FechaVencimiento: new Date(),
    // OrdenDeCompra: '',
    // TipoDeCambio: '',
    // FechaDeEntrega: new Date(),
    // CondicionesDePago: '',
    // Vendedor: '',
    // Estatus: '',
    // Version: '',
    // Usuario: '',
    // }

  }

  crearjsonfactura(id: number): string {

    let cadena: string;

    this.service.getFacturasClienteID(id).subscribe(data => {


    //  console.log(data[0]);
    //  console.log(data[0].IdAPI);

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
      // console.log(this.json1.Receptor.UID);

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

      // console.log(this.json);




      this.service.getDetallesFacturaListProducto(id).subscribe(data => {
        // console.log(data);
        // console.log(data[0]);

        this.json1.Conceptos.pop();
        // console.log(data.length);

        if (this.json1.Moneda == 'MXN') {
          for (let i = 0; i < data.length; i++) {
            this.json1.Conceptos.push({
              ClaveProdServ: data[i].ClaveSAT,
              NoIdentificacion: data[i].ClaveProducto,
              Cantidad: data[i].Cantidad,
              ClaveUnidad: data[i].Unidad,
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

                  // Importe: (parseInt(data[i].Importe)*0.16).toString()


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

                  // Importe: (parseInt(data[i].Importe)*0.16).toString()


                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }

        }



        // console.log(this.json1);
        // console.log(JSON.stringify(this.json1));
        // this.json1 = JSON.stringify(this.json1);


        cadena = JSON.stringify(this.json1);
        //  console.log(cadena);

        this.enviar(cadena);
      })

      //  console.log(this.json);



      // return JSON.stringify(this.json1)

    });




    return cadena;




  }



  onSubmit(form: NgForm) {
    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Creada';
    this.service.formData.Version = '3.3';
    this.service.formData.Id = this.IdFactura;
    if (this.service.formData.Moneda == 'USD') {
      this.service.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.service.formData.TipoDeCambio = '0';
    }
    this.service.updateFactura(this.service.formData).subscribe(res => {
      this.resetForm(form);
      this.IniciarTotales();
      // this.snackBar.open(res.toString(),'',{
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire(
        'Factura Guardada',
        '',
        'success'
      )
      // this.enviar(this.IdFactura);
      // this.crearjsonfactura(this.IdFactura); 

    }
    );

    // console.log(this.service.formData);
  }

  timbrar(form: NgForm) {
    this.loading2 = true;
    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Creada';
    this.service.formData.Version = '3.3';
    this.service.formData.Serie = '5628';
    if (this.service.formData.Moneda == 'USD') {
      this.service.formData.TipoDeCambio = this.Cdolar;
    } else {
      this.service.formData.TipoDeCambio = '0';
    }
    this.service.formData.Id = +this.IdFactura;
    this.service.updateFactura(this.service.formData).subscribe(res => {
      console.log(this.service.formData);
      this.resetForm(form);
      this.IniciarTotales();
      // this.snackBar.open(res.toString(),'',{
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      // this.enviar(this.IdFactura);
      this.crearjsonfactura(this.IdFactura);

    }
    );

  }

  enviar(cadena: string) {


    // Aqui manda la factura
    this.enviarfact.enviarFactura(cadena).subscribe(data => {
      console.log(data);
      if (data.response === 'success') {
        // console.log('Factura Creada');
        this.service.formData.LugarDeExpedicion = '31203';
        this.service.formData.NumeroDeCertificado = '00001000000403628664';
        // tslint:disable-next-line: max-line-length
        this.service.formData.Certificado = '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';

        // console.log(this.service.formData);

        this.service.formData.UUID = data.UUID;
        this.service.formData.CadenaOriginal = '||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
        this.service.formData.SelloDigitalSAT = data.SAT.SelloSAT;
        this.service.formData.SelloDigitalCFDI = data.SAT.SelloCFD;
        this.service.formData.NumeroDeSelloSAT = data.SAT.NoCertificadoSAT;
        this.service.formData.RFCdelPAC = 'LSO1306189R5';
        this.service.formData.Estatus = 'Timbrada';


        this.numfact = data.UUID;

        // console.log(this.service.formData);

        this.service.updateFactura(this.service.formData).subscribe(data => {
          // console.log(this.service.formData);
          // console.log('Factura Actualizada');
          this.loading2 = false;
          Swal.fire(
            'Factura Creada',
            '' + this.numfact + '',
            'success'
          )

          this.dxml2(this.numfact, this.service.formData.Folio);
          // this.resetForm();





          // this.onExportClick(this.service.formData.Folio);

          // console.log(data);


        });


        this.estatusfact = 'Factura Creada ' + data.invoice_uid;


        this.servicefolios.updateFolios().subscribe(data =>{
          console.log(data);
          
        });

      } else
        if (data.response === 'error') {
          this.loading2 = false;
          // console.log('error');
          Swal.fire(
            'Error',
            '' + data.message + '',
            'error'
          )

          // this.estatusfact = data.response + ' ' + data.message;
        }
    })

    // console.log(datosfact);


  }

  verfolios() {

    //5df9887b8fa49
  }



  dxml(id: string, folio: string) {
    // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/xml";
    // this.proceso='xml';
    this.loading = true;
    let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    this.enviarfact.xml(id).subscribe(data => {
      // localStorage.removeItem('xml')
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.fileUrl = window.URL.createObjectURL(blob);


      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';

      document.body.appendChild(this.a);
      //      console.log(this.fileUrl);
      // console.log(this.a);
      // console.log('blob:'+this.a.href);

      this.a.click();
      do {
        this.xmlparam = folio;
        // console.log(this.xmlparam);

        if (localStorage.getItem('xml' + folio) != null) {
          // console.log('no nulo');
          // this.xmlparam = localStorage.getItem('xml' + folio);
          this.xmlparam =  folio;
          setTimeout(()=>{
            // this.onExportClick(folio);    
            this.onExportClick(this.service.formData.Folio);
           },1000)
        }
      }
      while (localStorage.getItem('xml' + folio) == null);
      this.resetForm();
      // console.log(this.xmlparam);


      return this.fileUrl;

      // console.log(this.fileUrl);


    });

    setTimeout(() => {
      this.loading = false;
    }, 7000)






  }
  dxml2(id: string, folio: string) {
    // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/xml";
    this.proceso = 'xml';
    let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';
    this.enviarfact.xml(id).subscribe(data => {
      localStorage.removeItem('xml' + folio)
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.fileUrl = window.URL.createObjectURL(blob);


      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';

      document.body.appendChild(this.a);
      //      console.log(this.fileUrl);
      // console.log(this.a);
      // console.log('blob:'+this.a.href);

      // this.a.click();
      this.xmlparam = folio
      this.resetForm();
      // console.log(this.xmlparam);

      return this.fileUrl;

      // console.log(this.fileUrl);


    });





  }

  onExportClick(folio?: string) {
    this.proceso = 'xml';
    const content: Element = document.getElementById('element-to-PDF');

    const option = {

      margin: [0, 0, 0, 0],
      filename: 'F-' + folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
      jsPDF: { format: 'letter', orientation: 'portrait' },
      
    };

    // html2pdf()
    //   .from(content)
    //   .set(option)
    //   .save();

    html2pdf().from(content).set(option).save(); 

    // html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
    //   console.log(pdfAsString);
      
    // })
    // let pdf =  html2pdf().output(option,content)
    //.from(content).set(option).save(); 
    
    
   

    
    this.proceso = '';
  }

  // myCallback(pdf) {
  //   localStorage.setItem('pdf', pdf);

  // }


  dpdfxml() {
    this.enviarfact.xml('http://devfactura.in/api/v3/cfdi33/5e06601d92802/xml')
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

  email(id: string, folio: string) {

    // let xml = 'http://devfactura.in/api/v3/cfdi33/' + id + '/xml';

    // localStorage.removeItem('xml'+folio);
    // localStorage.removeItem('pdf'+folio);


    
    // let pdf =  html2pdf().output(option,content)
    //.from(content).set(option).save(); 
    
    // .pipe(retry())
    this.enviarfact.xml(id).subscribe(data => {
        // console.log(data);
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
       
  
  setTimeout(()=>{
        let datos;
        datos={
          'nombre': 'Ivan Talamantes',
          'email': 'ivan.talamantes@live.com',
          'mensaje':'Prueba del correo xml',
          'asunto': 'Prueba',
          "folio": folio,
          "xml": localStorage.getItem('xml'+folio),
          "pdf": localStorage.getItem('pdf'+folio)
        }
        this._MessageService.sendMessage(datos).subscribe(() => {
          Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
        });
      },3000)
       
    })
       

     
   
    }
    
    
    //   const blob = new Blob([data as BlobPart], { type: 'application/xml' });
    //   // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    //   this.fileUrl = window.URL.createObjectURL(blob);


    //   this.a.href = this.fileUrl;
    //   this.a.target = '_blank';
    //   this.a.download = 'F-' + folio + '.xml';

    //   document.body.appendChild(this.a);
    //   //      console.log(this.fileUrl);
    //   // console.log(this.a);
    //   // console.log('blob:'+this.a.href);

    //   //this.a.click();
    //   localStorage.removeItem('xml')
    //   localStorage.setItem('xml', data)
    //   this.xmlparam = localStorage.getItem('xml');


    //   const content: Element = document.getElementById('element-to-PDF');

    //   const option = {
    //     margin: [0, 0, 0, 0],
    //     filename: 'F-' + folio + '.pdf',
    //     image: { type: 'jpeg', quality: 1 },
    //     html2canvas: { scale: 2, logging: true, scrollY: content.scrollHeight },
    //     jsPDF: { format: 'letter', orientation: 'portrait' }


    //   };

    //   html2pdf().from(content).set(option).toPdf().output('datauristring').then(function (res) {
    //     // console.log(res);

    //     localStorage.setItem('pdf', res);
    //   })
    //   //  .save()






    //   this.resetForm();
    //   // console.log(this.xmlparam);


    //   return this.fileUrl;

    //   // console.log(this.fileUrl);


    // });









    // console.log('email');
   
  



  cancelar(id: string, folio: string) {



    // console.log(data);
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
        // console.log(id);
        this.loading = true;
        this.enviarfact.cancelar(id).subscribe(data => {
          // console.log(data.response);
          let data2 = JSON.parse(data);
          // console.log(data2);


          if (data2.response === 'success') {
            // this.loading2 = false;
            // console.log('error');
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






            // console.log(this.service.formData.Id);


            // console.log(this.service.formData);
            // console.log('Factura Actualizada');
            // console.log(data);

            this.loading = false;
            this.resetForm();
            Swal.fire(
              'Error en Cancelacion',
              '' + data2.message + '',
              'error'
            )




          }
        })



        // this.estatusfact = data.response + ' ' + data.message;

        // localStorage.removeItem('xml')




        // setTimeout(()=>{
        //   this.loading = false;
        //  },6000)


      }

    })
  }

  prefactura(folio: string) {
    this.crearjsonprefactura(this.IdFactura);



  }



  crearjsonprefactura(id: number): string {

    let cadena: string;

    this.service.getFacturasClienteID(id).subscribe(data => {

      // console.log(data[0]);

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
      // console.log(this.json.Receptor.UID);

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

      // console.log(this.json);




      this.service.getDetallesFacturaListProducto(id).subscribe(data => {
        // console.log(data);
        // console.log(data[0]);

        this.json2.Conceptos.pop();
        // console.log(data.length);

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

                  // Importe: (parseInt(data[i].Importe)*0.16).toString()


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

                  // Importe: (parseInt(data[i].Importe)*0.16).toString()


                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }

        }



        // console.log(this.json1);
        // console.log(JSON.stringify(this.json1));
        // this.json1 = JSON.stringify(this.json1);


        cadena = JSON.stringify(this.json2);
        //  console.log(cadena);
        document.getElementById('abrirpdf').click();

        setTimeout(() => {
          this.onExportClick();
          //  console.log(this.json1);

        }, 1000)

        // this.enviar(cadena);
      })

      //  console.log(this.json);



      // return JSON.stringify(this.json1)

    });




    return cadena;




  }




}
