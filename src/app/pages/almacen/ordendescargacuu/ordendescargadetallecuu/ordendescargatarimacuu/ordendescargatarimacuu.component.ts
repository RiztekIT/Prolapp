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
  
  constructor(public router: Router, public tarimaService: TarimaService, public ordenDescargaService: OrdenDescargaService, private dialog: MatDialog, public ordenTemporalService: OrdenTemporalService) {
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
  displayedColumnsScan: string[] = ['ClaveProducto', 'Producto', 'Lote', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
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
    this.filteredOptionsProductos =  of([]);

    this.ordenDescargaService.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataDOD=>{
      dataDOD.forEach(element => { 
            this.obtenerInformacionProducto(element);          
        });
    });
  }

  obtenerInformacionProducto(element:any){
    console.log(element);
    this.tarimaService.getDetalleTarimaClaveLoteBodega(element.ClaveProducto, element.Lote, 'Transito').subscribe(dataP => {
      console.log(dataP);
      for (let i = 0; i < dataP.length; i++) {
        let product = dataP[i];
        product.Saldo = element.Saldo;
        product.IdOrdenDescarga = element.IdOrdenDescarga;
        product.PesoOriginal = element.Sacos;
        product.SacosOriginal = ((+element.Sacos)/(+element.PesoxSaco)).toString();
        // product.NuevoSaldo = ((+product.Saldo) - (+dataP[i].PesoTotal)).toString();
        product.KilogramosSobrantes = ((+dataP[i].PesoTotal)-(+product.Saldo)).toString();

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

  deleteProductoIngresado(prodInfo){
    console.log(prodInfo);
    this.arrayProductosIngresados.splice(this.ordenTemporalService.preOrdenTemporal.indexOf(prodInfo), 1);
    this.listData = new MatTableDataSource(this.arrayProductosIngresados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    console.log(this.arrayProductosIngresados.length);
    if(this.arrayProductosIngresados.length>0){
      this.productoValido = true;
    }else{
      this.productoValido = false;
    }
  }

  clearCamposIngresados(){
    this.ClaveProductoIngresado = "";
    this.LoteProductoIngresado = "";
    this.ProductoIngresado = "";
    this.detalleSeleccionado = "";
  }

  actualizarTablaTarima(informacionProducto) {
    console.log(informacionProducto);
    this.productoValido = true;

    console.log(+informacionProducto.KilogramosSobrantes);

    this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, informacionProducto.Lote, informacionProducto.ClaveProducto).subscribe(dataOD=>{
        console.log(dataOD);
      if (+dataOD[0].Saldo > 0) {
        
        this.arrayProductosIngresados.forEach(element => {
          if ((informacionProducto.ClaveProducto == element.ClaveProducto) && (informacionProducto.Lote == element.Lote)) {
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

  //   this.ordenDescargaService.GetODOTTB(this.IdOrdenDescarga, 'Chihuahua').subscribe(dataQR => {
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

      let kg = +this.arrayProductosIngresados[i].PesoOriginal;

      let kgSobra = +this.arrayProductosIngresados[i].KilogramosSobrantes;

      this.agregarOrdenTemporalActualizarSaldos(i, Lote, ClaveProducto, Sacos, kg);

     

      this.tarimaService.GetGetProductoInformacionBodega(this.arrayProductosIngresados[i].ClaveProducto, this.arrayProductosIngresados[i].Lote, 'Transito').subscribe(dataDetalleTarima => {
        console.log(dataDetalleTarima);

        let dataDetalleTarimaOriginal = dataDetalleTarima;
        let dataDetalleTarimaNueva = dataDetalleTarima;


        // console.log(Sacos);
        // console.log(Lote);
        // console.log(ClaveProducto);
        // console.log(i);

        //^ Verificar si se estan utilizando todos los sacos de la Bodega (detalle Tarima)
        if (kgSobra == 0) {
          //^ si se utilizan todos, solo se cambiara la bodega del producto (Chihuahua)
          console.log('Se utilizaran todos los Sacos');
          //^ Verificar si ya existe este producto en la bodega destino
          this.tarimaService.GetGetProductoInformacionBodega(ClaveProducto, Lote, 'Chihuahua').subscribe(dataDetalleTarimaDestino => {
              console.log(dataDetalleTarimaDestino);
              let updateDetalleTarima: DetalleTarima = dataDetalleTarima[0];

              let detalleTarimaDestino: DetalleTarima = dataDetalleTarimaDestino[0];

              if(dataDetalleTarimaDestino.length>0){
                //^ si existen datos, se actualizara el numero de sacos y el peso total
                detalleTarimaDestino.PesoTotal = ((+detalleTarimaDestino.PesoTotal) + (+kg)).toString(); 
                detalleTarimaDestino.SacosTotales = ((+detalleTarimaDestino.SacosTotales) + (+Sacos)).toString(); 
                this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarimaDestino).subscribe(resUpdate => {
                  console.log(resUpdate);
                  this.dropdownRefreshProductos();
                })
              }else{
                //^ si no existen datos, se actualizara nomas la bodega origen (en este caso TRANSITO)
                updateDetalleTarima.Bodega = 'Chihuahua';
                this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(updateDetalleTarima).subscribe(resUpdate => {
                  console.log(resUpdate);
                  this.dropdownRefreshProductos();
                })
              }
          });
        } else {

          //& CLAVE : 01
          //& Saldo: 2500 kg
          //& DetalleTarima: 3750kg
          //& Sobrantes: 1250 kg

          //^ Si no coincide el # de sacos, entonces se creara un nuevo detalle tarima con los sacos utilizados
          console.log('No todos los sacos seran Utilizados');
          //^ Actualizar Detalle Tarima Origen (original)//Agregar Nuevo Detalle Tarima con Bodega (Chihuahua)
          let detalleTarimaNueva: DetalleTarima = dataDetalleTarimaNueva[0];
          //& PesoTotal: 3750 kg

          console.log(detalleTarimaNueva);
          console.log(dataDetalleTarimaNueva[0]);
          console.log(Sacos);

          detalleTarimaNueva.SacosTotales = ((+detalleTarimaNueva.SacosTotales) - (+Sacos)).toString();
          detalleTarimaNueva.PesoTotal = (+kgSobra).toString();
          detalleTarimaNueva.Bodega = 'Transito';
          detalleTarimaNueva.Estatus = 'Creada';
          //! detalleTarimaNueva.TarimasTotales  COMO CALCULAR TARIMAS TOTALES ??

          this.tarimaService.addDetalleTarima(detalleTarimaNueva).subscribe(resNuevaTarima => {
            console.log(resNuevaTarima);
            let detalleTarimaOriginal: DetalleTarima = dataDetalleTarimaOriginal[0];
            detalleTarimaOriginal.SacosTotales = Sacos.toString();
            detalleTarimaOriginal.PesoTotal = kg.toString();
            //! detalleTarimaOriginal.TarimasTotales COMO CALCULAR TARIMAS TOTALES ??
            detalleTarimaOriginal.Bodega = 'Chihuahua';
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
  agregarOrdenTemporalActualizarSaldos(i, Lote, ClaveProducto, Sacos, kg) {
    //^ asignar valores al objeto que sera insertado en orden temporal.
    let ordenT = new OrdenTemporal();

    console.log(this.arrayProductosIngresados);
    console.log(this.arrayProductosIngresados[i]);

    ordenT.IdDetalleTarima = this.arrayProductosIngresados[i].IdDetalleTarima;
    ordenT.IdOrdenCarga = 0;
    ordenT.IdOrdenDescarga = this.arrayProductosIngresados[i].IdOrdenDescarga;
    ordenT.QR = '';
    ordenT.ClaveProducto = this.arrayProductosIngresados[i].ClaveProducto;
    ordenT.Lote = this.arrayProductosIngresados[i].Lote;
    ordenT.Sacos = Sacos;
    ordenT.Producto = this.arrayProductosIngresados[i].Producto;
    ordenT.PesoTotal = kg;
    ordenT.FechaCaducidad = this.arrayProductosIngresados[i].FechaCaducidad;
    ordenT.Comentarios = this.arrayProductosIngresados[i].Comentarios;

    console.log(ordenT);
    //^ Insert a Orden Temporal
    this.ordenTemporalService.addOrdenTemporal(ordenT).subscribe(resAdd => {
      console.log(resAdd);
        // ^Obtener Detalle Orden de Descarga, para ser actualizado posteriormente
      this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOrdenDescarga => {
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

    let Sacos = ot.Sacos;
    let PesoTotal = ot.PesoTotal;

    Swal.fire({
      title: '¿Seguro de Borrar Ingreso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.tarimaService.GetGetProductoInformacionBodega(ClaveProducto, Lote, Bodega).subscribe(dataDT => {
          console.log(dataDT);
          if (dataDT.length > 0) {
            //^ en este caso, se tendra que actualizar el detalle tarima origen y eliminar el detalle que se encuentra en transito
            //^ Actualizar tarima origen
            let detalleTarima = new DetalleTarima();
            detalleTarima = dataDT[0];
            detalleTarima.SacosTotales = ((+detalleTarima.SacosTotales) + (+Sacos)).toString();
            detalleTarima.PesoTotal = ((+detalleTarima.PesoTotal) + (+PesoTotal)).toString();
            this.tarimaService.updateDetalleTarimaSacosPesoTarimasBodega(detalleTarima).subscribe(resUpdate => {
              console.log(resUpdate);
              //^ eliminar detalle tarima Transito
              this.tarimaService.deleteDetalleTarima(IdDetalleTarima).subscribe(resDelete => {
                console.log(resDelete);
                //^ Obtener Detalle Orden de Descarga, para ser actualizado posteriormente
                this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOrdenDescarga => {
                  console.log(dataOrdenDescarga);
                  let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) + (+ot.PesoTotal)).toString();
                  console.log(NuevoSaldo)
                    //^ Actualizar Saldo de la tabla Detalle Orden Descarga
                  this.ordenDescargaService.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
                    console.log(res);
                    this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden=>{
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
                    })
                  })
                });
              })
            })

          } else {
            //^ si no se encuntran resultados, solo se actualizara la bodega en el detalle que se encuentra en transito
            this.tarimaService.getUpdateDetalleTarimaBodega(IdDetalleTarima, Bodega).subscribe(resUpdate => {
              console.log(resUpdate);
              //^ Obtener Detalle Orden de Descarga, para ser actualizado posteriormente
              this.ordenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOrdenDescarga => {
                console.log(dataOrdenDescarga);
                let NuevoSaldo = ((+dataOrdenDescarga[0].Saldo) + (+ot.PesoTotal)).toString();
                console.log(NuevoSaldo)
                  //^ Actualizar Saldo de la tabla Detalle Orden Descarga
                this.ordenDescargaService.updateDetalleOrdenDescargaSaldo(dataOrdenDescarga[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
                  console.log(res);
                  this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(DeleteOrden=>{
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
            })
          }
        });
        
      }
    })


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


  finalizar(){

    //this.ordenDescargaService.formData.Estatus = 'Descargada'
        console.log(this.ordenDescargaService.formData);
        console.log(this.listDataScan.data);

        let sacos;
        let sacos2;
        let saldo;
        sacos=0;
        sacos2=0;
        saldo=1;
        
        for (let i=0; i<this.listDataScan.data.length; i++ ){
          sacos2 = sacos2 + +this.listDataScan.data[i].PesoTotal;
        }

        console.log(this.ordenDescargaService.formData.Sacos);
        console.log(sacos2);
        
        saldo = +this.ordenDescargaService.formData.Sacos - sacos2;



        if (saldo==0){
          this.ordenDescargaService.formData.Estatus = 'Descargada'
        console.log(this.ordenDescargaService.formData);
        this.updateOrdenDescarga(this.ordenDescargaService.formData,'Descargada');
        Swal.fire({
          title: 'Orden Descarga Completada',
          icon: 'success',
          text: 'Productos Descargados Correctamente.',
          timer: 2000,
          showCancelButton: false,
          showConfirmButton: false
        });
        this.router.navigate(['/ordenDescargadetallecuu']);
        }else{
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

  updateOrdenDescarga(od,estatus){
    od.Estatus=estatus
    od.FechaFinalDescarga = new Date();
    this.ordenDescargaService.updateOrdenDescarga(od).subscribe(data=>{
      console.log(data,'update od '+estatus);
    })
    
  }


  Ingresa(){

  }






}
