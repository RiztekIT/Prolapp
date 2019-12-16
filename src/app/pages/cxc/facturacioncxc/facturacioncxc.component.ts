import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Factura } from '../../../Models/facturacioncxc/factura-model';
import { FacturaService } from '../../../services/facturacioncxc/factura.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FacturacioncxcAddComponent } from './facturacioncxc-add/facturacioncxc-add.component';
import { FacturacioncxcEditComponent } from './facturacioncxc-edit/facturacioncxc-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturacioncxc',
  templateUrl: './facturacioncxc.component.html',
  styles: []
})
export class FacturacioncxcComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['Cliente', 'Productos', 'Cantidad', 'Precio', 'CFDI', 'MetodoPago','FormaPago', 'Folio', 
  'Fecha', 'TipoComprobante', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router) {

    // this.service.listen().subscribe((m:any)=>{
    //   console.log(m);
    //   this.refreshProductosList();
    //   });

   }

  ngOnInit() {
    // this.refreshProductosList();
  }

  // refreshProductosList() {

  //   this.service.getProductosList().subscribe(data => {
  //     this.listData = new MatTableDataSource(data);
  //     this.listData.sort = this.sort;
  //   });

  // }

  onDelete( id:number){
    console.log(id);
    // if ( confirm('Are you sure to delete?')) {
    //   this.service.deleteProducto(id).subscribe(res => {
    //   this.refreshProductosList();
    //   this.snackBar.open(res.toString(), '', {
    //     duration: 3000,
    //     verticalPosition: 'top'
    //   });

    //   });
    // }

  }

  onAdd(){
    this.router.navigateByUrl('/facturacionCxcAdd');

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width="70%";
    // this.dialog.open(FacturacioncxcAddComponent, dialogConfig);

  }

  onEdit(factura: Factura){
// console.log(usuario);
this.service.formData = factura;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(FacturacioncxcEditComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }


}
