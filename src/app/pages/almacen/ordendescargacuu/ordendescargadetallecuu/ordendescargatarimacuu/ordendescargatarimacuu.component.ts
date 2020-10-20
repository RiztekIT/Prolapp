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
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { element } from 'protractor';


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

    this.tarimaService.listenerScan().subscribe((m: any) => {
      console.log(m);
      this.actualizarTablaTarimaEscaneada();
    });


    //Actualiza la tabla visualizacion cuando se hace un traspaso
    // this.ordenTemporalService.listen().subscribe((m: any) => {
    //   console.log(m);
    //   this.simularQR(m);
    //   this.tarimaService.trapasoOrdenDescarga = false;
    // });
  }


  ngOnInit() {
    this.isVisible = false;
    this.isVisibleQR = true;
    this.tarimaService.TraspasoDescarga = false;
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.ordenDescargaService.formData = JSON.parse(localStorage.getItem('OrdenDescarga'))
    this.obtenerBodegaOrigen();
    this.obtenerBodegaDestino();
    // this.actualizarTablaTarima();
    this.actualizarTablaTarimaEscaneada();
    this.dropdownRefreshProductos();
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
  displayedColumnsScan: string[] = ['IdTarima', 'Sacos', 'PesoTotal', 'QR', 'Bodega', 'Traspaso', 'Borrar'];
  isExpansionDetailRowScan = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sortScan: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorScan: MatPaginator;

  //Dropdown Productos
  myControlProductos = new FormControl();
  filteredOptionsProductos: Observable<any[]>;
  optionsProductos: any[] = [];
  detalleSeleccionado: string = "";

  //Variables donde se guardaran los Valores que el usuario ingresara (Producto)
  ClaveProductoIngresado: string;
  LoteProductoIngresado: string;

  //Informacion del Producto Ingresado
  ProductoIngresado: any;

  //Arreglo con la Informacion de los productos Ingresados (Todavia no han sido registrados en el sistema)
  arrayProductosIngresados = new Array<any>();

  regresar() {
    this.router.navigate(['/ordenDescargadetallecuu']);
  }

  dropdownRefreshProductos() {
    this.optionsProductos = new Array<any[]>();
    this.filteredOptionsProductos = new Observable<any[]>();
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
        // product.NuevoSaldo = ((+product.Saldo) - (+dataP[i].PesoTotal)).toString();

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
  }

  clearCamposIngresados(){
    this.ClaveProductoIngresado = "";
    this.LoteProductoIngresado = "";
    this.ProductoIngresado = "";
    this.detalleSeleccionado = "";
  }

  actualizarTablaTarima(informacionProducto) {
console.log(informacionProducto);

let productoValido = true;
console.log(+informacionProducto.NuevoSaldo);
if(+informacionProducto.Saldo > 0){

  this.arrayProductosIngresados.forEach(element => {
    if((informacionProducto.ClaveProducto == element.ClaveProducto)&&(informacionProducto.Lote == element.Lote)){
      Swal.fire({
        icon: 'error',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1200,
        title: 'Producto ya Ingresado',
        text: 'El Producto ya ha sido ingresado.'
      })
      productoValido = false;
    }  
  });
  if(productoValido == true){
    this.arrayProductosIngresados.push(informacionProducto);
    this.listData = new MatTableDataSource(this.arrayProductosIngresados);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.clearCamposIngresados(); 
  }
}else{
  Swal.fire({
    icon: 'error',
    showCancelButton: false,
    showConfirmButton: false,
    timer: 1200,
    title: 'Producto Ya Descargado',
    text: 'El Producto ya ha sido descargado.'
  })
}



    // // this.tarimaService.masterT = new Array<MasterDetalleTarima>();
    // this.tarimaService.masterT = [];
    // // this.ordenDescargaService.GetODOTQR(1).subscribe(dataID => {
    // // console.log(dataID, 'loquetraeODOT');
    // // let pm = 0
    // // console.log(dataID[i]);
    // this.ordenDescargaService.GetODOTTB(this.IdOrdenDescarga, 'PasoTx').subscribe(dataQR => {
    //   if (dataQR.length > 0) {
    //     for (let i = 0; i <= dataQR.length - 1; i++) {
    //       // es lo que trae detalle tarima con ese QR
    //       console.log(dataQR[0]);
    //       // if(dataQR[0]){
    //       // console.warn(pm);
    //       this.tarimaService.masterT[i] = dataQR[i];
    //       this.tarimaService.masterT[i].detalleTarima = [];
    //       this.tarimaService.getDetalleTarimaID(dataQR[i].IdTarima).subscribe(res => {
    //         for (let l = 0; l <= res.length - 1; l++) {
    //           console.log(l);
    //           console.log(res[l]);
    //           this.tarimaService.masterT[i].detalleTarima.push(res[l]);
    //         }
    //       })
    //       this.listData = new MatTableDataSource(this.tarimaService.masterT);
    //       this.listData.sort = this.sort;
    //       this.listData.paginator = this.paginator;
    //       this.listData.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
    //       console.log(this.tarimaService.masterT);
    //       // pm++;
    //       // }
    //     }
    //   } else {
    //     this.tarimaService.masterT = [];
    //     this.listData = new MatTableDataSource(this.tarimaService.masterT);
    //     this.listData.sort = this.sort;
    //     this.listData.paginator = this.paginator;
    //     this.listData.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
    //   }
    // })
    // // })
  }



  actualizarTablaTarimaEscaneada() {

    this.tarimaService.masterTE = new Array<any>();
    this.tarimaService.masterTE = [];

    this.ordenDescargaService.GetODOTTB(this.IdOrdenDescarga, 'Chihuahua').subscribe(dataQR => {
      if (dataQR.length > 0) {
        for (let i = 0; i <= dataQR.length - 1; i++) {
          // es lo que trae detalle tarima con ese QR
          console.log(dataQR[0]);
          // if(dataQR[0]){
          // console.warn(pm);
          this.tarimaService.masterTE[i] = dataQR[i];
          this.tarimaService.masterTE[i].detalleTarima = [];
          this.tarimaService.getDetalleTarimaID(dataQR[i].IdTarima).subscribe(res => {
            for (let l = 0; l <= res.length - 1; l++) {
              console.log(l);
              console.log(res[l]);
              this.tarimaService.masterTE[i].detalleTarima.push(res[l]);
            }
          })
          this.listDataScan = new MatTableDataSource(this.tarimaService.masterTE);
          this.listDataScan.sort = this.sortScan;
          this.listDataScan.paginator = this.paginatorScan;
          this.listDataScan.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';
          console.log(this.tarimaService.masterTE);
          // pm++;
          // }
        }
      } else {
        this.tarimaService.masterTE = [];
        this.listDataScan = new MatTableDataSource(this.tarimaService.masterTE);
        this.listDataScan.sort = this.sortScan;
        this.listDataScan.paginator = this.paginatorScan;
        this.listDataScan.paginator._intl.itemsPerPageLabel = 'Tarimas por Pagina';

      }
    })

  }





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

  //Descargar Producto (llegaran como parametro la informacion del producto ingresado por el usuario)
  descargarProducto(ClaveProducto, Lote) {
    // hardcode
    this.QRdata = new Tarima();
    // this.QRdata.QR = qrleido;
    // this.qrleido = '7AzEQFo';
    // this.QRdata.QR = '7AzEQFo';

    console.log(this.qrleido.lenght);

    if (this.qrleido.lenght < 6 || this.qrleido.lenght > 6) {
      Swal.fire({
        icon: 'error',
        // showCancelButton: false,
        // showConfirmButton: false,
        // timer: 1200,
        title: 'ERROR TARIMA',
        text: 'QR incompleto.'
      })
    } else {

      this.isVisible = false;
      this.isVisibleQR = true;

      console.log(this.QRdata);

      this.tarimaService.getTarimaQR(this.QRdata.QR).subscribe(dataQR => {
        console.log(dataQR);
        let TQR = new Tarima();
        TQR = dataQR[0]

        TQR.Bodega = "Chihuahua"

        this.tarimaService.updateTarima(TQR).subscribe(res => {

          this.tarimaService.getDetalleTarimaID(dataQR[0].IdTarima).subscribe(data => {

            for (let i = 0; i <= data.length - 1; i++) {

              let ordenTemp = new OrdenTemporal();

              ordenTemp.IdOrdenTemporal = 0;
              ordenTemp.IdDetalleTarima = dataQR[0].IdTarima;
              ordenTemp.IdOrdenCarga = 0;
              ordenTemp.IdOrdenDescarga = this.IdOrdenDescarga;
              ordenTemp.QR = dataQR[0].QR
              ordenTemp.ClaveProducto = data[i].ClaveProducto;
              ordenTemp.Lote = data[i].Lote;
              ordenTemp.Sacos = data[i].SacosTotales;
              ordenTemp.Producto = data[i].Producto;
              ordenTemp.PesoTotal = ((+data[i].SacosTotales) * (+data[i].PesoxSaco)).toString();
              // ordenTemp.PesoTotal = ((+this.ordenTemporalService.preOrdenTemporalOD[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)).toString();
              ordenTemp.FechaCaducidad = data[i].FechaCaducidad;
              ordenTemp.Comentarios = '';
              console.log(ordenTemp, 'ordentemp´final');

         this.ordenTemporalService.addOrdenTemporal(ordenTemp).subscribe(DataOT => {
            console.log(DataOT);

            this.actualizarTablaTarimaEscaneada();
          // this.actualizarTablaTarima();
          console.log(res);
          Swal.fire({
            icon: 'success',
            // showCancelButton: false,
            // showConfirmButton: false,
            // timer: 1200,
            title: 'Tarima Escaneada Exitosamente',
            text: 'Tarima: ' + TQR.QR
            // text1: 'Bodega: '+ TQR.Bodega

          })

           })


            }

          })
            

        

          
        })
      })



    }
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

  //Traspaso

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

  traspaso() {

    this.tarimaService.trapasoOrdenCarga = false;
    this.tarimaService.TraspasoDescarga = true;
    console.log(this.bodegaDestino);
    this.tarimaService.bodega = this.bodegaDestino;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(TraspasoTarimaComponent, dialogConfig);

  }

  // traspasoOrdenDescarga(row: DetalleTarima) {
  //   console.log(row);
  //   // this.tarimaService.trapasoOrdenCarga = true;
  //   this.tarimaService.trapasoOrdenDescarga = true;
  //   this.ordenTemporalService.traspasoOrdenTemporal = false;
  //   this.tarimaService.idTarimaOrdenCarga = row.IdTarima;
  //   this.tarimaService.detalleTarimaOrdenCarga = row;
  //   //Indicar cual es la bodega de la tarima
  //   this.tarimaService.bodega = this.bodegaOrigen;
  //   this.tarimaService.getTarimaID(row.IdTarima).subscribe(dataQr => {
  //     this.tarimaService.QrOrigen = dataQr[0].QR;
  //     const dialogConfig = new MatDialogConfig();
  //     dialogConfig.disableClose = true;
  //     dialogConfig.autoFocus = true;
  //     dialogConfig.width = "70%";
  //     this.dialog.open(TraspasoTarimaComponent, dialogConfig);
  //   })
  // }

  traspasoOrdenDescargaTemporal(row: OrdenTemporal) {
    console.log(row);
    //Indicamos que el traspaso se esta haciendo desde la tabla Orden Temporal
    this.ordenTemporalService.traspasoOrdenTemporal = true;
    this.tarimaService.trapasoOrdenDescarga = false;
    this.ordenTemporalService.ordenTemporalt = new OrdenTemporal();
    this.ordenTemporalService.ordenTemporalt = row;
    this.tarimaService.idTarimaOrdenDescarga = row.IdDetalleTarima;
    this.tarimaService.QrOrigen = row.QR;
    //Indicar cual es la bodega de la tarima
    this.tarimaService.bodega = this.bodegaDestino;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(TraspasoTarimaComponent, dialogConfig);
    // this.traspasoOrdenCargaTemporal(row);
  }

  //regresar el concepto a su estado original
  regresarConceptos(row: OrdenTemporal) {
    console.log(row);
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
        this.tarimaService.getTarimaQR(undoQR).subscribe(undores => {
          console.log(undores);
          let TQR = new Tarima();
          TQR = undores[0]

          TQR.Bodega = "PasoTx"

          this.tarimaService.updateTarima(TQR).subscribe(res => {
            console.log(res);
            // this.actualizarTablaTarima();
            this.actualizarTablaTarimaEscaneada();
            Swal.fire({
              icon: 'success',
              // showCancelButton: false,
              // showConfirmButton: false,
              // timer: 1200,
              title: 'Tarima Borrada ',
              text: 'Tarima: ' + TQR.QR
              // text1: 'Bodega: '+ TQR.Bodega

            })
          })

        })
      }
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
          sacos2 = sacos2 + +this.listDataScan.data[i].Sacos;
        }

        console.log(this.ordenDescargaService.formData.Sacos);
        console.log(sacos2);
        
        saldo = +this.ordenDescargaService.formData.Sacos - sacos2;



        if (saldo==0){
          this.ordenDescargaService.formData.Estatus = 'Descargada'
        console.log(this.ordenDescargaService.formData);
        this.updateOrdenDescarga(this.ordenDescargaService.formData,'Descargada');
        this.router.navigate(['/ordenDescargadetallecuu']);
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


  Ingresar(){
    
  }






}
