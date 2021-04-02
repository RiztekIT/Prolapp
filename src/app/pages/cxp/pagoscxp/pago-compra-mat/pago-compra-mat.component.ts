import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';
@Component({
  selector: 'app-pago-compra-mat',
  templateUrl: './pago-compra-mat.component.html',
  styleUrls: ['./pago-compra-mat.component.css']
})
export class PagoCompraMatComponent implements OnInit {

  constructor(public pagosService: PagoscxpService) { }

  ngOnInit() {
    this.getComprasMPrima();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'PO', 'Proveedor', 'PesoTotal', 'FechaElaboracion', 'FechaPromesa', 'FechaEntrega','Estatus', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  getComprasMPrima(){
    this.pagosService.getComprasMateriaPrima().subscribe(dataCompra=>{
      console.log(dataCompra);
      this.listData = new MatTableDataSource(dataCompra);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
    })
  }

  @Output() agregarPago = new EventEmitter<any>();
  onAddPago(compras: any) {
    // console.log(compras);
    compras.Modulo = 'CompraMateriaPrima';
    this.agregarPago.emit(compras);
  }

  estatusSelect;

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Transito' },
    { Estatus: 'Finalizada' }
  ];

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
// console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

  }
  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();  
  }
  applyFilter2(filtervalue: string){  
    
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

}
