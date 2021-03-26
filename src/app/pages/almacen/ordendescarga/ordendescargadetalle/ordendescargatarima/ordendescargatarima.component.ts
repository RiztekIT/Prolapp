import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { OrdenDescargaService } from '../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { DetalleOrdenDescarga } from '../../../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { Router } from '@angular/router';
import { preOrdenTemporalOD } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporalOD-model';
import { nanoid } from 'nanoid'
import { Tarima } from '../../../../../Models/almacen/Tarima/tarima-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { preOrdenTemporalODSacos } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporalODSacos-model';
import { OrdenDescargaConceptoComponent } from 'src/app/components/almacen/orden-descarga/ordendescargadetalle/ordendescargatarima/orden-descarga-concepto/orden-descarga-concepto.component';
import { map, startWith } from 'rxjs/operators';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { CalendarioService } from '../../../../../services/calendario/calendario.service';
import { TipoCambioService } from '../../../../../services/tipo-cambio.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    // 'Bmx-Token': '19b7c18b48291872e37dbfd89ee7e4ea26743de4777741f90b79059950c34544',
    'Bmx-Token': '410db2afc39118c6917da0778cf81b6becdf5614dabd10b92815768bc0a87e26',
    //'Access-Control-Allow-Origin': '*',
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
  selector: 'app-ordendescargatarima',
  templateUrl: './ordendescargatarima.component.html',
  styleUrls: ['./ordendescargatarima.component.css'],
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
export class OrdendescargatarimaComponent implements OnInit {


  constructor(public router: Router, private dialog: MatDialog, public service: OrdenDescargaService,
    public ordenTemporalService: OrdenTemporalService, public Tarimaservice: TarimaService, public CalendarioService: CalendarioService, public serviceTarima: TarimaService, public tipoCambioService: TipoCambioService, private http : HttpClient) {
    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshOrdenDescargaList();
    });

    this.service.listenOrdenTemporal().subscribe((m: any) => {
      console.log(m);
      this.actualizarTablaOrdenTemporal();
    });

    this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
      console.log(m);
      this.actualizarTablaOrdenTemporal();
    });
    // this.ordenTemporalService.listenOrdenTemporalSI().subscribe((m: any) => {
    //   console.log(m);
    //   this.ActualizarOrdenTemporalSI();
    // });


  }
  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    console.log('%c%s', 'color: #e50000', this.IdOrdenDescarga);
    // this.service.formData = JSON.parse(localStorage.getItem('OrdenDescarga')); 
 


    this.informacionOrden();
    this.refreshOrdenDescargaList();
    this.actualizarTablaOrdenTemporal();
    // this.updateOrdenDescarga(this.service.formData,'Proceso');
    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporalOD = [];
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    this.Tarimaservice.tarimaDetalleDOD = [];
    this.ordenTemporalService.preOrdenTemporalSacos = [];
    this.sacosCero = true;
    // this.preOrdenTemporalSacos = new any();
    this.show = false;
    
  }

  informacionOrden(){
    this.service.getOrdenDescargaID(this.IdOrdenDescarga).subscribe(resOD=>{
      console.log('%c⧭', 'color: #733d00', resOD);
      console.log(resOD);
      this.service.formData = resOD[0];
      this.estatusOrdenDescarga = this.service.formData.Estatus;
      console.log('%c%s', 'color: #aa00ff', this.estatusOrdenDescarga);
      console.log(this.service.formData);
    })
  }

