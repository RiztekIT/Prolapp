import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { ScannerComponent } from 'src/app/components/scanner/scanner.component';
import { Tarima } from 'src/app/Models/almacen/Tarima/tarima-model';
import Swal from 'sweetalert2';
import { TraspasoTarimaComponent } from '../../../traspaso-tarima/traspaso-tarima.component';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { MasterDetalleTarima } from 'src/app/Models/almacen/OrdenDescarga/cuu/masterDetalleTarima-model';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { element } from 'protractor';
import { clearLine } from 'readline';
import { ClassField } from '@angular/compiler';
import { TraspasoMercanciaService } from '../../../../../services/importacion/traspaso-mercancia.service';


@Component({
  selector: 'app-ordendescargatarimacuu',
  templateUrl: './ordendescargatarimacuu.component.html',
  styleUrls: ['./ordendescargatarimacuu.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdendescargatarimacuuComponent implements OnInit {

  constructor(public router: Router, public tarimaService: TarimaService, public ordenDescargaService: OrdenDescargaService, private dialog: MatDialog, public ordenTemporalService: OrdenTemporalService, public traspasoSVC: TraspasoMercanciaService) {
    // this.tarimaService.listenDt().subscribe((m: any) => {
    //   console.log(m);
    //   this.actualizarTablaTarima();
    // });

    // this.tarimaService.listenerScan().subscribe((m: any) => {
    //   console.log(m);
    //   this.actualizarTablaTarimaEscaneada();
    // });


    //Actualiza la tabla visualizacion cuando se hace un traspaso
    // this.ordenTemporalService.listen().subscribe((m: any) => {
    //   console.log(m);
    //   this.simularQR(m);
    //   this.tarimaService.trapasoOrdenDescarga = false;
    // });
  }


  ngOnInit() {
    console.clear();
    this.isVisible = false;
    this.isVisibleQR = true;
    this.tarimaService.TraspasoDescarga = false;
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.ordenDescargaService.formData = JSON.parse(localStorage.getItem('OrdenDescarga'))
    this.obtenerBodegaOrigen();
    this.obtenerBodegaDestino();
    // this.actualizarTablaTarima();
    // this.actualizarTablaTarimaEscaneada();
    this.dropdownRefreshProductos();
    this.actualizarTablaOrdenTemporal();
  }
  IdOrdenDescarga: number;
  displayedColumnsVersion: string[] = ['IdDetalleTarima, IdTarima, ClaveProducto, Producto, Sacos, PesoxSaco, Lote, IdProveedor, Proveedor, PO, FechaMFG, FechaCaducidad, Shipper, USDA, Pedimento'];
  displayedColumnsVersionScan: string[] = ['IdDetalleTarima, IdTarima, ClaveProducto, Producto, Sacos, PesoxSaco, Lote, IdProveedor, Proveedor, PO, FechaMFG, FechaCaducidad, Shipper, USDA, Pedimento'];
  expandedElement: any;
  detalle = new Array<DetalleTarima>();
  isVisible: boolean;
  isVisibleQR: boolean;
  tqr: any

  bodegaOrigen: string;
  bodegaDestino: string;

  clgR = "background-color: white; color: red;"

  enableScan = false;
  qrleido;

  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();


  listData: MatTableDataSource<any>;
  // displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Kg', 'Saldo', 'Bodega', 'Borrar'];
  displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Kg', 'Saldo', 'KgSobrantes', 'Bodega', 'Borrar'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listDataScan: MatTableDataSource<any>;
  displayedColumnsScan: string[] = ['ClaveProducto', 'Producto', 'Lote', 'PesoTotal', 'FechaCaducidad', 'Options'];
  @ViewChild(MatSort, null) sortScan: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorScan: MatPaginator;

  //Dropdown Productos
  myControlProductos = new FormControl();
  filteredOptionsProductos = new Observable<any[]>();
  optionsProductos: any[] = [];
  detalleSeleccionado: string = "";

  //Variables donde se guardaran los Valores que el usuario ingresara (Producto)
  ClaveProductoIngresado: string;
  LoteProductoIngresado: string;

  //Informacion del Producto Ingresado
  ProductoIngresado: any;

  //Arreglo con la Informacion de los productos Ingresados (Todavia no han sido registrados en el sistema)
  arrayProductosIngresados = new Array<any>();

  productoValido: boolean = false;

  regresar() {
    this.router.navigate(['/ordenDescargadetallecuu']);
  }

  dropdownRefreshProductos() {
    this.optionsProductos = new Array<any[]>();
    this.optionsProductos = [];
    this.filteredOptionsProductos = of([]);

    this.ordenDescargaService.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataDOD => {
      dataDOD.forEach(element => {
        this.obtenerInformacionProducto(element);
      });
    });
  }

  obtenerInformacionProducto(element: any) {
    console.log(element);
    // this.tarimaService.getDetalleTarimaClaveLoteBodega(element.ClaveProducto, element.Lote, 'Transito').subscribe(dataP => {
    let query1 = 'select * from DetalleTarima where ClaveProducto = ' + "'" + element.ClaveProducto + "'" + ' and Lote =' + "'" + element.Lote + "'" + ' and Shipper =' + "'" + element.Shipper + "'" + ' and Bodega =' + "'Transito'";
    let consulta1 = {
      'consulta': query1
    };
    console.log(query1);
    this.traspasoSVC.getQuery(consulta1).subscribe((dataP: any) => {
      console.log(dataP);
      console.log(dataP);
      for (let i = 0; i < dataP.length; i++) {
        let product = dataP[i];
        product.Saldo = element.Saldo;
        product.IdOrdenDescarga = element.IdOrdenDescarga;
        product.PesoOriginal = (+element.Sacos * +element.PesoxSaco).toFixed(4);
        product.SacosOriginal = element.Sacos;
        // product.NuevoSaldo = ((+product.Saldo) - (+dataP[i].PesoTotal)).toString();
        product.KilogramosSobrantes = ((+product.Saldo) - (+dataP[i].PesoTotal)).toFixed(4);

        this.optionsProductos.push(product)
        this.filteredOptionsProductos = this.myControlProductos.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProductos(value))
          );




      }
    });
  }

  private _filterProductos(value: any): any[] {
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
      this.ProductoIngresado = options;
    }
  }

  deleteProductoIngresado(prodInfo) {
    console.log(prodInfo);
    this.arrayProductosIngresados.splice(this.ordenTemporalService.preOrdenTemporal.indexOf(prodInfo), 1);
    this.listData = new MatTableDataSource(this.arrayProductosIngresados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    console.log(this.arrayProductosIngresados.length);
    if (this.arrayProductosIngresados.length > 0) {
      this.productoValido = true;
    } else {
      this.productoValido = false;
    }
  }

  clearCamposIngresados() {
    this.ClaveProductoIngresado = "";
    this.LoteProductoIngresado = "";
    this.ProductoIngresado = "";
    this.detalleSeleccionado = "";
  }

  actualizarTablaTarima(informacionProducto) {
    console.log(informacionProducto);
    this.productoValido = true;

    console.log(+informacionProducto.KilogramosSobrantes);

    // this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, informacionProducto.Lote, informacionProducto.ClaveProducto).subscribe(dataOD => {
      let query = 'select * from DetalleOrdenDescarga where IdOrdenDescarga = ' + this.IdOrdenDescarga + ' and Lote =' + "'" + informacionProducto.Lote + "'" + ' and ClaveProducto =' + "'" + informacionProducto.ClaveProducto + "'" + ' and Shipper =' + "'" + informacionProducto.Shipper + "';";
      let consulta = {
        'consulta': query
      };
      console.log(query);
      this.traspasoSVC.getQuery(consulta).subscribe((dataOD: any) => {
      console.log(dataOD);
      console.log(this.arrayProductosIngresados);
      if (+dataOD[0].Saldo > 0) {

        this.arrayProductosIngresados.forEach(element => {
          if ((informacionProducto.ClaveProducto == element.ClaveProducto) && (informacionProducto.Lote == element.Lote) && (informacionProducto.Shipper == element.Shipper)) {
            Swal.fire({
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 1200,
              title: 'Producto ya Ingresado',
              text: 'El Producto ya ha sido ingresado.'
            })
            this.productoValido = false;
          }
        });
        if (this.productoValido == true) {
          this.arrayProductosIngresados.push(informacionProducto);
          this.listData = new MatTableDataSource(this.arrayProductosIngresados);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
          this.clearCamposIngresados();
        }
      } else {
        Swal.fire({
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1200,
          title: 'Producto Ya Descargado',
          text: 'El Producto ya ha sido descargado.'
        })
      }
    })

  }
  //^ Llenamos informaicon en la tabla Orden temporal (Nos indica los productos que ya han sido descargados)
  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalIDOD(this.IdOrdenDescarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      this.listDataScan = new MatTableDataSource(dataOrdenTemporal);
      console.log(this.listDataScan);
      this.listDataScan.sort = this.sortScan;
      this.listDataScan.paginator = this.paginatorScan;
      this.listDataScan.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    })
  }

  // actualizarTablaTarimaEscaneada() {

  //   this.tarimaService.masterTE = new Array<any>();
  //   this.tarimaService.masterTE = [];

  //   this.ordenDescargaService.GetODOTTB(this.IdOrdenDescarga, 'CHIHUAHUA').subscribe(dataQR => {
  //     if (dataQR.length > 0) {
  //       for (let i = 0; i <= dataQR.length - 1; i++) {
  //         // es lo que trae detalle tarima con ese QR
  //         console.log(dataQR[0]);
  //         // if(dataQR[0]){
  //         // console.warn(pm);
  //         this.tarimaService.masterTE[i] = dataQR[i];
  //         this.tarimaService.masterTE[i].detalleTarima = [];
  //         this.tarimaService.getDetalleTarimaID(dataQR[i].IdTarima).subscribe(res => {
  //           for (let l = 0; l <= res.length - 1; l++) {
  //             console.log(l);
  //             console.log(res[l]);
  //             this.tarimaService.masterTE[i].detalleTarima.push(res[l]);
  //           }
  //         })
  //         this.listDataScan = new MatTableDataSource(this.tarimaService.masterTE);
  //         this.listDataScan.sort = this.sortScan;
  //         this.listDataScan.paginator = this.paginatorScan;
  //         this.listDataScan.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
  //         console.log(this.tarimaService.masterTE);
  //         // pm++;
  //         // }
  //       }
  //     } else {
  //       this.tarimaService.masterTE = [];
  //       this.listDataScan = new MatTableDataSource(this.tarimaService.masterTE);
  //       this.listDataScan.sort = this.sortScan;
  //       this.listDataScan.paginator = this.paginatorScan;
  //       this.listDataScan.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';

  //     }
  //   })

  // }





  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  CheckQR(row, posicion) {
    console.log(row.QR);

  }

  // scanner
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

  //^Resetear tabla de ingresos
  resetQR() {
    this.arrayProductosIngresados = [];
    this.listData = new MatTableDataSource(this.arrayProductosIngresados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.productoValido = false;
  }

  //^ Metodo que Descargara el Producto (Actualiza detalla tarima)
  descargarProductos() {

    console.log('DESCARGAR PRODUCTOS');
    console.log(this.arrayProductosIngresados);
    //Generar Orden Temporal
    //Actualizar Saldos Detalle Orden Descarga
    //Verificar si se generara otro detalle tarima o se actualizara

    for (let i = 0; i < this.arrayProductosIngresados.length; i++) {
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Lote);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
      // console.log(i);
      console.log(this.arrayProductosIngresados[i]);

      let Sacos = +this.arrayProductosIngresados[i].SacosOriginal;
      let Lote = this.arrayProductosIngresados[i].Lote;
      let ClaveProducto = this.arrayProductosIngresados[i].ClaveProducto;
      let Factura = this.arrayProductosIngresados[i].Shipper;

      let kg = +this.arrayProductosIngresados[i].PesoOriginal;

      let kgSobra = +this.arrayProductosIngresados[i].KilogramosSobrantes;

      this.agregarOrdenTemporalActualizarSaldos(i, Lote, ClaveProducto, Sacos, kg, Factura);



      // this.tarimaService.GetGetProductoInformacionBodega(this.arrayProductosIngresados[i].ClaveProducto, this.arrayProductosIngresados[i].Lote, 'Transito').subscribe(dataDetalleTarima => {
      let query = 'select * from DetalleTarima where ClaveProducto = ' + "'" + ClaveProducto + "'" + ' and Lote =' + "'" + Lote + "'" + ' and Shipper =' + "'" + Factura + "'" + ' and Bodega =' + "'Transito'";
      let consulta = {
        'consulta': query
      };
      console.log(query);
      this.traspasoSVC.getQuery(consulta).subscribe((dataDetalleTarima: any) => {
        console.log(dataDetalleTarima);

        let dataDetalleTarimaOriginal = dataDetalleTarima;
        let dataDetalleTarimaNueva = dataDetalleTarima;


        // console.log(Sacos);
        // console.log(Lote);
        // console.log(ClaveProducto);
        // console.log(i);

        //^ Verificar si se estan utilizando todos los sacos de la Bodega (detalle Tarima)
        if (kgSobra == 0) {
          //^ si se utilizan todos, solo se cambiara la bodega del producto (CHIHUAHUA)
          console.log('Se utilizaran todos los Sacos');
          //^ Verificar si ya existe este producto en la bodega destino
          //   let query = 'select * from DetalleTarima where ClaveProducto = '+"'"+ClaveProducto+"'"+' and Lote ='+"'"+Lote+"'"+' and Shipper ='+"'"+Factura+"'"+' and Bodega ='+"'CHIHUAHUA'";
          // let consulta = {
          //   'consulta': query
          // };
          // console.log(query);
          // this.traspasoSVC.getQuery(consulta).subscribe((dataDetalleTarimaDestino: any) => {
          this.tarimaService.GetGetProductoInformacionBodega(ClaveProducto, Lote, 'CHIHUAHUA').subscribe(dataDetalleTarimaDestino => {
            console.log(dataDetalleTarimaDestino);
            let updateDetalleTarima: DetalleTarima = dataDetalleTarima[0];

            let detalleTarimaDestino: DetalleTarima = dataDetalleTarimaDestino[0];

            if (dataDetalleTarimaDestino.length > 0) {
              //^ si existen datos, se actualizara el numero de sacos y el peso total y eliminaremos el Detalle Tarima en Transito
              detalleTarimaDestino.PesoTotal = ((+detalleTarimaDestino.PesoTotal) + (+kg)).toString();
              detalleTarimaDestino.SacosTotales = ((+detalleTarimaDestino.SacosTotales) + (+Sacos)).toString();
              this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaDestino).subscribe(resUpdate => {
                console.log(resUpdate);
                let query = 'delete DetalleTarima where IdDetalleTarima = ' + dataDetalleTarima[0].IdDetalleTarima
                let consulta = {
                  'consulta': query
                };
                console.log(query);
                this.traspasoSVC.getQuery(consulta).subscribe((deleteDetalleTarima: any) => {
                  console.log('%c%s', 'color: #0088cc', deleteDetalleTarima);
                })
                this.dropdownRefreshProductos();
              })
            } else {
              //^ si no existen datos, se actualizara nomas la bodega origen (en este caso TRANSITO)
              updateDetalleTarima.Bodega = 'CHIHUAHUA';
              this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(updateDetalleTarima).subscribe(resUpdate => {
                console.log(resUpdate);
                this.dropdownRefreshProductos();
              })
            }
          });
        } else {



          //^ Si no coincide el # de sacos, entonces se creara un nuevo detalle tarima con los sacos utilizados
          console.log('No todos los sacos seran Utilizados');
          //^ Actualizar Detalle Tarima Origen (original)//Agregar Nuevo Detalle Tarima con Bodega (CHIHUAHUA)
          let detalleTarimaNueva: DetalleTarima = dataDetalleTarimaNueva[0];


          console.log(detalleTarimaNueva);
          console.log(dataDetalleTarimaNueva[0]);
          console.log(Sacos);

          detalleTarimaNueva.SacosTotales = ((+detalleTarimaNueva.SacosTotales) - (+Sacos)).toString();
          detalleTarimaNueva.PesoTotal = (+kgSobra).toString();
          detalleTarimaNueva.Bodega = 'Transito';
          detalleTarimaNueva.Estatus = 'Creada';

          this.tarimaService.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
            console.log(resNuevaTarima);
            let detalleTarimaOriginal: DetalleTarima = dataDetalleTarimaOriginal[0];
            detalleTarimaOriginal.SacosTotales = Sacos.toString();
            detalleTarimaOriginal.PesoTotal = kg.toString();
            detalleTarimaOriginal.Bodega = 'CHIHUAHUA';
            this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaOriginal).subscribe(resUpdateOriginal => {
              console.log(resUpdateOriginal);
              this.dropdownRefreshProductos();
            })
          })
        }
      });
    }
    // this.agregarOrdenTemporal();
    this.resetQR();

  }

  // ^ Metodo para Generar Orden Temporal y Actualizar Saldos Detalle Orden Descarga
  // & Recibe como parametro la posicion del arreglo, Lote, ClaveProducto, Sacos y Kg
  agregarOrdenTemporalActualizarSaldos(i, Lote, ClaveProducto, Sacos, kg, Factura) {
    //^ asignar valores al objeto que sera insertado en orden temporal.
    let ordenT = new OrdenTemporal();

    console.log(this.arrayProductosIngresados);
    console.log(this.arrayProductosIngresados[i]);

    ordenT.IdDetalleTarima = this.arrayProductosIngresados[i].IdDetalleTarima;
    ordenT.IdOrdenCarga = 0;
    ordenT.IdOrdenDescarga = this.arrayProductosIngresados[i].IdOrdenDescarga;
    ordenT.QR = '';
    ordenT.NumeroFactura = this.arrayProductosIngresados[i].Shipper;
    ordenT.NumeroEntrada = this.arrayProductosIngresados[i].Pedimento;
    ordenT.ClaveProducto = this.arrayProductosIngresados[i].ClaveProducto;
    ordenT.Lote = this.arrayProductosIngresados[i].Lote;
    ordenT.Sacos = Sacos;
    ordenT.Producto = this.arrayProductosIngresados[i].Producto;
    ordenT.PesoTotal = kg;
    ordenT.FechaCaducidad = this.arrayProductosIngresados[i].FechaCaducidad;
    ordenT.FechaMFG = this.arrayProductosIngresados[i].FechaMFG;
    ordenT.Comentarios = this.arrayProductosIngresados[i].Comentarios;
    ordenT.CampoExtra1 = this.arrayProductosIngresados[i].PO;
    ordenT.CampoExtra2 = '';
    ordenT.CampoExtra3 = '';

    console.log(ordenT);
    //^ Insert a Orden Temporal
    this.ordenTemporalService.addOrdenTemporal(ordenT).subscribe(resAdd => {
      console.log(resAdd);
      // ^Obtener Detalle Orden de Descarga, para ser actualizado posteriormente
      // this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOrdenDescarga => {
      let query = 'select * from DetalleOrdenDescarga where IdOrdenDescarga = ' + this.IdOrdenDescarga + ' and Lote =' + "'" + Lote + "'" + ' and ClaveProducto =' + "'" + ClaveProducto + "'" + ' and Shipper =' + "'" + Factura + "';";
      let consulta = {
        'consulta': query
      };
      console.log(query);
      this.traspasoSVC.getQuery(consulta).subscribe((dataOrdenDescarga: any) => {
        console.log(dataOrdenDescarga);
        console.log(Sacos);
        let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) - (+kg)).toString();
        console.log(NuevoSaldo);
        //^ Actualizar Saldo de la tabla Detalle Orden Descarga
        this.ordenDescargaService.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
          console.log(res);
          this.actualizarTablaOrdenTemporal();
        });
      });
    });

  }


  onDeleteOrdenTemporal(ot: OrdenTemporal) {
    console.log(ot);
    let Lote = ot.Lote;
    let ClaveProducto = ot.ClaveProducto;
    let Bodega = 'Transito';
    let IdDetalleTarima = ot.IdDetalleTarima;
    let Factura = ot.NumeroFactura;
    let Sacos = ot.Sacos;
    let PesoTotal = ot.PesoTotal;

    //? PROCESO ELIMINAR PRODUCTO INGRESADO
    //? VERIFICAR SI ESE PRODUCTO EXISTE EN LA BODEGA DESTINO (TRANSITO)
    //? ----  SI EXISTE
    //? DESCONTAR LA CANTIDAD DE LA BODEGA ORIGEN Y SI QUEDA EN 0, ELIMINAMOS ESE DETALLE TARIMA
    //? ACTUALIZAMOS LA CANTIDAD EN LA BODEGA DESTINO

    //? ----  NO EXISTE
    //? DESCONTAR LA CANTIDAD DE LA BODEGA ORIGEN Y SI QUEDA EN 0, ELIMINAMOS ESE DETALLE TARIMA
    //? CREAMOS EL DETALLE TARIMA CON BODEGA DESTINO (TRANSITO)

    //? METODO ACTUALIZAR DETALLEBORRARORDENTEMPORAL
    //? OBTENEMOS Y ACTUALIZAMOS DETALLE ORDEN DESCARGA
    //? ELIMINAMOS ORDEN TEMPORAL

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
        //^ OBTENDREMOS EL DETALLE TARIMA ORIGEN (CHIHUAHUA) 
        let consultaTarimaOrigen = {
          'consulta': 'select * from DetalleTarima where ClaveProducto = ' + "'" + ClaveProducto + "'" + ' and Lote =' + "'" + Lote + "'" + ' and Bodega =' + "'Chihuahua'"
        };
        console.log(consultaTarimaOrigen);
        this.traspasoSVC.getQuery(consultaTarimaOrigen).subscribe((dataTO: any) => {
          console.log(dataTO);
          //^ DESCONTAREMOS LOS KG.
          let kgTO = dataTO[0].PesoTotal;
          let sacosTO = dataTO[0].SacosTotales;
          let kgRestantesTO = +kgTO - +PesoTotal;
          let sacosRestantesTO = +sacosTO - +Sacos;
          //^ SI LOS KG RESTANTES NOS DAN 0, ENTONCES LA ELIMINAMOS
          if (kgRestantesTO == 0) {
            //^ ELIMINAR DETALLE TARIMA ORIGEN
            let eliminarDetalleTarimaOrigen = {
              'consulta': 'delete DetalleTarima where IdDetalleTarima =' + dataTO[0].IdDetalleTarima
            }
            console.log(eliminarDetalleTarimaOrigen);
            this.traspasoSVC.getQuery(eliminarDetalleTarimaOrigen).subscribe((eliminarTO: any) => {
              console.log(eliminarTO);
            })
          }
          //^ SI LOS KG RESTANTES NO SON 0, ENTONCES ACTUALIZAREMOS SUS KG            
          else {
            //^ ACTUALIZAR DETALLE TARIMA ORIGEN
            console.log('Sobran Sacos en Chihuahua');
            let actualizarCantidadesTarimaOrigen = {
              'consulta': 'update DetalleTarima set SacosTotales =' + "'" + sacosRestantesTO + "'" + ', PesoTotal =' + "'" + kgRestantesTO + "'" + ' where IdDetalleTarima =' + dataTO[0].IdDetalleTarima
            }
            console.log(actualizarCantidadesTarimaOrigen);
            this.traspasoSVC.getQuery(actualizarCantidadesTarimaOrigen).subscribe((eliminarTO: any) => {
              console.log(eliminarTO);
            })
          }
          //^ OBTENER DETALLE TARIMA DESTINO (TRANSITO)
          let consultaTarimaDestino = {
            'consulta': 'select * from DetalleTarima where ClaveProducto = ' + "'" + ClaveProducto + "'" + ' and Lote =' + "'" + Lote + "'" + ' and Shipper =' + "'" + Factura + "'" + ' and Bodega =' + "'Transito'"
          };
          console.log(consultaTarimaDestino);
          this.traspasoSVC.getQuery(consultaTarimaDestino).subscribe((dataTD: any) => {
            if (dataTD.length > 0) {
              console.log('si hay resultados');
              //^ ACTUALIZAR DETALLE TARIMA DESTINO (TRANSITO)
              let kgActualizados = +dataTD[0].PesoTotal + +PesoTotal;
              let sacosActualizados = +dataTD[0].SacosTotales + +Sacos;
              let actualizarCantidadesTarimaDestino = {
                'consulta': 'update DetalleTarima set SacosTotales =' + "'" + sacosActualizados + "'" + ', PesoTotal =' + "'" + kgActualizados + "'" + ' where IdDetalleTarima =' + dataTD[0].IdDetalleTarima
              }
              console.log(actualizarCantidadesTarimaDestino);
              this.traspasoSVC.getQuery(actualizarCantidadesTarimaDestino).subscribe((eliminarTD: any) => {
                console.log(eliminarTD);
                //^ ACTUALIZAMOS DETALLE ORDEN DESCARGA Y ELIMINAMOS ORDEN TEMPORAL
                this.actualizarDetalleBorrarOT(ot);
              })
            } else {
              console.log('no hay resultados, crearemos detalle Tarima');
              //^ CREAR DETALLE TAIRMA DESTINO (TRANSITO)
              let detalleTarimaNueva: DetalleTarima
              detalleTarimaNueva = {
                IdDetalleTarima: 0,
                ClaveProducto: ot.ClaveProducto,
                Producto: ot.Producto,
                SacosTotales: ot.Sacos,
                PesoxSaco: ((+ot.PesoTotal) / (+ot.Sacos)).toString(),
                Lote: ot.Lote,
                PesoTotal: ot.PesoTotal,
                SacosxTarima: '',
                TarimasTotales: '',
                Bodega: 'Transito',
                IdProveedor: 0,
                Proveedor: '',
                PO: ot.CampoExtra1,
                FechaMFG: ot.FechaMFG,
                FechaCaducidad: ot.FechaCaducidad,
                Shipper: ot.NumeroFactura,
                USDA: '',
                Pedimento: ot.NumeroEntrada,
                Estatus: 'Creada'
              }        
              console.log(detalleTarimaNueva);
              this.tarimaService.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
              console.log('%c%s', 'color: #917399', resNuevaTarima);
              //^ ACTUALIZAMOS DETALLE ORDEN DESCARGA Y ELIMINAMOS ORDEN TEMPORAL
              this.actualizarDetalleBorrarOT(ot);
            })
            }
          });
        })
      }
    })
  }

  //^ Metodo para actualizar el Saldo x Detalle Orden de Carga y  borrar Orden Temporal
  actualizarDetalleBorrarOT(ot: OrdenTemporal) {
    let ClaveProducto = ot.ClaveProducto;
    let Lote = ot.Lote;
    let Factura = ot.NumeroFactura;
    //^ Obtener Detalle Orden de Descarga, para ser actualizado posteriormente
    let query = 'select * from DetalleOrdenDescarga where IdOrdenDescarga = ' + this.IdOrdenDescarga + ' and Lote =' + "'" + Lote + "'" + ' and ClaveProducto =' + "'" + ClaveProducto + "'" + ' and Shipper =' + "'" + Factura + "';";
    let consulta = {
      'consulta': query
    };
    console.log(query);
    this.traspasoSVC.getQuery(consulta).subscribe((dataOrdenDescarga: any) => {
      console.log(dataOrdenDescarga);
      let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) + (+ot.PesoTotal)).toString();
      console.log(NuevoSaldo)
      //^ Actualizar Saldo de la tabla Detalle Orden Descarga
      this.ordenDescargaService.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
        console.log(res);
        this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden => {
          console.log(DeleteOrden);
          this.actualizarTablaOrdenTemporal();
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          this.dropdownRefreshProductos();
        });
      });
    });

  }


  //Metodo para obtener la bodega origen hardcode
  obtenerBodegaOrigen() {
    console.log(this.IdOrdenDescarga);
    this.ordenDescargaService.getOrdenDescargaID(this.IdOrdenDescarga).subscribe(data => {
      this.bodegaOrigen = data[0].Origen;
      console.log(this.bodegaOrigen);
    })

  }

  //Metodo para obtener la bodega Destino hardcode
  obtenerBodegaDestino() {
    console.log(this.IdOrdenDescarga);
    this.ordenDescargaService.getOrdenDescargaID(this.IdOrdenDescarga).subscribe(data => {
      this.bodegaDestino = data[0].Destino;
      console.log(this.bodegaDestino);
    })

  }


  finalizar() {

    //this.ordenDescargaService.formData.Estatus = 'Descargada'
    console.log(this.ordenDescargaService.formData);
    console.log(this.listDataScan.data);

    let kg;
    let kg2;
    let saldo;
    kg = 0;
    kg2 = 0;
    saldo = 1;

    for (let i = 0; i < this.listDataScan.data.length; i++) {
      kg2 = kg2 + +this.listDataScan.data[i].PesoTotal;
    }

    console.log(this.ordenDescargaService.formData.Sacos);
    console.log(kg2);

    saldo = +this.ordenDescargaService.formData.Kg - kg2;



    if (saldo == 0) {
      this.ordenDescargaService.formData.Estatus = 'Descargada'
      console.log(this.ordenDescargaService.formData);
      this.updateOrdenDescarga(this.ordenDescargaService.formData, 'Descargada');
      Swal.fire({
        title: 'Orden Descarga Completada',
        icon: 'success',
        text: 'Productos Descargados Correctamente.',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
      this.router.navigate(['/ordenDescargadetallecuu']);
    } else {
      Swal.fire({
        title: 'Orden Descarga Incompleta',
        icon: 'warning',
        text: 'No se han terminado de Descargar los productos.',
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false
      });
    }
    //this.updateOrdenDescarga(this.service.formData,'Descargada');

    /*  let productos = this.listData.data;
    // let productos = this.ordenTemporalService.preOrdenTemporalOD

    console.log(this.listData.data,'finalizarORdne');

let saldo = 0;
    for (let i =0; i<productos.length;i++){

      saldo = saldo + +this.listData.data[i].Saldo
      if(saldo==0){
        this.service.formData.Estatus = 'Descargada'
        console.log(this.service.formData);
        this.updateOrdenDescarga(this.service.formData,'Descargada');
      }



    } */



  }

  updateOrdenDescarga(od, estatus) {
    od.Estatus = estatus
    // od.FechaFinalDescarga = new Date();
    this.ordenDescargaService.updateOrdenDescarga(od).subscribe(data => {
      console.log(data, 'update od ' + estatus);
    })

  }


  Ingresa() {

  }






}
