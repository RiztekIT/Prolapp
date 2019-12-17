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
  folio: string;
  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['Id', 'Folio', 'Cliente', 'FechaExpedicion', 'Subtotal', 'IVA', 'Total', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshFacturaList();
      });

   }

  ngOnInit() {
    this.refreshFacturaList();
    this.Folio();
  }

  refreshFacturaList() {

    this.service.getFacturasList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    });

  }

  onDelete( id:number){
    // console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteFactura(id).subscribe(res => {
      this.refreshFacturaList();
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top'
      });

      });
    }

  }

  onAdd(){
    // this.service.getFolio().subscribe(data => {
    //   this.folio = data; 
    // });
    // this.service.folio = this.folio;
    // console.log(this.folio);
    // this.Folio();
    // this.service.formData.Folio = this.folio;
    // console.log(this.service.formData.Folio);
    // console.log(this.service.formData.Folio);
    this.router.navigateByUrl('/facturacionCxcAdd');

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width="70%";
    // this.dialog.open(FacturacioncxcAddComponent, dialogConfig);

  }
  Folio(){
    this.service.getFolio().subscribe(data => {
      this.folio = data; 
      // console.log(this.folio);
      
      this.service.formData.Folio = data;
      console.log(this.service.formData.Folio);
    });
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
