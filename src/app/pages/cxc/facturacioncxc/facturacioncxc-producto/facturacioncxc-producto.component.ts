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


  IdFactura: any;
  myControl = new FormControl();
  options: Producto[] = [];
  filteredOptions: Observable<any[]>;
  // options = [{city_name: "AnyTown", city_num: "4"}, {city_name: "YourTown", city_num: "15"}, {city_name: "SmallTown", city_num: "35"}];
  //Objeto de ProductoslistClientes: Cliente[] = [];
  listProductos: Producto[] = [];
  
  myControlUnidad = new FormControl();
  optionsUnidad = ['Medida 1', 'Medida 2', 'Medida 3'];
  filteredOptionsUnidad: Observable<any[]>;

  constructor(public dialogbox: MatDialogRef<FacturacioncxcProductoComponent>,
    public service: FacturaService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
    this.obtenerProductos();


    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );

      console.log(this.service.IdFactura);
      this.IdFactura = this.service.IdFactura ;
      console.log(this.IdFactura);

  }
  //Filter Clave Producto
   private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    // console.log(filterValue + "FILTER  VALUE");
    // return this.options.filter(option => option.Nombre.toLowerCase().includes(filterValue));
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }
  //Filter Unidad
  private _filterUnidad(value: any): any[] {
    const filterValueUnidad = value.toLowerCase();
    // console.log(this.optionsUnidad);
    return this.optionsUnidad.filter(optionUnidad => optionUnidad.toString().toLowerCase().includes(filterValueUnidad));
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
  onSelectionChange(event: MatAutocompleteSelectedEvent, options:Producto){
    if(event.source.selected){
      this.service.formDataDF.Producto = options.Nombre;
      this.service.formDataDF.ClaveSat = options.ClaveSAT;
    }
  }
   

  // onSelectionChanged(event: MatAutocompleteSelectedEvent,options: Producto) {
  //   if (event.source.selected) {
  //   console.log(options);
  //    this.service.formDataDF.Producto = options.Nombre;
  //   }
  // }

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
    Observaciones: '',
    TextoExtra: '',
    }

  }
 
  onSubmit(form: NgForm) {
    this.service.formDataDF.IdFactura = this.IdFactura;
    console.log(this.service.formDataDF);
    this.service.addDetalleFactura(this.service.formDataDF).subscribe(res => {
      this.resetForm(form);
      console.log(res);
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      console.log(this.service.formDataDF);
    }
    );
  
  }

  Finalizar(form: NgForm){

    this.service.formDataDF.IdFactura = this.IdFactura;
    console.log(this.service.formDataDF);
    this.service.addDetalleFactura(this.service.formDataDF).subscribe(res => {
      this.resetForm(form);
      console.log(res);
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      console.log(this.service.formDataDF);
      this.dialogbox.close();
      this.service.filter('Register click');
    }
    );

  }


}
