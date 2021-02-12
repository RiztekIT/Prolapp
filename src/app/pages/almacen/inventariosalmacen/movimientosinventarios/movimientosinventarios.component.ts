import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';

@Component({
  selector: 'app-movimientosinventarios',
  templateUrl: './movimientosinventarios.component.html',
  styleUrls: ['./movimientosinventarios.component.css']
})
export class MovimientosinventariosComponent implements OnInit {

  constructor(public serviceTarima: TarimaService) { }

  filteredOptions2: Observable<any[]>;
  filteredOptions3: Observable<any[]>;
  filteredOptions4: Observable<any[]>;
  filteredOptions5: Observable<any[]>;
  myControl2 = new FormControl();
  myControl3 = new FormControl();
  myControl4 = new FormControl();
  myControl5 = new FormControl();
  ProductoSelect: string;
  MarcaSelect: string;
  OrigenSelect:string;
  PresentacionSelect: string;

  ngOnInit() {
    this.getProductosInventario()
  }

  getProductosInventario(){
    let consulta = {
      'consulta':"select * from detalletarima where iddetalletarima=1"
    };
    this.serviceTarima.generarConsulta(consulta).subscribe(data=>{
      console.log(data);
    })
  }
/* 
  onSelectionChange2(options2: Producto, event: any) {
    if (event.isUserInput) {
      this.service.formProd = options2;
      this.PStock = this.service.formProd.Stock;
      this.ProductoPrecio = +this.service.formProd.PrecioVenta;
      //asignar el valor inicial en caso de que la moneda este declarada en USD
      if (this.MonedaBoolean == false) {
        this.ProductoPrecioDLLS = (+this.service.formProd.PrecioVenta / this.TipoCambio);
      }

      this.ClaveProducto = this.service.formProd.ClaveProducto;
      this.droddownMarcas(this.service.formProd.Nombre);
      this.droddownOrigen();
      this.droddownPresentacion();

      this.OrigenSelect = 'USA'
      this.claveorigen = '1'
      this.PresentacionSelect = '25 Kg'
      console.log(+this.PStock + " STOCKKKK");
    }
  } */

}
