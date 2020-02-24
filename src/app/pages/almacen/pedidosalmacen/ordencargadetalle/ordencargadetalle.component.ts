import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga.service';

// import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
// import { DetallePedido } from '../../../Models/Pedidos/detallePedido-model';

@Component({
  selector: 'app-ordencargadetalle',
  templateUrl: './ordencargadetalle.component.html',
  styleUrls: ['./ordencargadetalle.component.css'],
})
export class OrdencargadetalleComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdDetalleOrdenCarga', 'IdOrdenCarga', 'IdProveedor', 'Proveedor', 'PO', 'IdProducto', 'Lote', 'Sacos', 'PesoSaco', 'FechaMFG', 'FechaCaducidad', 'Bodega', 'USDA','Shipper', 'Pedimiento'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public router: Router, private dialog: MatDialog, private service: OrdenCargaService) { 

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshDetalleOrdenCargaList();
      });

  }

  ngOnInit() {
    this.refreshDetalleOrdenCargaList();
    console.log(this.service.formData);
  }

  refreshDetalleOrdenCargaList(){
    this.service.getDetalleOrdenCargaList(this.service.formData.IdOrdenCarga).subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina';
      console.log(data);
    });
  }


}
  