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
//IMPORTS QR SCANNER
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {
  
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
    }
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
  ngVersion = VERSION.full;

  @ViewChild('scanner', null)
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;
  currentDevice: MediaDeviceInfo = null;

  // SCANNER QR //

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }

  leerQR(){
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
  });

  this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
  });

  this.scanner.permissionResponse.subscribe((answer: boolean) => {
    this.hasPermission = answer;
  });
}

  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;
}

// onDeviceSelectChange(selectedValue: string) {
//     console.log('Selection changed: ', selectedValue);
//     this.selectedDevice = this.scanner.getDeviceById(selectedValue);
// }

  simularQR() {

    //Obtener Datos Escaneados del QR
    this.QRdata.IdTarima = 33;
    this.QRdata.Sacos = '150';
    this.QRdata.PesoTotal = '3000';
    this.QRdata.QR = '123';

    this.ordenTemporalService.preOrdenTemporal = [];
    console.log(this.ordenTemporalService.preOrdenTemporal);

    console.log(this.QRdata);
    //Obtener los detalles de Tarima del QR previamente escaneado
    this.tarimaService.getDetalleTarimaID(this.QRdata.IdTarima).subscribe(data => {
      console.log(data);
      if(data.length > 0){
        
      
      for (let i = 0; i <= data.length - 1; i++) {

        //Variable para establece el maximo de sacos en base a la cantidad de sacos en la tarima
        let sacosMaximos = data[i].Sacos;
        this.QRDetalledata[i] = data[i];
        console.log(this.QRDetalledata);

        console.log(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto);
        //Verificar match de detalle tarima con detalle Orden Carga
        this.ordenCargaService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto).subscribe(dataOrdenCarga => {
          console.log(dataOrdenCarga);
          if (dataOrdenCarga.length > 0) {
            console.log('Si hay Datos Registrados');
            let SaldoMaximo = dataOrdenCarga[0].Saldo;

            //Verificar que se puedan ingresar mas productos a ordenTemporal en base al saldo de DetalleOrdenCarga
            if (+SaldoMaximo > 0) {
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
              oT.Sacos = sacosMaximos;
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
