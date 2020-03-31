import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import { TarimaService } from '../../../services/almacen/tarima/tarima.service';
import { Observable, } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';
import { Tarima } from '../../../Models/almacen/Tarima/tarima-model';

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

  //Dropdown Producto

  myControlDetalleTarima = new FormControl();
  filteredOptionsDetalleTarima: Observable<any[]>;
  listDetalleTarima: DetalleTarima[] = [];
  DetalleTarimaSelect: string;
  producto: string
  //objecto para guardar detalle tarima seleccionada
  detalleTarimaSelected: DetalleTarima;

  //Dropdown Producto

  onClose() {
    this.dialogbox.close();
    
  }

  onSubmit(form: NgForm) {
    //Verificar si es una nueva tarima 
    //Verficar si se estan traspasando todos los sacos de ese producto TRUE( nomas cambiar el idTarima ) FALSE ( generar nuevo Dt y actualizar los sacos de Dt origen )
    //Hacer Update a Tarima
    console.log(this.sacosTraspaso)
if(this.nuevaTarima == true){
  let tarimaInsert = new Tarima();
  tarimaInsert.IdTarima = 0;
  tarimaInsert.Sacos = this.sacosTraspaso.toString();
  tarimaInsert.PesoTotal = (this.sacosTraspaso * 20).toString();
  tarimaInsert.QR = 'QR2';
  console.log(tarimaInsert);
// this.tarimaService.addTarima().subscribe(res=>{
      this.actualizarTarimaOrigen();
// });
}else{
      this.actualizarTarimaOrigen();
      this.actualizarTarimaDestino();
}


    // this.dialogbox.close();
  }

  actualizarTarimaOrigen(){

    let idTarima = this.detalleTarimaSelected.IdTarima;
    let idDetalleTarima = this.detalleTarimaSelected.IdDetalleTarima;
    let SacosInicio; 
    let SacosFinal = this.detalleTarimaSelected.Sacos
    let PesoTotal;
       this.tarimaService.getTarimaID(idTarima).subscribe(data =>{
        SacosInicio = data[0].Sacos;
        SacosFinal = ((+SacosInicio) - (this.sacosTraspaso)).toString();
        PesoTotal =  (+SacosFinal * 20).toString();
      this.tarimaService.updateTarimaSacosPeso(idTarima, SacosFinal, PesoTotal).subscribe(res =>{
        console.log(res);
      });
    });

  }
  actualizarTarimaDestino(){

  }

  onBlurIdOrigen(){
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


  onSelectionChangeDetalleTarima(dt: DetalleTarima, event: any) {
    if (event.isUserInput) {
      console.log(dt);
      this.detalleTarimaSelected= new DetalleTarima();
      this.detalleTarimaSelected = dt;
      this.producto = dt.Producto;
      this.sacosTraspaso = +dt.Sacos;
    }
  }



}
