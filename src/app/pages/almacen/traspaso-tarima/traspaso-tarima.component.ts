import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import { TarimaService } from '../../../services/almacen/tarima/tarima.service';
import { Observable, } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';
import { TraspasoTarima } from '../../../Models/almacen/Tarima/traspasoTarima-model';
import { OrdenTemporalService } from '../../../services/almacen/orden-temporal/orden-temporal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-traspaso-tarima',
  templateUrl: './traspaso-tarima.component.html',
  styleUrls: ['./traspaso-tarima.component.css']
})
export class TraspasoTarimaComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<TraspasoTarimaComponent>, public tarimaService: TarimaService, public ordenTemporalService: OrdenTemporalService) { }

  ngOnInit() {
    this.nuevaTarima = false;
    this.tarimaDValida = false;
    console.log(this.tarimaService.trapasoOrdenCarga);
    console.log(this.ordenTemporalService.traspasoOrdenTemporal);
    if(this.tarimaService.trapasoOrdenCarga == true){
this.traspasoTarimaOrdenCarga(this.tarimaService.idTarimaOrdenCarga, this.tarimaService.detalleTarimaOrdenCarga, this.tarimaService.QrOrigen);
    }
    if(this.ordenTemporalService.traspasoOrdenTemporal == true){
      console.log(this.tarimaService.idTarimaOrdenCarga);
      console.log(this.ordenTemporalService.ordenTemporalt);
      console.log(this.tarimaService.QrOrigen);
this.traspasoTarimaOrdenCarga(this.tarimaService.idTarimaOrdenCarga, this.ordenTemporalService.ordenTemporalt, this.tarimaService.QrOrigen);
    }
  }

  tarimaIdOrigen: number;
  tarimaIdDestino: number;

  tarimaQrOrigen: string;
  tarimaQrDestino: string;

  sacosTraspaso: number;
  cantidadMaximaSacos: number;
  nuevaTarima: boolean;
  idDetalleTarimaOrigen: number;

  //variable para indicar que la tarima Destino esta correcta
  tarimaDValida: boolean;

  //Dropdown Producto

  myControlDetalleTarima = new FormControl();
  filteredOptionsDetalleTarima: Observable<any[]>;
  listDetalleTarima: DetalleTarima[] = [];
  DetalleTarimaSelect: string;
  producto: string



  //objecto para guardar detalle tarima seleccionada
  detalleTarimaSelected: DetalleTarima;
  detalleTarimaSelectedDestino: DetalleTarima;
  tarimaDestino: Tarima;
  tt: TraspasoTarima;

  //Dropdown Producto

  onClose() {
    // console.log(this.tarimaService.trapasoOrdenCarga);
    
this.dialogbox.close();

  }

  onSubmit(form: NgForm) {
    //Verificar si es una nueva tarima 
    //Verficar si se estan traspasando todos los sacos de ese producto TRUE( nomas cambiar el idTarima ) FALSE ( generar nuevo Dt y actualizar los sacos de Dt origen )
    //Hacer Update a Tarima
    console.log(this.sacosTraspaso)
    if (this.nuevaTarima == true) {
      let tarimaInsert = new Tarima();
      let sacosTraspaso = this.sacosTraspaso;
      tarimaInsert.IdTarima = 0;
      tarimaInsert.Sacos = sacosTraspaso.toString();
      tarimaInsert.PesoTotal = (sacosTraspaso * 20).toString();

      //Generar CODIGO QR
      tarimaInsert.QR = 'QR6';




      console.log(tarimaInsert);
      console.log(this.detalleTarimaSelected);
      this.tarimaService.addTarima(tarimaInsert).subscribe(rest => {
        console.log(rest);
        //Obtener id new Tarima
        this.tarimaService.getUltimaTarima().subscribe(dataUT => {
          console.log(dataUT);

          this.detalleTarimaSelected.IdTarima = dataUT[0].IdTarima;
          this.detalleTarimaSelected.Sacos = sacosTraspaso.toString();
          console.log(this.detalleTarimaSelected);
          //Agregar detalle Tarima
          this.tarimaService.addDetalleTarima(this.detalleTarimaSelected).subscribe(resDT => {
            console.log(resDT);
            this.tt = new TraspasoTarima();
            this.tt.IdOrigenTarima = this.tarimaIdOrigen;
            this.tt.IdDestinoTarima = this.detalleTarimaSelected.IdTarima;
            this.tt.ClaveProducto = this.detalleTarimaSelected.ClaveProducto;
            this.tt.Producto = this.detalleTarimaSelected.Producto;
            this.tt.Lote = this.detalleTarimaSelected.Lote;
            this.tt.Sacos = sacosTraspaso.toString();
            this.tt.FechaTraspaso = new Date();
            this.tt.IdUsuario = 0;
            this.tt.Usuario = 'TYSOK';
            console.log(this.tt);
            this.tarimaService.addTraspasoTarima(this.tt).subscribe(resTrasTarima => {
              console.log(resTrasTarima);
              this.actualizarTarimaOrigen();
              // this.onClose();
            })
          });
        });
      });
    } else {
      this.tt = new TraspasoTarima();
            this.tt.IdOrigenTarima = this.tarimaIdOrigen;
            this.tt.IdDestinoTarima = this.tarimaIdDestino;
            this.tt.ClaveProducto = this.detalleTarimaSelected.ClaveProducto;
            this.tt.Producto = this.detalleTarimaSelected.Producto;
            this.tt.Lote = this.detalleTarimaSelected.Lote;
            this.tt.Sacos = this.sacosTraspaso.toString();
            this.tt.FechaTraspaso = new Date();
            this.tt.IdUsuario = 0;
            this.tt.Usuario = 'TYSOK';
            console.log(this.tt);
            this.tarimaService.addTraspasoTarima(this.tt).subscribe(resTrasTarima => {
              console.log(resTrasTarima);
              this.actualizarTarimaOrigen();
              this.actualizarTarimaDestino();
              // this.onClose();
            })
    }

    Swal.fire({
      title: 'Concepto Traspasado',
      icon: 'success',
      timer: 1000,
      showCancelButton: false,
      showConfirmButton: false
    });

    this.onClose();


    
  }

  actualizarTarimaOrigen() {

    let idTarima = this.tarimaIdOrigen;
    let idDetalleTarima = this.detalleTarimaSelected.IdDetalleTarima;
    let sacosTraspaso = this.sacosTraspaso;
    let SacosIniciot;
    let SacosIniciodt;
    let SacosFinalt;
    let SacosFinaldt;
    let PesoTotal;
    console.log(idTarima);
    console.log(sacosTraspaso);
    this.tarimaService.getTarimaID(idTarima).subscribe(data => {
      console.log(data);
      console.log(sacosTraspaso);
      SacosIniciot = data[0].Sacos;
      console.log(SacosIniciot);
      SacosFinalt = ((+SacosIniciot) - (+sacosTraspaso));
      console.log(SacosFinalt);
      PesoTotal = ((+SacosFinalt) * (20));
      console.log(PesoTotal);
      console.log(idTarima);
      console.log('////////////////');
      console.log(SacosFinalt);
      console.log(PesoTotal);
      console.log(idTarima);
      console.log('////////////////');
      //Actualizamos Tarima Origen
      this.tarimaService.updateTarimaSacosPeso(idTarima, SacosFinalt.toString(), PesoTotal.toString()).subscribe(res => {
        console.log(res);
        console.log(idDetalleTarima);
        //Obtener Detalle Tarima ID
        this.tarimaService.getDetalleTarimaIDdetalle(idDetalleTarima).subscribe(datadt => {
          console.log(datadt);
          SacosIniciodt = datadt[0].Sacos;
          SacosFinaldt = (+SacosIniciodt - this.sacosTraspaso)
          console.log(SacosIniciodt);
          console.log(SacosFinaldt);
          if (SacosFinaldt > 0) {
            console.log(idTarima);
            console.log(idDetalleTarima);
            console.log(SacosFinaldt.toString());
            //Actualizar detalles Tarima Origen
            this.tarimaService.updateDetalleTarimaIdSacos(idTarima, idDetalleTarima, SacosFinaldt.toString()).subscribe(resdt => {
              console.log(resdt);
              // this.onClose();
              if(this.tarimaService.trapasoOrdenCarga == true){
                this.ordenTemporalService.filter(this.tarimaQrOrigen);
                }
                if(this.ordenTemporalService.traspasoOrdenTemporal == true){
                this.ordenTemporalService.filterOrdenTemporal('HOLA DESDE TRASPASO TARIMA');
                }
            });
          } else {
            console.log(idDetalleTarima);
            this.tarimaService.deleteDetalleTarima(idDetalleTarima).subscribe(resDelete => {
              console.log(resDelete);
              // this.onClose();
              if(this.tarimaService.trapasoOrdenCarga == true){
                this.ordenTemporalService.filter(this.tarimaQrOrigen);
                }
                if(this.ordenTemporalService.traspasoOrdenTemporal == true){
                  this.ordenTemporalService.filterOrdenTemporal('HOLA DESDE TRASPASO TARIMA');
                  }
            });
          }

        });
      });
    });

  }
  actualizarTarimaDestino() {
//Actualizar Tarima Destino
this.detalleTarimaSelectedDestino = new DetalleTarima();
this.detalleTarimaSelectedDestino = this.detalleTarimaSelected;
this.detalleTarimaSelectedDestino.IdTarima = this.tarimaIdDestino;
this.detalleTarimaSelectedDestino.Sacos = this.sacosTraspaso.toString();
let idTarima = this.tarimaIdDestino;
    let idDetalleTarima;
    let sacosTraspaso = this.sacosTraspaso;
    let clave = this.detalleTarimaSelectedDestino.ClaveProducto;
    let lote = this.detalleTarimaSelectedDestino.Lote;
    let SacosIniciot;
    let SacosIniciodt;
    let SacosFinalt;
    let SacosFinaldt;
    let PesoTotal;


    console.log(idTarima);
    console.log(sacosTraspaso);
    this.tarimaService.getTarimaID(idTarima).subscribe(data => {
      console.log(data);
      console.log(sacosTraspaso);
      SacosIniciot = data[0].Sacos;
      console.log(SacosIniciot);
      SacosFinalt = ((+SacosIniciot) + (+sacosTraspaso));
      console.log(SacosFinalt);
      PesoTotal = ((+SacosFinalt) * (20));
      console.log(PesoTotal);
      console.log(idTarima);
      console.log('////////////////');
      console.log(SacosFinalt);
      console.log(PesoTotal);
      console.log(idTarima);
      console.log('////////////////');
      //Actualizamos Tarima Origen
      this.tarimaService.updateTarimaSacosPeso(idTarima, SacosFinalt.toString(), PesoTotal.toString()).subscribe(res => {
        console.log(res);
        //Buscar si existe detalleTarima en la tarima con la misma ClaveProducto y Lote
this.tarimaService.getDetalleTarimaIdClaveLote(idTarima, clave, lote).subscribe(dataDetalleTarima =>{
console.log(dataDetalleTarima);
if(dataDetalleTarima.length > 0){
  //si existen, actualizar detalle tarima
  idDetalleTarima = dataDetalleTarima[0].IdDetalleTarima;
  SacosFinaldt = ((+dataDetalleTarima[0].Sacos) + (sacosTraspaso));
  console.log(idTarima);
  console.log(idDetalleTarima);
  console.log(SacosFinaldt.toString());
    this.tarimaService.updateDetalleTarimaIdSacos(idTarima, idDetalleTarima, SacosFinaldt.toString()).subscribe(resdt => {
    console.log(resdt);
  });

}else{
  //si no, agregar detalle tarima
  console.log(this.detalleTarimaSelected);
  this.tarimaService.addDetalleTarima(this.detalleTarimaSelected).subscribe(resDT => {

  });
}
  
  
});
      });
    });



  }

  traspasoTarimaOrdenCarga(idTarima: number, detalleTarimaOrigen: any, qr: string){
    this.tarimaIdOrigen = idTarima;
    this.tarimaQrOrigen = qr;
    let ClaveP = detalleTarimaOrigen.ClaveProducto;
    this.DetalleTarimaSelect = ClaveP;

this.dropdownRefreshDetalleTarima(qr);
console.log(detalleTarimaOrigen);
//Obtener valores que seran enviados como parametro a detalle tarima origen
this.tarimaService.getDetalleTarimaIdClaveLote(idTarima, ClaveP, detalleTarimaOrigen.Lote).subscribe( data =>{
  let detalleTarima = new DetalleTarima();
  detalleTarima = data[0];
  console.log(detalleTarima);
  this.onSelectionChangeDetalleTarimaOrigen(detalleTarima, true);
})
  }

  onBlurIdOrigen() {

    this.tarimaService.getTarimaQR(this.tarimaQrOrigen).subscribe( dataTarima =>{
console.log(dataTarima);
this.listDetalleTarima = [];
console.log(this.listDetalleTarima);
//Inicializar en 0 el dropdown de Detalles Tarima. 
this.filteredOptionsDetalleTarima = new  Observable<any[]>();
if(dataTarima.length > 0){
  
  if(dataTarima[0].Bodega == 'Transito'){
    Swal.fire({
      icon: 'error',
      title: 'Tarima en Transito',
      text: 'La tarima con el codigo ' + this.tarimaQrOrigen + ' se encuentra en Transito.' 
    })
  }else{
    this.dropdownRefreshDetalleTarima(this.tarimaQrOrigen);
  }
  }else{
    Swal.fire({
      icon: 'error',
      title: 'Tarima no existente',
      text: 'La tarima con el codigo ' + this.tarimaQrOrigen + ' no existe.' 
    })
    // this.dropdownRefreshDetalleTarima('');
  
  }
})




  }

  changeNuevaTarima(checkbox: any) {
    if (checkbox == true) {
      this.nuevaTarima = true;

    } else {
      this.nuevaTarima = false;

    }


  }

  dropdownRefreshDetalleTarima(qr: string) {
    this.listDetalleTarima = [];
    this.tarimaService.getTarimaQR(qr).subscribe( dataQR =>{
let tarimaId = dataQR[0].IdTarima;
this.tarimaIdOrigen = tarimaId;
      this.tarimaService.getDetalleTarimaID(tarimaId).subscribe(dataP => {
        for (let i = 0; i < dataP.length; i++) {
          let product = dataP[i];
          this.listDetalleTarima.push(product)
          this.filteredOptionsDetalleTarima = this.myControlDetalleTarima.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterDetalleTarima(value))
            );
          }
        });
      });

  }

  private _filterDetalleTarima(value: any): any[] {
    // console.clear();
    // console.log(value);
    if (typeof (value) == 'string') {
      const filterValueDetalleTarima = value.toLowerCase();
      return this.listDetalleTarima.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValueDetalleTarima) || option.Producto.toString().toLowerCase().includes(filterValueDetalleTarima));
    } else if (typeof (value) == 'number') {
      const filterValueDetalleTarima = value.toString();
      return this.listDetalleTarima.filter(option => option.ClaveProducto.toString().includes(filterValueDetalleTarima) || option.Producto.toString().includes(filterValueDetalleTarima));
    }


  }


  onSelectionChangeDetalleTarimaOrigen(dt: DetalleTarima, event: any) {
    // if (event.isUserInput) {
      console.log(dt);
      this.detalleTarimaSelected = new DetalleTarima();
      this.detalleTarimaSelected = dt;
      this.producto = dt.Producto;
      this.sacosTraspaso = +dt.Sacos;
      this.cantidadMaximaSacos = +dt.Sacos;
      this.idDetalleTarimaOrigen = dt.IdDetalleTarima;
    // }
  }

  //metodo que se ejecuta cuando cambia la cantidad de sacos
  onChangeCantidadSacos(cantidad: any){
    // console.log(cantidad);
    let elemHTML: any = document.getElementsByName('sacoTraspaso')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.sacosTraspaso;
    console.log(this.sacosTraspaso);
    
  }


  validarCantidad(cantidad: any) {
    // console.log(cantidad + ' CANTIDAD');
  this.sacosTraspaso = +cantidad;
    // console.log(this.cantidadMaximaSacos);

    if (this.sacosTraspaso >= this.cantidadMaximaSacos) {
      this.sacosTraspaso = this.cantidadMaximaSacos;
    }
    if (this.sacosTraspaso <= 0) {
      this.sacosTraspaso = 0;
    }
    if (cantidad == null) {
      this.sacosTraspaso = 0;
    }
    // console.log(this.sacosTraspaso);
  }

  onBlurIdDestino(qrDestino: string) {
    this.tarimaDValida = false;
    console.log(qrDestino);
    this.tarimaIdDestino = 0;
    if(qrDestino != ''){
console.log('TEXTO');
this.tarimaService.getTarimaQR(qrDestino).subscribe(dataqr =>{
  console.log(dataqr);
  if(dataqr.length > 0){
    console.log('si entro');
    if(dataqr[0].Bodega == 'Transito'){
      Swal.fire({
        icon: 'error',
        title: 'Tarima en Transito',
        text: 'La tarima con el codigo ' + this.tarimaQrDestino + ' se encuentra en transito.' 
      })
    }else{      
      this.tarimaIdDestino = dataqr[0].IdTarima;
      console.log(this.tarimaIdDestino);
      this.tarimaService.getTarimaID(this.tarimaIdDestino).subscribe(data => {
        console.log(data);
        this.tarimaDestino = new Tarima();
        this.tarimaDestino = data[0];
        console.log(this.tarimaDestino);
        this.tarimaDValida = true;
      });
    }
    }else{
    console.log('No existe Tarima Destino');
    Swal.fire({
      icon: 'error',
      title: 'Tarima no existente',
      text: 'La tarima con el codigo ' + this.tarimaQrDestino + ' no existe.' 
    })
  }
});
    }else{
console.log('VACIO');
    }
 

  }



}
