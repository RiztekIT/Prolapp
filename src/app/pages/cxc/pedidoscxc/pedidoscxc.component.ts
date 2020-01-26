import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Pedido } from '../../../Models/Pedidos/pedido-model';
import { PedidoService } from 'src/app/services/pedidos/pedido.service';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-pedidoscxc',
  templateUrl: './pedidoscxc.component.html',
  styleUrls: ['./pedidoscxc.component.css'],
  animations: [

  ]
})
export class PedidoscxcComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdPedido', 'IdCliente', 'Folio', 'Subtotal', 'Descuento', 'Total', 'Observaciones', 'FechaVencimiento', 'OrdenDeCompra', 'FechaDeEntrega', 'CondicionesDePago', 'Vendedor', 'Estatus', 'Usuario', 'Factura', 'LugarDeEntrega']

  constructor() { }

  ngOnInit() {
  }

}
