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
//import propiedades para mostrar tabla detalles del Pedido
import { trigger, state, transition, animate, style } from '@angular/animations';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
import { DetallePedido } from '../../../Models/Pedidos/detallePedido-model';

@Component({
  selector: 'app-pedido-ventas',
  templateUrl: './pedido-ventas.component.html',
  styleUrls: ['./pedido-ventas.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PedidoVentasComponent implements OnInit {
  constructor(public router: Router, private dialog: MatDialog, private currencyPipe: CurrencyPipe , public service: VentasPedidoService, private _formBuilder: FormBuilder) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshPedidoList();
      });

  }
  
  ngOnInit() {
    this.refreshPedidoList();
    this.ObtenerUltimoPedido();
    
  }

  IdPedido: any;
  MasterDetalle = new Array<pedidoMaster>();

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdPedido', 'Nombre', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario', 'Factura', 'LugarDeEntrega', 'Moneda', 'Prioridad', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];
  expandedElement: any;
  detalle = new Array<DetallePedido>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  

  refreshPedidoList(){
    // this.service.getPedidoList().subscribe(data => {
     this.service.getPedidoCliente().subscribe(data => {
       console.log(data);
       for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i]
        this.service.master[i].DetallePedido = [];
        this.service.getDetallePedidoId(data[i].IdPedido).subscribe(res => {
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].DetallePedido.push(res[l]);
          }
        });
      }

      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      console.log(this.service.master);
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
    

// console.log(res);
console.log(this.IdPedido);
localStorage.setItem('IdPedido', this.IdPedido.toString());
    this.router.navigate(['/pedidoventasAdd']);
   });
}

ObtenerUltimoPedido(){
  this.service.getUltimoPedido().subscribe(res =>{
    // console.log(res);
    this.IdPedido = res[0].IdPedido + 1;
    console.log(this.IdPedido);
  })
}


onEdit(pedido : Pedido){

this.service.formDataPedido = pedido;
this.service.IdCliente = pedido.IdCliente;
let Id = pedido.IdPedido;
localStorage.setItem('IdPedido', Id.toString());
this.router.navigate(['/pedidoventasAdd']);
}

onDelete(pedido : Pedido){
  this.service.onDelete(pedido.IdPedido).subscribe(res => {
    this.refreshPedidoList();
  });
}


  applyFilter(filtervalue: string){  
    // this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter);
      // return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
     };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
