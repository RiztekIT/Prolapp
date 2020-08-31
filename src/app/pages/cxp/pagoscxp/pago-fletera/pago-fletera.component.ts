import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { PagoscxpService } from '../../../../services/cuentasxpagar/pagoscxp.service';

@Component({
  selector: 'app-pago-fletera',
  templateUrl: './pago-fletera.component.html',
  styleUrls: ['./pago-fletera.component.css']
})
export class PagoFleteraComponent implements OnInit {

  constructor(public pagosService: PagoscxpService) { }

  ngOnInit() {
    this.getFletes();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Factura', 'Fletera', 'Estatus', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  getFletes(){
    this.pagosService.getFacturasFletes().subscribe(dataFlete=>{
      console.log(dataFlete);
      this.listData = new MatTableDataSource(dataFlete);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Fletes por Pagina';
    })
  }

  @Output() agregarPago = new EventEmitter<any>();
  onAddPago(flete: any) {
    // console.log(compras);
    flete.Modulo = 'Flete';
    this.agregarPago.emit(flete);
  }

  estatusSelect;

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Capturada' },
    { Estatus: 'Terminada' }
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
