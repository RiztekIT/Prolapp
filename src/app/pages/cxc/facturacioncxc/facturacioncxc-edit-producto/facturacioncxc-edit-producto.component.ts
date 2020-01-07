import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Producto } from '../../../../Models/catalogos/productos-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturacioncxc-edit-producto',
  templateUrl: './facturacioncxc-edit-producto.component.html',
  styleUrls: ['./facturacioncxc-edit-producto.component.css']
})
export class FacturacioncxcEditProductoComponent implements OnInit {

  IdFactura: any;
  myControl = new FormControl();
  options: Producto[] = [];
  filteredOptions: Observable<any[]>;
  listProductos: Producto[] = [];
  
  myControlUnidad = new FormControl();
  optionsUnidad = ['Pieza'];
  
  filteredOptionsUnidad: Observable<any[]>;

  

  constructor(public dialogbox: MatDialogRef<FacturacioncxcEditProductoComponent>,
    public service: FacturaService, private snackBar: MatSnackBar) { }

  ngOnInit() {
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
    return this.options.filter(option => 
      option.Nombre.toLowerCase().includes(filterValue) || 
      option.ClaveProducto.toLowerCase().includes(filterValue));
  }
  //Filter Unidad
  private _filterUnidad(value: any): any[] {
    const filterValueUnidad = value.toLowerCase();
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


      
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    }
    });

  }
  onSelectionChange(event: MatAutocompleteSelectedEvent, options:Producto){
    
    if(event.option.selected){
      this.service.formDataDF.Producto = options.Nombre;
      this.service.formDataDF.ClaveSAT = options.ClaveSAT;
    }
  }
   

 
  onSubmit(form: NgForm) {
    this.service.formDataDF.IdFactura = this.IdFactura;
    // console.log(this.service.formDataDF);
    this.service.updateDetalleFactura(this.service.formDataDF).subscribe(res => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Concepto Actualizado'
      })
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      // console.log(this.service.formDataDF);
    }
    );
  
  }




}
