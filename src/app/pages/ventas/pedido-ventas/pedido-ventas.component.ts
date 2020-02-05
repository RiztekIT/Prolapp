import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Producto } from '../../../Models/catalogos/productos-model';
import { CurrencyPipe } from '@angular/common';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import { Pedido } from '../../../Models/Pedidos/pedido-model';

@Component({
  selector: 'app-pedido-ventas',
  templateUrl: './pedido-ventas.component.html',
  styleUrls: ['./pedido-ventas.component.css']
})
export class PedidoVentasComponent implements OnInit {
  IdPedido: any;
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdPedido', 'IdCliente', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario', 'Factura', 'LugarDeEntrega', 'Moneda', 'Prioridad', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public router: Router, private dialog: MatDialog, private currencyPipe: CurrencyPipe , public service: VentasPedidoService, private _formBuilder: FormBuilder) { 

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

  public PedidoBlanco: Pedido = 
  {
    IdPedido: 0,
    IdCliente : 1,
    Folio : "",
    Subtotal : "",
    Descuento : "",
    Total : "",
    Observaciones :"",
    FechaVencimiento : new Date(),
    OrdenDeCompra : "",
    FechaDeEntrega : new Date(),
    CondicionesDePago : "",
    Vendedor : "",
    Estatus : "",
    Usuario : "",
    Factura : 0,
    LugarDeEntrega: "",
    Moneda: "MXN",
    Prioridad: "Normal"
}


onAdd(){
  // console.log(this.PedidoBlanco);
  this.service.addPedido(this.PedidoBlanco).subscribe(res => {

console.log(res);
    this.router.navigate(['/pedidoventasAdd']);
   });
}


onEdit(pedido : Pedido){

this.service.formDataP = pedido;
this.service.IdCliente = pedido.IdCliente;
this.router.navigate(['/pedidoventasAdd']);
}

onDelete(pedido : Pedido){
  this.service.onDelete(pedido.IdPedido).subscribe(res => {
    this.refreshPedidoList();
  });
}

  
  private _listeners = new Subject<any>(); 
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
