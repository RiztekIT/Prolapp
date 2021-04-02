import { Component, OnInit, Input, SimpleChanges, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { ngxLoadingAnimationTypes } from "ngx-loading";

@Component({
  selector: 'app-display-saldos',
  templateUrl: './display-saldos.component.html',
  styleUrls: ['./display-saldos.component.css']
})
export class DisplaySaldosComponentp implements OnInit {


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Abonos','FechaDeExpedicion','FechaVencimiento','Folio','Moneda','NCTotal','NCTotalDlls','Saldo','Tipo','TipoDeCambio','Total','TotalDlls','pagos',];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;




  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogbox: MatDialogRef<DisplaySaldosComponentp>,
    
    ) { }

  ngOnInit() {
    this.saldoData = this.data
    // console.log('arrcon', this.arrcon[0].Docs[0].Folio);
    console.log('this.saldoData: ', this.saldoData.data);
this.refreshTable()
    // detalles
    // console.log('this.saldoData: ', this.saldoData.data.Docs);
    // console.log('this.saldoData: ', this.saldoData.data.Docs[0]);
  }

  saldoData;
  saldoDetalle;

  onClose() {
    this.dialogbox.close();
  }

  refreshTable(){ 
    
  this.listData = new MatTableDataSource(this.saldoData.data.Docs);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';


}

}








