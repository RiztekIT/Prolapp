import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Producto } from '../../../../Models/catalogos/productos-model';

@Component({
  selector: 'app-facturacioncxc-producto',
  templateUrl: './facturacioncxc-producto.component.html',
  styles: []
})
export class FacturacioncxcProductoComponent implements OnInit {

  myControl = new FormControl();
  options: Producto[] = [];
  // options = [{city_name: "AnyTown", city_num: "4"}, {city_name: "YourTown", city_num: "15"}, {city_name: "SmallTown", city_num: "35"}];
  filteredOptions: Observable<any[]>;
  //Objeto de ProductoslistClientes: Cliente[] = [];
  listProductos: Producto[] = [];


  constructor(public dialogbox: MatDialogRef<FacturacioncxcProductoComponent>,
    public service: FacturaService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
    this.obtenerProductos();
x
  }
   private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    // console.log(filterValue + "FILTER  VALUE");
    // return this.options.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  obtenerProductos(){
    this.service.getProductos().subscribe((data) => {
    for (let i = 0; i < data.length; i++) {
      let producto = data[i];
      this.listProductos.push(producto);
       this.options.push(producto)
      // console.log(this.options);
      // this.service.formDataDF.Producto = producto.Nombre;

      
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    }
    
    // console.log(this.listProductos);
    // console.log(this.listProductos[0].Nombre);
    });
    // this.options = this.listProductos['ClaveProducto'];
    // console.log(this.options);
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent,options: Producto) {
    if (event.source.selected) {
    console.log(options);
     this.service.formDataDF.Producto = options.Nombre;
    }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formDataDF = {
      // Detalle Factura
    IdDetalle: 0,
    IdFactura: 0,
    ClaveProducto: '',
    Producto: '',
    Unidad: '',
    ClaveSat: '',
    PrecioUnitario: '',
    Cantidad: '',
    Importe: '',
    ObservacionesConcepto: '',
    TextoExtra: '',
    }

  }
 
  onSubmit(form: NgForm) {
    // this.service.updateProducto(form.value).subscribe(res => {
    //   this.snackBar.open(res.toString(), '', {
    //     duration: 5000,
    //     verticalPosition: 'top'
    //   });
    // });
    console.log(this.service.formDataDF);
    
    console.log(form.value);
  }
}
