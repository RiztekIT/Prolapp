import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenCargaService } from '../../../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { Tarima } from '../../../../../Models/almacen/Tarima/tarima-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { OrdenCargaConceptoComponent } from './orden-carga-concepto/orden-carga-concepto.component';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['ClaveProducto', 'Lote', 'Sacos', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public router: Router, public tarimaService: TarimaService, public ordenCargaService: OrdenCargaService,
    public ordenTemporalService: OrdenTemporalService, private dialog: MatDialog,) { }

  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.showButton = false;
  }

  //Informacion que vendra del QR
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  //Id Orden Carga
  IdOrdenCarga: number;
  // //Orden Temporal
  // oT = new OrdenTemporal();

  //Variable para mostrar botones
 showButton: boolean;

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }

  simularQR() {

    //Obtener Datos Escaneados del QR
    this.QRdata.IdTarima = 2;
    this.QRdata.Sacos = '150';
    this.QRdata.PesoTotal = '3000';
    this.QRdata.QR = '123';

    this.ordenTemporalService.preOrdenTemporal = [];
    console.log(this.ordenTemporalService.preOrdenTemporal);

    console.log(this.QRdata);
    //Obtener los detalles de Tarima del QR previamente escaneado
    this.tarimaService.getDetalleTarimaID(this.QRdata.IdTarima).subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        
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
                  oT.Sacos = SaldoMaximo;
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


                // this.ordenTemporalService.addOrdenTemporal(this.oT).subscribe(resAdd => {
                //   console.log(resAdd);
                // })
                // //Restar el numero de costales ingresados - el SALDO MAXIMO
                // let saldoNuevo = +SaldoMaximo - +SaldoMaximo
                // //Actualizar Saldo de la tabla Detalle Orden Carga
                // this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[i].IdDetalleOrdenCarga, saldoNuevo.toString()).subscribe(res => {
                //   console.log(res);
                // });
              // })
            } else {
              console.log('ORDEN CARGA LLENA DEL PRODUCTO:' + this.QRDetalledata[i].ClaveProducto);
            }
          } else {
            //Alerta Tarima contiene producto/Lote que no concuerda con Orden Carga
            console.log('No Existe match');
          }
          console.log(this.ordenTemporalService.preOrdenTemporal);
          this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
          this.showButton = true;
    
        })

      }
   
    });


  }

  //Resetear tabla y valores para escanear nuevo codigo QR
  resetQR(){
    this.ordenTemporalService.preOrdenTemporal = [];
    this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    this.showButton = false;
  }

  //Metodo para aceptar datos de la tabla y hacer el insert a Tabla Orden Temporal
  Aceptar(){
    this.resetQR();
  }

  //Cancelar operacion de insert Tabla Orden Temporal
  Cancelar(){
    this.resetQR();
  }

  //Editar producto a ingresar en Orden Temporal
  onEdit(ordenTemporal: OrdenTemporal, id: number){
console.log(ordenTemporal);
console.log(id);
this.ordenTemporalService.ordenTemporalData= ordenTemporal;
this.ordenTemporalService.posicionOrdenTemporal = id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(OrdenCargaConceptoComponent, dialogConfig);
  }

  traspaso() {
    console.log(this.ordenTemporalService.preOrdenTemporal);
  }



  pdf() {

  }

  finalizar() {
  }

}
