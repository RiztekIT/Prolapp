import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { map, startWith } from 'rxjs/operators';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../Models/catalogos/productos-model';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
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
  constructor(public router: Router, private dialog: MatDialog, private currencyPipe: CurrencyPipe, public service: VentasPedidoService, private _formBuilder: FormBuilder) {

    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshPedidoList();
    });

  }

  ngOnInit() {
    this.refreshPedidoList();


  }

  IdPedido: any;
  MasterDetalle = new Array<pedidoMaster>();

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdPedido', 'Nombre', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario', 'Factura', 'LugarDeEntrega', 'Moneda', 'Prioridad', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];
  expandedElement: any;
  detalle = new Array<DetallePedido>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  refreshPedidoList() {
    // this.service.getPedidoList().subscribe(data => {
    this.service.getPedidoCliente().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].Estatus == 'Creada') {
          // console.log(data[i]);
          // console.log('ELIMINAR ESTE PEDIDO');
          // console.log(i + 1);
          this.service.onDelete(data[i].IdPedido).subscribe(res => {
            this.refreshPedidoList();
          });
        }
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
      IdCliente: 0,
      Folio: "",
      Subtotal: "",
      Descuento: "",
      Total: "",
      Observaciones: "",
      FechaVencimiento: new Date(),
      OrdenDeCompra: "",
      FechaDeEntrega: new Date(),
      CondicionesDePago: "",
      Vendedor: "",
      Estatus: "Creada",
      Usuario: "",
      Factura: 0,
      LugarDeEntrega: "",
      Moneda: "MXN",
      Prioridad: "Normal"
    }

  //Get the Folio and verify if it comes empty( in this case it will be set to 1) otherwise, it will be added 1 to not repeat the same Folio among the Pedidos
  ObtenerFolio() {
    this.service.GetFolio().subscribe(data => {
      // console.log(data[0].Folio);
      let folio = data[0].Folio;
      if (folio == "") {
        folio = 1;
      } else {
        folio = +folio + 1;
      }
      // console.log(folio);
      this.PedidoBlanco.Folio = folio.toString();
    });
  }

  //agregar nuevo pedido
  onAdd() {
    //Obtener el folio y agregarselo al pedido que se generara
    this.ObtenerFolio();
    console.log(this.PedidoBlanco);
    this.service.addPedido(this.PedidoBlanco).subscribe(res => {
      //Obtener el pedido que se acaba de generar
      this.ObtenerUltimoPedido();
    });
  }

  //Obtener ultimo pedido y agregarlo al local Storage
  ObtenerUltimoPedido() {
    this.service.getUltimoPedido().subscribe(res => {
      console.log('NUEVO IDPEDIDO------');
      console.log(res[0]);
      console.log('NUEVO IDPEDIDO------');
      this.IdPedido = res[0].IdPedido;
      console.log(this.IdPedido);
      localStorage.setItem('IdPedido', this.IdPedido.toString());
      this.router.navigate(['/pedidoventasAdd']);
    })
  }

  //editar pedido, llenar los formdata de donde se obtendra la informacion en el otro componente.
  //Abrir la sig pagina donde se editara el pedido
  onEdit(pedido: Pedido) {

    this.service.formDataPedido = pedido;
    this.service.IdCliente = pedido.IdCliente;
    let Id = pedido.IdPedido;
    localStorage.setItem('IdPedido', Id.toString());
    this.router.navigate(['/pedidoventasAdd']);
  }


  //Eliminar pedido
  //A su vez verificar si existen detalles pedidos relacionados a ese pedido.
  //En caso que si existan, se regresara el stock original a esos productos y se eliminaran los Detalles pedidos y el pedido.
  //en caso que no existan detalles pedido, solamente se eliminara el pedido.
  onDelete(pedido: Pedido) {
    this.service.GetDetallePedidoId(pedido.IdPedido).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        console.log('Si hay valores');
        for (let i = 0; i <= data.length - 1; i++) {
          this.SumarStock(data[i].Cantidad, data[i].ClaveProducto, data[i].IdDetallePedido);
          this.DeletePedidoDetallePedido(pedido);
        }
      } else {
        console.log('No hay valores');
        this.DeletePedidoDetallePedido(pedido);
      }
    })
  }

  //ELiminar Pedidos y DetallePedido
  DeletePedidoDetallePedido(pedido: Pedido) {
    this.service.onDeleteAllDetallePedido(pedido.IdPedido).subscribe(res => {
      this.service.onDelete(pedido.IdPedido).subscribe(res => {
        this.refreshPedidoList();
      });
    });
  }


  //Metodo para sumar Stock Producto
  SumarStock(Cantidad: string, ClaveProducto: string, Id: number) {
    console.log(ClaveProducto + 'claveproducto');
    console.log(Id + 'IDDDDD');
    this.service.GetProductoDetalleProducto(ClaveProducto, Id).subscribe(data => {
      console.log(data[0]);
      let stock = data[0].Stock;
      console.log(stock);
      stock = (+stock) + (+Cantidad);
      console.log(stock);
      this.service.updateStockProduto(ClaveProducto, stock.toString()).subscribe(res => {
        console.log(res);
      });
    })


  }

  //Filtro para buscar valores de la tabla de pedidos por Nombre de Cliente e IdPedido
  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdPedido.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

}
