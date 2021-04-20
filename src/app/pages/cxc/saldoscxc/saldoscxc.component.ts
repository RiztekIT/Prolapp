import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';

import { MatSort } from '@angular/material/sort';

import { Router } from '@angular/router';

import { trigger, state, transition, animate, style } from '@angular/animations';

import { ngxLoadingAnimationTypes } from 'ngx-loading';

import Swal from 'sweetalert2';

import { Observable, Subscriber } from 'rxjs';

import { ClientesService } from 'src/app/services/catalogos/clientes.service';

import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';

import { SharedService } from 'src/app/services/service.index';

import { ReporteMaster } from 'src/app/Models/cxc/reportecxcmaster-model';

import { DisplaySaldosComponent } from './display-saldos/display-saldos.component';

import { EventosService } from 'src/app/services/eventos/eventos.service';




@Component({
  selector: 'app-saldoscxc',
  templateUrl: './saldoscxc.component.html',
  styleUrls: ['./saldoscxc.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class SaldoscxcComponent implements OnInit {

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  IdCliente: any;

  IdC: number;

  textoNombre: any;

  masterArray = new Array<ReporteMaster>();

  isVisible: boolean;


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdCliente', 'Nombre', 'TotalAbonos',  'TotalDLLS',  'TotalMXN',  'TotalSaldo', 'Options'];
  displayedColumnsVersion: string[] = ['Folio', 'FechaDeExpedicion', 'FechaVencimiento', 'Total', 'TotalDlls', 'Abonos', 'Saldo', 'Moneda', 'TipoDeCambio'];
  expandedElement: any;
  detalle = new Array<any>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService, public sharedService: SharedService, private dialog: MatDialog,
    private eventosService:EventosService,) { }

  con: string | number;
  arrcon: Array<any> = [];
  totalmxn;
  totaldlls;
  saldo;
  abono;
  totalsaldo;
  totalabonos;
  public loading = false;


  objconc: Array<any> = [];

  ngOnInit() {
    console.clear();
      this.getClientes();

      //^ **** PRIVILEGIOS POR USUARIO *****
      this.obtenerPrivilegios();
      //^ **** PRIVILEGIOS POR USUARIO *****
  }

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Cuentas por Cobrar';
    area = 'Saldos de Cuentas';
  
    //^ VARIABLES DE PERMISOS
    Ver: boolean = false;
    
    //^ VARIABLES DE PERMISOS
  
  
    obtenerPrivilegios() {
      let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
      console.log(arrayPermisosMenu);
      let arrayPrivilegios: any;
      try {
        arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
        // console.log(arrayPrivilegios);
        arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
        // console.log(arrayPrivilegios);
        this.privilegios = [];
        arrayPrivilegios.privilegios.forEach(element => {
          this.privilegios.push(element.nombreProceso);
          this.verificarPrivilegio(element.nombreProceso);
        });
        // console.log(this.privilegios);
      } catch {
        console.log('Ocurrio algun problema');
      }
    }
  
    verificarPrivilegio(privilegio) {
      switch (privilegio) {
        case ('Ver Saldos de Cuentas'):
          this.Ver = true;
          break;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****



  getClientes(){

    this.serviceCliente.getClientesListIDN().subscribe(data=>{
      this.loading = true;

      this.IdCliente = data;

      console.log('cliente',data);



      // console.log(this.IdCliente);

      this.objconc = []

      this.masterArray = []

      for (let i = 0; i < data.length ; i++){
     this.totaldlls = '0';
     this.totalmxn = '0';
     this.totalsaldo = '0';
     this.totalabonos = '0';
      // console.log( this.IdCliente[i].IdClientes);

      
      this.masterArray.push({
        IdCliente: this.IdCliente[i].IdClientes,
        Nombre: this.IdCliente[i].Nombre,
        TotalMXN: '0',
        TotalDLLS: '0'
      })

      this.textoNombre = this.masterArray[i].Nombre.length;
      // console.log(this.textoNombre);

      this.masterArray[i].Docs =[];

        this.serviceFactura.getReportes(this.IdCliente[i].IdClientes).subscribe(res=>{
          this.totaldlls = '0';
          this.totalmxn = '0';
          this.totalsaldo = '0';
     this.totalabonos = '0';

          this.saldo = 0;
          this.abono = 0;
          
          let notacredito;
          let pagos;
          if(res.length > 0){

          for( let l = 0; l < res.length; l++){

            if (res[l].Moneda === 'MXN'){
              if (!res[l].NCTotal){

                notacredito = 0;
              }else{
                notacredito = +res[l].NCTotal;
              }
            }else if (res[l].Moneda === 'USD'){
              if (!res[l].NCTotalDlls){
                
                notacredito = 0;
              }else{
                notacredito = +res[l].NCTotalDlls;
              }
            }

              if (!res[l].pagos){

                pagos = 0;
              }else{
                pagos = res[l].pagos
              }

            this.abono = +notacredito + +pagos;
            // console.log(this.abono);
            // console.log(+notacredito);
            // console.log(+pagos);
            
            if (res[l].Moneda === 'MXN'){

              this.saldo = +res[l].Total - +this.abono

            }else if (res[l].Moneda === 'USD'){
              this.saldo = +res[l].TotalDlls - +this.abono

              // this.saldo = this.saldo * +res[l].TipoDeCambio;

            }
            

           
            console.log(res[l]);
            // this.masterArray[i].Docs.push(res[l],"abonos:'5");
            this.masterArray[i].Docs.push({
              FechaDeExpedicion: res[l].FechaDeExpedicion,
              FechaVencimiento: res[l].FechaVencimiento,
              Folio: res[l].Folio,
              Idcliente: res[l].Idcliente,
              Moneda: res[l].Moneda,
              NCTotal: res[l].NCTotal,
              NCTotalDlls: res[l].NCTotalDlls,
              Tipo: res[l].Tipo,
              TipoDeCambio: res[l].TipoDeCambio,
              Total: res[l].Total,
              TotalDlls: res[l].TotalDlls,
              pagos: res[l].pagos,
              Abonos: this.abono,
              Saldo: this.saldo
            })
            
            this.totalmxn = (+this.totalmxn + +res[l].Total).toString();
            this.totaldlls = (+this.totaldlls + +res[l].TotalDlls).toString();  
            this.totalsaldo = +this.totalsaldo + +this.saldo;
            this.totalabonos = +this.totalabonos + +this.abono;          
            this.masterArray[i].TotalMXN = this.totalmxn;
            this.masterArray[i].TotalDLLS = this.totaldlls;
            this.masterArray[i].TotalAbonos = this.totalabonos;
            this.masterArray[i].TotalSaldo = this.totalsaldo;

              this.objconc.push(res[l]);

            }
          }
   
          this.datosArray(this.masterArray);
        })
      }
      
      
    })
  }

  datosArray(datos) {

    // console.log(datos);

    this.arrcon = [];
    if (datos.length > 0) {
      for (let j = 0; j < datos.length; j++) {
        //var info = datos[j];
        //console.log(info);
        if (datos[j].Docs.length > 0) {
          this.arrcon.push(datos[j])
        }
      }
      console.clear();
      console.log('arrcon', this.arrcon);
      console.log('arrcon', this.arrcon[0].Docs[0].Folio);

      console.log(this.detalle);

    }
    this.listData = new MatTableDataSource(this.arrcon);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    this.loading = false;
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }





  onEdit(row) {
    console.clear();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = "80%";
  dialogConfig.data = {
    data: row
  };
  console.log(dialogConfig.data);
  
  this.eventosService.movimientos('Editar Saldos de Cuentas')
  this.dialog.open(DisplaySaldosComponent, dialogConfig);

  }

}