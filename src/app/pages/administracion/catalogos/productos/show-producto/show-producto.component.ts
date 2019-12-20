import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Producto } from '../../../../../Models/catalogos/productos-model';
import { ProductosService } from '../../../../../services/catalogos/productos.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddProductoComponent } from '../add-producto/add-producto.component';
import { EditProductoComponent } from '../edit-producto/edit-producto.component';

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {


  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'PrecioVenta', 'PrecioCosto', 'Cantidad', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:ProductosService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshProductosList();
      });

   }

  ngOnInit() {
    this.refreshProductosList();
  }

  refreshProductosList() {

    this.service.getProductosList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
    //console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteProducto(id).subscribe(res => {
      this.refreshProductosList();
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top'
      });

      });
    }

  }

  onAdd(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddProductoComponent, dialogConfig);

  }

  onEdit(producto: Producto){
// console.log(usuario);
    this.service.formData = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EditProductoComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