//^Estatus de la orden
  estatusOrdenDescarga: string = "";

  fecha2;
  rowDTOD: any;
  kilogramosSaldo: any;
  InputComentarios: string;
  NombreProducto: string;
  fechaCaducidad: Date;
  fechaMFG: Date;
  lote: string;
  kilogramostotal: any;
  saldototal: any;
  IdOrdenDescarga: number;
  Lote: any;
  cantidadKilogramos: number;
  ClaveProducto: any;
  dataODID = new Array<DetalleOrdenDescarga>();
  cantidadMaximaKilogramos: number;
  sacosCero: boolean;
  numerofactura;
  FechaFactura: Date;
  TipoCambio: string
  PO;
  PODescarga;
  NumeroEntrada;
  

  // qrTarimaExistente
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listQR: Tarima[] = [];
  options: Tarima[] = [];
  POTSTE: any;
  show: boolean;

  QRtarima;



  preOrdenTemporalSacos: any;

  // isVisibleVisualizacion: boolean;
  // isVisibleOT: boolean;

  regresar() {
    this.router.navigate(['/ordenDescargadetalle']);
  }

  updateOrdenDescarga(od,estatus){
    od.Estatus=estatus
    this.service.updateOrdenDescarga(od).subscribe(data=>{
      console.log(data,'update od '+estatus);
      this.informacionOrden();
      // this.estatusOrdenDescarga = 'Proceso';
    })
    
  }

  finalizarOrden(){

    // let productos = this.listData.data;
    // let productos = this.ordenTemporalService.preOrdenTemporalOD

    console.log(this.listData.data,'finalizarORdne');
    let OrdenCompletada = false;
    // let saldo = 0;
    for (let i =0; i<this.listData.data.length; i++){
      // saldo = saldo + +this.listData.data[i].Saldo
      if(+this.listData.data[i].Saldo == 0){
          OrdenCompletada = true;
      }else{
        OrdenCompletada = false;
      }
    }

    if(OrdenCompletada == true){
      this.service.formData.Estatus = 'Descargada'
      console.log(this.service.formData);
      Swal.fire({
        title: 'Orden Descargada',
        icon: 'success',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
        this.updateOrdenDescarga(this.service.formData,'Descargada');
        this.generarEventoCalendario(this.service.formData.Folio);
    }
    else{
      Swal.fire({
        title: 'Orden Incompleta',
        icon: 'warning',
        text:'No se han Descargado todos los productos. Si confirmas, el estatus de la Orden cambiara a Descargada.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            title: 'Orden Descargada',
            icon: 'success',
            timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
            
            // text: 'No se han descargado todos los productos.',
            // timer: 1000
          });
          this.updateOrdenDescarga(this.service.formData,'Descargada');
          this.generarEventoCalendario(this.service.formData.Folio);
        }
      })
    }


  }

  generarEventoCalendario(folio){
    // console.log(this.compra);
    //idcalendario, folio, documento, descripcion, inicio, fin, titulo, color, allday, rezi ,rezi, dragga
    // console.log(this.CalendarioService.DetalleCalendarioData);
    //Obtener el id del calendario que le corresponde al usuario y al modulo
    let usuario: any
    usuario = localStorage.getItem('ProlappSession');
    usuario = JSON.parse(usuario);
    console.log(usuario.user);
    this.CalendarioService.getCalendarioComprasUsuarioModulo(usuario.user, 'Almacen').subscribe(res=>{
      console.log(res);
      this.CalendarioService.DetalleCalendarioData.IdCalendario = res[0].IdCalendario;
      //el folio corresponde con la Orden/Documento que se genera junto con el evento.
      this.CalendarioService.DetalleCalendarioData.Folio = folio;
      this.CalendarioService.DetalleCalendarioData.Documento = 'OrdenDescarga';
      this.CalendarioService.DetalleCalendarioData.Descripcion = 'Evento Orden de Descarga con Folio: '+folio;
      //Las fechas van a variar dependiendo en el modulo en el que se encuentre
      this.CalendarioService.DetalleCalendarioData.Start = this.service.formData.FechaInicioDescarga;
      this.CalendarioService.DetalleCalendarioData.Endd = this.service.formData.FechaFinalDescarga;
      this.CalendarioService.DetalleCalendarioData.Title = 'Orden de Descarga Finalizada ' + folio;
      this.CalendarioService.DetalleCalendarioData.Color = '#0fd8e6';
      console.log(this.CalendarioService.DetalleCalendarioData);
      this.CalendarioService.addDetalleCalendario(this.CalendarioService.DetalleCalendarioData).subscribe(resAdd=>{
        console.log(resAdd);
      })
    })
  }


  //tabla visualizacion
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Sacos','Kg',  'Saldo', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //tabla Sacos Ingresados
  listDataSacosIngresados: MatTableDataSource<any>;
  displayedColumnsSacosIngresados: string[] = ['ClaveProducto', 'Producto', 'Kg', 'Lote', 'FechaCaducidad', 'FechaMFG', 'Options'];
  @ViewChild(MatSort, null) sortSacosIngresados: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSacosIngresados: MatPaginator;

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['PO','Factura','CBK','ClaveProducto', 'Producto', 'Lote', 'Kg',  'FechaCaducidad',  'FechaMFG', 'Options'];
  // displayedColumnsOrdenTemporal: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Kg',  'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  //desplegar 



  refreshOrdenDescargaList() {

    this.ordenTemporalService.preOrdenTemporalOD = [];
      this.ordenTemporalService.preOrdenTemporalOD = new Array<preOrdenTemporalOD>();

    this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataID => {

      console.log(dataID, 'detalles DOD a asignarse');
      // recorrer tantos conceptos tenga la OD
      this.Tarimaservice.tarimaDetalleDOD = [];
      this.ordenTemporalService.preOrdenTemporalOD = [];
      this.ordenTemporalService.preOrdenTemporalOD = new Array<preOrdenTemporalOD>();
      console.log(this.ordenTemporalService.preOrdenTemporalOD, 'reinicio');
      for (let i = 0; i <= dataID.length - 1; i++) {

        this.dataODID[i] = dataID[i];
        console.log(dataID[i], 'ID OD-verificar tabla');


        // this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, this.dataODID[i].Lote, this.dataODID[i].ClaveProducto).subscribe(data => {

          // console.log(data, 'IDLOTECP');

          // let KilogramosDetalle = ((+this.dataODID[i].Sacos)*(+this.dataODID[i].PesoxSaco));
          let DOD = new preOrdenTemporalOD();
          let DTOD = new DetalleOrdenDescarga();

          DOD.IdDetalleOrdenDescarga = this.dataODID[i].IdDetalleOrdenDescarga;
          DOD.IdOrdenDescarga = this.dataODID[i].IdOrdenDescarga;
          DOD.ClaveProducto = this.dataODID[i].ClaveProducto
          DOD.Producto = this.dataODID[i].Producto
          DOD.Sacos = this.dataODID[i].Sacos
          DOD.Lote = this.dataODID[i].Lote
          DOD.Saldo = this.dataODID[i].Saldo
          //DOD.PesoTotal = ((+DOD.Sacos) * (+this.dataODID[i].PesoxSaco)).toString();
          DOD.PesoTotal = (DOD.Sacos);
          DOD.FechaCaducidad = this.dataODID[i].FechaCaducidad;
          DOD.KilogramosIngresados = '';
          DOD.Comentarios = 'NA';
          DOD.KilogramosIngresadosTotales = ((+this.dataODID[i].PesoxSaco) * (+this.dataODID[i].Sacos)).toString();
          DOD.Pedimento = this.dataODID[i].Pedimento
          DOD.Proveedor = this.dataODID[i].Proveedor
          DOD.IdProveedor = this.dataODID[i].IdProveedor
          // DOD.PO = this.service.formData.PO
          DOD.PO = '';
          DOD.FechaMFG = this.dataODID[i].FechaMFG
          DOD.Shipper = this.dataODID[i].Shipper
          DOD.USDA = this.dataODID[i].USDA
          DOD.PesoxSaco = this.dataODID[i].PesoxSaco

          console.log(DOD, 'DOD');
          this.ordenTemporalService.preOrdenTemporalOD.push(DOD);
          this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
          // this.finalizarOrden();



          //llenar DTOD para los detalles de tarima
          // console.log(this.Tarimaservice.tarimaDetalleDOD);
          // DTOD.ClaveProducto = this.dataODID[i].ClaveProducto;
          // DTOD.Producto = this.dataODID[i].Producto;
          // DTOD.Sacos = this.dataODID[i].Sacos;
          // DTOD.PesoxSaco = this.dataODID[i].PesoxSaco;
          // DTOD.Lote = this.dataODID[i].Lote;
          // DTOD.IdProveedor = this.dataODID[i].IdProveedor;
          // DTOD.Proveedor = this.dataODID[i].Proveedor;
          // DTOD.PO = this.dataODID[i].PO;
          // DTOD.FechaMFG = this.dataODID[i].FechaMFG;
          // DTOD.FechaCaducidad = this.dataODID[i].FechaCaducidad;
          // DTOD.Shipper = this.dataODID[i].Shipper;
          // DTOD.USDA = this.dataODID[i].USDA;
          // DTOD.Pedimento = this.dataODID[i].Pedimento;
          // console.log(DTOD, 'DTOD para DetalleTarima');
          // this.Tarimaservice.tarimaDetalleDOD.push(DTOD);
          // console.log(this.Tarimaservice.tarimaDetalleDOD);



        // })
      }
    })
  }



  // onEdit(detalleordendescarga: DetalleOrdenDescarga, id: any) {
  onEdit(preOD: preOrdenTemporalODSacos, id: any) {
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    this.NombreProducto = this.ordenTemporalService.preOrdenTemporalOD[id].Producto
    this.PO = this.ordenTemporalService.preOrdenTemporalOD[id].PO
    // this.NumeroEntrada = this.ordenTemporalService.preOrdenTemporalOD[id].Pedimento
    console.log(this.ordenTemporalService.preOrdenTemporalOD[id].Producto);
    console.log(preOD);
    console.log(id);
    // console.log(detalleordendescarga);
    // this.rowDTOD = detalleordendescarga;
    console.log(id, 'posicion');

    this.preOrdenTemporalSacos = <any>{};
    this.preOrdenTemporalSacos = preOD;
    this.preOrdenTemporalSacos.posicionOrdenTemporalOD = id;
    this.ordenTemporalService.posicionOrdenTemporalOD = id;

    this.TipoCambio = this.tipoCambioService.TipoCambio;
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'oijfas');

    // console.log(this.ordenTemporalService.posicionOrdenTemporalOD, 'wwwwwwwwwwwwwwwwwwwwwwwwwww');

    //asigna el id del producto a la posicion para que se le puedan asignar los valores al dato temporal en tabla -1
    // console.log(this.ordenTemporalService.posicionOrdenTemporalOD, 'Posicion');

    // if(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo != this.rowDTOD.Sacos){
    //   this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = '0'
    //   this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.rowDTOD.Sacos
    // }



    // console.log(this.rowDTOD.Sacos, 'Sacos en total');
    // console.log(this.rowDTOD.Saldo, 'Saldo al momento');




    // let oTSacos = new preOrdenTemporalODSacos();
    // oTSacos = preOD;
    // oTSacos.posicionArreglo = id;
    // this.preOrdenTemporalSacos.FechaCaducidad = new Date();
    // this.preOrdenTemporalSacos.FechaMFG = new Date();



    // oTSacos.IdDetalleOrdenDescarga = detalleordendescarga.IdDetalleOrdenDescarga;
    // oTSacos.ClaveProducto = detalleordendescarga.ClaveProducto;
    // oTSacos.Producto = detalleordendescarga.Producto;
    // oTSacos.Sacos = detalleordendescarga.Sacos;
    // oTSacos.SacosIngresados = '0';
    // oTSacos.IdOrdenDescarga = detalleordendescarga.IdOrdenDescarga;
    // oTSacos.Lote = detalleordendescarga.Lote
    // oTSacos.Saldo = detalleordendescarga.Saldo
    // // oTSacos.PesoTotal = ((+oTSacos.Sacos) * (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].PesoxSaco)).toString();
    // oTSacos.FechaCaducidad = detalleordendescarga.FechaCaducidad;
    // oTSacos.Comentarios = 'NA';
    // oTSacos.posicionArreglo = this.ordenTemporalService.posicionOrdenTemporalOD;
    // // oTSacos.IdOrdenTemporal = detalleordendescarga.IdOrdenTemporal;
    // // oTSacos.IdTarima = detalleordendescarga.IdTarima;
    // // oTSacos.IdOrdenCarga = detalleordendescarga.IdOrdenCarga;
    // // oTSacos.QR = detalleordendescarga.QR;
    // // oTSacos.PesoTotal = detalleordendescarga.PesoTotal;
    // // oTSacos.Comentarios = detalleordendescarga.Comentarios;
    // // oTSacos.sacosSobra = detalleordendescarga.sacosSobra;
    // // oTSacos.productoValido = detalleordendescarga.productoValido;
    // // oTSacos.SacosIngresadosTotales = detalleordendescarga.SacosIngresadosTotales;
    // // oTSacos.posicionArreglo = detalleordendescarga.posicionArreglo;
    // oTSacos.PesoxSaco = detalleordendescarga.PesoxSaco;
    // oTSacos.IdProveedor = detalleordendescarga.IdProveedor;
    // oTSacos.Proveedor = detalleordendescarga.Proveedor;
    // oTSacos.PO = detalleordendescarga.PO;
    // oTSacos.FechaMFG = detalleordendescarga.FechaMFG;
    // oTSacos.Shipper = detalleordendescarga.Shipper;
    // oTSacos.USDA = detalleordendescarga.USDA;
    // oTSacos.Pedimento = detalleordendescarga.Pedimento;

    // ingresar tambien lo de detalletarima]

    // console.log(oTSacos, 'OTSACOS');
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'antes de push');
    // this.preOrdenTemporalSacos = oTSacos;
    /* this.preOrdenTemporalSacos.KilogramosIngresadosTotales = oTSacos.SacosIngresadosTotales; */

  /*   for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalSacos.length - 1; i++) {
      if (this.ordenTemporalService.preOrdenTemporalSacos[i].ClaveProducto == this.preOrdenTemporalSacos.ClaveProducto && this.ordenTemporalService.preOrdenTemporalSacos[i].Lote == this.preOrdenTemporalSacos.Lote) {
        Swal.fire({
          title: 'Producto Ya ingresado.',
          icon: 'warning',
          text: '',
          timer: 1000
        });
        return
      }
    } */
    // console.log(this.preOrdenTemporalSacos);
    // this.ordenTemporalService.preOrdenTemporalSacos.push(oTSacos);
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);

    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'asaaaa');




  }

  //metodo que se ejecuta cuando cambia la cantidad de Kilogramos
  onChangeCantidadKilogramos(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Kilogramos')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.cantidadKilogramos;
    console.log(this.cantidadKilogramos);
    console.log(this.preOrdenTemporalSacos.KilogramosIngresadosTotales);
    this.preOrdenTemporalSacos.KilogramosIngresados = this.cantidadKilogramos.toString();
    // this.preOrdenTemporalSacos.KilogramosIngresadosTotales = ((+this.preOrdenTemporalSacos.KilogramosIngresadosTotales) + (+this.cantidadKilogramos)).toString();

  }


  // validarCantidad(cantidad: any) {
  //   // console.log(cantidad + ' CANTIDAD');
  // this.sacosTraspaso = +cantidad;
  //   // console.log(this.cantidadMaximaSacos);

  //   if (this.sacosTraspaso >= this.cantidadMaximaSacos) {
  //     this.sacosTraspaso = this.cantidadMaximaSacos;
  //   }
  //   if (this.sacosTraspaso <= 0) {
  //     this.sacosTraspaso = 0;
  //   }
  //   if (cantidad == null) {
  //     this.sacosTraspaso = 0;
  //   }
  //   // console.log(this.sacosTraspaso);
  // }

  validarCantidad(cantidad: any) {
    console.log(cantidad);
    this.cantidadKilogramos = cantidad;
    console.log(this.cantidadKilogramos + '/////////');
    this.cantidadMaximaKilogramos = +this.preOrdenTemporalSacos.Saldo;
    console.log(this.cantidadMaximaKilogramos + '/////////');
    this.sacosCero = true;
    // console.log(this.cantidadSacos, 'sacos entrando');
    // if ((+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados + +this.cantidadSacos) > this.cantidadMaximaSacos) {
    if (this.cantidadKilogramos >= this.cantidadMaximaKilogramos) {

      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadMaximaSacos.toString();
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = '0'
      this.cantidadKilogramos = this.cantidadMaximaKilogramos;
      console.log('la cantidad de kilogramos ingresados es mayor al saldo');
    }
    if (this.cantidadKilogramos <= 0) {
      console.log('La cantidad es = 0');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadSacos.toString();
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados + +this.cantidadSacos).toString(); 
      this.cantidadKilogramos = 0;
    }
    if (cantidad == null) {
      this.cantidadKilogramos = 0;
    }
    // if (this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados == '0') {

    //   this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadSacos.toString();
    // }
    // if (this.cantidadSacos >= this.cantidadMaximaSacos) {
    //   this.cantidadSacos = this.cantidadMaximaSacos;
    // }
    // if (this.cantidadSacos == null || this.cantidadSacos <= 0 || this.sacosSaldo == null) {
    //   console.log('1111111');
    //   this.sacosCero = false
    // }


    // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos.toString()).toString();

  }

  addSacos(form?: NgForm) {
    // this.dropdownRefresh();



    console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'prueba doble');
    console.log(this.Tarimaservice.tarimaDetalleDOD, 'tarimadetallealinicio-----------');
    // if (this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo == '0') {
    // if (+this.preOrdenTemporalSacos.Saldo == 0) {
    //   Swal.fire({
    //     title: 'No se pueden Ingresar mas Sacos',
    //     icon: 'warning',
    //     text: 'Saldo agotado'
    //   });

    //   return;
    // }

    // if (this.ordenTemporalService.posicionOrdenTemporalOD == null) {
    //   Swal.fire({
    //     title: 'Seleccionar Producto',
    //     icon: 'warning',
    //     text: ''
    //   });
    // }
    // this.validarCantidad();





    // if (this.cantidadKilogramos == 0 || this.cantidadKilogramos == null) {
    //   Swal.fire({
    //     title: 'Ingresar Numero Valido',
    //     icon: 'warning',
    //     text: ''
    //   });
    //   return;
    // }
    // if (this.InputComentarios == '' || this.InputComentarios == null) {
    //   console.log('comentario if');
    //   // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = 'NA'
    //   this.preOrdenTemporalSacos.Comentarios = 'NA'
    // } else {
    //   console.log('comentario else');
    //   // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.InputComentarios
    //   this.preOrdenTemporalSacos.Comentarios = this.InputComentarios
    // }

    // console.log('////////////////');
    console.log(this.fechaCaducidad);
    console.log(this.fechaMFG);
