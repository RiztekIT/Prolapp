import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { NgForm } from '@angular/forms';
import { TarimaService } from '../../../../../../services/almacen/tarima/tarima.service';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { OrdenDescargaService } from '../../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';
import { DetalleTarima } from '../../../../../../Models/almacen/Tarima/detalleTarima-model';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';


@Component({
  selector: 'app-orden-descarga-concepto',
  templateUrl: './orden-descarga-concepto.component.html',
  styleUrls: ['./orden-descarga-concepto.component.css']
})
export class OrdenDescargaConceptoComponent implements OnInit {

  constructor(public ordenTemporalService: OrdenTemporalService, public dialogbox: MatDialogRef<OrdenDescargaConceptoComponent>,
    public tarimaService: TarimaService, public OrdenDescargaService: OrdenDescargaService, @Inject(MAT_DIALOG_DATA) public dataOrdenDescarga: any,
    public traspasoSVC:TraspasoMercanciaService,
    private eventosService:EventosService,) { }

  ngOnInit() {
    console.log(this.ordenTemporalService.ordenTemporalDataOD);
    // this.cantidadSacos = +this.ordenTemporalService.ordenTemporalDataOD.Sacos;
    this.cantidadSacos = +this.ordenTemporalService.sacosETOD;
    this.sacosInicio = +this.ordenTemporalService.sacosETOD;
    // this.cantidadKg = +this.ordenTemporalService.ordenTemporalDataOD.PesoTotal;
    this.cantidadKg = +this.ordenTemporalService.kgETOD;
    this.kgInicio = +this.ordenTemporalService.kgETOD;

    this.pesoxSaco = +this.ordenTemporalService.pesoETOD;

    this.estatusOD = this.dataOrdenDescarga.estatus;
    console.log('%c%s', 'color: #00258c', this.estatusOD);

    //^ Obtener info del detalleTarima
    this.obtenerDetalleTarimaInfo(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima)
    console.log(this.cantidadSacos, 'sacos al inicio');
    console.log(this.cantidadKg, 'sacos al inicio');
  }

//^ Objeto Detalle Tarima a Editar
detalleT: DetalleTarima;

//^Estatus de la orden descarga
estatusOD

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

  obtenerDetalleTarimaInfo(id){
    console.log(id);
    this.tarimaService.getDetalleTarimaIDdetalle(id).subscribe(resDetalle=>{
      console.log(resDetalle[0]);
      this.detalleT = resDetalle[0];
    })
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
    ordenTempEt.Comentarios = this.ordenTemporalService.ordenTemporalDataOD.Comentarios;
    ordenTempEt.CampoExtra1 = this.ordenTemporalService.ordenTemporalDataOD.CampoExtra1;
    ordenTempEt.CampoExtra2 = this.ordenTemporalService.ordenTemporalDataOD.CampoExtra2;
    ordenTempEt.CampoExtra3 = this.ordenTemporalService.ordenTemporalDataOD.CampoExtra3;

    console.log(ordenTempEt, 'Concepto editado a ser ingresado en OT');


//^ Actualizar Orden Temporal
    this.ordenTemporalService.updateOrdenTemporal(ordenTempEt).subscribe(res => {
      console.log(res);
      
      this.eventosService.movimientos('Editar Producto Ingresado ODTarima')

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
        // this.tarimaService.updateDetalleTarimaIdSacos(this.ordenTemporalService.ordenTemporalDataOD.IdDetalleTarima, ((this.cantidadKg)/(this.pesoxSaco)).toString(), this.cantidadKg.toString(), this.ordenTemporalService.ordenTemporalDataOD.Lote ).subscribe(dataDetalleTarima =>{
         //^ Asignar Valores a DetalleTarima
          this.detalleT.SacosTotales = ((this.cantidadKg)/(this.pesoxSaco)).toString();
          this.detalleT.Lote = this.ordenTemporalService.ordenTemporalDataOD.Lote
          this.detalleT.PesoTotal = this.cantidadKg.toString()
          this.detalleT.PO = this.ordenTemporalService.ordenTemporalDataOD.CampoExtra1;
          this.detalleT.FechaMFG = this.ordenTemporalService.ordenTemporalDataOD.FechaMFG;
          this.detalleT.FechaCaducidad = this.ordenTemporalService.ordenTemporalDataOD.FechaCaducidad;
          this.detalleT.Shipper = this.ordenTemporalService.ordenTemporalDataOD.NumeroFactura;
          this.detalleT.Pedimento = this.ordenTemporalService.ordenTemporalDataOD.NumeroEntrada;
          //^ Actualizar Detalle Tarima
        this.tarimaService.updateDetalleTarima(this.detalleT).subscribe(dataDetalleTarima =>{
          console.log(dataDetalleTarima);
          //^ Metodo para actualizar CBK (Numero de Entrada) en el Detalle OrdenCarga
          this.actualizarCBKDetalleCarga(this.ordenTemporalService.ordenTemporalDataOD.ClaveProducto, this.ordenTemporalService.ordenTemporalDataOD.Lote, this.ordenTemporalService.ordenTemporalDataOD.CampoExtra1, 
            this.ordenTemporalService.ordenTemporalDataOD.NumeroEntrada)
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

  //^ Este metodo nos servira para actualizar el CBK en dado caso que ya se haya generado un Traspaso.
  //^ Hay veces que el CBK no se conoce hasta el momento en el que el producto esta siendo cargado. Es por esto que se debe de dar la opcion de actualziarlo.
  //^ En dado caso que la cantidad de sacos o algun otro campo haya sido ingresado mal, y ya se haya generado el traspaso. Se tendra que eliminar el Traspaso y generar uno nuevo con la informacion actualizada 
  actualizarCBKDetalleCarga(clave, lote, po, cbk) {
    //^ Primero validaremos si ya se genero un traspaso
    let query = 'select * from DetalleOrdenCarga where ClaveProducto = ' + "'" + clave + "'" + ' and Lote = ' + "'" + lote + "'" + ' and PO = ' + "'" + po + "'" + ';'
    let consulta = {
      'consulta': query
    };
    this.traspasoSVC.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta);
      //^ Si se genero, obtendremos el Detalle Orden Carga
      if (detallesConsulta.length > 0) {
        console.log('Ya se genero el Traspaso');
        //^Actualizamos el CBK/Pedimento(aqui se guarda el CBK) detalle Orden Carga
        let IdDetalleOrdenCarga = detallesConsulta[0].IdDetalleOrdenCarga;
        let query = 'update DetalleOrdenCarga set Pedimento = ' + "'" + cbk + "'" + ' where IdDetalleOrdenCarga ='+IdDetalleOrdenCarga
        let consulta = {
          'consulta': query
        };
        this.traspasoSVC.getQuery(consulta).subscribe((updatecbk: any) => {
          console.log(updatecbk);
        })
      }
      //^ En dado caso que no exista, significa que no se ha generado ningun traspaso
      else {
        console.log('NO HAY Traspaso');
      }
    })

  }



}
