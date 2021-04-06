import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { PosserviceService } from '../../posservice.service';

@Component({
  selector: 'app-poshistoricoventas',
  templateUrl: './poshistoricoventas.component.html',
  styleUrls: ['./poshistoricoventas.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class PoshistoricoventasComponent implements OnInit {

  public listEstatus = [
    { 'Estatus': 'Todos' },
    { 'Estatus': 'Creada' },
    { 'Estatus': 'Abierta' },
    { 'Estatus': 'Credito' },
    { 'Estatus': 'Pagada' }
  ];

  constructor(public posSVC: PosserviceService, public dialogbox: MatDialogRef<PoshistoricoventasComponent>) { }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Cliente', 'Subtotal', 'Total', 'FechaDeExpedicion', 'Estatus','Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  expandedElement: any;
  estatusSelect

  ngOnInit() {

    this.refreshOrdenesList();
  }

  estatusCambio(event){
    console.log(event.value);
    if (event.value=='Todos'){

      this.applyFilterEstatus('');
    }else{

      this.applyFilterEstatus(event.value);
    }


  }

  applyFilterEstatus(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.estatus.toString().toLowerCase().includes(filter)
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.nombreCliente.toString().toLowerCase().includes(filter) || data.folio.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  onEdit(row){

    this.dialogbox.close(row);

  }

  onDelete(row){

  }



  refreshOrdenesList(){

    Swal.showLoading();
    
    
   

    let consulta = {
      'consulta':"select ventas.*, cliente.* from ventas left join cliente on ventas.idCliente = cliente.idCLiente where ventas.tipo='Venta' order by ventas.fechaexpedicion desc"
    };
    
    this.posSVC.masterventas = []


    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      console.log('lista servicios',data);
      Swal.close();
      for (let i=0; i<data.length;i++){

        let consulta2 = {
          'consulta':"select * from detalleVentas where idventas="+data[i].idVentas
        };
        

          this.posSVC.masterventas[i] = data[i];
          this.posSVC.masterventas[i].DetalleServicios = [];
          this.posSVC.generarConsulta(consulta2).subscribe((detallesresp:any)=>{
            for(let l=0; l<detallesresp.length;l++){
              this.posSVC.masterventas[i].DetalleServicios.push(detallesresp[l]);
            }
          })
        
      }
      

      console.log(this.posSVC.masterventas);
      this.listData = new MatTableDataSource(this.posSVC.masterventas);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      
/* this.dropdownRefreshS(); */
    })


  }

}
