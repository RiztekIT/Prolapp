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
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';
import { OrdenCargaConceptoComponent } from './orden-carga-concepto/orden-carga-concepto.component';
import { TraspasoTarimaComponent } from '../../../traspaso-tarima/traspaso-tarima.component';
import { ScannerComponent } from 'src/app/components/scanner/scanner.component';
//IMPORTS QR SCANNER
// import { ZXingScannerComponent } from '@zxing/ngx-scanner';
// import { Result } from '@zxing/library';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {
  enableScan=false;
  qrleido;
  
  constructor(public router: Router, public tarimaService: TarimaService, public ordenCargaService: OrdenCargaService,
    public ordenTemporalService: OrdenTemporalService, private dialog: MatDialog, ) {
      
      this.ordenTemporalService.listen().subscribe((m: any) => {
        this.actualizarTabla();
      });

      this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
        this.actualizarTablaOrdenTemporal();
      });
      
    }
    
    
    ngOnInit() {
      this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
      this.showButton = false;
      this.actualizarTablaOrdenTemporal();
      // this.onPageInit();
   

    }
    // @ViewChild('scanner',{static:true, read: false}) scanner: ZXingScannerComponent;
    // currentDevice: MediaDeviceInfo = null;
    // allowedFormats: any;

    // private onPageInit(){
    //   this.initCamera();
    //   this.scanner.permissionResponse.subscribe(
    //     (perm: boolean) =>{
    //      this.hasPermission = perm;
    //     });

    // }
  
    // private initCamera(): void {
    //   this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
    //     this.hasDevices = true;
    //     this.availableDevices = devices;
    //     this.currentDevice = null;
    //     if (this.availableDevices.length > 1) {
    //       const defaultCamera = this.availableDevices.filter(e => e.label.toLocaleLowerCase().indexOf('back') > -1);
    //       if (defaultCamera !== null && defaultCamera !== undefined) {
    //         this.currentDevice = defaultCamera[0];
    //       } else {
    //          this.currentDevice = this.availableDevices[0];
    //       }
    //     } else {
    //       this.currentDevice = this.availableDevices[0];
    //     }
    //   });
    // }
    // handleQrCodeResult(resultString: string) {
    //   console.debug('Result: ', resultString);
    //   const final_value = JSON.parse(resultString)
    //   this.qrResultString = 'name: ' + final_value.name + ' age: ' + final_value.age;
    // }


    // Tabla pre visualizacion
      listData: MatTableDataSource<any>;
      displayedColumns: string[] = ['ClaveProducto', 'Lote', 'Sacos', 'Comentarios', 'Options'];
      @ViewChild(MatSort, null) sort: MatSort;
      @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    // Tabla Orden Temporal
      listDataOrdenTemporal: MatTableDataSource<any>;
      displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
      @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
      @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  //Informacion que vendra del QR
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  //Id Orden Carga
  IdOrdenCarga: number;
  // //Orden Temporal
  // oT = new OrdenTemporal();

  //Variable para mostrar botones
  showButton: boolean;

  // SCANNER QR //

  // ngVersion = VERSION.full;

  // @ViewChild('scanner', null)
  // scanner: ZXingScannerComponent;

  // hasDevices: boolean;
  // hasPermission: boolean;
  // qrResultString: string;
  // qrResult: Result;

  // availableDevices: MediaDeviceInfo[];
  // currentDevice: MediaDeviceInfo;

  // SCANNER QR //

  escaner(evento){
    console.log(evento);
    this.qrleido = evento;
    // this.enableScan = false;
  }
  escanear(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";

    let dialogscan = this.dialog.open(ScannerComponent, dialogConfig);

    dialogscan.afterClosed().subscribe(data=>{
      console.log(data);
      this.qrleido = data;
    })

    

  }
  cerrarescaner(){
    console.log('cerrar escaner');
    this.enableScan = false;
    console.log(this.enableScan);
  }
  camaras(event){
    console.log(event);

  }
 

  simularQR() {

    //Obtener Datos Escaneados del QR
    this.QRdata.IdTarima = 36;
    this.QRdata.Sacos = '150';
    this.QRdata.PesoTotal = '3000';
    this.QRdata.QR = '123';

    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporal = [];
    console.log(this.ordenTemporalService.preOrdenTemporal);

    console.log(this.QRdata);
    //Obtener los detalles de Tarima del QR previamente escaneado
    this.tarimaService.getDetalleTarimaID(this.QRdata.IdTarima).subscribe(data => {
      console.log(data);
      //verificar si la tarima tiene detalles tarima
      if(data.length > 0){
        
        
        // recorrer tantos conceptos tenga la tarima escaneada
      for (let i = 0; i <= data.length - 1; i++) {

        //Variable para establece el maximo de sacos en base a la cantidad de sacos en la tarima
        let sacosMaximos = data[i].Sacos;
        console.log(sacosMaximos);
        //igualar el objeto QRdetalle data con el concepto
        this.QRDetalledata[i] = data[i];
        console.log(this.QRDetalledata);

        console.log(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto);
        //Verificar match de detalle tarima con detalle Orden Carga
        this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto).subscribe(dataOrdenCarga => {
          console.log(dataOrdenCarga);
          if (dataOrdenCarga.length > 0) {
            console.log('Si hay Datos Registrados');
            let SaldoMaximo = dataOrdenCarga[0].Saldo;
            let sacosIngreso;

            console.log(SaldoMaximo);
            console.log(sacosMaximos);
            if(SaldoMaximo < sacosMaximos){
sacosIngreso = sacosMaximos;
            }else{
sacosIngreso = SaldoMaximo
            }

          console.log(sacosIngreso);

            //Verificar que se puedan ingresar mas productos a ordenTemporal en base al saldo de DetalleOrdenCarga
            console.log(sacosIngreso);
            if (+sacosIngreso > 0) {
              //Orden Temporal
              let oT = new OrdenTemporal();

              //Verifiacar si ya hay datos guardados en orden Temporal.
              // this.ordenTemporalService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto).subscribe(dataOrdenTemporal => {
              //   console.log(dataOrdenTemporal);
              //   if (dataOrdenTemporal.length > 0) {
              //     console.log('Ya hay VALORES EN LA ORDEN TEMPORAL');
              oT.IdTarima = this.QRdata.IdTarima;
              oT.IdOrdenCarga = this.IdOrdenCarga;
              oT.IdOrdenDescarga = 0;
              oT.QR = this.QRdata.QR;
              oT.ClaveProducto = this.QRDetalledata[i].ClaveProducto;
              oT.Lote = this.QRDetalledata[i].Lote;
              oT.Sacos = sacosIngreso;
              oT.Producto = this.QRDetalledata[i].Producto;
              oT.PesoTotal = ((+oT.Sacos) * (+this.QRDetalledata[i].PesoxSaco)).toString();
              oT.FechaCaducidad = this.QRDetalledata[i].FechaCaducidad;
              console.log(oT);

              this.ordenTemporalService.preOrdenTemporal.push(oT);


              //   } else {
              //     console.log('NUEVO INSERT VALOR ORDEN TEMPORAL');
              //     this.oT.IdTarima = this.QRdata.IdTarima;
              //     this.oT.IdOrdenCarga = this.IdOrdenCarga;
              //     this.oT.IdOrdenDescarga = 0;
              //     this.oT.QR = this.QRdata.QR;
              //     this.oT.ClaveProducto = this.QRDetalledata[i].ClaveProducto;
              //     this.oT.Lote = this.QRDetalledata[i].Lote;
              //     this.oT.Sacos = SaldoMaximo;
              //     this.oT.Producto = this.QRDetalledata[i].Producto;
              //     this.oT.PesoTotal = ((+this.oT.Sacos) * (+this.QRDetalledata[i].PesoxSaco)).toString();
              //     this.oT.FechaCaducidad = this.QRDetalledata[i].FechaCaducidad;
              //     console.log(this.oT);
              //   }
              
              this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
              this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
              this.showButton = true;
            } else {
              console.log('ORDEN CARGA LLENA DEL PRODUCTO:' + this.QRDetalledata[i].ClaveProducto);
            }
          } else {
            //Alerta Tarima contiene producto/Lote que no concuerda con Orden Carga
            console.log('No Existe match');
          }
          console.log(this.ordenTemporalService.preOrdenTemporal);

        })

      }
    }
    else{
      console.log('Tarima Vacia');
    }
    });


  }

  onDeleteRowTablaV(posicion: any){
    console.log(posicion);
    console.log(this.ordenTemporalService.preOrdenTemporal);
    this.ordenTemporalService.preOrdenTemporal.splice(posicion, 1);
      console.log(this.ordenTemporalService.preOrdenTemporal);
      if(this.ordenTemporalService.preOrdenTemporal.length > 0){
        this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
                this.listData.sort = this.sort;
                this.listData.paginator = this.paginator;
                this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
                this.showButton = true;
      }else{
        this.resetQR();
      }

  }

  // ----- INICIO TABLA ORDEN TEMPORAL -------
  actualizarTablaOrdenTemporal(){
    this.ordenTemporalService.GetOrdenTemporalID(this.IdOrdenCarga).subscribe( dataOrdenTemporal => {
console.log(dataOrdenTemporal);
if(dataOrdenTemporal.length > 0){
console.log('Si hay Movimientos en esta orden de carga');
this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
}else{
  console.log('No hay Movimientos en esta orden de carga');
  this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
  // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
  // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
  // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
}
    })
  }
  // ----- FIN TABLA ORDEN TEMPORAL -------

  //Resetear tabla y valores para escanear nuevo codigo QR
  resetQR() {
    this.ordenTemporalService.preOrdenTemporal = [];
    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
    this.showButton = false;
  }

  //Metodo para aceptar datos de la tabla y hacer el insert a Tabla Orden Temporal
  Aceptar() {
    console.log(this.ordenTemporalService.preOrdenTemporal);
    for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporal.length - 1; i++) {
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Lote);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
      // console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
      let Sacos = this.ordenTemporalService.preOrdenTemporal[i].Sacos;
      let Lote = this.ordenTemporalService.preOrdenTemporal[i].Lote;
      let ClaveProducto = this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto;
      //Insert a Orden Temporal
      this.ordenTemporalService.addOrdenTemporal(this.ordenTemporalService.preOrdenTemporal[i]).subscribe(resAdd => {
        console.log(resAdd);
        //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
        this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
          console.log(dataOrdenCarga);
          console.log(Sacos);
          let NuevoSaldo = ((+dataOrdenCarga[0].Saldo)-(+Sacos)).toString();
          console.log(NuevoSaldo);
          // Actualizar Saldo de la tabla Detalle Orden Carga
          this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
            console.log(res);
            this.actualizarTablaOrdenTemporal();
          });
        });
      });
    }
    this.resetQR();
  }

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }


  //Cancelar operacion de insert Tabla Orden Temporal
  Cancelar() {
    this.resetQR();
  }

  //Actualizar valores de la tabla que sera insertada a Orden Temporal (Este metodo es disparado al actualizar el numero de sacos de x concepto)
  actualizarTabla() {
    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
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

  traspaso() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(TraspasoTarimaComponent, dialogConfig);
  }

  onDeleteOrdenTemporal(ot: OrdenTemporal){
    console.log(ot);
    let Lote = ot.Lote;
    let ClaveProducto = ot.ClaveProducto;
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
         //Obtener Detalle Orden de Carga, para ser actualizado posteriormente
         this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, Lote, ClaveProducto).subscribe(dataOrdenCarga => {
          console.log(dataOrdenCarga);
          let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) + (+ot.Sacos)).toString();
          console.log(NuevoSaldo)
          // Actualizar Saldo de la tabla Detalle Orden Carga
          this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[0].IdDetalleOrdenCarga, NuevoSaldo).subscribe(res => {
            console.log(res);
            this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(res =>{
              this.actualizarTablaOrdenTemporal();
              
              Swal.fire({
                title: 'Borrado',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            })
            });
          });
      }
    })
 

  }



  pdf() {

    // console.log(row);
    // this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EntradaProductoComponent, dialogConfig);
  }

  finalizar() {
    this.ordenCargaService.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, "Preparada").subscribe(data =>{
      Swal.fire({
        title: 'Preparado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      this.router.navigate(['/ordencargadetalle']);
    })
  }

}
