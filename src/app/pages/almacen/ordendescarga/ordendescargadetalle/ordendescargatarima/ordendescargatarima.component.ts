import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig } from '@angular/material';
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
import { OrdenCargaConceptoComponent } from '../../../pedidosalmacen/ordencargadetalle/preparar/orden-carga-concepto/orden-carga-concepto.component';
import { OrdenDescargaConceptoComponent } from 'src/app/components/almacen/orden-descarga/ordendescargadetalle/ordendescargatarima/orden-descarga-concepto/orden-descarga-concepto.component';
import { OrdenDecargaTarimaExistenteComponent } from '../../../../../components/almacen/orden-descarga/ordendescargadetalle/ordendescargatarima/orden-decarga-tarima-existente/orden-decarga-tarima-existente.component';
import { map, startWith } from 'rxjs/operators';




@Component({
  selector: 'app-ordendescargatarima',
  templateUrl: './ordendescargatarima.component.html',
  styleUrls: ['./ordendescargatarima.component.css']
})
export class OrdendescargatarimaComponent implements OnInit {


  fecha2;
  rowDTOD: any;
  sacosSaldo: any;
  InputComentarios: string;
  NombreProducto: string;
  fechaCaducidad: Date;
  fechaMFG: Date;
  lote: string;
  sacostotal: any;
  saldototal: any;
  IdOrdenDescarga: number;
  Lote: any;
  cantidadSacos: number;
  ClaveProducto: any;
  dataODID = new Array<DetalleOrdenDescarga>();
  cantidadMaximaSacos: number;
  sacosCero: boolean;
  

  // qrTarimaExistente
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listQR: Tarima[] = [];
  options: Tarima[] = [];
  POTSTE: any;
  show: boolean;



  preOrdenTemporalSacos: preOrdenTemporalODSacos;

  // isVisibleVisualizacion: boolean;
  // isVisibleOT: boolean;