//^ Asignar variables capturadas al objeto a ingresar
    this.preOrdenTemporalSacos.Lote = this.lote
    this.preOrdenTemporalSacos.FechaCaducidad = this.fechaCaducidad
    this.preOrdenTemporalSacos.FechaMFG = this.fechaMFG
    //^ En shipper guardaremos Numero Facura
    this.preOrdenTemporalSacos.Shipper = this.numerofactura;
    //^  guardaremos FechaFactura
    this.preOrdenTemporalSacos.FechaFactura = this.FechaFactura;
    //^ guardaremos el tipo de cambio ingresado
    this.preOrdenTemporalSacos.TipoCambio = this.TipoCambio;    
    //^ En Pedimento guardaremos Numero Entrada (CBK)
    this.preOrdenTemporalSacos.Pedimento = this.NumeroEntrada;
    /* this.preOrdenTemporalSacos.Sacos = this.numerofactura; */

    // this.ordenTemporalService.preOrdenTemporalSacos.push(this.preOrdenTemporalSacos)
    // this.listDataSacosIngresados = new MatTableDataSource(this.preOrdenTemporalSacos);
    // this.listData.sort = this.sort;
    // this.listData.paginator = this.paginator;
    // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';


    



    // console.log(this.ordenTemporalService.posicionOrdenTemporalOD, 'posicion3');
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'posicion3');
    // if (this.ordenTemporalService.preOrdenTemporalSacos.length == 0) {
    //   console.log('lenght 0');


    //   this.ingresoSacos()
    //   console.log('solo se debe mostrar 1 vez');

    // } else {

    // console.log('length else');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto);

    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);

    // console.log(this.ordenTemporalService.posicionOrdenTemporalOD, 'posicion1');
    // let posicion = this.ordenTemporalService.posicionOrdenTemporalOD
    // for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalSacos.length - 1; i++) {
    // console.log('for');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto);
    // console.log(posicion, 'posicion2');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto, 'probando');

    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto + 'lo trae od ' + this.ordenTemporalService.preOrdenTemporalSacos[i].ClaveProducto + 'OT');
    // if (this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto == this.ordenTemporalService.preOrdenTemporalSacos[i].ClaveProducto && this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Lote == this.ordenTemporalService.preOrdenTemporalSacos[i].Lote) {
    //   console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    //   console.log('if');
    //   Swal.fire({
    //     title: 'El Producto ya se Ingreso',
    //     icon: 'warning',
    //     text: ''
    //   });
    //   // this.ordenTemporalService.preOrdenTemporalSacos.splice(i, 1); 
    //   // this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    //   // this.listData.sort = this.sort;
    //   // this.listData.paginator = this.paginator;
    //   // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    //   this.sacosSaldo = null;
    //   this.ordenTemporalService.posicionOrdenTemporalOD = null
    //   return;
    // }
    // }
    // this.ingresoSacos();

    // }
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    this.agregarProductos();
  }

  // ingresoSacos() {
  //   /* console.clear(); */
  //   // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresadosTotales = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos - +this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo).toString()
  //   if (this.InputComentarios == '' || this.InputComentarios == null) {
  //     console.log('comentario if');
  //     // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = 'NA'
  //     this.preOrdenTemporalSacos.Comentarios = 'Sin Comentarios'
  //   } else {
  //     console.log('comentario else');
  //     // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.InputComentarios
  //     this.preOrdenTemporalSacos.Comentarios = this.InputComentarios
  //   }
  //   console.log('sipaso');
  //   // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos, 'Cantidad de sacos');
  //   // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados, 'Sacos ingresados');

  //   // console.log(this.ordenTemporalService.preOrdenTemporalSacos);
  //   // console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'posicion');


  //   //aqui

  //   // this.ordenTemporalService.preOrdenTemporalSacos[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados;
  //   // this.ordenTemporalService.preOrdenTemporalSacos[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios;

  //   this.ordenTemporalService.preOrdenTemporalSacos.push(this.preOrdenTemporalSacos)
  //   // this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
  //   // this.listData.sort = this.sort;
  //   // this.listData.paginator = this.paginator;
  //   // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

  //   this.kilogramosSaldo = null;
  //   this.ordenTemporalService.posicionOrdenTemporalOD = null


  //   // this.isVisibleVisualizacion = true;

  //   console.log(this.Tarimaservice.tarimaDetalleDOD, 'tarimadetallealinicio00000000000');
  // }

  // ActualizarOrdenTemporalSI() {
  //  /*  this.ordenTemporalService.preOrdenTemporalSacos = []
  //   this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
  //   this.listData.sort = this.sort;
  //   this.listData.paginator = this.paginator;
  //   this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina'; */
  // }



  onDeleteSacos(row: any, posicion: any) {

    console.log(posicion);
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    console.log(row);



    this.ordenTemporalService.preOrdenTemporalSacos.splice(posicion, 1);


    // this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados = (+this.dataODID[row.posicionArreglo].Sacos - +this.dataODID[row.posicionArreglo].Saldo).toString();
    // this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo + +this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados).toString()

    // console.log(this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo, 'saldo');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados);
    // this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    // this.listData.sort = this.sort;
    // this.listData.paginator = this.paginator;
    // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';




  }

  // agregarProductos2(){
  //   console.log(this.ordenTemporalService.preOrdenTemporalSacos);
  //   let POTS = this.ordenTemporalService.preOrdenTemporalSacos;


  //   for (let j = 0; j <= POTS.length - 1; j++) {
  //   let IdOD = POTS[j].IdOrdenDescarga
  //   console.log(IdOD);
  //   // Update a detalleordencompra para actualizar lote,y fechas
  //   console.log(POTS[j].IdDetalleOrdenDescarga);
  //   console.log(POTS[j].Lote);
  //   console.log(POTS[j].FechaCaducidad);
  //   console.log(POTS[j].FechaMFG);

  //   console.log(POTS[j]);
  
  //    /*  this.service.OnEditDetalleOrdenDescarga(POTS[j]).subscribe(res => {
  //       console.log(res);

  //     }) */
  //   }
  // }

  agregarProductos() {
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    console.log(this.preOrdenTemporalSacos);
    let POTS = this.preOrdenTemporalSacos;


    for (let j = 0; j <= POTS.length - 1; j++) {
      let IdOD = POTS[j].IdOrdenDescarga
      console.log(IdOD);
      // Update a detalleordencompra para actualizar lote,y fechas
      console.log(POTS[j].IdDetalleOrdenDescarga);
      console.log(POTS[j].Lote);
      console.log(POTS[j].FechaCaducidad);
      console.log(POTS[j].FechaMFG);

      this.service.OnEditDetalleOrdenDescarga(POTS[j]).subscribe(res => {
        console.log(res);

      })
    }

    // for (let i = 0; i < this.ordenTemporalService.preOrdenTemporalSacos.length; i++) {

      let detalletarimanueva = new DetalleTarima;

      detalletarimanueva = {
        IdDetalleTarima: 0,
        ClaveProducto: this.preOrdenTemporalSacos.ClaveProducto,
        Producto: this.preOrdenTemporalSacos.Producto,
        SacosTotales: (+this.preOrdenTemporalSacos.KilogramosIngresados / + this.preOrdenTemporalSacos.PesoxSaco).toFixed(4),
        PesoxSaco: this.preOrdenTemporalSacos.PesoxSaco,
        Lote: this.preOrdenTemporalSacos.Lote,
        PesoTotal: this.preOrdenTemporalSacos.KilogramosIngresados,
        SacosxTarima: '',
        TarimasTotales: '',
        Bodega: this.service.formData.Destino,
        IdProveedor: this.preOrdenTemporalSacos.IdProveedor,
        Proveedor: this.preOrdenTemporalSacos.Proveedor,
        PO: this.PODescarga,
        FechaMFG: this.preOrdenTemporalSacos.FechaMFG,
        FechaCaducidad: this.preOrdenTemporalSacos.FechaCaducidad,
        Shipper: this.preOrdenTemporalSacos.Shipper,
        USDA: this.preOrdenTemporalSacos.USDA,
        Pedimento: this.preOrdenTemporalSacos.Pedimento,
        Estatus: 'Creada',
      }

      console.log(detalletarimanueva);


      this.Tarimaservice.addDetalleTarima(detalletarimanueva).subscribe(resp => {
        console.log(resp);
        this.Tarimaservice.getUltimoDetalleTarima().subscribe(ultimo => {
          console.log(ultimo);
          let ordentemporalnueva = new OrdenTemporal;

          ordentemporalnueva = {
            IdOrdenTemporal: 0,
            IdDetalleTarima: +ultimo[0].IdDetalleTarima,
            IdOrdenCarga: 0,
            IdOrdenDescarga: this.preOrdenTemporalSacos.IdOrdenDescarga,
            QR: '',
            NumeroFactura: this.numerofactura,
            NumeroEntrada: this.NumeroEntrada,
            ClaveProducto: this.preOrdenTemporalSacos.ClaveProducto,
            Lote: this.preOrdenTemporalSacos.Lote,
            Sacos: (+this.preOrdenTemporalSacos.KilogramosIngresados / + this.preOrdenTemporalSacos.PesoxSaco).toFixed(4),
            Producto: this.preOrdenTemporalSacos.Producto,
            PesoTotal: this.preOrdenTemporalSacos.KilogramosIngresados,
            FechaCaducidad: this.preOrdenTemporalSacos.FechaCaducidad,
            FechaMFG: this.preOrdenTemporalSacos.FechaMFG,
            Comentarios: '',
            CampoExtra1: this.PODescarga,
            //^ Aqui Guardaremos el Tipo de Cambio
            CampoExtra2: this.preOrdenTemporalSacos.TipoCambio,
            //^ Aqui Guardaremos la Fecha de la Factura
            CampoExtra3: this.preOrdenTemporalSacos.FechaFactura
          }

          console.log(ordentemporalnueva);

          this.ordenTemporalService.addOrdenTemporal(ordentemporalnueva).subscribe(res => {
            console.log(res);
            // console.log(resp);
            let Lote = this.preOrdenTemporalSacos.Lote;
            let ClaveProducto = this.preOrdenTemporalSacos.ClaveProducto;
            let Kilos = this.preOrdenTemporalSacos.KilogramosIngresados;
            /* let Sacos = this.ordenTemporalService.preOrdenTemporalSacos[i]; */

            this.service.getDetalleOrdenDescargaIdClave(this.IdOrdenDescarga, ClaveProducto).subscribe(dataOD => {
              console.log(dataOD);
              console.log(dataOD[0].Saldo);
              console.log(Kilos);
              let NuevoSaldo = ((+dataOD[0].Saldo) - (+Kilos)).toString();
              console.log(NuevoSaldo);
                this.updateOrdenDescarga(this.service.formData,'Proceso');
              this.service.updateDetalleOrdenDescargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
                console.log(res);

                  Swal.fire({
        title: 'Producto Descargado',
        icon: 'success',
        text: '',
        timer: 2000
      });

         //^Limpiar campos visuales
    this.NombreProducto = null;
    this.numerofactura = null;
    this.FechaFactura = null;
    this.TipoCambio = null;
    this.PO = null;
    this.PODescarga = null;
    this.NumeroEntrada = null;
    this.cantidadKilogramos = null;
    this.lote = null;
    this.fechaCaducidad = null;
    this.fechaMFG = null;

                // POTS = [];
                // this.ordenTemporalService.preOrdenTemporalSacos = []
                // this.listDataSacosIngresados = new MatTableDataSource(POTS);
                // this.listData.sort = this.sort;
                // this.listData.paginator = this.paginator;
                // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

                this.refreshOrdenDescargaList();
                this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                // console.log('actualizar');
                // this.isVisibleOT = true;
                this.actualizarTablaOrdenTemporal();
              })
            })
          })
        })
      })
    // }
  }

  onAddTarimaOT() {
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    let POTS = this.ordenTemporalService.preOrdenTemporalSacos;

    console.log(POTS, 'POTS');
    //trae el ultimo que se selecciono
    console.log(this.preOrdenTemporalSacos, 'this.preordenTemporalSacos');

    if (POTS.length == 0) {
      Swal.fire({
        title: 'Ingresar Sacos a la Tarima',
        icon: 'warning',
        text: 'No se Puede Crear una Tarima Vacia'
      });
    }
    else {
      let IdOD = POTS[0].IdOrdenDescarga
      console.log(IdOD);
      // Update a detalleordencompra para actualizar lote,y fechas
      console.log(POTS[0].IdDetalleOrdenDescarga);
      console.log(POTS[0].Lote);
      console.log(POTS[0].FechaCaducidad);
      console.log(POTS[0].FechaMFG);
      for (let j = 0; j <= POTS.length - 1; j++) {
        this.service.OnEditDetalleOrdenDescarga(POTS[j]).subscribe(res => {
          console.log(res);

        })
      }
      // se hace un get para obtener la OD y de ahi tomar el peso por saco
      this.service.getOrdenDescargaIDList(IdOD).subscribe(dataOD => {
        console.log(dataOD)

        let TarimaTemp = new Tarima();
        let DetalleTarimaTemp = new DetalleTarima();
        let sacosTarima = 0;
        let PesoTotalTarima = 0;

        for (let i = 0; i <= POTS.length - 1; i++) {
          //Tarima
          sacosTarima = +POTS[i].KilogramosIngresados + +sacosTarima;
          PesoTotalTarima = ((+POTS[i].KilogramosIngresados) * (+this.dataODID[i].PesoxSaco)) + PesoTotalTarima
        }
        TarimaTemp.IdTarima = 0;
        TarimaTemp.Sacos = sacosTarima.toString();
        TarimaTemp.PesoTotal = PesoTotalTarima.toString();
        TarimaTemp.QR = nanoid(7);
        TarimaTemp.Bodega = 'PasoTx';
        console.log(TarimaTemp, "TARIMA");
// asignar valor a la variable de QR previamente creado
        this.QRtarima = TarimaTemp.QR
        localStorage.setItem("QRtarima", this.QRtarima);

        this.Tarimaservice.addTarima(TarimaTemp).subscribe(resAdd => {
          console.log(resAdd);

          for (let i = 0; i <= POTS.length - 1; i++) {

            this.Tarimaservice.getUltimaTarima().subscribe(DataTarima => {
              let IdTarimaDt = DataTarima[0].IdTarima;
              let Sacos = POTS[i].KilogramosIngresados;
              let Lote = POTS[i].Lote;
              let ClaveProducto = POTS[i].ClaveProducto;

              //detalle tarima
              console.log(this.ordenTemporalService.preOrdenTemporalSacos);

              DetalleTarimaTemp.IdDetalleTarima = 0;
              DetalleTarimaTemp.IdDetalleTarima = IdTarimaDt;
              DetalleTarimaTemp.ClaveProducto = POTS[i].ClaveProducto;
              DetalleTarimaTemp.Producto = POTS[i].Producto;
              DetalleTarimaTemp.SacosTotales = POTS[i].KilogramosIngresados;
              DetalleTarimaTemp.PesoxSaco = POTS[i].PesoxSaco;
              DetalleTarimaTemp.Lote = POTS[i].Lote;
              DetalleTarimaTemp.IdProveedor = POTS[i].IdProveedor;
              DetalleTarimaTemp.Proveedor = POTS[i].Proveedor;
              DetalleTarimaTemp.PO = POTS[i].PO;
              DetalleTarimaTemp.FechaMFG = POTS[i].FechaMFG;
              DetalleTarimaTemp.FechaCaducidad = POTS[i].FechaCaducidad;
              DetalleTarimaTemp.Shipper = POTS[i].Shipper;
              DetalleTarimaTemp.USDA = POTS[i].USDA;
              DetalleTarimaTemp.Pedimento = POTS[i].Pedimento;

              console.log(DetalleTarimaTemp, 'DETALLETARIMA a DB');

              this.Tarimaservice.addDetalleTarima(DetalleTarimaTemp).subscribe(DataTemp => {
                console.log(DataTemp);
              })

              //insercion a orden temporal
              let ordenTemp = new OrdenTemporal();

              ordenTemp.IdOrdenTemporal = 1;
              ordenTemp.IdDetalleTarima = IdTarimaDt;
              ordenTemp.IdOrdenCarga = 0;
              ordenTemp.IdOrdenDescarga = this.IdOrdenDescarga;
              ordenTemp.QR = TarimaTemp.QR;
              ordenTemp.ClaveProducto = POTS[i].ClaveProducto;
              ordenTemp.Lote = POTS[i].Lote;
              ordenTemp.Sacos = POTS[i].KilogramosIngresados;
              ordenTemp.Producto = POTS[i].Producto;
              ordenTemp.PesoTotal = ((+POTS[i].KilogramosIngresados) * (+this.dataODID[i].PesoxSaco)).toString();
              // ordenTemp.PesoTotal = ((+this.ordenTemporalService.preOrdenTemporalOD[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)).toString();
              ordenTemp.FechaCaducidad = POTS[i].FechaCaducidad;
              ordenTemp.Comentarios = POTS[i].Comentarios;
              console.log(ordenTemp, 'ordentemp´final');

              this.ordenTemporalService.addOrdenTemporal(ordenTemp).subscribe(DataOT => {
                console.log(DataOT);

                //se tomara el valor de sacos, para ser modificado en update saldo
                console.log(this.IdOrdenDescarga);
                console.log(Lote);
                console.log(ClaveProducto);
                this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOD => {
                  console.log(dataOD);
                  console.log(Sacos);
                  let NuevoSaldo = ((+dataOD[0].Saldo) - (+Sacos)).toString();
                  this.service.updateDetalleOrdenDescargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
                    console.log(res);

                    // POTS = [];
                    // this.ordenTemporalService.preOrdenTemporalSacos = []
                    // this.listDataSacosIngresados = new MatTableDataSource(POTS);
                    // this.listData.sort = this.sort;
                    // this.listData.paginator = this.paginator;
                    // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

                    this.refreshOrdenDescargaList();
                    // this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                    // this.listData.sort = this.sort;
                    // this.listData.paginator = this.paginator;
                    // this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                    // console.log('actualizar');
                    // this.isVisibleOT = true;
                    this.actualizarTablaOrdenTemporal();
                    Swal.fire({
                      title: 'Producto Descargado',
                      icon: 'success',
                      timer: 2000,
                      showCancelButton: false,
                      showConfirmButton: false
                    });
                  })
                })

              })
            })
          }
        })
        console.log(this.QRtarima);
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        this.dialog.open(QrComponent, dialogConfig);
      })



      
      // Swal.fire({
      //   title: 'Tarima Creada Correctamente',
      //   icon: 'success',
      //   text: 'QR: ' + this.QRtarima,
      // });
      //fin de la insercion

    }
  }

  QRmodal(row: OrdenTemporal){
    console.log(row);
    this.QRtarima = row.QR
 localStorage.setItem("QRtarima", this.QRtarima);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(QrComponent, dialogConfig);
  }

  // no regresa el saldo
  regresarConceptos(row: OrdenTemporal) {
    console.log(row, "row");
    let Lote = row.Lote;
    let ClaveProducto = row.ClaveProducto;
    let IdTarimaOD = row.IdDetalleTarima;
    let undoQR = row.QR;
    Swal.fire({
      title: '¿Seguro de Borrar Ingreso(s)?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //Obtener todos los productos que sean del mismo QR
        console.log(this.IdOrdenDescarga);
        console.log(undoQR);
        this.ordenTemporalService.GetOrdenTemporalIdqrOD(this.IdOrdenDescarga, undoQR).subscribe(dataOt => {
          console.log(dataOt);
          let idtarima = dataOt[0].IdDetalleTarima;
          //Actualizar Saldos a su estado original
          for (let l = 0; l <= dataOt.length - 1; l++) {
            let SaldoActual;
            let SaldoFinal;
            let Sacos = +dataOt[l].Sacos;
            let idtarima = dataOt[l].IdDetalleTarima;
            this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, dataOt[l].Lote, dataOt[l].ClaveProducto).subscribe(dataDetalle => {
              console.log(dataDetalle);
              SaldoActual = +dataDetalle[0].Saldo;
              console.log(SaldoActual);
              console.log(Sacos);
              SaldoFinal = SaldoActual + Sacos;
              console.log(SaldoFinal);
              this.service.updateDetalleOrdenDescargaSaldo(dataDetalle[0].IdDetalleOrdenDescarga, SaldoFinal.toString()).subscribe(res => {
                console.log(res);
// regresar lote a cero
                for (let j = 0; j <= dataOt.length - 1; j++) {
                  dataDetalle[j].Lote = '0';
                  dataDetalle[j].FechaCaducidad = new Date()
                  dataDetalle[j].FechaMFG = new Date()
                  console.log(dataDetalle[j].FechaMFG);
                  this.service.OnEditDetalleOrdenDescarga(dataDetalle[j]).subscribe(res => {
                    console.log(res);
                    console.log('si actualizo el dT');
          
                  })
                }

                this.ordenTemporalService.deleteOrdenTemporal(dataOt[l].IdOrdenTemporal).subscribe(res => {
                  this.Tarimaservice.getTarimaID(idtarima).subscribe(resDataTarima => {
                    this.Tarimaservice.getDetalleTarimaIdClaveLote(IdTarimaOD, ClaveProducto, Lote).subscribe(resDTTIDCL => {
                      console.log(resDTTIDCL[0]);
                      this.Tarimaservice.getDetalleTarimaID(resDTTIDCL[0].IdDetalleTarima).subscribe(resDataTarimadt => {
                        console.log(resDataTarimadt, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                        console.log(resDataTarimadt[0]);
                        let delDTT = resDataTarimadt[0].IdDetalleTarima;
                        console.log(delDTT);
                        this.Tarimaservice.deleteDetalleTarima(delDTT).subscribe(resDOD => {
                          console.log(resDOD);
                          console.log(res);
                          this.Tarimaservice.deleteTarima(IdTarimaOD).subscribe(resDeleteTarima => {
                            console.log(resDeleteTarima);


                            Swal.fire({
                              title: 'Borrado',
                              icon: 'success',
                              timer: 1000,
                              showCancelButton: false,
                              showConfirmButton: false
                            });
                            console.log(l);
                            console.log(dataOt.length);
                            if (l == dataOt.length - 1) {
                              this.actualizarTablaOrdenTemporal();
                            }
                            //regresar los valores ya con los saldos reiniciados
                            this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                            this.listData.sort = this.sort;
                            this.listData.paginator = this.paginator;
                            this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                            this.service.filter('Register click');

                            this.actualizarTablaOrdenTemporal();
                            this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                            this.listData.sort = this.sort;
                            this.listData.paginator = this.paginator;
                            this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          }
        })
      }
    })
  }

  onDeleteProductOT(ot: OrdenTemporal, posicion: any) {
    console.log(ot, 'OT');
    let Lote = ot.Lote;
    let ClaveProducto = ot.ClaveProducto;
    let IdTarimaOD = ot.IdDetalleTarima;
    let sacosTup = ot.Sacos;
    let posicionborrar = posicion;
    console.log(posicionborrar, 'Posicion a borrar');
    Swal.fire({
      title: '¿Seguro de Borrar Producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {



        //Obtener Detalle Orden de descarga, para ser actualizado posteriormente
        console.log(this.IdOrdenDescarga);
        console.log(Lote);
        console.log(ClaveProducto);
        this.service.getDetalleOrdenDescargaIdClave(this.IdOrdenDescarga, ClaveProducto).subscribe(dataOrdenDescarga => {
          console.log(dataOrdenDescarga, 'dataOrdenDescarga');
          console.log(+dataOrdenDescarga[0].Saldo);
          console.log(ot.Sacos);
          let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) + (+ot.PesoTotal)).toString();
          let pesoSaco = dataOrdenDescarga[0].PesoxSaco;
          console.log(NuevoSaldo)
            // Actualizar Saldo de la tabla Detalle Orden Descarga
          this.service.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
          //   console.log(res, 'res');
          //   dataOrdenDescarga[0].Lote = '0'
          //   dataOrdenDescarga[0].FechaCaducidad = new Date()
          //   dataOrdenDescarga[0].FechaMFG = new Date()
          //   console.log(dataOrdenDescarga[0]);
          //     this.service.OnEditDetalleOrdenDescarga(dataOrdenDescarga[0]).subscribe(res => {
          //       console.log(res);
          //       console.log('si actualizo el dT');
      
                this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(res => {
          //         this.actualizarTablaOrdenTemporal();
          //         this.Tarimaservice.getTarimaID(IdTarimaOD).subscribe(resDataTarima => {
          //           console.log(resDataTarima[0], 'lo que tiene la tarima');
          //           // que traiga el peso por saco ya que trae los sacos totales
          //           console.log(pesoSaco, 'peso por saco a multiplicar');
          //           console.log(sacosTup, 'Sacos a multiplicar');
          //           let pesoProd = +sacosTup * +pesoSaco;
          //           let idTarimaUpt = resDataTarima[0].IdTarima;
          //           let sacosTarimaUpt = (+resDataTarima[0].Sacos - +sacosTup).toString();
          //           let pesoTarimaUpt = (+resDataTarima[0].PesoTotal - +pesoProd).toString();
          //           console.log(pesoTarimaUpt, 'peso total a guardarse');
          //           this.Tarimaservice.updateTarimaSacosPeso(idTarimaUpt, sacosTarimaUpt, pesoTarimaUpt).subscribe(dataUptsacos => {
          //             console.log(dataUptsacos);
          //             console.log(idTarimaUpt, ClaveProducto, Lote, 'id,cp,L');
          //             this.Tarimaservice.getDetalleTarimaIdClaveLote(idTarimaUpt, ClaveProducto, Lote).subscribe(resDTTIDCL => {
          //               console.log(resDTTIDCL[0]);
          //               this.Tarimaservice.getDetalleTarimaID(resDTTIDCL[0].IdDetalleTarima).subscribe(resDataTarimadt => {
          //                 console.log(resDataTarimadt, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          //             console.log(resDataTarimadt[0]);
          //             let delDTT = resDataTarimadt[0].IdDetalleTarima;
          //             console.log(delDTT);
                      this.Tarimaservice.deleteDetalleTarima(ot.IdDetalleTarima).subscribe(resDOD => {
          //               console.log(resDOD);
          //               this.Tarimaservice.getDetalleTarimaID(resDataTarimadt[0].IdDetalleTarima).subscribe(resdetallet => {
          //                 if (resdetallet.length == 0) {
          //                   this.Tarimaservice.deleteTarima(IdTarimaOD).subscribe(resDeleteTarima => {
          //                     console.log(resDeleteTarima);
                              
                              
                              
                              
                              
                              Swal.fire({
                                title: 'Producto Borrado',
                                icon: 'success',
                                timer: 1000,
                                showCancelButton: false,
                                showConfirmButton: false
                              });
                              // this.service.filter('Register click');

                              this.actualizarTablaOrdenTemporal();
                              this.refreshOrdenDescargaList();
                              // this.ref
                              // this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                              // this.listData.sort = this.sort;
                              // this.listData.paginator = this.paginator;
                              // this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
          //                   });
          //                 }
          //               });
          //             });
          //           });
          //         });
          //       });
          //     });
            })
              
            });




          });  
          
          
        });
      }
    })
  }
  
  
  actualizarTablaOrdenTemporal() {
    console.log('actualiza');
    this.ordenTemporalService.GetOrdenTemporalIDOD(this.IdOrdenDescarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      if (dataOrdenTemporal.length > 0) {
        console.log('Si hay Movimientos en esta orden de Descarga');
        this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      } else {
        console.log('No hay Movimientos en esta orden de Descarga');

        this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';


        // this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      }
    })
  }


  onEditOT(ordenTemporal: OrdenTemporal, id: number) {
    console.log(ordenTemporal);
    console.log(id);
    console.log(ordenTemporal.Lote);
    this.ordenTemporalService.ordenTemporalDataOD = ordenTemporal;
    this.ordenTemporalService.posicionOrdenTemporalOD = id;

    this.service.getDetalleOrdenDescargaIdClave(this.IdOrdenDescarga, ordenTemporal.ClaveProducto).subscribe(dataed => {
      console.log(dataed);
      // this.ordenTemporalService.sacosETOD = +dataed[0].Sacos;
      //^ Obtener el total de kilogramos
      this.ordenTemporalService.sacosETOD = +ordenTemporal.Sacos;
      this.ordenTemporalService.kgETOD = +ordenTemporal.PesoTotal;
      // this.ordenTemporalService.pesoETOD = +ordenTemporal.PesoTotal;
      this.ordenTemporalService.pesoETOD = +dataed[0].PesoxSaco;
      // this.ordenTemporalService.kgETOD = ((+dataed[0].Sacos)*(+dataed[0].PesoxSaco))

      console.log(this.ordenTemporalService.pesoETOD, 'sacos para tomar de base');
      console.log(this.ordenTemporalService.kgETOD, 'kg para tomar de base');
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      dialogConfig.data = {
        estatus: this.estatusOrdenDescarga
      }
      this.dialog.open(OrdenDescargaConceptoComponent, dialogConfig);
    });


  }

  changeMat(evento, tipo) {
    if(tipo == 'Caducidad'){
      this.preOrdenTemporalSacos.FechaCaducidad = evento.target.value;
      this.change(this.preOrdenTemporalSacos.FechaCaducidad);
      
    }else if(tipo == 'Factura'){
      this.preOrdenTemporalSacos.FechaFactura = evento.target.value;
      this.change(this.preOrdenTemporalSacos.FechaFactura);
      this.tc(this.preOrdenTemporalSacos.FechaFactura);

    }
  }

  tc(date){

    console.log(date);
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    let dia;
    let dia2;
    let mes;
    let mes2;
    let año;
    let hora;
    let min;
    let seg;
    let diaf;
    
    let fecha = new Date(date);

    if (((fecha.getDate()+1)==31) && ((fecha.getMonth()==1) || (fecha.getMonth()==3) || (fecha.getMonth()==5) || (fecha.getMonth()==8) || (fecha.getMonth()==10))){
      diaf = 1;
      mes2 = `${months[fecha.getMonth()+1]}`;
    }else if ((fecha.getDate()+1)==32){
      diaf = 1;
      mes2 = `${months[fecha.getMonth()+1]}`;
    }else{
      diaf = fecha.getDate()+1
      mes2 = `${months[fecha.getMonth()]}`;
    }



    mes = `${months[fecha.getMonth()]}`;
    dia = `${days[fecha.getDate()]}`;
    dia2 = `${days[diaf]}`;
    
    año = fecha.getFullYear();
    hora = fecha.getHours();
    min = fecha.getMinutes();
    seg = fecha.getSeconds();

    hora = '00';
    min = '00';
    seg = '00';

    this.fecha2 = año + '-' + mes + '-' + dia + 'T' + hora + ':' + min + ':' + seg
    console.log(fecha);
    console.log(this.fecha2);

    let fechaapi = año + '-' + mes2 + '-' + dia2


    this.traerApi(fechaapi).subscribe(data =>{
      let l;
      console.log(data);
      l = data.bmx.series[0].datos[0].dato;
      console.log(l);
      this.TipoCambio = parseFloat(l).toFixed(4);
  
      
    })
  }

  traerApi(fecha): Observable<any>{

    //return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/"+fecha+'/'+fecha, httpOptions)
    return this.http.get("/SieAPIRest/service/v1/series/SF60653/datos/"+fecha+'/'+fecha, httpOptions)

  }

  change(date: any) {
    //2020-02-26T07:00:00
    console.log(date);
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    let dia;
    let dia2;
    let mes;
    let año;
    let hora;
    let min;
    let seg;

    let fecha = new Date(date);


    dia = `${days[fecha.getDate()]}`;
    dia2 = `${days[fecha.getDate() - 1]}`;
    mes = `${months[fecha.getMonth()]}`;
    año = fecha.getFullYear();
    hora = fecha.getHours();
    min = fecha.getMinutes();
    seg = fecha.getSeconds();

    hora = '00';
    min = '00';
    seg = '00';

    this.fecha2 = año + '-' + mes + '-' + dia + 'T' + hora + ':' + min + ':' + seg
    console.log(fecha);
    console.log(this.fecha2);


  }

  // qr
  private _filter(value: any): any[] {
    console.log(value);

    console.log(this.Tarimaservice.formDataDrop);

    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.QR.toLowerCase().includes(filterValue));

  }

  // dropdownRefresh() {
  //   this.Tarimaservice.getTarima().subscribe(data => {
  //     for (let i = 0; i < data.length; i++) {
  //       let Qr = data[i];
  //       this.listQR.push(Qr);
  //       this.options.push(Qr)
  //       this.filteredOptions = this.myControl.valueChanges
  //         .pipe(
  //           startWith(''),
  //           map(value => this._filter(value))
  //         );
  //     }
  //   });

  // }

  //on blur se usa para que en caso de modificar el filtro no se borre el dato que esta dentro del select, limpia el arreglo y lo vuelve a llenar desde DB
  // onBlurQR() {
  //   console.log('blur');
  //   this.listQR = [];
  //   this.options = [];
  //   this.dropdownRefresh();
  // }

  onSelectionChange(options: Tarima, event: any) {
    if (event.isUserInput) {
      this.Tarimaservice.formDataDrop = options;
    }
  }

  onSubmit(form: NgForm) {
    this.POTSTE = this.ordenTemporalService.preOrdenTemporalSacos;
    let TarimaDataQR = this.Tarimaservice.formDataDrop

    if (TarimaDataQR.QR == null) {
      Swal.fire({
        title: 'Ingresar QR',
        icon: 'warning',
        text: ''
      });

    } else {

      for (let j = 0; j <= this.POTSTE.length - 1; j++) {
        this.service.OnEditDetalleOrdenDescarga(this.POTSTE[j]).subscribe(res => {
          console.log(res);
          console.log('si actualizo el dT');

        })
      }

      console.log(TarimaDataQR);
      let idTarima = TarimaDataQR.IdTarima;
      let codigoQR = TarimaDataQR.QR;
      let sacos
      let DTTE = new Array<DetalleTarima>();
      this.Tarimaservice.getTarimaID(idTarima).subscribe(resDataTarima => {
        let sacosOT = +resDataTarima[0].Sacos;
        let pesoTotalOT = +resDataTarima[0].PesoTotal;
        let PesoTotalTarima = 0;
        for (let i = 0; i <= this.POTSTE.length - 1; i++) {
          let Dt = new DetalleTarima();
          // Dt = this.POTSTE[i];

          PesoTotalTarima = ((+this.POTSTE[i].SacosIngresados) * (+this.POTSTE[i].PesoxSaco))

          Dt.IdDetalleTarima = idTarima;
          Dt.ClaveProducto = this.POTSTE[i].ClaveProducto;
          Dt.Producto = this.POTSTE[i].Producto;
          Dt.SacosTotales = this.POTSTE[i].SacosIngresados;
          Dt.PesoxSaco = this.POTSTE[i].PesoxSaco;
          Dt.Lote = this.POTSTE[i].Lote;
          Dt.IdProveedor = this.POTSTE[i].IdProveedor;
          Dt.Proveedor = this.POTSTE[i].Proveedor;
          Dt.PO = this.POTSTE[i].PO;
          Dt.FechaMFG = this.POTSTE[i].FechaMFG;
          Dt.FechaCaducidad = this.POTSTE[i].FechaCaducidad;
          Dt.Shipper = this.POTSTE[i].Shipper;
          Dt.USDA = this.POTSTE[i].USDA;
          Dt.Pedimento = this.POTSTE[i].Pedimento;
          DTTE.push(Dt);
          sacosOT = (+sacosOT + +DTTE[i].SacosTotales)
          // pesoTotalOT =( +pesoTotalOT + +this.POTSTE[i].PesoTotal)
          pesoTotalOT = (+pesoTotalOT + +PesoTotalTarima)
        }
        console.log(DTTE)
        console.warn(idTarima);
        console.log(this.POTSTE)
        console.log(sacosOT);
        console.log(pesoTotalOT);
        this.Tarimaservice.updateTarimaSacosPeso(idTarima, sacosOT.toString(), pesoTotalOT.toString()).subscribe(dataT => {

          for (let i = 0; i <= DTTE.length - 1; i++) {


            // let sacostarimaE = +sacosOT + +resDataTarima[0].Sacos;            
            // let pesotarimaE = +pesoTotalOT + +resDataTarima[0].PesoTotal;
            this.Tarimaservice.addDetalleTarima(DTTE[i]).subscribe(DataTemp => {
              console.log(DataTemp);

              //insercion a orden temporal
              let ordenTempTE = new OrdenTemporal();

              ordenTempTE.IdOrdenTemporal = 1;
              ordenTempTE.IdDetalleTarima = idTarima;
              ordenTempTE.IdOrdenCarga = 0;
              //cambiar esta chingadera
              ordenTempTE.IdOrdenDescarga = 1;
              ordenTempTE.QR = codigoQR;
              ordenTempTE.ClaveProducto = this.POTSTE[i].ClaveProducto;
              ordenTempTE.Lote = this.POTSTE[i].Lote;
              ordenTempTE.Sacos = this.POTSTE[i].SacosIngresados;
              ordenTempTE.Producto = this.POTSTE[i].Producto;
              ordenTempTE.PesoTotal = ((+this.POTSTE[i].SacosIngresados) * (+this.POTSTE[i].PesoxSaco)).toString();
              ordenTempTE.FechaCaducidad = this.POTSTE[i].FechaCaducidad;
              ordenTempTE.Comentarios = this.POTSTE[i].Comentarios;
              console.log(ordenTempTE, 'ordenTempTE');

              // console.log(sacostarimaE);
              // console.log(pesotarimaE);


              console.log(dataT);
              this.ordenTemporalService.addOrdenTemporal(ordenTempTE).subscribe(DataOT => {
                console.log(DataOT);

                let Lote = this.POTSTE[i].Lote;
                let ClaveProducto = this.POTSTE[i].ClaveProducto;
                let Sacos = this.POTSTE[i].SacosIngresados;
                console.log(this.IdOrdenDescarga);
                console.log(Lote);
                console.log(ClaveProducto);
                this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOD => {
                  console.log(dataOD);
                  console.log(Sacos);
                  let NuevoSaldo = ((+dataOD[0].Saldo) - (+Sacos)).toString();
                  this.service.updateDetalleOrdenDescargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
                    console.log(res);

                    this.POTSTE = [];
                    this.ordenTemporalService.preOrdenTemporalSacos = []
                    // this.listDataSacosIngresados = new MatTableDataSource(this.POTSTE);
                    // this.listData.sort = this.sort;
                    // this.listData.paginator = this.paginator;
                    // this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

                    this.refreshOrdenDescargaList();
                    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                    this.listData.sort = this.sort;
                    this.listData.paginator = this.paginator;
                    this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                    // console.log('actualizar');
                    // this.isVisibleOT = true;
                    this.actualizarTablaOrdenTemporal();
                  })
                })


                // this.ordenTemporalService.filterOrdenTemporal('Register click');
                // this.ordenTemporalService.filterOrdenTemporalSI('Register click');



              })
            })
          }
        })
      }
      )
    }
  }

  toggle() {

    this.show = !this.show;


    if (this.show)
      console.log('displayed');
    else
      console.log('notdisplayed');
  }


  checarLote(){
console.log(this.preOrdenTemporalSacos.ClaveProducto);

      let consulta = {
        'consulta':"select * from detalletarima where ClaveProducto='"+this.preOrdenTemporalSacos.ClaveProducto+ "' and lote='"+this.lote+"' and Bodega='"+this.service.formData.Destino+"';"
      };
  
      console.log(consulta);
      this.serviceTarima.generarConsulta(consulta).subscribe((data:any)=>{
      console.log(data);
        if (data.length>0){
            
          this.fechaCaducidad = new Date(data[0].FechaCaducidad);
          this.fechaMFG = new Date(data[0].FechaMFG);
  
        }
  
      })
  

  }

}