import { Component, OnInit, ViewChild, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenCargaService } from '../../../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { Tarima } from '../../../../../Models/almacen/Tarima/tarima-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EntradaProductoComponent } from 'src/app/components/almacen/entrada-producto/entrada-producto.component';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import Swal from 'sweetalert2';
import { OrdenCargaConceptoComponent } from './orden-carga-concepto/orden-carga-concepto.component';
import { TraspasoTarimaComponent } from '../../../traspaso-tarima/traspaso-tarima.component';
import { ScannerComponent } from 'src/app/components/scanner/scanner.component';
//IMPORTS QR SCANNER
// import { ZXingScannerComponent } from '@zxing/ngx-scanner';
// import { Result } from '@zxing/library';
import { DetalleOrdenCarga } from '../../../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { preOrdenTemporal } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporal-model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SalidaProductoComponent } from '../../../../../components/almacen/salida-producto/salida-producto.component';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { PedidoService } from '../../../../../services/pedidos/pedido.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import { DatePipe } from '@angular/common';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { EventosService } from 'src/app/services/eventos/eventos.service';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {
  enableScan = false;
  qrleido;
  isVisible: boolean;
  isVisibleQR: boolean;


  constructor(public router: Router, public tarimaService: TarimaService, public ordenCargaService: OrdenCargaService,
    public ordenTemporalService: OrdenTemporalService, private dialog: MatDialog, public traspasoSVC: TraspasoMercanciaService, public pedidoService: VentasPedidoService,
    private datePipe:DatePipe,
    private eventosService:EventosService,) {

    //Actualiza la tabla visualizacion cuando se hace un traspaso (YA NO SE HARAN TRASPASOS, NO SE NECESITA ESTE SUBJECT)
    // this.ordenTemporalService.listen().subscribe((m: any) => {
    //   if(m!=1){

    //     console.log(m);
    //     this.simularQR(m);
    //     this.tarimaService.trapasoOrdenCarga = false;
    //   }
    // });

    //Actualiza Tabla Orden Temporal
    this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
      if (this.ordenTemporalService.traspasoOrdenTemporal == true) {
        //Actualizar Saldo detalle Orden Carga//Actualizar sacos Orden Temporal 
        this.actualizarOrdenTemporalTraspaso(this.ordenTemporalService.ordenTemporalt);
        //Regresar variable a false
        this.ordenTemporalService.traspasoOrdenTemporal = false;
      }
      this.actualizarTablaOrdenTemporal();
    });


    console.log('preparando');

  }


  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.ordenCarga = JSON.parse(localStorage.getItem('OrdenCarga'))
    console.log(this.ordenCarga);
    this.ordenCargaService.getOCID(this.IdOrdenCarga).subscribe(data => {
      console.log(data, 'ORDEN');
      //^ Cuando una Orden de Carga viene de un Traspaso, en las Observaciones se especifica que ya se encuentra en Transito. 
      //^ Por lo tanto, la bodega en donde se encuentra el producto no es en la bodega Origen. Si no en la bodega 'Transito'  
      if (data[0].Observaciones == 'Transito') {
        this.bodegaOrigen = 'Transito';
      } else {
        this.bodegaOrigen = data[0].Origen;
      }
      //^Verificamos si se utilizo seleccion Manual al generar esta Orden Carga (SI ES QUE VIENE DE VENTAS)
      if(data[0].Observaciones == 'sinlote'){
        this.seleccionManual = false;
      }

      console.log(this.bodegaOrigen);
      this.dropdownRefreshProductos();


      this.isVisible = false;
      this.isVisibleQR = true;
      this.showButtonAceptar = false;
      this.showButtonCancelar = false;
      // this.MostrarConceptos = false;
      this.ordenTemporalService.preOrdenTemporal = new Array<preOrdenTemporal>();

      this.IdPedido = data[0].IdPedido;
      this.conceptosIngreso();
      // this.obtenerBodegaOrigen();
      this.actualizarTablaOrdenTemporal();
      // this.onPageInit();
    })
  }

  IdPedido: number;
  seleccionManual: boolean = true;

  ordenCarga;

  // Tabla pre visualizacion
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['ClaveProducto', 'Lote', 'Sacos', 'sacosSobra', 'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['Factura', 'Entrada','ClaveProducto', 'Producto', 'Lote', 'PesoTotal', 'FechaCaducidad', 'Options'];
  // displayedColumnsOrdenTemporal: string[] = ['Options1', 'QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  //Tabla conceptos Faltantes
  // listDataConceptosFaltantes: MatTableDataSource<any>;
  // displayedColumnsConceptosFaltantes: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Saldo'];
  // @ViewChild(MatSort, null) sortConceptosFaltantes: MatSort;
  // @ViewChild(MatPaginator, { static: true }) paginatorConceptosFaltantes: MatPaginator;

  //Tabla Productos Ingreso
  listDataProductosIngreso: MatTableDataSource<any>;
  displayedColumnsProductosIngreso: string[] = ['Factura', 'Entrada','ClaveProducto', 'Producto', 'Lote', 'Saldo', 'Options'];
  @ViewChild(MatSort, null) sortProductosIngreso: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorProductosIngreso: MatPaginator;

  //Informacion que vendra del QR
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  //Id Orden Carga
  IdOrdenCarga: number;
  // //Orden Temporal
  // oT = new OrdenTemporal();

  //Variable para mostrar botones
  showButtonAceptar: boolean;
  showButtonCancelar: boolean;

  //Variable Insercion VALIDA
  insertarOrdenTemporal: boolean;

  // Variable para guardar el nombre del Origen
  bodegaOrigen: string;

  //Input donde se guardara el QR escanedado
  inputQR: string;

  //Variables donde se guardaran los Valores que el usuario ingresara (Producto)
  ClaveProductoIngresado: string;
  LoteProductoIngresado: string;
  ProductoIngresado: string;

  //^ Boolean que sera Verdadero cuando el lote del producto es 0 y se tenga que elegir un lote de la bodega
  elegirLote: boolean = false;
  myControlLote = new FormControl();
  filteredOptionsLote: Observable<any[]>;
  optionsLote: any[] = [];
  detalleSeleccionadoLote: string = "";

  //^cantidad de kilos que se ingresan cuando proviene de una venta sin seleccion manual
  cantidadKilosIngreso: number = null;

  claveProductoIngreso: string = '';


  //^ Metodos al elegir un lote
  dropdownRefreshLotes(data) {
    this.optionsLote = new Array<any[]>();
    this.filteredOptionsLote = new Observable<any[]>();
    // this.filteredOptionsProductos = new Observable<any>();
    // this.tarimaService.getDetalleTarimaBodega(this.bodegaOrigen).subscribe(dataP => {
      // console.log(dataP);
      for (let i = 0; i < data.length; i++) {
        let product = data[i];
        this.optionsLote.push(product)
        this.filteredOptionsLote = this.myControlLote.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterLote(value))
          );
      }
      // }
    // });
  }

  private _filterLote(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.optionsLote.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Producto.toString().toLowerCase().includes(filterValue2) || option.Lote.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.optionsLote.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Producto.toString().includes(filterValue2) || option.Lote.toString().toLowerCase().includes(filterValue2));
    }


  }

   DetalleTarimaLote: any;
  onSelectionChangeLote(options: any, event: any) {
    if (event.isUserInput) {
      console.log(options);
      console.log(event);
      this.DetalleTarimaLote = options;
      this.detalleSeleccionadoLote = options.Lote;
      this.LoteProductoIngresado = options.Lote;
      // console.log('%c%s', 'color: #006dcc', this.LoteProductoIngresado);
      this.ClaveProductoIngresado = options.ClaveProducto;
      // console.log('%c%s', 'color: #731d6d', this.ClaveProductoIngresado);
      this.ProductoIngresado = options.Producto;
      // console.log('%c%s', 'color: #e57373', this.LoteProductoIngresado);

    }
  }

  //metodo que se ejecuta cuando cambia la cantidad de kilos
  onChangeCantidadKilosIngreso(cantidad: any) {
    console.log(cantidad);
    let elemHTML: any = document.getElementsByName('cantidadKilo')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.cantidadKilosIngreso;
  }

  validarCantidad(cantidad: any) {
    console.log(cantidad + ' CANTIDAD');
    let cantidadMaximaKg = +this.saldoProductoIngreso;
    console.log(cantidadMaximaKg);
    if (+cantidad >= cantidadMaximaKg) {
      this.cantidadKilosIngreso = cantidadMaximaKg;
    }
    if (+cantidad <= 0) {
      this.cantidadKilosIngreso = 0;
    }
    if (cantidad == null) {
      this.cantidadKilosIngreso = 0;
    }
  }

  IngresarLote(){
    console.log('%c%s', 'color: #006dcc', this.LoteProductoIngresado);
      console.log('%c%s', 'color: #731d6d', this.ClaveProductoIngresado);  
      // console.log('%c%s', 'color: #e57373', this.LoteProductoIngresado);
      console.log('%c⧭', 'color: #5200cc',  this.DetalleTarimaLote);
      console.log(this.cantidadKilosIngreso)
      console.log(this.IdOrdenCarga);
      //^ Verificamos que haya suficiente sacos Ingreso y que sea numero positivo
      if(this.cantidadKilosIngreso > +this.DetalleTarimaLote.PesoTotal || this.cantidadKilosIngreso <= 0){
        console.log('Favor de Verificar la cantidad de sacos a Ingresar');
        Swal.fire({
                  icon: 'warning',
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 2000,
                  title: 'Favor de Verificar Sacos a Ingresar'                  
                })
      }else{
        console.log('todo correcto');
        //^ En este caso llenaremos el arreglo de preOrdenTemporal, que sera utilizado proximamente para finalizar la preparacion del producto
        let oT = <any>{};
        oT.IdOrdenCarga = this.IdOrdenCarga;
            oT.IdDetalleTarima = this.DetalleTarimaLote.IdDetalleTarima;
            oT.IdOrdenDescarga = 0;
            oT.QR = '';
            oT.ClaveProducto = this.DetalleTarimaLote.ClaveProducto;
            oT.Lote = this.DetalleTarimaLote.Lote;
            oT.Sacos = (+this.cantidadKilosIngreso / +this.DetalleTarimaLote.PesoxSaco).toString();
            oT.Producto = this.DetalleTarimaLote.Producto;
            oT.PesoTotal =  this.cantidadKilosIngreso.toString();
            oT.FechaCaducidad = this.DetalleTarimaLote.FechaCaducidad;
            // oT.sacosSobra = (+kgSobrantes).toString();
            oT.Comentarios = '';

            //^ Agregar Campos Faltantes
            oT.NumeroFactura = this.DetalleTarimaLote.Shipper;
            oT.NumeroEntrada = this.DetalleTarimaLote.Pedimento;
            oT.FechaMFG = this.DetalleTarimaLote.FechaMFG;
            oT.CampoExtra1 = this.DetalleTarimaLote.PO;
            //^ Especificamos que este producto cuando fue ingresado, no tenia lote
            oT.CampoExtra2 = 'sinlote';
            oT.CampoExtra3 = '';
            console.log(oT);
            this.ordenTemporalService.preOrdenTemporal.push(oT);           
           //^ Creamos el Detalle Orden Carga con la informacion obtenida
          //  console.log(oT);           
           let detordencarga: DetalleOrdenCarga = {
                    
            IdDetalleOrdenCarga: 0,
            IdOrdenCarga: this.IdOrdenCarga,
            ClaveProducto: this.DetalleTarimaLote.ClaveProducto,
            Producto: this.DetalleTarimaLote.Producto,
            Sacos: (+this.cantidadKilosIngreso / +this.DetalleTarimaLote.PesoxSaco).toString(),
            PesoxSaco: this.DetalleTarimaLote.PesoxSaco,
            Lote: this.DetalleTarimaLote.Lote,
            IdProveedor: this.DetalleTarimaLote.IdProveedor,
            Proveedor:this.DetalleTarimaLote.Proveedor,
            PO: this.DetalleTarimaLote.PO,
            FechaMFG: this.DetalleTarimaLote.FechaMFG,
            FechaCaducidad: this.DetalleTarimaLote.FechaCaducidad,
            Shipper: this.DetalleTarimaLote.Shipper,
            USDA: this.DetalleTarimaLote.USDA,
            Pedimento: this.DetalleTarimaLote.Pedimento,
            Saldo: this.cantidadKilosIngreso.toString()
        }
        
        console.log(detordencarga);      
        console.log(this.ordenTemporalService.preOrdenTemporal);          
         this.ordenCargaService.addDetalleOrdenCarga(detordencarga).subscribe(data => {          
           console.log(data);
           //^ Llamamos al metodo donde terminaremos el proceso de preparacion
           this.AprobarInsercionTablaTemporal();
           //^ Limpiar campos de ingreso Lote
           this.elegirLote = false;
           this.detalleSeleccionadoLote ='';
           this.claveProductoIngreso = '';
           this.cantidadKilosIngreso = null;
         })
      }
      //Verificar match de detalle tarima con detalle Orden Carga
      //^ Se buscan con lote '0' porque asi fue generado en la Venta
      //  this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, '0', this.ClaveProductoIngresado).subscribe(dataOrdenCarga => {
      //   console.log(dataOrdenCarga);
      //   let oT = <any>{};
      //   let SaldoMaximo = 0;
      //   let kgIngreso = 0;
      //   let kgSobrantes = 0;
      //   let KgMaximos = this.DetalleTarimaLote.PesoTotal;
      //   if (dataOrdenCarga.length > 0) {

      //     if (+dataOrdenCarga[0].Saldo > 0) {

        
      //       //Si coincide el producto con el detalle orden carga
      //       console.log('Si hay Datos Registrados');
      //       oT.productoValido = true;
      //       this.showButtonAceptar = true;
      //       SaldoMaximo = +dataOrdenCarga[0].Saldo;
      //       console.log(SaldoMaximo);
      //       console.log(KgMaximos);

      //       kgIngreso = SaldoMaximo;
      //       kgSobrantes = KgMaximos - kgIngreso


      //       oT.IdOrdenCarga = this.IdOrdenCarga;
      //       oT.IdDetalleTarima = this.DetalleTarimaLote.IdDetalleTarima;
      //       oT.IdOrdenDescarga = 0;
      //       oT.QR = this.QRdata.QR;
      //       oT.ClaveProducto = this.ClaveProductoIngresado;
      //       oT.Lote = this.LoteProductoIngresado;
      //       oT.Sacos = ((+kgIngreso / +dataOrdenCarga[0].PesoxSaco)).toString();
      //       oT.Producto = this.ProductoIngresado;
      //       oT.PesoTotal = kgIngreso.toString();
      //       oT.FechaCaducidad = this.DetalleTarimaLote.FechaCaducidad;
      //       oT.sacosSobra = (+kgSobrantes).toString();
      //       oT.Comentarios = '';

      //       //^ Agregar Campos Faltantes
      //       oT.NumeroFactura = this.DetalleTarimaLote.Shipper;
      //       oT.NumeroEntrada = this.DetalleTarimaLote.Pedimento;
      //       oT.FechaMFG = this.DetalleTarimaLote.FechaMFG;
      //       oT.CampoExtra1 = this.DetalleTarimaLote.PO;
      //       oT.CampoExtra2 = 'sinlote';
      //       oT.CampoExtra3 = '';
      //       console.log(oT);
      //       this.ordenTemporalService.preOrdenTemporal.push(oT);


      //       this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
      //       this.listData.sort = this.sort;
      //       this.listData.paginator = this.paginator;
      //       this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      //       console.log(this.ordenTemporalService.preOrdenTemporal);


      //       this.limpiarCamposIngresarProducto();
      //     } else {
      //       Swal.fire({
      //         icon: 'error',
      //         showCancelButton: false,
      //         showConfirmButton: false,
      //         timer: 2000,
      //         title: 'Producto Preparado',
      //         text: 'El producto Ingresado ya ha sido preparado.'
      //       })
      //     }
      //   } else {
      //     //     //Alerta Tarima contiene producto/Lote que no concuerda con Orden Carga
      //     console.log('No Existe match');
      //     Swal.fire({
      //       icon: 'error',
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       timer: 1200,
      //       title: 'Producto No Valido',
      //       text: 'El producto Ingresado no cumple con las caracterisiticas de la Orden de Carga.'
      //     })
      //     oT.productoValido = false;
      //     kgIngreso = KgMaximos;
      //   }
      //   //^ Limpiar campos de ingreso Lote
      //      this.elegirLote = false;
      //      this.detalleSeleccionadoLote ='';
      //      this.claveProductoIngreso = '';
      //      this.cantidadKilosIngreso = null;
      // })
      
  }

  //Dropdown Productos
  myControlProductos = new FormControl();
  filteredOptionsProductos: Observable<any[]>;
  optionsProductos: any[] = [];
  detalleSeleccionado: string = "";



  dropdownRefreshProductos() {
    this.optionsProductos = new Array<any[]>();
    this.filteredOptionsProductos = new Observable<any[]>();
    // this.filteredOptionsProductos = new Observable<any>();
    this.tarimaService.getDetalleTarimaBodega(this.bodegaOrigen).subscribe(dataP => {
      console.log(dataP);
      for (let i = 0; i < dataP.length; i++) {
        let product = dataP[i];
        this.optionsProductos.push(product)
        this.filteredOptionsProductos = this.myControlProductos.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProductos(value))
          );
      }
      // }
    });
  }

  private _filterProductos(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValue2 = value.toLowerCase();
      return this.optionsProductos.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Producto.toString().toLowerCase().includes(filterValue2));
    } else if (typeof (value) == 'number') {
      const filterValue2 = value.toString();
      return this.optionsProductos.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Producto.toString().includes(filterValue2));
    }


  }

  onSelectionChangeProducto(options: any, event: any) {
    if (event.isUserInput) {
      console.log(options);
      console.log(event);
      this.detalleSeleccionado = options.ClaveProducto;
      this.ClaveProductoIngresado = options.ClaveProducto;
      this.LoteProductoIngresado = options.Lote;
    }
  }



  // SCANNER QR //

  escaner(evento) {
    console.log(evento);
    this.qrleido = evento;
    // this.enableScan = false;
  }
  escanear() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";

    let dialogscan = this.dialog.open(ScannerComponent, dialogConfig);

    dialogscan.afterClosed().subscribe(data => {

      console.log(data);
      this.qrleido = data;
      // this.simularQR(this.qrleido);

    })

  }
  cerrarescaner() {
    console.log('cerrar escaner');
    this.enableScan = false;
    console.log(this.enableScan);
  }
  camaras(event) {
    console.log(event);

  }

  //Metodo para obtener la bodega origen
  obtenerBodegaOrigen() {
    console.log(this.IdOrdenCarga);
   

  }


  conceptosIngresoList: DetalleOrdenCarga[];
  //pintar tabla con los detalles Orden Carga
  conceptosIngreso() {
    this.conceptosIngresoList = new Array<DetalleOrdenCarga>();
    //^ si es verdadero, significa que si se utilizo seleccion manual en la venta, o que la orden se genero de un traspaso
    if(this.seleccionManual == true){
      //^ Se obtienen los detalles de la orden Carga
      this.ordenCargaService.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
        console.log(data, 'OIRDEN de carga ');
        if (data.length > 0) {
          for (let i = 0; i <= data.length - 1; i++) {
            if (+data[i].Saldo > 0) {
              this.conceptosIngresoList.push(data[i]);
            }
          }
          console.log(this.conceptosIngresoList, 'LISTA DE FALTANTES');
  
          this.listDataProductosIngreso = new MatTableDataSource(this.conceptosIngresoList);
          this.listDataProductosIngreso.sort = this.sortProductosIngreso;
          this.listDataProductosIngreso.paginator = this.paginatorProductosIngreso;
          this.listDataProductosIngreso.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    
        }
      });
    }
    //^  si es falso, significa que viene de una venta donde no se utilizo seleccion manual (no se eligieron los lotes a utilizar)
    else{
      console.log('SIN SELECCION MANUAL');
      //^ No existen detalles de la Orden, entonces se obtienen los detalles del pedido
              this.pedidoService.getDetallePedidoId(this.IdPedido).subscribe(resPedido=>{
                console.log(resPedido);
                if(resPedido.length > 0){
                  //^ Recorremos los detalles
                  for (let i = 0; i <= resPedido.length - 1; i++) {
                    //^ Tenemos que buscar si en Orden Temporal ya se ingreso el producto
                    let query = 'select * from OrdenTemporal where IdOrdenCarga = '+""+this.IdOrdenCarga+""+' and ClaveProducto ='+"'"+resPedido[i].ClaveProducto+"'"+'';
                    let consulta = {
                      'consulta':query
                    };
                    console.log(query);
                    let SacosIngresados: number = 0;
                    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
                      //^ Si es verdadero, entonces actualizamos el Saldo del producto
                      //^ Si es falso, significa que no se ha ingresado este producto
                      if(detalles.length> 0){
                        //^ Recorremos todos los detalles para obtener la cantidad de Sacos
                        for (let a = 0; a <= detalles.length - 1; a++) {
                          //! CHECAR ESTA OPERACION!!!
                            SacosIngresados = SacosIngresados + +detalles[a].PesoTotal;
                        }
                        SacosIngresados = +resPedido[i].Cantidad - SacosIngresados
                      }else{
                        SacosIngresados = +resPedido[i].Cantidad;
                      }
                      //^ hacemos push del detalle a la tabla
                      let detalleOC: DetalleOrdenCarga = {
                        IdDetalleOrdenCarga: 0,
                    IdOrdenCarga: this.IdOrdenCarga,
                    ClaveProducto: resPedido[i].ClaveProducto,
                    Producto: resPedido[i].Producto,
                    Sacos: (+resPedido[i].Cantidad  / +resPedido[i].Observaciones).toString(),
                    PesoxSaco: resPedido[i].Observaciones,
                    Lote: '0',
                    IdProveedor: 0,
                    Proveedor: '',
                    PO: '',
                    FechaMFG: new Date(),
                    FechaCaducidad: new Date(),
                    Shipper:'',
                    USDA: '',
                    Pedimento: '',
                    Saldo: SacosIngresados.toString(),
                      }
                      // this.conceptosIngresoList.push(resPedido[i]);
                      console.log('%c⧭', 'color: #40fff2', detalleOC);
                      this.conceptosIngresoList.push(detalleOC);

                      // if (+resPedido[i].Saldo > 0) {
                        // }
                        console.log(this.conceptosIngresoList, 'LISTA DE FALTANTES');
                        this.listDataProductosIngreso = new MatTableDataSource(this.conceptosIngresoList);
                        this.listDataProductosIngreso.sort = this.sortProductosIngreso;
                        this.listDataProductosIngreso.paginator = this.paginatorProductosIngreso;
                        this.listDataProductosIngreso.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
                      });
                    }
                  
                }
              })

    }
      
      

  }


  saldoProductoIngreso: number =0; 
  IngresarProducto(ClaveProducto, Lote, productoIngreso) {

    this.claveProductoIngreso = ClaveProducto;

    console.log(ClaveProducto);
    console.log(Lote);
    console.log(productoIngreso);
    // simularQR(qrleido: string) {
    //   // console.log(qrleido);
    //   // this.QRdata = new Tarima();

    //   //  this.QRdata.QR = qrleido;
    //   // console.log(this.QRdata);

    //   // //igualar en 0s el arreglo que se encuentra en el servicio
    //   // this.ordenTemporalService.preOrdenTemporal = new Array<preOrdenTemporal>();
    //   // console.log(this.ordenTemporalService.preOrdenTemporal);


    //   // //Verificar que exista Codigo QR previamente escaneado y en dado caso, traerse id de tarima
    //   // this.tarimaService.getTarimaQR(this.QRdata.QR).subscribe(data => {
    //   //   console.log(data);
    //   //   if (data.length > 0) {
    //   //     let idTarima = data[0].IdTarima;

    //   //     //Verificar que la tarima se encuentre en la bodega donde sera cargado.
    //   //     if (data[0].Bodega == this.bodegaOrigen) {
    //   //       console.log('LA TARIMA SE ENCUENTRA EN LA BODEGA');



    //   //       //Verificar que esta tarima no haaya sido escaneada previamente en esta orden de carga
    //   //       this.ordenTemporalService.GetOrdenTemporalIdTarimaOC(idTarima, this.IdOrdenCarga).subscribe(resOT => {
    //   //         console.log(resOT);

    //   //         if (resOT.length>0) {
    //   //           console.log('Esta tarima ya fue ESCANEADA');
    //   //           Swal.fire({
    //   //             icon: 'error',
    //   //             title: 'Tarima ya escaneada',
    //   //             text: 'Esta tarima ya ha sido escaneda en esta orden de carga'
    //   //           })
    //   //         } else {
    //   //           console.log('tarima no ESCANEADA');
    //   //           console.log('Si existe el QR');
    //   //           this.QRdata.IdTarima = data[0].IdTarima;
    //   //           console.log(this.QRdata.IdTarima);


    //   //           //Obtener los detalles de Tarima del QR previamente escaneado
    //   //           this.tarimaService.getDetalleTarimaID(this.QRdata.IdTarima).subscribe(data => {
    //   //             console.log(data);
    //   //             //verificar si la tarima tiene detalles tarima
    //   //             if (data.length > 0) {

    //   //               this.showButtonAceptar = true;
    //   //               this.showButtonCancelar = true;

    //   //               // recorrer tantos conceptos tenga la tarima escaneada
    //   //               for (let i = 0; i <= data.length - 1; i++) {

    //   //                 //Variable para establece el maximo de sacos en base a la cantidad de sacos en la tarima
    //   //                 let sacosMaximos = +data[i].SacosTotales;
    //   //                 // console.log(sacosMaximos);
    //   //                 //igualar el objeto QRdetalle data con el concepto
    //   //                 this.QRDetalledata[i] = data[i];
    //   //                 console.log(this.QRDetalledata);

    //   //                 console.log(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto);

    //VALIDAR QUE NO SE PUEDA INGRESAR EL MISMO PRODUCTO MAS DE 1 VEZ


    // DESDE AQUI VERFICAR LOS DATOS QUE SERAN INGRESADOS POR EL USUARIO

    let productoValido: boolean = true;

    //Verificara que no exista el producto en la tabla
    console.log(this.ordenTemporalService.preOrdenTemporal);
    for (let l = 0; l <= this.ordenTemporalService.preOrdenTemporal.length - 1; l++) {
      console.log('%c⧭', 'color: #00bf00', this.ordenTemporalService.preOrdenTemporal[l]);
      if ((Lote == this.ordenTemporalService.preOrdenTemporal[l].Lote) && (ClaveProducto == this.ordenTemporalService.preOrdenTemporal[l].ClaveProducto)) {
        Swal.fire({
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
          title: 'Producto Ya Ingresado',
          text: 'El producto ya ha sido Ingresado.'
        })
        productoValido = false;
        this.limpiarCamposIngresarProducto();
        break;
      }
    }

    if (productoValido == true) {

      //Obtener Datos de la bodega para verfificar que ese producto si Existe y tiene sacos necesarios      
      //^ Marca error por lotes con "/" this.tarimaService.GetGetProductoInformacionBodega(ClaveProducto, Lote, this.bodegaOrigen).subscribe(prodInfo => {
        // let query = 'select * from DetalleTarima where ClaveProducto = ' + "'" + ClaveProducto + "'" + ' and bodega =' + "'" + this.bodegaOrigen + "'" + '';
        let query = 'select * from DetalleTarima where ClaveProducto = '+"'"+ClaveProducto+"'"+' and Lote ='+"'"+Lote+"'"+' and Shipper ='+"'"+productoIngreso.Shipper+"'"+' and Bodega ='+"'"+this.bodegaOrigen+"'";
        let consulta = {
          'consulta': query
        };
        console.log(query);
        this.traspasoSVC.getQuery(consulta).subscribe((prodInfo: any) => {
        console.log(prodInfo);
        let lote2;
        lote2 = Lote;
        if (prodInfo.length > 0) {


          //Variable para establece el maximo de sacos en base a la cantidad de sacos de la bodega
          let kgMaximos = +prodInfo[0].PesoTotal;
          console.log(kgMaximos);

          /* console.log(this.listDataConceptosFaltantes.data, 'PRODUCTOS FALTANTES'); */

          for (let i = 0; i < this.ordenCarga.detalleOrdenCarga.length; i++) {

            if (this.ordenCarga.detalleOrdenCarga[i].ClaveProducto == ClaveProducto) {
              if (this.ordenCarga.detalleOrdenCarga[i].Lote == '0') {
                lote2 = '0';
                break;
              }
            }

          }


          //Verificar match de detalle tarima con detalle Orden Carga
          // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, lote2, ClaveProducto).subscribe(dataOrdenCarga => {
            let query2 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+lote2+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'"+' and Shipper ='+"'"+productoIngreso.Shipper+"'";
            let consulta2 = {
              'consulta':query2
            };
            console.log(query2);
            this.traspasoSVC.getQuery(consulta2).subscribe((dataOrdenCarga: any)=>{
            console.log(dataOrdenCarga);
            let oT = <any>{};
            let SaldoMaximo = 0;
            let kgIngreso = 0;
            let kgSobrantes = 0;
            if (dataOrdenCarga.length > 0) {

              if (+dataOrdenCarga[0].Saldo > 0) {


                //Si coincide el producto con el detalle orden carga
                console.log('Si hay Datos Registrados');
                oT.productoValido = true;
                this.showButtonAceptar = true;
                // SaldoMaximo = +dataOrdenCarga[0].Saldo * +dataOrdenCarga[0].PesoxSaco;
                SaldoMaximo = +dataOrdenCarga[0].Saldo;
                console.log(SaldoMaximo);
                console.log(kgMaximos);

                kgIngreso = SaldoMaximo;
                kgSobrantes = kgMaximos - kgIngreso;

                // if (SaldoMaximo < kgMaximos) {
                //   kgIngreso = SaldoMaximo;

                //   kgSobrantes = kgMaximos - kgIngreso;
                // } else {
                //   kgIngreso = kgMaximos
                // }


                oT.IdOrdenCarga = this.IdOrdenCarga;
                // oT.IdDetalleTarima = this.QRdata.IdTarima;
                oT.IdDetalleTarima = prodInfo[0].IdDetalleTarima;
                oT.IdOrdenDescarga = 0;
                oT.QR = this.QRdata.QR;
                oT.ClaveProducto = ClaveProducto;
                oT.Lote = Lote;
                oT.Sacos = ((+kgIngreso / +dataOrdenCarga[0].PesoxSaco)).toString();
                /* oT.Sacos = ((+kgIngreso) / (+prodInfo[0].PesoxSaco)).toString(); */
                // oT.Sacos = sacosIngreso.toString();
                // oT.Sacos =  this.QRDetalledata[i].Sacos;
                oT.Producto = prodInfo[0].Producto;
                // oT.PesoTotal = ((+oT.Sacos) * (+prodInfo[0].PesoxSaco)).toString();
                oT.PesoTotal = kgIngreso.toString();
                oT.FechaCaducidad = prodInfo[0].FechaCaducidad;
                oT.sacosSobra = (+kgSobrantes).toString();
                oT.Comentarios = '';

                //^ Agregar Campos Faltantes
                oT.NumeroFactura = dataOrdenCarga[0].Shipper;
                oT.NumeroEntrada = dataOrdenCarga[0].Pedimento;
                oT.FechaMFG = dataOrdenCarga[0].FechaMFG;
                oT.CampoExtra1 = dataOrdenCarga[0].PO;
                console.log(oT);
                this.ordenTemporalService.preOrdenTemporal.push(oT);


                this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
                console.log(this.ordenTemporalService.preOrdenTemporal);


                this.limpiarCamposIngresarProducto();
              } else {
                Swal.fire({
                  icon: 'error',
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 2000,
                  title: 'Producto Preparado',
                  text: 'El producto Ingresado ya ha sido preparado.'
                })
              }
            } else {
              //     //Alerta Tarima contiene producto/Lote que no concuerda con Orden Carga
              console.log('No Existe match');
              Swal.fire({
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1200,
                title: 'Producto No Valido',
                text: 'El producto Ingresado no cumple con las caracterisiticas de la Orden de Carga.'
              })
              //con id Orden carga = 0, se hacen varias validaciones para indicar que el producto no pertenece a esta orden carga.
              // oT.IdOrdenCarga = 0;
              oT.productoValido = false;
              kgIngreso = kgMaximos;
            }



            //Verificar si ya existen datos en la tabla (PARA CAMBIAR EL ESTATUS Y MOSTRAR LOS DATOS EN DADO CASO QUE UN PRODUCTO NO SEA VALIDO Y NO AFECTE A LOS PRODUCTOS DE LA TABLA)
            if (this.listData) {
              console.log(' si hay datos en la tabla');
            }

            if (oT.productoValido == false) {
              this.showButtonAceptar = false;
            }




          })
        } else {
          //^ Verificar si el lote del producto es 0
          //^ En este caso el lote es 0, se buscara en la bodega si existe un producto con esta clave y se daran opciones a elegir
          if (Lote == '0') {

            let query = 'select * from DetalleTarima where ClaveProducto = ' + "'" + ClaveProducto + "'" + ' and bodega =' + "'" + this.bodegaOrigen + "'" + '';
            let consulta = {
              'consulta': query
            };
            console.log(query);
            this.traspasoSVC.getQuery(consulta).subscribe((detalles: any) => {
              console.log(detalles);
              //^ si se encuentran resultados, entonces se dara la opcion a elegir cual producto se cargara
              if (detalles.length > 0) {
                this.elegirLote = true;
                this.saldoProductoIngreso = +productoIngreso.Saldo;
                this.dropdownRefreshLotes(detalles);
              }
              //^ si no se encuentran productos, entonces no hay en la bodega
              else {
                Swal.fire({
                  icon: 'error',
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1200,
                  title: 'Producto No Valido',
                  text: 'El producto Ingresado no Existe o no se encuentra en esta bodega.'
                })
                this.limpiarCamposIngresarProducto();
              }
            })
          }
          //^ si el lote no es 0, entonces no se encuentra en la bodega
          else {
            Swal.fire({
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 1200,
              title: 'Producto No Valido',
              text: 'El producto Ingresado no Existe o no se encuentra en esta bodega.'
            })
            this.limpiarCamposIngresarProducto();
          }
        }

        //               }
        //             }
        //             else {
        //               console.log('Tarima Vacia');
        //               
        //             }
        //           });
        //         }
        //       });
        //     } else {
        //       console.log('ESTA TARIMA NO SE ENCUENTRA EN LA BODEGA');
        //       Swal.fire({
        //         icon: 'error',
        //         // showCancelButton: false,
        //         // showConfirmButton: false,
        //         // timer: 1200,
        //         title: 'ERROR TARIMA',
        //         text: 'Esta tarima NO se encuentra en la bodega.'
        //       })
        //     }
        //   }
        //   else {
        //     console.log('NO EXISTE QR');
        //     Swal.fire({
        //       icon: 'error',
        //       showCancelButton: false,
        //       showConfirmButton: false,
        //       timer: 1200,
        //       title: 'QR NO VALIDO'
        //     })
        //   }
        // });

      })
    }
  }


  limpiarCamposIngresarProducto() {
    this.ClaveProductoIngresado = "";
    this.LoteProductoIngresado = "";
    this.detalleSeleccionado = "";
  }

  eliminarProductoTablaIngreso(event) {
    this.ordenTemporalService.preOrdenTemporal.splice(this.ordenTemporalService.preOrdenTemporal.indexOf(event), 1);
    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    if (this.ordenTemporalService.preOrdenTemporal.length == 0) {
      this.showButtonAceptar = false;
    }
    Swal.fire({
      title: 'Borrado',
      icon: 'success',
      timer: 500,
      showCancelButton: false,
      showConfirmButton: false
    });
  }


  onDeleteRowTablaV(posicion: any) {
    console.log(posicion);
    console.log(this.ordenTemporalService.preOrdenTemporal);
    this.ordenTemporalService.preOrdenTemporal.splice(posicion, 1);
    console.log(this.ordenTemporalService.preOrdenTemporal);
    if (this.ordenTemporalService.preOrdenTemporal.length > 0) {
      this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      this.showButtonAceptar = true;
      this.showButtonCancelar = true;
    } else {
      this.resetQR();
    }
    Swal.fire({
      title: 'Borrado',
      icon: 'success',
      timer: 500,
      showCancelButton: false,
      showConfirmButton: false
    });



  }

  KilogramosTotales: number = 0;
  // ----- INICIO TABLA ORDEN TEMPORAL -------
  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalID(this.IdOrdenCarga).subscribe(dataOrdenTemporal => {
      this.KilogramosTotales = 0;
      console.log(dataOrdenTemporal);
      if (dataOrdenTemporal.length > 0) {
        console.log('Si hay Movimientos en esta orden de carga');
        dataOrdenTemporal.forEach(element => {
          this.KilogramosTotales = +element.PesoTotal + this.KilogramosTotales;
        });
        this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      } else {
        console.log('No hay Movimientos en esta orden de carga');

        this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      }
    })
  }
  // ----- FIN TABLA ORDEN TEMPORAL -------



  //Metodo para regresar conceptos de OrdenTemporal a tabla visualizacion
  regresarConceptos(row: OrdenTemporal) {
    console.log(row);
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
        this.ordenTemporalService.GetOrdenTemporalIdqr(this.IdOrdenCarga, undoQR).subscribe(dataOt => {
          console.log(dataOt);
          //Actualizar Saldos a su estado original
          for (let l = 0; l <= dataOt.length - 1; l++) {
            let SaldoActual;
            let SaldoFinal;
            let Sacos = +dataOt[l].Sacos;
            this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, dataOt[l].Lote, dataOt[l].ClaveProducto).subscribe(dataDetalle => {
             
              console.log(dataDetalle);
              SaldoActual = +dataDetalle[0].Saldo;
              console.log(SaldoActual);
              console.log(Sacos);
              SaldoFinal = SaldoActual + Sacos;
              console.log(SaldoFinal);
              this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataDetalle[0].IdDetalleOrdenCarga, SaldoFinal.toString()).subscribe(res => {
                console.log(res);
                this.ordenTemporalService.deleteOrdenTemporal(dataOt[l].IdOrdenTemporal).subscribe(res => {
                  console.log(res);
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





                    // VERIFICAR ESTE METODO
                    // this.simularQR(row.QR);
                    // IngresarProducto();
                    // VERIFICAR ESTE METODO
                    // 
                    // 




                  }
                })
              })
            })
          }
        })
      }
    })

  }

  //Metodo para actualizar Saldo de Detalle Orden Carga, y actualizar Orden Temporal (eliminar o actualizar sacos)
  actualizarOrdenTemporalTraspaso(row: OrdenTemporal) {
    console.log(row);

    let sacosInicio = +row.Sacos;
    let sacosActuales;
    let sacosTraspasados;

    //Obtener informacion de DetalleTarima acorde al concepto que fue traspasado
    this.tarimaService.getDetalleTarimaIdClaveLote(row.IdDetalleTarima, row.ClaveProducto, row.Lote).subscribe(dataDetalleTarima => {
      console.log(dataDetalleTarima);
      //si se encuentra un resultado, el concepto no fue traspasado por completo.
      if (dataDetalleTarima.length > 0) {
        console.log(sacosInicio);;
        sacosActuales = +dataDetalleTarima[0].SacosTotales;
        console.log(sacosActuales)
        sacosTraspasados = sacosInicio - sacosActuales;
        console.log(sacosTraspasados);
        //Actualizar Orden Temporal
        row.Sacos = sacosActuales.toString();
        row.PesoTotal = (+sacosActuales * 20).toString();
        console.log(row);
        this.ordenTemporalService.updateOrdenTemporal(row).subscribe(resUpdateOT => {
          console.log(resUpdateOT);
          this.actualizarTablaOrdenTemporal();
        })
        console.log(sacosTraspasados);
        //Obtener Detalle orden de carga a actualizar
        this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(row.IdOrdenCarga, row.Lote, row.ClaveProducto).subscribe(dataDetalle => {
          console.log(dataDetalle);
          let saldoFinal = +dataDetalle[0].Saldo;
          saldoFinal = (saldoFinal + sacosTraspasados);
          //Actualizar Saldo Detalle Orden Carga
          this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataDetalle[0].IdDetalleOrdenCarga, saldoFinal.toString()).subscribe(resSaldo => {
            console.log(resSaldo);
          })
        })
      }//si no hay resultado, el concepto ya no existe en esa tarima
      else {
        sacosTraspasados = sacosInicio;
        console.log(sacosTraspasados);
        //Eliminar Orden Temporal
        this.ordenTemporalService.deleteOrdenTemporal(row.IdOrdenTemporal).subscribe(resDelete => {
          console.log(resDelete);
          this.actualizarTablaOrdenTemporal();
        })
        console.log(sacosTraspasados);
        //Obtener Detalle orden de carga a actualizar
        this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(row.IdOrdenCarga, row.Lote, row.ClaveProducto).subscribe(dataDetalle => {
          console.log(dataDetalle);
          let saldoFinal = +dataDetalle[0].Saldo;
          saldoFinal = (saldoFinal + sacosTraspasados);
          //Actualizar Saldo Detalle Orden Carga
          this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataDetalle[0].IdDetalleOrdenCarga, saldoFinal.toString()).subscribe(resSaldo => {
            console.log(resSaldo);
          })
        })
      }


    })


  }

  //Resetear tabla y valores para escanear nuevo codigo QR
  resetQR() {
    this.ordenTemporalService.preOrdenTemporal = [];
    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.showButtonAceptar = false;
    this.showButtonCancelar = false;
  }

  //Metodo para aceptar datos de la tabla y hacer el insert a Tabla Orden Temporal
  Aceptar() {
    console.log(this.ordenTemporalService.preOrdenTemporal);
    /*  this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, lote2, ClaveProducto).subscribe(dataOrdenCarga => {
 
     })
     this.ordenCargaService.updateDetalleOrdenCarga
     this.AprobarInsercionTablaTemporal(); */
    // 
    this.AprobarInsercionTablaTemporal();
  }

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }

  //Metodo para verificar si todos los productos de la tabla fueron aprobados para la insercion a Tabla Temporal.
  //En Dado caso que no, no dejara hacer la insercion y pedira hacer el traspaso tarima.
  //Solo se podra dar Click en Aceptar cuando todos los productos sean correctos para la insercion.
  AprobarInsercionTablaTemporal() {
    console.log(this.ordenTemporalService.preOrdenTemporal);
    // let idTarima = this.ordenTemporalService.preOrdenTemporal[0].IdDetalleTarima;
    // console.log(idTarima);
    // this.tarimaService.getDetalleTarimaID(idTarima).subscribe(dataTarima => {
    // console.log(dataTarima);
    //Variable para saber el numero de veces que debe coincidir los conceptos a ingresar con los de la tarima
    // let conceptoCoincidir = dataTarima.length;
    // for (let l = 0; l <= dataTarima.length - 1; l++) {
    //   for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporal.length - 1; i++) {
    //     if ((dataTarima[l].ClaveProducto == this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto) && (dataTarima[l].SacosTotales == this.ordenTemporalService.preOrdenTemporal[i].Sacos)) {
    //       console.log('ESTE COINCIDE');
    //       console.log(dataTarima[l].ClaveProducto);
    //       console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
    //       console.log(dataTarima[l].SacosTotales);
    //       console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
    //       conceptoCoincidir = conceptoCoincidir - 1;
    //       break;
    //     } else {
    //       console.log('ESTE NO COINCIDE');
    //       console.log(dataTarima[l].ClaveProducto);
    //       console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
    //       console.log(dataTarima[l].SacosTotales);
    //       console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);

    //     }
    //   }
    // }
    // if (conceptoCoincidir == 0) {
    //   console.log('Tarima COMPLETA');
    //   Swal.fire({
    //     title: 'Conceptos Validos',
    //     icon: 'success',
    //     text: ''
    //   });

    for (let i = 0; i < this.ordenTemporalService.preOrdenTemporal.length; i++) {
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Lote);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
      console.log(i);
      console.log(this.ordenTemporalService.preOrdenTemporal[i]);

      let Sacos = this.ordenTemporalService.preOrdenTemporal[i].Sacos;
      let Lote = this.ordenTemporalService.preOrdenTemporal[i].Lote;
      let ClaveProducto = this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto;
      let Factura = this.ordenTemporalService.preOrdenTemporal[i].NumeroFactura

      let kg = this.ordenTemporalService.preOrdenTemporal[i].PesoTotal;

      this.agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos, kg, Factura);
      // this.tarimaService.GetGetProductoInformacionBodega(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto, this.ordenTemporalService.preOrdenTemporal[i].Lote, this.bodegaOrigen).subscribe(dataDetalleTarima => {
        let query1 = 'select * from DetalleTarima where ClaveProducto = '+"'"+this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto+"'"+' and Lote ='+"'"+this.ordenTemporalService.preOrdenTemporal[i].Lote+"'"+' and Bodega ='+"'"+this.bodegaOrigen+"'"+' and Shipper ='+"'"+Factura+"'";
        let consulta1 = {
          'consulta':query1
        };
        console.log(query1);
        this.traspasoSVC.getQuery(consulta1).subscribe((dataDetalleTarima: any)=>{
        console.log(dataDetalleTarima);

        let dataDetalleTarimaOriginal = dataDetalleTarima;
        let dataDetalleTarimaNueva = dataDetalleTarima;


        console.log(Sacos);
        console.log(Lote);
        console.log(ClaveProducto);
        console.log(i);

        //Verificar si se estan utilizando todos los sacos de la Bodega (detalle Tarima)
        if (dataDetalleTarima[0].PesoTotal == kg) { 
          //si se utilizan todos, solo se cambiara la bodega del producto (Transito)
          console.log('Se utilizaran todos los Sacos');
          //^ Verificar en donde se esta cargando la Mercancia
          //^ si el producto se encuentra en Transito, o en este caso NO ESTA EN CHIHUAHUA, se cambiara su Estatus a Transito
          if(this.bodegaOrigen == 'Transito'){

            let updateDetalleTarima: DetalleTarima = dataDetalleTarima[0];
            updateDetalleTarima.Bodega = 'Transito';
            this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(updateDetalleTarima).subscribe(resUpdate => {
              console.log(resUpdate);
              //Generar Orden Temporal
              // this.agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos);
              // this.conceptosIngreso();
              
            })
          }
          //^!!!! si es en Chihuahua, el producto sera eliminado de la bodega
          else{
              this.tarimaService.deleteDetalleTarima(dataDetalleTarima[0].IdDetalleTarima).subscribe(resDelete=>{
                console.log(resDelete);
              })
          }
          } else {

            //^ Verificar donde se esta haciendo la carga de la Mercancia
            //^ si el producto se encuentra en Transito, o en este caso NO ESTA EN CHIHUAHUA, se realizaran los siguientes procedimientos
            if(this.bodegaOrigen == 'Transito'){

              //Si no coincide el # de sacos, entonces se creara un nuevo detalle tarima con los sacos utilizados
          console.log('No todos los sacos seran Utilizados');
          //Actualizar Detalle Tarima Origen (original)//Agregar Nuevo Detalle Tarima con Bodega (Transito)
          let detalleTarimaNueva: DetalleTarima = dataDetalleTarimaNueva[0];

          console.log(detalleTarimaNueva);
          console.log(dataDetalleTarimaNueva[0]);
          console.log(Sacos);

          detalleTarimaNueva.SacosTotales = ((+detalleTarimaNueva.SacosTotales) - (+Sacos)).toString();
          detalleTarimaNueva.PesoTotal = ((+detalleTarimaNueva.PesoTotal) - (+kg)).toString();
          // detalleTarimaNueva.PesoTotal = ((+detalleTarimaNueva.SacosTotales) * (+detalleTarimaNueva.PesoxSaco)).toString();
          // detalleTarimaNueva.SacosTotales = Sacos
          // detalleTarimaNueva.PesoTotal = ((+Sacos) * (+dataDetalleTarima[0].PesoxSaco)).toString();
          detalleTarimaNueva.Bodega = this.bodegaOrigen;
          detalleTarimaNueva.Estatus = 'Creada';
          // detalleTarimaNueva.TarimasTotales  COMO CALCULAR TARIMAS TOTALES ??

          this.tarimaService.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
            console.log(resNuevaTarima);
            let detalleTarimaOriginal: DetalleTarima = dataDetalleTarimaOriginal[0];

            detalleTarimaOriginal.SacosTotales = Sacos;
            detalleTarimaOriginal.PesoTotal = kg.toString();
            // detalleTarimaOriginal.PesoTotal =  ((+Sacos) * (+dataDetalleTarimaOriginal[0].PesoxSaco)).toString();
            // detalleTarimaOriginal.SacosTotales = ((+dataDetalleTarima[0].SacosTotales) - (+Sacos)).toString();
            // detalleTarimaOriginal.PesoTotal = ((+detalleTarimaOriginal.SacosTotales) * (+dataDetalleTarima[0].PesoxSaco)).toString();
            // detalleTarimaOriginal.TarimasTotales COMO CALCULAR TARIMAS TOTALES ??
            detalleTarimaOriginal.Bodega = 'Transito';
            this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaOriginal).subscribe(resUpdateOriginal => {
              console.log(resUpdateOriginal);
              // this.conceptosIngreso();

              // this.tarimaService.getUltimoDetalleTarima().subscribe(dataUltimo => {
              //   console.log(dataUltimo[0]);
              //   //Actualizar Nuevo IdDetalleTarima
              //   this.ordenTemporalService.preOrdenTemporal[i].IdDetalleTarima = dataUltimo[0].IdDetalleTarima;
              //   //Generar Orden Temporal
              //   // this.agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos);
              //   // this.agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos);


              // })
            })
          })

            }
            //^ en este caso, no se estan utilizando todos los kg de este producto. Por lo tanto nomas actualizaremos su Stock
            else{
              let detalleTarimaOriginal: DetalleTarima = dataDetalleTarimaOriginal[0];
              detalleTarimaOriginal.SacosTotales = ((+detalleTarimaOriginal.SacosTotales) - (+Sacos)).toString();
              detalleTarimaOriginal.PesoTotal =  ((+detalleTarimaOriginal.PesoTotal) - (+kg)).toString();
              this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaOriginal).subscribe(resUpdateOriginal => {
                console.log(resUpdateOriginal);                
              })
            }
          
        }
      });
    }
    // this.agregarOrdenTemporal();
    this.resetQR();


    // } else {
    // console.log('FALTAN CONCEPTOS EN TARIMA');
    // Swal.fire({
    //       title: 'Conceptos no Validos',
    //       icon: 'error',
    //       text: 'Los Conceptos ingresados no coinciden con los de la Tarima. Favor de revisar conceptos a ingresar.'
    //     });
    //   }
    // })

  }

  // agregarOrdenTemporal() {
  agregarOrdenTemporal(i, Lote, ClaveProducto, Sacos, kg, Factura) {
    //asignar valores al objeto que sera insertado en orden temporal.
    let ordenT = new OrdenTemporal();

    console.log(this.ordenTemporalService.preOrdenTemporal);
    console.log(this.ordenTemporalService.preOrdenTemporal[i]);

    // ordenT.IdOrdenTemporal = this.ordenTemporalService.preOrdenTemporal[i].IdOrdenTemporal;
    ordenT.IdDetalleTarima = this.ordenTemporalService.preOrdenTemporal[i].IdDetalleTarima;
    ordenT.IdOrdenCarga = this.ordenTemporalService.preOrdenTemporal[i].IdOrdenCarga;
    ordenT.IdOrdenDescarga = this.ordenTemporalService.preOrdenTemporal[i].IdOrdenDescarga;
    ordenT.QR = this.ordenTemporalService.preOrdenTemporal[i].QR;
    ordenT.NumeroFactura = this.ordenTemporalService.preOrdenTemporal[i].NumeroFactura;
    ordenT.NumeroEntrada = this.ordenTemporalService.preOrdenTemporal[i].NumeroEntrada;
    ordenT.ClaveProducto = this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto;
    ordenT.Lote = this.ordenTemporalService.preOrdenTemporal[i].Lote;
    ordenT.Sacos = this.ordenTemporalService.preOrdenTemporal[i].Sacos;
    ordenT.Producto = this.ordenTemporalService.preOrdenTemporal[i].Producto;
    ordenT.PesoTotal = this.ordenTemporalService.preOrdenTemporal[i].PesoTotal;
    ordenT.FechaCaducidad = this.ordenTemporalService.preOrdenTemporal[i].FechaCaducidad;
    ordenT.FechaMFG = this.ordenTemporalService.preOrdenTemporal[i].FechaMFG
    ordenT.Comentarios = this.ordenTemporalService.preOrdenTemporal[i].Comentarios;
    ordenT.CampoExtra1 = this.ordenTemporalService.preOrdenTemporal[i].CampoExtra1;
    ordenT.CampoExtra2 = this.ordenTemporalService.preOrdenTemporal[i].CampoExtra2;
    ordenT.CampoExtra3 = this.ordenTemporalService.preOrdenTemporal[i].Campoextra3;

    console.log(ordenT);
    //Insert a Orden Temporal
    this.ordenTemporalService.addOrdenTemporal(ordenT).subscribe(resAdd => {
      console.log(resAdd);
      //   //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
      // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
        let query2 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'"+' and Shipper ='+"'"+Factura+"'";
        let consulta2 = {
          'consulta':query2
        };
        console.log(query2);
        this.traspasoSVC.getQuery(consulta2).subscribe((dataOrdenCarga: any)=>{

        console.log(dataOrdenCarga);
        if (dataOrdenCarga.length > 0) {
          console.log(Sacos);
          let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) - (+kg)).toString();
          console.log(NuevoSaldo);
          // Actualizar Saldo de la tabla Detalle Orden Carga
          this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
            console.log(res);
            this.actualizarTablaOrdenTemporal();
            this.conceptosIngreso();
          });

        } 
        //^! con la actualizacion de seleccion Manual , ya no deberia de entrar nunca a este else
        else {

          // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, '0', ClaveProducto).subscribe(dataOrdenCarga => {
            // let query2 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+0+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'";
            let query2 =  'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'"+' and Shipper ='+"'"+this.ordenTemporalService.preOrdenTemporal[i].NumeroFactura+"'";
            let consulta2 = {
              'consulta':query2
            };
            console.log(query2);
            this.traspasoSVC.getQuery(consulta2).subscribe((dataOrdenCarga: any)=>{
            console.log(Sacos);
            let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) - (+kg)).toString();
            console.log(NuevoSaldo);
            // Actualizar Saldo de la tabla Detalle Orden Carga
            this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
              console.log(res);
              this.actualizarTablaOrdenTemporal();
              this.conceptosIngreso();
            });

          })

        }



      });
    });
    // }
  }


  //Cancelar operacion de insert Tabla Orden Temporal
  Cancelar() {
    this.resetQR();
  }

  //Editar producto a ingresar en Orden Temporal
  onEdit(ordenTemporal: OrdenTemporal, id: number) {
    console.log(ordenTemporal);
    console.log(id);
    this.ordenTemporalService.ordenTemporalData = ordenTemporal;
    this.ordenTemporalService.posicionOrdenTemporal = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(OrdenCargaConceptoComponent, dialogConfig);
  }
  //
  traspasoOrdenCarga(row: DetalleTarima) {
    console.log(row);
    this.tarimaService.trapasoOrdenCarga = true;
    this.ordenTemporalService.traspasoOrdenTemporal = false;
    this.tarimaService.idTarimaOrdenCarga = row.IdDetalleTarima;
    this.tarimaService.detalleTarimaOrdenCarga = row;
    //Indicar cual es la bodega de la tarima
    this.tarimaService.bodega = this.bodegaOrigen;
    this.tarimaService.getTarimaID(row.IdDetalleTarima).subscribe(dataQr => {
      this.tarimaService.QrOrigen = dataQr[0].QR;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "70%";
      this.dialog.open(TraspasoTarimaComponent, dialogConfig);
    })
  }

  traspasoOrdenCargaTemporal(row: OrdenTemporal) {
    console.log(row);
    //Indicamos que el traspaso se esta haciendo desde la tabla Orden Temporal
    this.ordenTemporalService.traspasoOrdenTemporal = true;
    this.tarimaService.trapasoOrdenCarga = false;
    this.ordenTemporalService.ordenTemporalt = new OrdenTemporal();
    this.ordenTemporalService.ordenTemporalt = row;
    this.tarimaService.idTarimaOrdenCarga = row.IdDetalleTarima;
    this.tarimaService.QrOrigen = row.QR;
    //Indicar cual es la bodega de la tarima
    this.tarimaService.bodega = this.bodegaOrigen;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(TraspasoTarimaComponent, dialogConfig);
    // this.traspasoOrdenCargaTemporal(row);
  }

  traspaso() {

    this.tarimaService.trapasoOrdenCarga = false;
    this.tarimaService.TraspasoDescarga = false;
    //Indicar cual es la bodega de la tarima
    this.tarimaService.bodega = this.bodegaOrigen;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(TraspasoTarimaComponent, dialogConfig);
  }

