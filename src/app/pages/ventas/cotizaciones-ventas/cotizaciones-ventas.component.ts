import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CotizacionComponent } from 'src/app/components/cotizacion/cotizacion.component';

@Component({
  selector: 'app-cotizaciones-ventas',
  templateUrl: './cotizaciones-ventas.component.html',
  styleUrls: ['./cotizaciones-ventas.component.css']
})
export class CotizacionesVentasComponent implements OnInit {

  constructor( private dialog: MatDialog,) { }

  ngOnInit() {
  }



  openrep(){

    console.log();
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(CotizacionComponent, dialogConfig);
  }

}
