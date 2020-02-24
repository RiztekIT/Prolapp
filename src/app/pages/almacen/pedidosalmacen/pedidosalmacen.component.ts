import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga.service';
import { OrdenCarga } from '../../../Models/almacen/ordencarga.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidosalmacen',
  templateUrl: './pedidosalmacen.component.html',
  styleUrls: ['./pedidosalmacen.component.css'],
})
export class PedidosalmacenComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdOrdenCarga', 'NumSalida', 'FechaOrden', 'IdCliente', 'Cliente', 'Producto', 'Fletera', 'NumCaja', 'EnviarA', 'Sacos', 'Kilos', 'Notas','Usuario', 'Boton'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public router: Router,private service:OrdenCargaService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenCargaList();
      });

   }

  ngOnInit() {
    this.refreshOrdenCargaList();
  }

  refreshOrdenCargaList(){
    this.service.getOrdenCargaList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina';
      // console.log(data);
    });
  }

  onEdit(ordencarga: OrdenCarga){
    this.service.formData = ordencarga;
    this.service.formData.IdOrdenCarga = ordencarga.IdOrdenCarga;
    // let Id = pedido.IdPedido;
    // localStorage.setItem('IdPedido', Id.toString());
    this.router.navigate(['/ordencargadetalle']);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
  }

}
