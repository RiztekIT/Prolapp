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

@Component({
  selector: 'app-traspaso-tarima',
  templateUrl: './traspaso-tarima.component.html',
  styleUrls: ['./traspaso-tarima.component.css']
})
export class TraspasoTarimaComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<TraspasoTarimaComponent>, public tarimaService: TarimaService) { }

  ngOnInit() {
    this.nuevaTarima = false;
  }

  tarimaIdOrigen: number;
  tarimaIdDestino: number;

  sacosTraspaso: number;
  nuevaTarima: boolean;
  idDetalleTarimaOrigen: number;

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
    this.dialogbox.close();

  }

  onSubmit(form: NgForm) {
    //Verificar si es una nueva tarima 
    //Verficar si se estan traspasando todos los sacos de ese producto TRUE( nomas cambiar el idTarima ) FALSE ( generar nuevo Dt y actualizar los sacos de Dt origen )
    //Hacer Update a Tarima
    console.log(this.sacosTraspaso)
    if (this.nuevaTarima == true) {
      let tarimaInsert = new Tarima();
      tarimaInsert.IdTarima = 0;
      tarimaInsert.Sacos = this.sacosTraspaso.toString();
      tarimaInsert.PesoTotal = (this.sacosTraspaso * 20).toString();
      tarimaInsert.QR = 'QR2';
      console.log(tarimaInsert);
      console.log(this.detalleTarimaSelected);
      this.tarimaService.addTarima(tarimaInsert).subscribe(rest => {
        console.log(rest);
        //Obtener id new Tarima
        this.tarimaService.getUltimaTarima().subscribe(dataUT => {
          console.log(dataUT);
          this.detalleTarimaSelected.IdTarima = dataUT[0].IdTarima;
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
            this.tt.Sacos = this.sacosTraspaso.toString();
            this.tt.FechaTraspaso = new Date();
            this.tt.IdUsuario = 0;
            this.tt.Usuario = 'TYSOK';
            console.log(this.tt);
            this.tarimaService.addTraspasoTarima(this.tt).subscribe(resTrasTarima => {
              console.log(resTrasTarima);
              // this.actualizarTarimaOrigen();
            })
          });
        });
      });
    } else {
      // this.actualizarTarimaOrigen();
      // this.actualizarTarimaDestino();
    }


    // this.dialogbox.close();
  }

  actualizarTarimaOrigen() {

    let idTarima = this.detalleTarimaSelected.IdTarima;
    let idDetalleTarima = this.detalleTarimaSelected.IdDetalleTarima;
    let SacosIniciot;
    let SacosIniciodt;
    let SacosFinalt;
    let SacosFinaldt;
    let PesoTotal;
    this.tarimaService.getTarimaID(idTarima).subscribe(data => {
      SacosIniciot = data[0].Sacos;
      SacosFinalt = ((+SacosIniciot) - (this.sacosTraspaso)).toString();
      PesoTotal = (+SacosFinalt * 20).toString();
      //Actualizamos Tarima Origen
      this.tarimaService.updateTarimaSacosPeso(idTarima, SacosFinalt, PesoTotal).subscribe(res => {
        console.log(res);
        //Obtener Detalle Tarima ID
        this.tarimaService.getDetalleTarimaID(idDetalleTarima).subscribe(datadt => {
          SacosIniciodt = datadt[0].Sacos;
          SacosFinaldt = (+SacosIniciodt - this.sacosTraspaso)
          if (SacosFinaldt > 0) {
            //Actualizar detalles Tarima Origen
            this.tarimaService.updateDetalleTarimaIdSacos(idTarima, idDetalleTarima, SacosFinaldt.toString()).subscribe(resdt => {
              console.log(resdt);
            });
          } else {
            this.tarimaService.deleteDetalleTarima(idDetalleTarima).subscribe(resDelete => {
              console.log(resDelete);
            });
          }
        });
      });
    });

  }
  actualizarTarimaDestino() {

  }

  onBlurIdOrigen() {
    this.dropdownRefreshDetalleTarima(this.tarimaIdOrigen);
  }

  changeNuevaTarima(checkbox: any) {
    if (checkbox == true) {
      this.nuevaTarima = true;

    } else {
      this.nuevaTarima = false;

    }


  }

  dropdownRefreshDetalleTarima(id: number) {
    this.listDetalleTarima = [];
    this.tarimaService.getDetalleTarimaID(id).subscribe(dataP => {
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
    if (event.isUserInput) {
      console.log(dt);
      this.detalleTarimaSelected = new DetalleTarima();
      this.detalleTarimaSelected = dt;
      this.producto = dt.Producto;
      this.sacosTraspaso = +dt.Sacos;
      this.idDetalleTarimaOrigen = dt.IdDetalleTarima;
    }
  }

  onBlurIdDestino(tarimaId: number) {
    console.log(tarimaId);
    this.tarimaService.getTarimaID(+tarimaId).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        this.tarimaDestino = new Tarima();
        this.tarimaDestino = data[0];
        console.log(this.tarimaDestino);
      }
    });

  }



}
