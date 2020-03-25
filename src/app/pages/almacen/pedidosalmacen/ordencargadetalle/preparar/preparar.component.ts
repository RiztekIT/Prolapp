import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { OrdenCargaService } from '../../../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporalService } from '../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { Tarima } from '../../../../../Models/almacen/Tarima/tarima-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {

  constructor(public router: Router, public tarimaService: TarimaService, public ordenCargaService: OrdenCargaService,
    public ordenTemporalService: OrdenTemporalService) { }

  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
  }

  //Informacion que vendra del QR
  QRdata = new Tarima();
  QRDetalledata = new Array<DetalleTarima>();
  //Id Orden Carga
  IdOrdenCarga: number;
  //Orden Temporal
  oT = new OrdenTemporal();

  regresar() {
    this.router.navigate(['/ordencargadetalle']);
  }

  simularQR() {

    //Obtener Datos Escaneados del QR
    this.QRdata.IdTarima = 2;
    this.QRdata.Sacos = '150';
    this.QRdata.PesoTotal = '3000';
    this.QRdata.QR = '123';

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

              //Verifiacar si ya hay datos guardados en orden Temporal.
              this.ordenTemporalService.getDetalleOrdenCargaIdLoteClave(this.IdOrdenCarga, this.QRDetalledata[i].Lote, this.QRDetalledata[i].ClaveProducto).subscribe(dataOrdenTemporal => {
                console.log(dataOrdenTemporal);
                if (dataOrdenTemporal.length > 0) {
                  console.log('Ya hay VALORES EN LA ORDEN TEMPORAL');
                  this.oT.IdTarima = this.QRdata.IdTarima;
                  this.oT.IdOrdenCarga = this.IdOrdenCarga;
                  this.oT.IdOrdenDescarga = 0;
                  this.oT.QR = this.QRdata.QR;
                  this.oT.ClaveProducto = this.QRDetalledata[i].ClaveProducto;
                  this.oT.Lote = this.QRDetalledata[i].Lote;
                  this.oT.Sacos = SaldoMaximo;
                  this.oT.Producto = this.QRDetalledata[i].Producto;
                  this.oT.PesoTotal = ((+this.oT.Sacos) * (+this.QRDetalledata[i].PesoxSaco)).toString();
                  this.oT.FechaCaducidad = this.QRDetalledata[i].FechaCaducidad;
                  console.log(this.oT);

                } else {
                  console.log('NUEVO INSERT VALOR ORDEN TEMPORAL');
                  this.oT.IdTarima = this.QRdata.IdTarima;
                  this.oT.IdOrdenCarga = this.IdOrdenCarga;
                  this.oT.IdOrdenDescarga = 0;
                  this.oT.QR = this.QRdata.QR;
                  this.oT.ClaveProducto = this.QRDetalledata[i].ClaveProducto;
                  this.oT.Lote = this.QRDetalledata[i].Lote;
                  this.oT.Sacos = SaldoMaximo;
                  this.oT.Producto = this.QRDetalledata[i].Producto;
                  this.oT.PesoTotal = ((+this.oT.Sacos) * (+this.QRDetalledata[i].PesoxSaco)).toString();
                  this.oT.FechaCaducidad = this.QRDetalledata[i].FechaCaducidad;
                  console.log(this.oT);
                }

                
                this.ordenTemporalService.addOrdenTemporal(this.oT).subscribe(resAdd => {
                  console.log(resAdd);
                })
                //Restar el numero de costales ingresados - el SALDO MAXIMO
                let saldoNuevo = +SaldoMaximo - +SaldoMaximo
                //Actualizar Saldo de la tabla Detalle Orden Carga
                this.ordenCargaService.updateDetalleOrdenCargaSaldo(dataOrdenCarga[i].IdDetalleOrdenCarga, saldoNuevo.toString()).subscribe(res => {
                  console.log(res);
                });
              })
            } else {
              console.log('ORDEN CARGA LLENA DEL PRODUCTO:' + this.QRDetalledata[i].ClaveProducto);
            }
          } else {
            //Alerta Tarima contiene producto/Lote que no concuerda con Orden Carga
            console.log('No Existe match');
          }
        })

      }

    });


  }

  traspaso() {

  }

  pdf() {

  }

  finalizar() {
  }

}
