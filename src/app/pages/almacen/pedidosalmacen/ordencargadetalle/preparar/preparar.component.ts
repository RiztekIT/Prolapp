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



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {
  enableScan = false;
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
    this.MostrarConceptos = false;
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

  //Tabla conceptos Faltantes
  listDataConceptosFaltantes: MatTableDataSource<any>;
  displayedColumnsConceptosFaltantes: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Saldo'];
  @ViewChild(MatSort, null) sortConceptosFaltantes: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorConceptosFaltantes: MatPaginator;

  //Informacion que vendra del QR
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  //Id Orden Carga
  IdOrdenCarga: number;
  // //Orden Temporal
  // oT = new OrdenTemporal();

  //Variable para mostrar botones
  showButton: boolean;

  //Variable Insercion VALIDA
  insertarOrdenTemporal: boolean;


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
      this.simularQR(this.qrleido);

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



  simularQR(qrleido: string) {
    this.QRdata = new Tarima();
    //Obtener Datos Escaneados del QR
    // this.QRdata.IdTarima = 0;
    // this.QRdata.Sacos = '150';
    // this.QRdata.PesoTotal = '3000';
    this.QRdata.QR = 'QR19';
    console.log(this.QRdata);

    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporal = [];
    console.log(this.ordenTemporalService.preOrdenTemporal);


    //Verificar que exista Codigo QR previamente escaneado y en dado caso, traerse id de tarima
    this.tarimaService.getTarimaQR(this.QRdata.QR).subscribe(data => {
      let idTarima = data[0].IdTarima;
      console.log(data);
      if (data.length > 0) {

        //Verificar que esta tarima no haaya sido escaneada previamente en esta orden de carga
        this.ordenTemporalService.GetOrdenTemporalIdTarima(idTarima).subscribe(resOT => {
          console.log(resOT);
          if(resOT.length > 0){
console.log('Esta tarima ya fue ESCANEADA');
Swal.fire({
  icon: 'error',
  title: 'Tarima ya escaneada',
  text:'Esta tarima ya ha sido escaneda en esta orden de carga'
})
}else{
  console.log('tarima no ESCANEADA');
        console.log('Si existe el QR');
        this.QRdata.IdTarima = data[0].IdTarima;
        console.log(this.QRdata.IdTarima);


        //Obtener los detalles de Tarima del QR previamente escaneado
        this.tarimaService.getDetalleTarimaID(this.QRdata.IdTarima).subscribe(data => {
          console.log(data);
          //verificar si la tarima tiene detalles tarima
          if (data.length > 0) {


            // recorrer tantos conceptos tenga la tarima escaneada
            for (let i = 0; i <= data.length - 1; i++) {

              //Variable para establece el maximo de sacos en base a la cantidad de sacos en la tarima
              let sacosMaximos = +data[i].Sacos;
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
                  let SaldoMaximo = +dataOrdenCarga[0].Saldo;
                  let sacosIngreso;

                  console.log(SaldoMaximo);
                  console.log(sacosMaximos);
                  if (SaldoMaximo < sacosMaximos) {
                    sacosIngreso = SaldoMaximo;
                  } else {
                    sacosIngreso = sacosMaximos
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
          else {
            console.log('Tarima Vacia');
            Swal.fire({
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 1200,
              title: 'Tarima Vacia'
            })
          }
        });
      }
      });
      } 
      else {
        console.log('NO EXISTE QR');
        Swal.fire({
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1200,
          title: 'QR NO VALIDO'
        })
      }
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
      this.showButton = true;
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

  // ----- INICIO TABLA ORDEN TEMPORAL -------
  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalID(this.IdOrdenCarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      if (dataOrdenTemporal.length > 0) {
        console.log('Si hay Movimientos en esta orden de carga');
        this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      } else {
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
    // console.log(this.ordenTemporalService.preOrdenTemporal);
    this.AprobarInsercionTablaTemporal();
    // 
  }

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }

  //Metodo para verificar si todos los productos de la tabla fueron aprobados para la insercion a Tabla Temporal.
  //En Dado caso que no, no dejara hacer la insercion y pedira hacer el traspaso tarima.
  //Solo se podra dar Click en Aceptar cuando todos los productos sean correctos para la insercion.
  AprobarInsercionTablaTemporal() {
    console.log(this.ordenTemporalService.preOrdenTemporal);
    let idTarima = this.ordenTemporalService.preOrdenTemporal[0].IdTarima;
    console.log(idTarima);
    this.tarimaService.getDetalleTarimaID(idTarima).subscribe(dataTarima => {
      console.log(dataTarima);
      //Variable para saber el numero de veces que debe coincidir los conceptos a ingresar con los de la tarima
      let conceptoCoincidir = dataTarima.length;
      for (let l = 0; l <= dataTarima.length - 1; l++) {
        for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporal.length - 1; i++) {
          if ((dataTarima[l].ClaveProducto == this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto) && (dataTarima[l].Sacos == this.ordenTemporalService.preOrdenTemporal[i].Sacos)) {
          console.log('ESTE COINCIDE');
          console.log(dataTarima[l].ClaveProducto);
          console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
          console.log(dataTarima[l].Sacos);
          console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
          conceptoCoincidir = conceptoCoincidir - 1;
          break;
          }else{
            console.log('ESTE NO COINCIDE');
          console.log(dataTarima[l].ClaveProducto);
          console.log(this.ordenTemporalService.preOrdenTemporal[i].ClaveProducto);
          console.log(dataTarima[l].Sacos);
          console.log(this.ordenTemporalService.preOrdenTemporal[i].Sacos);
          
          }
        }
      }
      if( conceptoCoincidir == 0){
console.log('Tarima COMPLETA');
Swal.fire({
  title: 'Conceptos Validos',
  icon: 'success',
  text: ''
});

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
        let NuevoSaldo = ((+dataOrdenCarga[0].Saldo) - (+Sacos)).toString();
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


      }else{
console.log('FALTAN CONCEPTOS EN TARIMA');
Swal.fire({
  title: 'Conceptos no Validos',
  icon: 'error',
  text: 'Los Conceptos ingresados no coinciden con los de la Tarima. Favor de solo ingresar los conceptos y sacos acorde a la tarima.'
});
      }
    })

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

  onDeleteOrdenTemporal(ot: OrdenTemporal) {
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
            this.ordenTemporalService.deleteOrdenTemporal(ot.IdOrdenTemporal).subscribe(res => {
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

  MostrarConceptos: boolean;
  conceptosFaltantesList: DetalleOrdenCarga[];
  //pintar tabla con los conceptos faltantes
  conceptosFaltantes() {
    this.ordenCargaService.getOrdenCargaIDList(this.IdOrdenCarga).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        this.conceptosFaltantesList = new Array<DetalleOrdenCarga>();
        for (let i = 0; i <= data.length - 1; i++) {
          if (+data[i].Saldo > 0) {
            this.conceptosFaltantesList.push(data[i]);
          }
        }
      }
      console.log(this.conceptosFaltantesList);
      this.MostrarConceptos = true;
      this.listDataConceptosFaltantes = new MatTableDataSource(this.conceptosFaltantesList);
      this.listDataConceptosFaltantes.sort = this.sortConceptosFaltantes;
      this.listDataConceptosFaltantes.paginator = this.paginatorConceptosFaltantes;
      this.listDataConceptosFaltantes.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    });

  }

  //esconder tabla con conceptos faltantes
  ocultarConceptosFaltantes() {
    this.MostrarConceptos = false;
  }


  pdf() {

    // console.log(row);
    // this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(EntradaProductoComponent, dialogConfig);
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
        this.ordenCargaService.updatedetalleOrdenCargaEstatus(this.IdOrdenCarga, "Preparada").subscribe(data => {
          Swal.fire({
            title: 'Preparado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          this.router.navigate(['/ordencargadetalle']);
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

}
