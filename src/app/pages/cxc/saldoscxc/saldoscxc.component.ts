import { Component, OnInit, ViewChild  } from '@angular/core';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar} from '@angular/material';
import {MatSort} from '@angular/material/sort';


import { FacturaService } from '../../../services/facturacioncxc/factura.service';

@Component({
  selector: 'app-saldoscxc',
  templateUrl: './saldoscxc.component.html',
  styleUrls: ['./saldoscxc.component.css'],
})
export class SaldoscxcComponent implements OnInit {

  constructor(private service: FacturaService, private dialog: MatDialog, private snackBar: MatSnackBar) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshSaldosList();
      });
   }

  ngOnInit() {
    this.refreshSaldosList();
  }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'SaldoPendiente', 'SaldoPendienteDlls','Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  refreshSaldosList(){
    this.service.getSaldos().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Saldos Por Pagina';
    })
  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdPedido.toString().includes(filter) ;
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
  onEdit(row){
    
  }
}
