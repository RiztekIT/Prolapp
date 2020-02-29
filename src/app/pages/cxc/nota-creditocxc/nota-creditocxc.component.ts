import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';


import { NotaCreditoService } from '../../../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';
import { NotaCredito } from '../../../Models/nota-credito/notaCredito-model';
import { DetalleNotaCredito } from '../../../Models/nota-credito/detalleNotaCredito-model';
import { NotaCreditoMaster } from 'src/app/Models/nota-credito/notaCreditoMaster-model';
import { MessageService } from '../../../services/message.service';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-nota-creditocxc',
  templateUrl: './nota-creditocxc.component.html',
  styleUrls: ['./nota-creditocxc.component.css'],
  animations: [
    /* Trigger para tabla con detalles, cambio de estado colapsado y expandido y sus estilis */
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NotaCreditocxcComponent implements OnInit {

  listData: MatTableDataSource<any>;

  displayedColumns : string [] = ['Folio', 'Nombre', 'FechaDeExpedicion', 'Subtotal', 'ImpuestosTrasladadosDlls', 'Total', 'Estado', 'Options'];
  displayedColumnsVersion : string [] = ['ClaveProducto'];

  expandedElement: any;
  detalle = new Array<DetalleNotaCredito>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private service: NotaCreditoService, private dialog: MatDialog, private snackbar: MatSnackBar, private router: Router, public _MessageService: MessageService ) { 
    this.service.listen().subscribe((m:any)=>{
      this.refreshNotaList();
    });
  }


  ngOnInit() {
    this.refreshNotaList();
  }

  refreshNotaList(){

    // this.service.deleteNotaCreada().subscribe(data =>{
      // console.log(data);


      this.service.getNotasjoinDetalle().subscribe(data=>{
        console.log(data);

        for(let i = 0; i <= data.length-1; i++){
          this.service.master[i] = data[i]
          console.log(this.service.master[i]);
          this.service.master[i].DetalleNotaCredito = [];
          if (data[i].IdCliente != 1){
            console.log(data[i].IdNotaCredito);
            this.service.getNotaCreditoDetalles(data[i].IdNotaCredito).subscribe(res=>{
              console.log(res);
              for(let l = 0; l <= res.length-1; l++){
                this.service.master[i].DetalleNotaCredito.push(res[l]);
              }
              this.listData = new MatTableDataSource(this.service.master);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
              this.listData.paginator._intl.itemsPerPageLabel = 'Notas de Credito Por Pagina';
            })
          }}
      });

      console.log(this.service.master);
    // })
  }

  onDelete(row){

    console.log(row);

    let id: any = row.IdNotaCredito;

    this.service.deleteNotaCredito(id).subscribe(data=>{

    })
  }

  applyFilter(filtervalue: string){  
    console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      if (data.Nombre){
        return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
      } else{
        return data.Folio.toString().toLowerCase().includes(filter);
      }
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }
}
