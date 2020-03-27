import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import { TarimaService } from '../../../services/almacen/tarima/tarima.service';
import { Observable, } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { DetalleTarima } from '../../../Models/almacen/Tarima/detalleTarima-model';

@Component({
  selector: 'app-traspaso-tarima',
  templateUrl: './traspaso-tarima.component.html',
  styleUrls: ['./traspaso-tarima.component.css']
})
export class TraspasoTarimaComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<TraspasoTarimaComponent>, public tarimaService: TarimaService) { }

  ngOnInit() {
  }

  tarimaIdOrigen: number;
  tarimaIdDestino: number;
  sacosTraspaso: number;

  //Dropdown Producto

  myControlDetalleTarima = new FormControl();
  filteredOptionsDetalleTarima: Observable<any[]>;
  listDetalleTarima: DetalleTarima[] = [];
  DetalleTarimaSelect: string;
  producto: string

  //Dropdown Producto

  onClose() {
    this.dialogbox.close();
    
  }

  onSubmit(form: NgForm) {
    this.dialogbox.close();
  }

  onBlurIdOrigen(){
    this.dropdownRefreshDetalleTarima(this.tarimaIdOrigen);
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
      this.producto = dt.Producto
    //   this.service.formProd = options2;
    //   this.PStock = this.service.formProd.Stock;
    //   this.ProductoPrecio = +this.service.formProd.PrecioVenta;
    //   //asignar el valor inicial en caso de que la moneda este declarada en USD
    //   if (this.MonedaBoolean == false) {
    //     this.ProductoPrecioDLLS = (+this.service.formProd.PrecioVenta / this.TipoCambio);
    //   }

    //   this.ClaveProducto = this.service.formProd.ClaveProducto;
    //   console.log(+this.PStock + " STOCKKKK");
    }
  }



}