//^ Borrar Ingreso
  onDeleteOrdenTemporal(ot: OrdenTemporal) {
    console.log(ot);
    let Lote = ot.Lote;
    let ClaveProducto = ot.ClaveProducto;
    let Factura  = ot.NumeroFactura;
    let Bodega = this.bodegaOrigen;
    let IdDetalleTarima = ot.IdDetalleTarima;

    let Sacos = ot.Sacos;
    let PesoTotal = ot.PesoTotal;

    Swal.fire({
      title: '¿Seguro de Borrar Ingreso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        // this.tarimaService.GetGetProductoInformacionBodega(ClaveProducto, Lote, Bodega).subscribe(dataDT => {
          // let query1 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'";
          let query1 = 'select * from DetalleTarima where IdDetalleTarima = '+""+IdDetalleTarima+""+'';
          let consulta1 = {
            'consulta':query1
          };
          console.log(query1);
          this.traspasoSVC.getQuery(consulta1).subscribe((dataDT: any)=>{
          console.log(dataDT);
          //^ si la bodega Origen es Transito, no es necesario actualizar el DetalleTarima. Solo el Saldo de Detalle Orden Carga  y eliminar Orden Temporal       
          if (Bodega == 'Transito') {
            //si no se encuntran resultados, solo se actualizara la bodega en el detalle que se encuentra en transito
            //  this.tarimaService.getUpdateDetalleTarimaBodega(IdDetalleTarima, Bodega).subscribe(resUpdate => {
            // console.log(resUpdate);
            //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
            // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
              let query2 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'"+' and Shipper ='+"'"+Factura+"'";
              let consulta2 = {
                'consulta':query2
              };
              console.log(query2);
              this.traspasoSVC.getQuery(consulta2).subscribe((dataOrdenCarga: any)=>{
              console.log(dataOrdenCarga);
              let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) + (+ot.PesoTotal)).toString();
              console.log(NuevoSaldo)
              //   // Actualizar Saldo de la tabla Detalle Orden Carga
              this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
                console.log(res);
                this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden => {
                  console.log(DeleteOrden);
                  this.actualizarTablaOrdenTemporal();
                  this.conceptosIngreso();
                  Swal.fire({
                    title: 'Borrado',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                });
              });
              // });
            })
          } else {

            if (dataDT.length > 0) {
              console.log('Actualzar tarima origen y eliminar el de transito');
              //en este caso, se tendra que actualizar el detalle tarima origen y eliminar el detalle que se encuentra en transito
              //Actualizar tarima origen
              let detalleTarima = new DetalleTarima();
              detalleTarima = dataDT[0];
              detalleTarima.SacosTotales = ((+detalleTarima.SacosTotales) + (+Sacos)).toString();
              detalleTarima.PesoTotal = ((+detalleTarima.PesoTotal) + (+PesoTotal)).toString();
              this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarima).subscribe(resUpdate => {
                console.log(resUpdate);
                //eliminar detalle tarima Transito
                // this.tarimaService.deleteDetalleTarima(IdDetalleTarima).subscribe(resDelete => {
                  // console.log(resDelete);   
                  //^ Verificar si el producto no tenia lote
                  // if(ot.CampoExtra2 == 'sinlote'){
                  //   Lote = '0'
                  // }              
                  //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
                  // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
                    this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden => {
                      console.log(DeleteOrden);
                      this.actualizarTablaOrdenTemporal();
                      this.conceptosIngreso();
                      Swal.fire({
                        title: 'Borrado',
                        icon: 'success',
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                      });
                    let query3 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'";
                    let consulta3 = {
                      'consulta':query3
                    };
                    console.log(query3);
                    this.traspasoSVC.getQuery(consulta3).subscribe((dataOrdenCarga: any)=>{
                    console.log(dataOrdenCarga);

                    //^ si viene de una venta donde no fue seleccion manual, borraremos el Detalle Orden Carga
                    //^ si se utilizo seleccion manual, actualizamos el saldo del detalle
                    if(ot.CampoExtra2=='sinlote'){
                      let query4 = 'Delete DetalleOrdenCarga where IdDetalleOrdenCarga  = '+""+dataOrdenCarga[0].IdDetalleOrdenCarga+""+"";
                    let consulta4 = {
                      'consulta':query4
                    };
                    console.log(query4);
                    this.traspasoSVC.getQuery(consulta4).subscribe((ddoc: any)=>{
                            console.log('%c%s', 'color: #f27999', ddoc);                            
                    });
                    }else{
                      let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) + (+ot.PesoTotal)).toString();
                      console.log(NuevoSaldo)
                      //   // Actualizar Saldo de la tabla Detalle Orden Carga
                      this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
                        console.log(res);
                        })
                    }
                    })
                  });
                // })
              })

            } else {
              console.log('Actualizar bodega origen');
              //^ si no se encuntran resultados, entonces significa que el detalle tarima ya fue eliminado de la bd, tendremos que recuperar la informacion y agregarla de nuevo
              // this.tarimaService.getUpdateDetalleTarimaBodega(IdDetalleTarima, Bodega).subscribe(resUpdate => {
                // console.log(resUpdate);
                //^ Verificar si el producto no tenia lote
                // if(ot.CampoExtra2 == 'sinlote'){
                  //   Lote = '0'
                  // }     
                  // this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
                    let query2 = 'select * from DetalleOrdenCarga where IdOrdenCarga  = '+""+this.IdOrdenCarga+""+' and Lote ='+"'"+Lote+"'"+' and ClaveProducto ='+"'"+ClaveProducto+"'";
                    let consulta2 = {
                      'consulta':query2
                    };
                    console.log(query2);
                    this.traspasoSVC.getQuery(consulta2).subscribe((dataOrdenCarga: any)=>{
                      //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
                      console.log(dataOrdenCarga);
                      let detalleTarimaNueva : DetalleTarima = {
                        IdDetalleTarima: 0,
                        ClaveProducto: ot.ClaveProducto,
                        Producto: ot.Producto,
                        SacosTotales: ot.Sacos,
                        PesoxSaco: ((+ot.PesoTotal)/(+ot.Sacos)).toString(),
                        Lote: ot.Lote,
                        PesoTotal: ot.PesoTotal,
                        SacosxTarima: '',
                        TarimasTotales: '',
                        Bodega: this.bodegaOrigen,
                        //! Verificar de donde sacar esta informacion
                        IdProveedor: 0,
                        Proveedor: '',
                        PO: ot.CampoExtra1,
                        FechaMFG: ot.FechaMFG,
                        FechaCaducidad: ot.FechaCaducidad,
                        Shipper: ot.NumeroFactura,
                        //! Verificar de donde sacar esta informacion
                        USDA: '',
                        Pedimento: ot.NumeroEntrada,
                        Estatus: 'Creada'
                      }
                      this.tarimaService.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
                        console.log('%c%s', 'color: #bfffc8', resNuevaTarima);
                        
                        this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden => {
                          console.log(DeleteOrden);
                          this.actualizarTablaOrdenTemporal();
                          this.conceptosIngreso();
                          Swal.fire({
                            title: 'Borrado',
                            icon: 'success',
                            timer: 1000,
                            showCancelButton: false,
                            showConfirmButton: false
                          });
                          //^ si viene de una venta donde no fue seleccion manual, borraremos el Detalle Orden Carsga
                    //^ si se utilizo seleccion manual, actualizamos el saldo del detalle
                    if(ot.CampoExtra2=='sinlote'){
                      let query4 = 'Delete DetalleOrdenCarga where IdDetalleOrdenCarga  = '+""+dataOrdenCarga[0].IdDetalleOrdenCarga+""+"";
                    let consulta4 = {
                      'consulta':query4
                    };
                    console.log(query4);
                    this.traspasoSVC.getQuery(consulta4).subscribe((ddoc: any)=>{
                            console.log('%c%s', 'color: #f27999', ddoc);                            
                    });
                    }else{
                        let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) + (+ot.PesoTotal)).toString();
                        console.log(NuevoSaldo)
                  //   // Actualizar Saldo de la tabla Detalle Orden Carga
                  this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
                    console.log(res);
                    });
                  }
                  });
                });
              // })
              });
            }
          } //si no se encuntran resultados, solo se actualizara la bodega en el detalle que se encuentra en transito
          // this.tarimaService.getUpdateDetalleTarimaBodega(IdDetalleTarima, Bodega).subscribe(resUpdate => {
          //   console.log(resUpdate);
          //   //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
          //   this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
          //     console.log(dataOrdenCarga);
          //     let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) + (+ot.PesoTotal)).toString();
          //     console.log(NuevoSaldo)
          //     //   // Actualizar Saldo de la tabla Detalle Orden Carga
          //     this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo, Lote).subscribe(res => {
          //       console.log(res);
          //       this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden=>{
          //         console.log(DeleteOrden);
          //         this.actualizarTablaOrdenTemporal();
          //         Swal.fire({
          //           title: 'Borrado',
          //           icon: 'success',
          //           timer: 1000,
          //           showCancelButton: false,
          //           showConfirmButton: false
          //         });
          //       });
          //     });
          //   });
          // })
        })
      }
    })
  }

  // MostrarConceptos: boolean;
  // conceptosFaltantesList: DetalleOrdenCarga[];
  //pintar tabla con los conceptos faltantes
  // conceptosFaltantes() {
  //   this.ordenCargaService.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
  //     console.log(data,'OIRDEN de carga ');
  //     if (data.length > 0) {
  //       this.conceptosFaltantesList = new Array<DetalleOrdenCarga>();
  //       for (let i = 0; i <= data.length - 1; i++) {
  //         if (+data[i].Saldo > 0) {
  //           this.conceptosFaltantesList.push(data[i]);
  //         }
  //       }
  //     }
  //     console.log(this.conceptosFaltantesList,'LISTA DE FALTANTES');
  //     this.MostrarConceptos = true;
  //     this.listDataConceptosFaltantes = new MatTableDataSource(this.conceptosFaltantesList);
  //     this.listDataConceptosFaltantes.sort = this.sortConceptosFaltantes;
  //     this.listDataConceptosFaltantes.paginator = this.paginatorConceptosFaltantes;
  //     this.listDataConceptosFaltantes.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
  //   });

  // }

  //esconder tabla con conceptos faltantes
  // ocultarConceptosFaltantes() {
  //   this.MostrarConceptos = false;
  // }


  pdf() {

    // console.log(row);
    // this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      IdOrdenCarga: this.IdOrdenCarga
      }
    this.dialog.open(SalidaProductoComponent, dialogConfig);
  }

  finalizar() {
    //variable para verificar que el salgo de los Deta.OrdenCarga esten en 0;
    let Terminado: boolean;
    //Verfiicar que ya se hayan preparado todos los conceptos de orden carga
    //obtener detalles orden carga por id orden carga
    this.ordenCargaService.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        console.log(+data[i].Saldo);
        if (+data[i].Saldo == 0) {
          console.log('PREPARADO LISTO');
          Terminado = true;
        } else {
          console.log('PREPARADO FALTANTE');
          Terminado = false;
          break;
        }
      }
      console.log(Terminado);
      //Si la variable Terminado es True, se actualizara el estatus de orden carga a PREPARADA
      if (Terminado == true) {
        this.ordenCargaService.getOCID(this.IdOrdenCarga).subscribe(res => {
          if (res[0].Estatus == 'Creada') {
            this.ordenCargaService.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, "Preparada").subscribe(data => {
              this.movimientos('Carga Preparada')
              Swal.fire({
                title: 'Preparado',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
              // this.router.navigate(['/ordencargadetalle']);
              this.ordenCargaService.filter('');
              this.router.navigate(['/ordencargadetalle']);
            })
          }
        })
      } else {
        console.log('FALTAN CONCEPTOS POR PREPARAR');
        Swal.fire({
          title: 'Conceptos Faltantes',
          icon: 'error',
          text: 'No se han preparado todos los conceptos acorde a esta orden de carga.',
          showCancelButton: false,
          showConfirmButton: true
        });
      }
    });
  }


  // blur
  CleanFieldQR() {
    if (this.qrleido == null) {
      this.isVisible = false;
      this.isVisibleQR = true;
    }

  }

  ActBtn() {
    this.isVisible = true;
    this.isVisibleQR = false;
  }

  
  movimientos(movimiento?){
    let userData = JSON.parse(localStorage.getItem("userAuth"))
    let idUser = userData.IdUsuario
    let evento = new Evento();
    let fecha = new Date();
    evento.IdUsuario = idUser
    evento.Autorizacion = '0'
    evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
    evento.Movimiento = movimiento
    console.log(evento);
    if (movimiento) {
      this.eventosService.addEvento(evento).subscribe(respuesta =>{
        console.log(respuesta);
      })      
    }
}

}
