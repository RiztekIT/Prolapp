import { Component, OnInit, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import {MatTableDataSource, MatSort, MatPaginator, MatTable} from '@angular/material';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReciboPagoService } from '../../../services/complementoPago/recibo-pago.service';
import { ReciboPago } from '../../../Models/ComplementoPago/recibopago';


@Component({
  selector: 'app-complementopagocxc',
  templateUrl: './complementopagocxc.component.html',
  styleUrls: ['./complementopagocxc.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComplementopagocxcComponent implements OnInit {

  IdFactura: any;
  listData: MatTableDataSource<any>;
  // MasterDetalle = new Array<facturaMasterDetalle>();
  listDetalleData;
  displayedColumns : string [] = ['Id', 'Cliente', 'FechaPago', 'Cantidad', 'Estado', 'Options'];
  displayedColumnsVersion : string [] = ['ClaveProducto'];
  folio: string;
  fileUrl;
  xmlparam;
  expandedElement: any;
  // detalle = new Array<DetalleFactura>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  a = document.createElement('a');
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:ReciboPagoService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router) {
  
    this.service.listen().subscribe((m:any)=>{
      this.refreshReciboPagoList();
      // this.detallesFactura();
      });

   }

  ngOnInit() {

    this.refreshReciboPagoList();
    // this.detallesFactura();
    // this.Folio();
    // this.ObtenerUltimaFactura();
    // this.listData.connect();
  }

  //Obtener lista de Recivo de pagos
  refreshReciboPagoList(){
    
  this.service.getRecibosPagoList().subscribe(data => {
    // console.log("ESTE EEESSSS" + data[0]);

  
  
  // for (let i = 0; i <= data.length-1; i++){
  //   this.service.master[i] = data[i]
  //   this.service.master[i].detalle = [];
  
  //   if (data[i].IdCliente != 1){
      
  //     this.service.getDetallesFacturaList(data[i].Id).subscribe(res => {
  //       for (let l = 0; l <=res.length-1; l++){

  //         this.service.master[i].detalle.push(res[l]);
  //       }
 
  this.listData = new MatTableDataSource(data)
        // this.listData = new MatTableDataSource(this.service.master);
        this.listData.sort = this.sort;    
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Facturas por Pagina';
      // })
    // }}
 
    
    
    
  });

  // console.log(this.listData);


  }

  //Obtener un solo PagoCFDI por ID
  getPagoCFDI(id){

  }

  //Obtener lista de PagosCFDI
  getPagosCFDIList(){

  }

  //Agregar
  onAdd(){

  }

  //Editar
  onEdit(reciboPago: ReciboPago){
this.service.formData = reciboPago;
let Id = reciboPago.Id;
console.log(Id);
    
    // this.router.navigate(['/facturacionCxcAdd', Id]);

  }

  //Eliminar
  onDelete(reciboPago: ReciboPago){

    console.log(reciboPago);

  }

  applyFilter(filtervalue: string){  
    // this.listData.filterPredicate = (data, filter: string) => {
    //   return data.Folio.toString().toLowerCase().includes(filter) || data.Nombre.toLowerCase().includes(filter);
    //  };
    // this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    // console.log(this.listData);
  }
  

}
