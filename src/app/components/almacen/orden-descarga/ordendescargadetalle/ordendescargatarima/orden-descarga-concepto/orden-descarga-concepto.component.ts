import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { NgForm } from '@angular/forms';
import { TarimaService } from '../../../../../../services/almacen/tarima/tarima.service';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { OrdenDescargaService } from '../../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-orden-descarga-concepto',
  templateUrl: './orden-descarga-concepto.component.html',
  styleUrls: ['./orden-descarga-concepto.component.css']
})
export class OrdenDescargaConceptoComponent implements OnInit {

  constructor(public ordenTemporalService: OrdenTemporalService, public dialogbox: MatDialogRef<OrdenDescargaConceptoComponent>,
    public tarimaService: TarimaService, public OrdenDescargaService: OrdenDescargaService) { }

  ngOnInit() {
    console.log(this.ordenTemporalService.ordenTemporalDataOD);
    this.cantidadSacos = +this.ordenTemporalService.ordenTemporalDataOD.Sacos;
    console.log(this.cantidadSacos, 'sacos al inicio');


  }

  cantidadSacos: number;
  cantidadMaximaSacos: number;
  Comentarios: string;
  lote: string;
  claveProducto: string;
  pesototalTarima = '0';
  sacostotalesTarima = '0';

  onClose() {
    this.dialogbox.close();
    this.ordenTemporalService.filterOrdenTemporal('Register click');
  }

  //metodo que se ejecuta cuando cambia la cantidad de sacos
  onChangeCantidadSacos(cantidad: any) {
    console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Cantidad')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.cantidadSacos;
  }

  validarCantidad(cantidad: any) {
    let cantidadMaximaSacos = +this.ordenTemporalService.sacosETOD;
    console.log(cantidad + ' CANTIDAD');
    console.log(cantidadMaximaSacos);
    if (+cantidad >= cantidadMaximaSacos) {
      this.cantidadSacos = cantidadMaximaSacos;
    }
    if (+cantidad <= 0) {
      this.cantidadSacos = 0;
    }
    if (cantidad == null) {
      this.cantidadSacos = 0;
    }
  }

  onSubmit(form: NgForm) {

    //Actualizar concepto con el nuevo numero de sacos




    let ordenTempEt = new OrdenTemporal();

    ordenTempEt.IdOrdenTemporal = this.ordenTemporalService.ordenTemporalDataOD.IdOrdenTemporal;
    ordenTempEt.IdDetalleTarima = this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima;
    ordenTempEt.IdOrdenCarga = this.ordenTemporalService.ordenTemporalDataOD.IdOrdenCarga;
    ordenTempEt.IdOrdenDescarga = this.ordenTemporalService.ordenTemporalDataOD.IdOrdenDescarga;
    ordenTempEt.QR = this.ordenTemporalService.ordenTemporalDataOD.QR;
    ordenTempEt.ClaveProducto = this.ordenTemporalService.ordenTemporalDataOD.ClaveProducto;
    ordenTempEt.Lote = this.ordenTemporalService.ordenTemporalDataOD.Lote;
    ordenTempEt.Sacos = (this.cantidadSacos).toString();
    ordenTempEt.Producto = this.ordenTemporalService.ordenTemporalDataOD.Producto;
    ordenTempEt.PesoTotal = (+this.ordenTemporalService.pesoETOD * +this.cantidadSacos).toString();
    ordenTempEt.FechaCaducidad = this.ordenTemporalService.ordenTemporalDataOD.FechaCaducidad;
    ordenTempEt.Comentarios = this.Comentarios;

    console.log(ordenTempEt, 'Concepto editado a ser ingresado en OT');
    this.ordenTemporalService.updateOrdenTemporal(ordenTempEt).subscribe(res => {
      console.log(res);

      this.ordenTemporalService.GetOrdenTemporalIdTarima(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima).subscribe(dataOTT =>{
        console.log(dataOTT,'OT por IDdeTarima');

        for(let i= 0; i <= dataOTT.length -1; i++){
          this.pesototalTarima =( +dataOTT[i].PesoTotal + +this.pesototalTarima).toString()
          this.sacostotalesTarima =( +dataOTT[i].Sacos + +this.sacostotalesTarima).toString()
        }
        console.log(this.pesototalTarima,'peso de tarima','funciona');
        console.log(this.sacostotalesTarima,'sacos de tarima','funciona');
this.tarimaService.updateTarimaSacosPeso(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima, this.sacostotalesTarima, this.pesototalTarima).subscribe(dataUptsacos => {
console.log(dataUptsacos);
      
      // this.tarimaService.getTarimaID(this.ordenTemporalService.ordenTemporalDataOD.IdTarima).subscribe(resDataTarima => {
      //   console.log(resDataTarima, 'lo que trae tarima');


      this.OrdenDescargaService.getDetalleOrdenDescargaIdLoteClave(this.ordenTemporalService.ordenTemporalDataOD.IdOrdenDescarga, this.ordenTemporalService.ordenTemporalDataOD.Lote, this.ordenTemporalService.ordenTemporalDataOD.ClaveProducto).subscribe(dataOD => {
        console.log(dataOD[0].Saldo, 'saldo en OD');
        console.log(this.cantidadSacos, 'sacos ingresados');
        let reinicioSaldo = ((+dataOD[0].Saldo) + +this.ordenTemporalService.ordenTemporalDataOD.Sacos).toString();
        console.log(reinicioSaldo,'reinicioSaldo');
        let NuevoSaldo = ((+reinicioSaldo) - (+this.cantidadSacos)).toString();
        if(+NuevoSaldo < 0 ){
          Swal.fire({
            title: 'No se puede ingresar mas sacos que el # de saldo',
            icon: 'warning',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          return;
        }
        console.log(NuevoSaldo);
        this.OrdenDescargaService.updateDetalleOrdenDescargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
          console.log(res);
this.OrdenDescargaService.filter('Register click');
          this.ordenTemporalService.filterOrdenTemporal('Register click');
        })
      })

        

          
        });
       });
      // })
     });

    this.dialogbox.close();

  }



}
