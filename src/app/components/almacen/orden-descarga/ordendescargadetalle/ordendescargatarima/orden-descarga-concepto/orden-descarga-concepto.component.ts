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
    // this.cantidadSacos = +this.ordenTemporalService.ordenTemporalDataOD.Sacos;
    this.cantidadSacos = +this.ordenTemporalService.sacosETOD;
    this.sacosInicio = +this.ordenTemporalService.sacosETOD;
    // this.cantidadKg = +this.ordenTemporalService.ordenTemporalDataOD.PesoTotal;
    this.cantidadKg = +this.ordenTemporalService.kgETOD;
    this.kgInicio = +this.ordenTemporalService.kgETOD;

    this.pesoxSaco = +this.ordenTemporalService.pesoETOD;
    console.log(this.cantidadSacos, 'sacos al inicio');
    console.log(this.cantidadKg, 'sacos al inicio');
  }

  pesoxSaco: number;
  cantidadSacos: number;
  cantidadKg: number;
  cantidadMaximaSacos: number;
  cantidadMaximaKg: number;


  sacosInicio:number
  kgInicio:number;

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
    elemHTML.value = this.cantidadKg;
  }

  validarCantidad(cantidad: any) {
    let cantidadMaximaKg = +this.ordenTemporalService.kgETOD;
    console.log(cantidad + ' CANTIDAD');
    console.log(cantidadMaximaKg);
    if (+cantidad >= cantidadMaximaKg) {
      this.cantidadKg = cantidadMaximaKg;
    }
    if (+cantidad <= 0) {
      this.cantidadKg = 0;
    }
    if (cantidad == null) {
      this.cantidadKg = 0;
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
    ordenTempEt.NumeroFactura = this.ordenTemporalService.ordenTemporalDataOD.NumeroFactura;
    ordenTempEt.NumeroEntrada = this.ordenTemporalService.ordenTemporalDataOD.NumeroEntrada;
    ordenTempEt.ClaveProducto = this.ordenTemporalService.ordenTemporalDataOD.ClaveProducto;
    ordenTempEt.Lote = this.ordenTemporalService.ordenTemporalDataOD.Lote;
    ordenTempEt.Sacos = ((this.cantidadKg)/(this.pesoxSaco)).toString();
    ordenTempEt.Producto = this.ordenTemporalService.ordenTemporalDataOD.Producto;
    ordenTempEt.PesoTotal = (this.cantidadKg).toString();
    ordenTempEt.FechaCaducidad = this.ordenTemporalService.ordenTemporalDataOD.FechaCaducidad;
    ordenTempEt.FechaMFG = this.ordenTemporalService.ordenTemporalDataOD.FechaMFG;
    ordenTempEt.Comentarios = '';
    ordenTempEt.CampoExtra1 = '';
    ordenTempEt.CampoExtra2 = '';
    ordenTempEt.CampoExtra3 = '';

    console.log(ordenTempEt, 'Concepto editado a ser ingresado en OT');


//^ Actualizar Orden Temporal
    this.ordenTemporalService.updateOrdenTemporal(ordenTempEt).subscribe(res => {
      console.log(res);

      // this.ordenTemporalService.GetOrdenTemporalIdTarima(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima).subscribe(dataOTT =>{
        // console.log(dataOTT,'OT por IDdeTarima');

        // for(let i= 0; i <= dataOTT.length -1; i++){
        //   this.pesototalTarima =( +dataOTT[i].PesoTotal + +this.pesototalTarima).toString()
        //   this.sacostotalesTarima =( +dataOTT[i].Sacos + +this.sacostotalesTarima).toString()
        // }
        // console.log(this.pesototalTarima,'peso de tarima','funciona');
        // console.log(this.sacostotalesTarima,'sacos de tarima','funciona');
// this.tarimaService.updateTarimaSacosPeso(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima, this.sacostotalesTarima, this.pesototalTarima).subscribe(dataUptsacos => {
// console.log(dataUptsacos);

console.log('%c%s', 'color: #d90000', this.ordenTemporalService.ordenTemporalDataOD.Lote);
console.log('%c%s', 'color: #917399', this.cantidadKg);
console.log('%c%s', 'color: #0088cc', ((this.cantidadKg)/(this.pesoxSaco)).toString());
console.log('%c%s', 'color: #00bf00', this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima);
//^ Actualizar Detalle Tarima
this.tarimaService.updateDetalleTarimaIdSacos(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima, ((this.cantidadKg)/(this.pesoxSaco)).toString(), this.cantidadKg.toString(), this.ordenTemporalService.ordenTemporalDataOD.Lote ).subscribe(dataDetalleTarima =>{

console.log(dataDetalleTarima);

//^ Actualizar Saldo Detalle Orden Descarga
      this.OrdenDescargaService.getDetalleOrdenDescargaIdClave(this.ordenTemporalService.ordenTemporalDataOD.IdOrdenDescarga, this.ordenTemporalService.ordenTemporalDataOD.ClaveProducto).subscribe(dataOD => {
        console.log(dataOD[0].Saldo, 'saldo en OD');
        // console.log(this.cantidadSacos, 'sacos ingresados');
        let reinicioSaldo = ((+dataOD[0].Saldo) + +this.kgInicio).toString();
        console.log(reinicioSaldo,'reinicioSaldo');
        let NuevoSaldo = ((+reinicioSaldo) - (+this.cantidadKg)).toString();
        // if(+NuevoSaldo < 0 ){
        //   Swal.fire({
        //     title: 'No se puede ingresar mas sacos que el # de saldo',
        //     icon: 'warning',
        //     timer: 1000,
        //     showCancelButton: false,
        //     showConfirmButton: false
        //   });
        //   return;
        // }
        console.log(NuevoSaldo);
        //^ Actualizar Detalle Orden Descarga
        this.OrdenDescargaService.updateDetalleOrdenDescargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res => {
          console.log(res);
          Swal.fire({
                title: 'Producto Editado',
                icon: 'success',
              });
this.OrdenDescargaService.filter('Register click');
          this.ordenTemporalService.filterOrdenTemporal('Register click');
        })
//       })

        

          
        // });
       });
      });
     });

    this.dialogbox.close();

  }



}
