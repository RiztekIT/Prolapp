import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import { OrdenCarga } from '../../../Models/almacen/OrdenCarga/ordencarga.model';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { DetalleOrdenCarga } from '../../../Models/almacen/OrdenCarga/detalleOrdenCarga-model';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { OrdenCargaComponent } from 'src/app/components/almacen/orden-carga/orden-carga.component';
import { SidebarService, privilegios } from '../../../services/shared/sidebar.service';
import { Incidencias } from 'src/app/Models/Incidencias/incidencias-model';
import { IncidenciasService } from 'src/app/services/almacen/incidencias/incidencias.service';
import { IncidenciaAlmacenComponent } from 'src/app/components/almacen/incidencia-almacen/incidencia-almacen.component';
import { SalidaProductoComponent } from '../../../components/almacen/salida-producto/salida-producto.component';
import { OrdenCargaDescargaComponent } from 'src/app/components/orden-carga-descarga/orden-carga-descarga.component';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { MasterOrdenCarga } from 'src/app/Models/almacen/OrdenCarga/masterOrdenCarga-model';

import { ConnectionHubServiceService } from '././../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Almacen", "titulo": 'OC'}
]
@Component({
  selector: 'app-pedidosalmacen',
  templateUrl: './pedidosalmacen.component.html',
  styleUrls: ['./pedidosalmacen.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PedidosalmacenComponent implements OnInit, OnDestroy {

  // INICIO VARIABLES TABLA ORDEN CARGA
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'FechaEnvio', 'Cliente', 'IdPedido', 'Fletera', 'Caja', 'Origen', 'Destino', 'Estatus', 'Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote'];
  expandedElement: any;
  detalle = new Array<DetalleOrdenCarga>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  arrOrdenCarga: any;
  estatusSelect;

  tipoSelect
  public listTipo: Array<Object> = [
    { Tipo: 'Todos' },
    { Tipo: 'Venta' },
    { Tipo: 'Traspaso' },  
  ];

  // FIN VARIABLES TABLA ORDEN CARGA

  constructor(public router: Router, private service: OrdenCargaService,
    private dialog: MatDialog, public privilegiosService: SidebarService,
    private incidenciasService: IncidenciasService, public traspasoSVC: TraspasoMercanciaService,
    private ConnectionHubService: ConnectionHubServiceService,) {

    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshOrdenCargaList();
    });

    
    this.ConnectionHubService.listenOC().subscribe((m:any)=>{
      this.refreshOrdenCargaList();
      });

    // console.log('Constructor Orden de Carga');
    this.service.master = new Array<MasterOrdenCarga>();
  }

  ngOnInit() {

    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.refreshOrdenCargaList();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }

  ngOnDestroy(): void {
    // this.refreshOrdenCargaList();
    // this.obtenerPrivilegios();
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    // this.subs3.unsubscribe();
  }


  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Almacen';
  area = 'Orden de Carga';

  //^ VARIABLES DE PERMISOS
  Editar: boolean = false;
  Borrar: boolean = false;
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
      case ('Editar Orden de Carga'):
        this.Editar = true;
        break;
      case ('Borrar Orden de Carga'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****


  estatusCambio(event) {
    // console.log(event);
    this.estatusSelect = event.value;
    console.log(this.estatusSelect);
    if (this.estatusSelect === 'Todos') {
      this.applyFilter2('')
    } else {

      this.applyFilter2(this.estatusSelect)
    }

  }


  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Creada' },
    { Estatus: 'Preparada' },
    { Estatus: 'Cargada' },
    { Estatus: 'Terminada' },
    { Estatus: 'Sin Validar' },
  ];

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
  applyFilter3(filtervalue: string) {
    
    if (filtervalue==''){

      this.listData.filterPredicate = (data, filter: string) => {
        return data.Cliente.toString().toLowerCase().includes(filter);
      };
      this.listData.filter = filtervalue.trim().toLocaleLowerCase();


    }else if(filtervalue=='Traspaso'){
      filtervalue = 'Traspaso'
      this.listData.filterPredicate = (data, filter: string) => {
        return data.Cliente.toString().toLowerCase().includes(filter);
      };
      this.listData.filter = filtervalue.trim().toLocaleLowerCase();

    }else {

      let string: string;
      filtervalue = 'Traspaso'
      


      this.listData.filterPredicate = (data, filter: string) => {
        data.Cliente.toString().toLowerCase()
        return data.Cliente.toString().toLowerCase().indexOf(filter) == -1;
      };
      this.listData.filter = filtervalue.trim().toLocaleLowerCase();

    }
  

  }

  tipoCambio(event){
    // console.log(event);
this.tipoSelect = event.value;
console.log(this.tipoSelect);
if (this.tipoSelect==='Todos'){
  this.applyFilter3('')
}else {

  this.applyFilter3(this.tipoSelect)
}

  }
  subs1: Subscription
  subs2: Subscription
  refreshOrdenCargaList() {

    
    this.arrOrdenCarga = this.service.getOrdenCargaList();
    this.subs1 = this.arrOrdenCarga.subscribe(data => {
      // console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        //^ Verificar si la Orden le Pertenece al Pedido o al Traspaso. 
        if (data[i].Cliente == 'Traspaso') {
          let query = 'select TraspasoMercancia.Folio from TraspasoMercancia where IdOrdenCarga =' + data[i].IdOrdenCarga;
          let consulta = {
            'consulta': query
          };
          console.log('%c%s', 'color: #ff0000', query);
          this.traspasoSVC.getQuery(consulta).subscribe((detallesConsulta: any) => {
            console.log(detallesConsulta);
            // this.agregarDetalles(data, i);
            data[i].IdPedido = detallesConsulta[0].Folio;
            this.service.master[i] = data[i];
            this.service.master[i].detalleOrdenCarga = [];
            this.subs2 = this.service.getOrdenCargaIDList(data[i].IdOrdenCarga).subscribe(res => {
              // console.log(res);
              for (let l = 0; l <= res.length - 1; l++) {
                this.service.master[i].detalleOrdenCarga.push(res[l]);
              }
            });
          })
          //^ La orden viene de un Traspaso
        }else {
          //^ La orden viene de una venta
          console.log('Viene de una Venta');
          let query = 'select Pedidos.Folio from Pedidos where IdPedido =' + data[i].IdPedido;
          let consulta = {
            'consulta': query
          };
          console.log('%c%s', 'color: #ff0000', query);
          this.traspasoSVC.getQuery(consulta).subscribe((detallesConsulta: any) => {
            console.log(detallesConsulta);
            // this.agregarDetalles(data, i);
            data[i].IdPedido = detallesConsulta[0].Folio;
            this.service.master[i] = data[i];
            this.service.master[i].detalleOrdenCarga = [];
            this.subs2 = this.service.getOrdenCargaIDList(data[i].IdOrdenCarga).subscribe(res => {
              // console.log(res);
              for (let l = 0; l <= res.length - 1; l++) {
                this.service.master[i].detalleOrdenCarga.push(res[l]);
              }
            });
          })
        }

      }
      // console.log(this.service.master);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Carga por Pagina';
    })
    // this.service.getOrdenCargaList().subscribe(data => {
    //   console.log(data);

    // });
  }

  agregarDetalles(data, i) {

  }

  onEdit(ordencarga: OrdenCarga) {
    console.log(ordencarga)
    localStorage.setItem('IdOrdenCarga', ordencarga.IdOrdenCarga.toString())
    localStorage.setItem('OrdenCarga', JSON.stringify(ordencarga))
    this.router.navigate(['/ordencargadetalle']);
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  ///////////////////////////////// MODALES /////////////////////////////////////////////
  openrep(row) {

    // this.service.formrow = row;
    // console.log(row);
    // console.log(this.service.formrow);
    // // this.service.formrow = row;
    // // console.log();
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "70%";
    // this.dialog.open(OrdenCargaComponent, dialogConfig);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "0%";
    dialogConfig.height = "0%";
    dialogConfig.data = {
      IdOrdenCarga: row.IdOrdenCarga,
      origen:'normal'
    }
    this.dialog.open(SalidaProductoComponent, dialogConfig);
  }

  openDocumentoTraspaso(id: number) {
    console.log(id);
    console.log(id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
      IdOrdenCarga: id
    }
    this.dialog.open(OrdenCargaDescargaComponent, dialogConfig);
  }

  /////////////////////////////// Fin Modales //////////////////////////////////////////
  onDelete(row) {
    console.log(row)
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();
    this.service.deleteOrdenCarga(row.IdOrdenCarga).subscribe(res => {
      Swal.close();
      this.ConnectionHubService.on(origen[0]);
      if (res == 'Se elimino Correctamente') {
        Swal.fire({
          title: 'Borrado',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
        this.refreshOrdenCargaList();

      } else {
        Swal.fire({
          text: 'Error al borrar',
          icon: 'error'
        });
      }
    })
  }

  public incidenciaBlanco: Incidencias = {
    IdIncidencia: 0,
    Folio: null,
    FolioProcedencia: null,
    TipoIncidencia: "",
    Procedencia: "",
    IdDetalle: null,
    Cantidad: "",
    Estatus: "Creada",
    FechaElaboracion: new Date(),
    FechaFinalizacion: new Date(0),
    Observaciones: ""
  }


  // tomar el row para sacar datos de la incidencia
  // !FUNCIONA SI NO HAY EXISTENTE
  IncidenciasRow(row?) {
    console.clear();

    console.log('%c⧭', 'color: #994d75', row);

    this.incidenciasService.GetIncidenciaFolioProcedencia(row.Folio, 'OrdenCarga').subscribe(resIP => {
      this.incidenciasService.incidenciaObject = new Incidencias()
      if (resIP.length > 0) {
        console.log('%c⧭', 'color: #d0bfff', resIP);
        console.log('%c⧭', 'color: #33cc99', resIP[0].FolioProcedencia);
        // let folioP = resIP[0].FolioProcedencia

        console.log('%c%s', 'color: #7f2200', 'si hay');

        this.incidenciasService.incidenciaObject.FolioProcedencia = row.Folio;
        this.incidenciasService.incidenciaObject.Procedencia = resIP[0].Procedencia;
        // this.incidenciasService.incidenciaObject.IdDetalle = resIP[0].IdDetalle;
        console.log('%c⧭', 'color: #364cd9', this.incidenciasService.incidenciaObject);



        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = "90%";
        dialogConfig.data = {
          modulo: 'OrdenCarga',
          datos: 'oo'
        }
        this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
      } else {
        // !FUNCIONA SI NO HAY EXISTENTE
        console.log('%c%s', 'color: #e5de73', 'No hay');
        console.log('%c⧭', 'color: #ffa280', this.incidenciaBlanco);

        this.incidenciasService.incidenciaObject = null;
        this.incidenciasService.getIncidenciaNewFolio().subscribe(resFolio => {
          console.log(resFolio);
          this.incidenciaBlanco.Folio = +resFolio;
          this.incidenciaBlanco.Procedencia = 'OrdenCarga'
          this.incidenciaBlanco.FolioProcedencia = row.Folio
          this.incidenciaBlanco.IdDetalle = row.IdOrdenCarga
          console.log('%c⧭', 'color: #ffa280', this.incidenciaBlanco);
          this.incidenciasService.addIncidencia(this.incidenciaBlanco).subscribe(resAdd => {
            console.log(resAdd);
            this.incidenciasService.getIncidenciaFolio(+resFolio).subscribe(resIncidencia => {
              console.log(resIncidencia[0]);
              this.incidenciasService.incidenciaObject = resIncidencia[0];
              const dialogConfig = new MatDialogConfig();
              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.height = "90%";
              dialogConfig.data = {
                modulo: 'OrdenCarga',
                datos: 'oo'
              }
              this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
            })
          })
        })

      }

    })




  }
}