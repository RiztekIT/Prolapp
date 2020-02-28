import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NotaCreditoService } from '../../../../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DetalleNotaCredito } from '../../../../Models/nota-credito/detalleNotaCredito-model';

@Component({
  selector: 'app-detalle-nota-credito',
  templateUrl: './detalle-nota-credito.component.html',
  styleUrls: ['./detalle-nota-credito.component.css']
})
export class DetalleNotaCreditoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<DetalleNotaCreditoComponent>, public service: NotaCreditoService) { 
    // this.service.listen().subscribe((m:any)=>{
    //   this.refreshProveedoresList();
    //   });
  }

  ngOnInit() {
    this.service.DetalleformData = new DetalleNotaCredito();
    this.DetalleNotaCredito();

    this.filteredOptionsDetalles = this.myControlDetalle.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
  }

   listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'ClaveProducto', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  //valores de Detalle Conceptos Factura
  filteredOptionsDetalles: Observable<any[]>;
  myControlDetalle = new FormControl();
  public listDetalle: Array<any> = [];
  ProductoSelect: string;
  CantidadDetalle: number;


DetalleNotaCredito() {
  
    this.listDetalle = [];
      this.listDetalle = this.service.DetalleFactura;
      this.filteredOptionsDetalles = this.myControlDetalle.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUnidad(value))
        );
  
}
 //Filter Unidad
 private _filterUnidad(value: any): any[] {
    const filterValueDetalle = value.toLowerCase();
    return this.listDetalle.filter(optionDetalle => optionDetalle.ClaveProducto.toString().toLowerCase().includes(filterValueDetalle) || optionDetalle.Producto.toString().toLowerCase().includes(filterValueDetalle));
  
}

onSelectionChange(detalle: DetalleNotaCredito, event: any){
  if (event.isUserInput) {
    console.log(detalle);
    this.service.DetalleformData = detalle;
    this.CantidadDetalle = +detalle.Cantidad;
  }

}

onChangeCantidad(event: any){
  if (event.isUserInput) {
    console.log(this.CantidadDetalle);
  }


}



     

  onClose(){
    this.dialogbox.close();
    this.service.filter('Register click');
  }
  onSubmit(){

  }

  onEdit(detalle: DetalleNotaCredito){

  }

  onDelete(id: number){

  }

}
