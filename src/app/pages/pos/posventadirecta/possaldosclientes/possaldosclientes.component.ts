import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import Swal from 'sweetalert2';
import { PosserviceService } from '../../posservice.service';

@Component({
  selector: 'app-possaldosclientes',
  templateUrl: './possaldosclientes.component.html',
  styleUrls: ['./possaldosclientes.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class PossaldosclientesComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Clave','RFC', 'Cliente','Total','Pagos', 'Saldo','Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  expandedElement: any;
  estatusSelect

  constructor(public posSVC: PosserviceService) { }

  ngOnInit() {
    this.obtenerSaldos();
  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.RazonSocial.toString().toLowerCase().includes(filter) || data.Clave.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }


  obtenerSaldos(){

    Swal.showLoading();
    
    
   

    let consulta = {
      'consulta':"select * from Cliente"
    };
    
    this.posSVC.mastersaldos = []


    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      console.log('lista servicios',data);
      Swal.close();
      for (let i=0; i<data.length;i++){

        let consulta2 = {
          'consulta':"select ventas.*, (select SUM(convert(float,cantidad)) from pagosclientes where idventas=ventas.idVentas group by idventas) as Pagos from ventas  where estatus<>'Pagada' and idCliente="+data[i].idCLiente
        };
        let saldo = 0;
        let total = 0;
        let pagos = 0;

          this.posSVC.mastersaldos[i] = data[i];
          this.posSVC.mastersaldos[i].DetalleVentas = [];
          this.posSVC.generarConsulta(consulta2).subscribe((detallesresp:any)=>{
            for(let l=0; l<detallesresp.length;l++){
              if (!detallesresp[l].Pagos){
                detallesresp[l].Pagos='0'
              }
              if (detallesresp[l].total==''){
                detallesresp[l].total='0'
              }
              detallesresp[l].saldo = (+detallesresp[l].total - +detallesresp[l].Pagos).toString();
              this.posSVC.mastersaldos[i].DetalleVentas.push(detallesresp[l]);
              saldo = (+saldo + +detallesresp[l].saldo);
              total = (+total + +detallesresp[l].total)
              pagos = (+pagos + +detallesresp[l].Pagos)
              

            }
            this.posSVC.mastersaldos[i].saldo = saldo.toString();
            this.posSVC.mastersaldos[i].total = total.toString();
            this.posSVC.mastersaldos[i].pagos = pagos.toString();
          })
        
      }
      

      console.log(this.posSVC.mastersaldos);
      this.listData = new MatTableDataSource(this.posSVC.mastersaldos);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
      
/* this.dropdownRefreshS(); */
    })

  }

}