  constructor(public router: Router, private dialog: MatDialog, public service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService, public Tarimaservice: TarimaService) {
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
    this.ordenTemporalService.listenOrdenTemporalSI().subscribe((m: any) => {
      console.log(m);
      this.ActualizarOrdenTemporalSI();
    });


  }
  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.refreshOrdenDescargaList();
    this.actualizarTablaOrdenTemporal();
    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporalOD = [];
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    this.Tarimaservice.tarimaDetalleDOD = [];
    this.ordenTemporalService.preOrdenTemporalSacos = [];
    this.sacosCero = true;
    this.preOrdenTemporalSacos = new preOrdenTemporalODSacos();
    this.show = false;
  }

  regresar() {
    this.router.navigate(['/ordenDescargadetalle']);
  }

  //tabla visualizacion
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Saldo', 'Lote', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //tabla Sacos Ingresados
  listDataSacosIngresados: MatTableDataSource<any>;
  displayedColumnsSacosIngresados: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'SacosIngresados', 'Lote', 'FechaCaducidad', 'FechaMFG', 'Options'];
  @ViewChild(MatSort, null) sortSacosIngresados: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorSacosIngresados: MatPaginator;

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  //desplegar 



  refreshOrdenDescargaList() {

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


        this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, this.dataODID[i].Lote, this.dataODID[i].ClaveProducto).subscribe(data => {

          console.log(data, 'IDLOTECP');
          let DOD = new preOrdenTemporalOD();
          let DTOD = new DetalleOrdenDescarga();

          DOD.IdDetalleOrdenDescarga = this.dataODID[i].IdDetalleOrdenDescarga;
          DOD.IdOrdenDescarga = this.dataODID[i].IdOrdenDescarga;
          DOD.ClaveProducto = this.dataODID[i].ClaveProducto
          DOD.Producto = this.dataODID[i].Producto
          DOD.Sacos = this.dataODID[i].Sacos
          DOD.Lote = this.dataODID[i].Lote
          DOD.Saldo = this.dataODID[i].Saldo
          DOD.PesoTotal = ((+DOD.Sacos) * (+this.dataODID[i].PesoxSaco)).toString();
          DOD.FechaCaducidad = this.dataODID[i].FechaCaducidad;
          DOD.SacosIngresados = '';
          DOD.Comentarios = 'NA';
          DOD.SacosIngresadosTotales = (+this.dataODID[i].Sacos - +this.dataODID[i].Saldo).toString();
          DOD.Pedimento = this.dataODID[i].Pedimento
          DOD.Proveedor = this.dataODID[i].Proveedor
          DOD.IdProveedor = this.dataODID[i].IdProveedor
          DOD.PO = this.dataODID[i].PO
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



        })
      }
    })
  }



  // onEdit(detalleordendescarga: DetalleOrdenDescarga, id: any) {
  onEdit(preOD: preOrdenTemporalODSacos, id: any) {
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    this.NombreProducto = this.ordenTemporalService.preOrdenTemporalOD[id].Producto
    console.log(this.ordenTemporalService.preOrdenTemporalOD[id].Producto);
    console.log(preOD);
    console.log(id);
    // console.log(detalleordendescarga);
    // this.rowDTOD = detalleordendescarga;
    console.log(id, 'posicion');
    this.ordenTemporalService.posicionOrdenTemporalOD = id;
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




    let oTSacos = new preOrdenTemporalODSacos();
    oTSacos = preOD;
    oTSacos.posicionArreglo = id;
    this.preOrdenTemporalSacos.FechaCaducidad = new Date();
    this.preOrdenTemporalSacos.FechaMFG = new Date();



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

    console.log(oTSacos, 'OTSACOS');
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'antes de push');
    this.preOrdenTemporalSacos = oTSacos;

    for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalSacos.length - 1; i++) {
      if (this.ordenTemporalService.preOrdenTemporalSacos[i].ClaveProducto == this.preOrdenTemporalSacos.ClaveProducto && this.ordenTemporalService.preOrdenTemporalSacos[i].Lote == this.preOrdenTemporalSacos.Lote) {
        Swal.fire({
          title: 'Producto YA ingresado.',
          icon: 'warning',
          text: '',
          timer: 1000
        });
        return
      }
    }
    // console.log(this.preOrdenTemporalSacos);
    // this.ordenTemporalService.preOrdenTemporalSacos.push(oTSacos);
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);

    // console.log(this.ordenTemporalService.preOrdenTemporalSacos, 'asaaaa');




  }

  //metodo que se ejecuta cuando cambia la cantidad de sacos
  onChangeCantidadSacos(cantidad: any) {
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Sacos')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.cantidadSacos;
    console.log(this.cantidadSacos);
    this.preOrdenTemporalSacos.SacosIngresados = this.cantidadSacos.toString();
    this.preOrdenTemporalSacos.SacosIngresadosTotales = ((+this.preOrdenTemporalSacos.SacosIngresadosTotales) + (this.cantidadSacos)).toString();

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
    this.cantidadSacos = cantidad;
    console.log(this.cantidadSacos + '/////////');
    this.cantidadMaximaSacos = +this.preOrdenTemporalSacos.Saldo;
    console.log(this.cantidadMaximaSacos + '/////////');
    this.sacosCero = true;
    // console.log(this.cantidadSacos, 'sacos entrando');
    // if ((+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados + +this.cantidadSacos) > this.cantidadMaximaSacos) {
    if (this.cantidadSacos >= this.cantidadMaximaSacos) {

      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadMaximaSacos.toString();
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = '0'
      this.cantidadSacos = this.cantidadMaximaSacos;
      console.log('la cantidad de sacos ingresados es mayor al saldo');
    }
    if (this.cantidadSacos <= 0) {
      console.log('La cantidad es = 0');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadSacos.toString();
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados + +this.cantidadSacos).toString(); 
      this.cantidadSacos = 0;
    }
    if (cantidad == null) {
      this.cantidadSacos = 0;
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
    this.dropdownRefresh();

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





    if (this.cantidadSacos == 0 || this.cantidadSacos == null) {
      Swal.fire({
        title: 'Ingresar Numero Valido',
        icon: 'warning',
        text: ''
      });
      return;
    }
    if (this.InputComentarios == '' || this.InputComentarios == null) {
      console.log('comentario if');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = 'NA'
      this.preOrdenTemporalSacos.Comentarios = 'NA'
    } else {
      console.log('comentario else');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.InputComentarios
      this.preOrdenTemporalSacos.Comentarios = this.InputComentarios
    }

    console.log('////////////////');
    console.log(this.fechaCaducidad);
    console.log(this.fechaMFG);

    this.preOrdenTemporalSacos.Lote = this.lote
    this.preOrdenTemporalSacos.FechaCaducidad = this.fechaCaducidad
    this.preOrdenTemporalSacos.FechaMFG = this.fechaMFG

    this.ordenTemporalService.preOrdenTemporalSacos.push(this.preOrdenTemporalSacos)
    this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    this.cantidadSacos = null;
    this.lote = null;
    this.fechaCaducidad = null;
    this.fechaMFG = null;



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
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
  }

  ingresoSacos() {
    console.clear();
    // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresadosTotales = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos - +this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo).toString()
    if (this.InputComentarios == '' || this.InputComentarios == null) {
      console.log('comentario if');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = 'NA'
      this.preOrdenTemporalSacos.Comentarios = 'Sin Comentarios'
    } else {
      console.log('comentario else');
      // this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.InputComentarios
      this.preOrdenTemporalSacos.Comentarios = this.InputComentarios
    }
    console.log('sipaso');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos, 'Cantidad de sacos');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados, 'Sacos ingresados');

    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    // console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'posicion');


    //aqui

    // this.ordenTemporalService.preOrdenTemporalSacos[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados;
    // this.ordenTemporalService.preOrdenTemporalSacos[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios;

    this.ordenTemporalService.preOrdenTemporalSacos.push(this.preOrdenTemporalSacos)
    this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    this.sacosSaldo = null;
    this.ordenTemporalService.posicionOrdenTemporalOD = null


    // this.isVisibleVisualizacion = true;

    console.log(this.Tarimaservice.tarimaDetalleDOD, 'tarimadetallealinicio00000000000');
  }

  ActualizarOrdenTemporalSI() {
    this.ordenTemporalService.preOrdenTemporalSacos = []
    this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
  }



  onDeleteSacos(row: any, posicion: any) {

    console.log(posicion);
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    console.log(row);



    this.ordenTemporalService.preOrdenTemporalSacos.splice(posicion, 1);


    // this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados = (+this.dataODID[row.posicionArreglo].Sacos - +this.dataODID[row.posicionArreglo].Saldo).toString();
    // this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo + +this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados).toString()

    // console.log(this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].Saldo, 'saldo');
    // console.log(this.ordenTemporalService.preOrdenTemporalOD[row.posicionArreglo].SacosIngresados);
    this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';




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
          sacosTarima = +POTS[i].SacosIngresados + +sacosTarima;
          PesoTotalTarima = ((+POTS[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)) + PesoTotalTarima
        }
        TarimaTemp.IdTarima = 0;
        TarimaTemp.Sacos = sacosTarima.toString();
        TarimaTemp.PesoTotal = PesoTotalTarima.toString();
        TarimaTemp.QR = nanoid(7);
        TarimaTemp.Bodega = 'ELP';
        console.log(TarimaTemp, "TARIMA");

        this.Tarimaservice.addTarima(TarimaTemp).subscribe(resAdd => {
          console.log(resAdd);

          for (let i = 0; i <= POTS.length - 1; i++) {

            this.Tarimaservice.getUltimaTarima().subscribe(DataTarima => {
              let IdTarimaDt = DataTarima[0].IdTarima;
              let Sacos = POTS[i].SacosIngresados;
              let Lote = POTS[i].Lote;
              let ClaveProducto = POTS[i].ClaveProducto;

              //detalle tarima
              console.log(this.ordenTemporalService.preOrdenTemporalSacos);

              DetalleTarimaTemp.IdDetalleTarima = 0;
              DetalleTarimaTemp.IdTarima = IdTarimaDt;
              DetalleTarimaTemp.ClaveProducto = POTS[i].ClaveProducto;
              DetalleTarimaTemp.Producto = POTS[i].Producto;
              DetalleTarimaTemp.Sacos = POTS[i].SacosIngresados;
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
              ordenTemp.IdTarima = IdTarimaDt;
              ordenTemp.IdOrdenCarga = 0;
              ordenTemp.IdOrdenDescarga = this.IdOrdenDescarga;
              ordenTemp.QR = TarimaTemp.QR;
              ordenTemp.ClaveProducto = POTS[i].ClaveProducto;
              ordenTemp.Lote = POTS[i].Lote;
              ordenTemp.Sacos = POTS[i].SacosIngresados;
              ordenTemp.Producto = POTS[i].Producto;
              ordenTemp.PesoTotal = ((+POTS[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)).toString();
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

                    POTS = [];
                    this.ordenTemporalService.preOrdenTemporalSacos = []
                    this.listDataSacosIngresados = new MatTableDataSource(POTS);
                    this.listData.sort = this.sort;
                    this.listData.paginator = this.paginator;
                    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

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
          }
        })
      })
      //fin de la insercion
    }
  }

  // no regresa el saldo
  regresarConceptos(row: OrdenTemporal) {
    console.log(row, "row");
    let Lote = row.Lote;
    let ClaveProducto = row.ClaveProducto;
    let IdTarimaOD = row.IdTarima;
    let undoQR = row.QR;
    Swal.fire({
      title: '¿Seguro de Borrar Ingreso(s)?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //Obtener todos los productos que sean del mismo QR
        console.log(this.IdOrdenDescarga);
        console.log(undoQR);
        this.ordenTemporalService.GetOrdenTemporalIdqrOD(this.IdOrdenDescarga, undoQR).subscribe(dataOt => {
          console.log(dataOt);
          let idtarima = dataOt[0].IdTarima;
          //Actualizar Saldos a su estado original
          for (let l = 0; l <= dataOt.length - 1; l++) {
            let SaldoActual;
            let SaldoFinal;
            let Sacos = +dataOt[l].Sacos;
            let idtarima = dataOt[l].IdTarima;
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
                      this.Tarimaservice.getDetalleTarimaID(resDTTIDCL[0].IdTarima).subscribe(resDataTarimadt => {
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
    let IdTarimaOD = ot.IdTarima;
    let sacosTup = ot.Sacos;
    let posicionborrar = posicion;
    console.log(posicionborrar, 'Posicion a borrar');
    Swal.fire({
      title: '¿Seguro de Borrar Producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //Obtener Detalle Orden de descarga, para ser actualizado posteriormente
        console.log(this.IdOrdenDescarga);
        console.log(Lote);
        console.log(ClaveProducto);
        this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOrdenDescarga => {
          console.log(dataOrdenDescarga, 'dataOrdenDescarga');
          console.log(+dataOrdenDescarga[0].Saldo);
          console.log(ot.Sacos);
          let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) + (+ot.Sacos)).toString();
          let pesoSaco = dataOrdenDescarga[0].PesoxSaco;
          console.log(NuevoSaldo)
          //   // Actualizar Saldo de la tabla Detalle Orden Descarga
          this.service.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
            console.log(res, 'res');
            dataOrdenDescarga[0].Lote = '0'
            dataOrdenDescarga[0].FechaCaducidad = new Date()
            dataOrdenDescarga[0].FechaMFG = new Date()
            console.log(dataOrdenDescarga[0]);
              this.service.OnEditDetalleOrdenDescarga(dataOrdenDescarga[0]).subscribe(res => {
                console.log(res);
                console.log('si actualizo el dT');
      
                this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(res => {
                  this.actualizarTablaOrdenTemporal();
                  this.Tarimaservice.getTarimaID(IdTarimaOD).subscribe(resDataTarima => {
                    console.log(resDataTarima[0], 'lo que tiene la tarima');
                    // que traiga el peso por saco ya que trae los sacos totales
                    console.log(pesoSaco, 'peso por saco a multiplicar');
                    console.log(sacosTup, 'Sacos a multiplicar');
                    let pesoProd = +sacosTup * +pesoSaco;
                    let idTarimaUpt = resDataTarima[0].IdTarima;
                    let sacosTarimaUpt = (+resDataTarima[0].Sacos - +sacosTup).toString();
                    let pesoTarimaUpt = (+resDataTarima[0].PesoTotal - +pesoProd).toString();
                    console.log(pesoTarimaUpt, 'peso total a guardarse');
                    this.Tarimaservice.updateTarimaSacosPeso(idTarimaUpt, sacosTarimaUpt, pesoTarimaUpt).subscribe(dataUptsacos => {
                      console.log(dataUptsacos);
                      console.log(idTarimaUpt, ClaveProducto, Lote, 'id,cp,L');
                      this.Tarimaservice.getDetalleTarimaIdClaveLote(idTarimaUpt, ClaveProducto, Lote).subscribe(resDTTIDCL => {
                        console.log(resDTTIDCL[0]);
                        this.Tarimaservice.getDetalleTarimaID(resDTTIDCL[0].IdTarima).subscribe(resDataTarimadt => {
                          console.log(resDataTarimadt, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                      console.log(resDataTarimadt[0]);
                      let delDTT = resDataTarimadt[0].IdDetalleTarima;
                      console.log(delDTT);
                      this.Tarimaservice.deleteDetalleTarima(delDTT).subscribe(resDOD => {
                        console.log(resDOD);
                        this.Tarimaservice.getDetalleTarimaID(resDataTarimadt[0].IdTarima).subscribe(resdetallet => {
                          if (resdetallet.length == 0) {
                            this.Tarimaservice.deleteTarima(IdTarimaOD).subscribe(resDeleteTarima => {
                              console.log(resDeleteTarima);
                              
                              
                              
                              
                              
                              Swal.fire({
                                title: 'Borrado',
                                icon: 'success',
                                timer: 1000,
                                showCancelButton: false,
                                showConfirmButton: false
                              });
                              this.service.filter('Register click');

                              this.actualizarTablaOrdenTemporal();
                              this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
                              this.listData.sort = this.sort;
                              this.listData.paginator = this.paginator;
                              this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
                            });
                          }
                        });
                      });
                    });
                  });
                });
              });
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
    // el lote no se esta guardando
    this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, ordenTemporal.Lote, ordenTemporal.ClaveProducto).subscribe(dataed => {
      console.log(dataed);
      this.ordenTemporalService.sacosETOD = +dataed[0].Sacos;
      this.ordenTemporalService.pesoETOD = +dataed[0].PesoxSaco;

      console.log(this.ordenTemporalService.pesoETOD, 'sacos para tomar de base');

    });


    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(OrdenDescargaConceptoComponent, dialogConfig);
  }

  changeMat(evento) {
    this.preOrdenTemporalSacos.FechaCaducidad = evento.target.value;
    this.change(this.preOrdenTemporalSacos.FechaCaducidad);
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
    // Causa problema al borrar el codigo
    console.log(value);

    console.log(this.Tarimaservice.formDataDrop);

    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.QR.toLowerCase().includes(filterValue));

  }

  dropdownRefresh() {
    this.Tarimaservice.getTarima().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let Qr = data[i];
        this.listQR.push(Qr);
        this.options.push(Qr)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }

  //on blur se usa para que en caso de modificar el filtro no se borre el dato que esta dentro del select, limpia el arreglo y lo vuelve a llenar desde DB
  onBlurQR() {
    console.log('blur');
    this.listQR = [];
    this.options = [];
    this.dropdownRefresh();
  }

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

          Dt.IdTarima = idTarima;
          Dt.ClaveProducto = this.POTSTE[i].ClaveProducto;
          Dt.Producto = this.POTSTE[i].Producto;
          Dt.Sacos = this.POTSTE[i].SacosIngresados;
          Dt.PesoxSaco = this.POTSTE[i].PesoxSaco;
          Dt.Lote = this.POTSTE[i].Lote;
          Dt.IdProveedor = this.POTSTE[i].IdProveedor;
          Dt.PO = this.POTSTE[i].PO;
          Dt.FechaMFG = this.POTSTE[i].FechaMFG;
          Dt.FechaCaducidad = this.POTSTE[i].FechaCaducidad;
          Dt.Shipper = this.POTSTE[i].Shipper;
          Dt.USDA = this.POTSTE[i].USDA;
          Dt.Pedimento = this.POTSTE[i].Pedimento;
          DTTE.push(Dt);
          sacosOT = (+sacosOT + +DTTE[i].Sacos)
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
              ordenTempTE.IdTarima = idTarima;
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
                    this.listDataSacosIngresados = new MatTableDataSource(this.POTSTE);
                    this.listData.sort = this.sort;
                    this.listData.paginator = this.paginator;
                    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

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

}