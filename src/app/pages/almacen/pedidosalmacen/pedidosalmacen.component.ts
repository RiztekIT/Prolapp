import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { PedidoService } from 'src/app/services/pedidos/pedido.service';

@Component({
  selector: 'app-pedidosalmacen',
  templateUrl: './pedidosalmacen.component.html',
  styles: []
})
export class PedidosalmacenComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdPedido', 'IdCliente', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario', 'Factura', 'LugarDeEntrega', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private service:PedidoService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshPedidoList();
      });

   }

  

  ngOnInit() {
    this.refreshPedidoList();
  }

  refreshPedidoList(){
    this.service.getPedidoList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      console.log(data);
    });
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
