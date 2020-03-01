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
    this.Inicializar();

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
  //Cantidad que se modificara
  CantidadDetalle: number;
  //Cantidad Original del concepto proveniente de detalle factura
  CantidadOriginal: number;
  //IdNotaCredito
  IdNotaCredito: number;

  //Variable tipo Cambio
  tipoCambio: string;

  //Nombre Cliente
  ClienteNombre: string;

  Importe: number;
  ImporteDlls: number;
  ImporteIVA: number;
  ImporteIVADLLS: number;
  iva: number;

  //Variable para ver si se agregara o actualizara un detalle Nota Credito
  agregar: boolean;


  Inicializar(){
    this.tipoCambio = this.service.TipoCambio;
    this.IdNotaCredito = this.service.idNotaCredito;
    this.ClienteNombre = this.service.ClienteNombre;
    this.agregar=true;
    this.IniciarImportes();
    this.DetalleNotaCredito();
    this.refreshTablaDetalles();
    console.log(this.IdNotaCredito);
    console.log(this.service.formData);
  }

  IniciarImportes(){
    this.Importe =0;
    this.ImporteDlls =0;
    this.ImporteIVA =0;
    this.ImporteIVADLLS =0;
    this.iva =0.16;
    this.ProductoSelect= "";
    this.service.DetalleformData = new DetalleNotaCredito();
  }

refreshTablaDetalles(){

  this.service.getDetalleNotaCreditoList(this.IdNotaCredito).subscribe(data=>{
    if(data.length > 0){
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
    console.log(this.listData);
    }else{
      console.log('No hay VALORES');
      this.listData = new MatTableDataSource(data)
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }
  })
}


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
    this.CantidadOriginal = +detalle.Cantidad;
  }

}

onChangeCantidad(Cantidad: any){
 
    console.log(this.CantidadDetalle);
    //  //Obtener el valor que se ingresa en cierto input en la posicion 0
     let elemHTML: any = document.getElementsByName('CantidadConcepto')[0];
    //  //Transformar la Cantidad en entero e igualarlo a la variable CantidadF2
     this.CalcularCantidades(Cantidad);
     this.MultiplicarImportes(this.CantidadDetalle);
      elemHTML.value = this.CantidadDetalle;
}

  CalcularCantidades(Cantidad: any) {
    console.log(Cantidad);
    if (Cantidad >= 0) {
      if (Cantidad >= this.CantidadOriginal) {
        this.CantidadDetalle = this.CantidadOriginal;
      }else if(Cantidad <= this.CantidadOriginal){
        this.CantidadDetalle = Cantidad;
      }
    } else {
      this.CantidadDetalle = 0;
    }
  }

  //Metodo para calcular/multiplicar importes
  MultiplicarImportes(Cantidad: any){
    this.service.DetalleformData.Importe = (Cantidad * +this.service.DetalleformData.PrecioUnitario).toString();
    this.service.DetalleformData.ImporteDlls = (Cantidad * +this.service.DetalleformData.PrecioUnitarioDlls).toString();
    if (+this.service.DetalleformData.ImporteIVA > 0) {
      console.log('SI LLEVA IVAAAAAAA');
      this.service.DetalleformData.ImporteIVA = (+this.service.DetalleformData.PrecioUnitario * this.iva).toString();
      this.service.DetalleformData.ImporteIVADlls = (+this.service.DetalleformData.PrecioUnitarioDlls * this.iva).toString();
    }
  }

  onClose(){
    this.dialogbox.close();
    this.service.filter('Register click');
  }


  onSubmit(form: NgForm){
    this.service.DetalleformData.Cantidad = this.CantidadDetalle.toString();
    this.service.DetalleformData.IdNotaCredito = this.IdNotaCredito;
console.log(form);
console.log(this.service.DetalleformData);
this.service.formData.IdNotaCredito = this.IdNotaCredito ;
this.service.formData.Estatus = 'Guardada';
console.log(this.service.formData);
this.service.updateNotaCredito(this.service.formData).subscribe(res=>{
console.log(res);
  this.service.addDetalleNotaCredito(this.service.DetalleformData).subscribe(res=>{
  
    console.log(res);
    this.IniciarImportes();
    form.resetForm();
    this.refreshTablaDetalles();
  });
});
  }

  onEdit(detalle: DetalleNotaCredito){
console.log(detalle);
this.agregar = false;
this.service.DetalleformData = detalle;
this.CantidadDetalle = +detalle.Cantidad;
this.ProductoSelect = detalle.ClaveProducto;
  }

  ActualizarDetalleNotaCredito(form: NgForm){
    this.service.DetalleformData.Cantidad = this.CantidadDetalle.toString();
    this.service.DetalleformData.IdNotaCredito = this.IdNotaCredito;
    console.log(this.service.DetalleformData.IdDetalleNotaCredito);
    console.log(this.service.DetalleformData);
    this.service.updateDetalleNotaCredito(this.service.DetalleformData).subscribe(res=>{
      console.log(res);
      this.agregar = true;
    this.IniciarImportes();
    form.resetForm();
    this.refreshTablaDetalles();
    });
  }

  onDelete(id: number){
// console.log(id);
this.service.DeleteDetalleNotaCredito(id).subscribe(res =>{
console.log(res);
this.refreshTablaDetalles();
});
  }

}
