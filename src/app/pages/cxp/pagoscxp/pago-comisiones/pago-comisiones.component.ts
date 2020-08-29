import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';

@Component({
  selector: 'app-pago-comisiones',
  templateUrl: './pago-comisiones.component.html',
  styleUrls: ['./pago-comisiones.component.css']
})
export class PagoComisionesComponent implements OnInit {

  constructor(public pagosService: PagoscxpService) { }

  ngOnInit() {
    this.getComisiones();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Folio', 'OrdenDeCompra', 'FechaVencimiento', 'FechaDeEntrega', 'Prioridad', 'Flete','Estatus', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  getComisiones(){
    this.pagosService.getComisiones().subscribe(dataComisiones=>{
      console.log(dataComisiones);
      this.listData = new MatTableDataSource(dataComisiones);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Compras por Pagina';
    })
  }

  @Output() agregarPago = new EventEmitter<any>();
  onAddPago(compras: any) {
    // console.log(compras);
    compras.Modulo = 'Comision';
    this.agregarPago.emit(compras);
  }

  estatusSelect;

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Cerrada' }
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
