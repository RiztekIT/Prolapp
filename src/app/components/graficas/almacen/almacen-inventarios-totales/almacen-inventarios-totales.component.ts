import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ProductosService } from 'src/app/services/catalogos/productos.service';
import { Producto } from '../../../../Models/catalogos/productos-model';


@Component({
  selector: 'app-almacen-inventarios-totales',
  templateUrl: './almacen-inventarios-totales.component.html',
  styleUrls: ['./almacen-inventarios-totales.component.css']
})
export class AlmacenInventariosTotalesComponent implements OnInit {

  constructor(public productoService: ProductosService) { }

  ngOnInit() {
  }

   //variables dropdown productos Inventario
   myControlInventario = new FormControl();
   filteredOptionsInventario: Observable<any[]>
   optionsInventario: Producto[] = [];
   InventarioProductoNombre: any;
   InventarioClaveProducto: string;
   InventarioLoteProducto: string;
 


  obtenerProductos(){
    this.productoService.getProductosList().subscribe(dataProd=>{
      console.log(dataProd);
      for (let i = 0; i < dataProd.length; i++) {
        let producto = dataProd[i];
        this.optionsInventario.push(producto)
        this.filteredOptionsInventario = this.myControlInventario.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterInventario(value))
          );
      }
    })
  }

  _filterInventario(value: any): any {
    const filterValue = value.toString().toLowerCase();
   return this.optionsInventario.filter(option =>
     option.Nombre.toLowerCase().includes(filterValue) ||
     option.ClaveProducto.toString().includes(filterValue));
 }

}
