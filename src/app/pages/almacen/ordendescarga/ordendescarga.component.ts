import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DetalleOrdenDescarga } from '../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenDescargaService } from '../../../services/almacen/orden-descarga/orden-descarga.service';
import { OrdenSalidaComponent } from 'src/app/components/almacen/orden-salida/orden-salida.component';
import { OrdenDescarga } from '../../../Models/almacen/OrdenDescarga/ordenDescarga-model';
import { Incidencias } from 'src/app/Models/Incidencias/incidencias-model';
import { IncidenciaAlmacenComponent } from 'src/app/components/almacen/incidencia-almacen/incidencia-almacen.component';
import { IncidenciasService } from 'src/app/services/almacen/incidencias/incidencias.service';
@Component({
  selector: 'app-ordendescarga',
  templateUrl: './ordendescarga.component.html',
  styleUrls: ['./ordendescarga.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdendescargaComponent implements OnInit {

  listData: MatTableDataSource<any>;
  //displayedColumns: string[] = ['Folio', 'FechaLlegada', 'Proveedor', 'PO', 'Fletera', 'Caja', 'Sacos', 'Kg', 'Origen', 'Destino', 'Estatus', 'Options'];
  displayedColumns: string[] = ['Folio', 'PO', 'FechaLlegada', 'Proveedor', 'Fletera','Origen','Destino','Estatus','Options'];
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Sacos', 'Lote','','','','',''];
  expandedElement: any;
  detalle = new Array<DetalleOrdenDescarga>();
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  arrOrdenDescarga: any;
  estatusSelect;

  constructor(public router: Router, private service: OrdenDescargaService, private dialog: MatDialog,
    private incidenciasService: IncidenciasService) {
    this.service.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshOrdenDescargaList();
    });
  }

  ngOnInit() {
    this.refreshOrdenDescargaList();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }


  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Almacen';
  area = 'Orden de Descarga';

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
      case ('Editar Orden de Descarga'):
        this.Editar = true;
        break;
      case ('Borrar Orden de Descarga'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

  }

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Descargada' },
    { Estatus: 'Proceso' },
    { Estatus: 'Transito' },
    { Estatus: 'Sin Validar' }    
  ];



  refreshOrdenDescargaList() {
    this.arrOrdenDescarga = this.service.getOrdenDescargaList();
    this.arrOrdenDescarga.subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
        this.service.master[i] = data[i];
        this.service.master[i].detalleOrdenDescarga = [];
        this.service.getOrdenDescargaIDList(data[i].IdOrdenDescarga).subscribe(res => {
          console.log(res);
          for (let l = 0; l <= res.length - 1; l++) {
            this.service.master[i].detalleOrdenDescarga.push(res[l]);
          }
        });
      }
      console.log(this.service.master);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    })
    // this.service.getOrdenCargaList().subscribe(data => {
    //   console.log(data);

    // });
  }
  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  openrep(row) {

    this.service.formrow = row;
    console.log(this.service.formrow);
    // this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(OrdenSalidaComponent, dialogConfig);
  }

  onEdit(ordenDescarga: OrdenDescarga) {
    this.service.formData = ordenDescarga;
    this.service.formData.IdOrdenDescarga = ordenDescarga.IdOrdenDescarga;
    localStorage.setItem('IdOrdenDescarga', this.service.formData.IdOrdenDescarga.toString())
    localStorage.setItem('OrdenDescarga', JSON.stringify(this.service.formData) )
    /* console.clear(); */
    console.log(this.service.formData);
    console.log(localStorage.getItem('IdOrdenDescarga'));


    if (ordenDescarga.Origen != "COMPRA") {
      this.router.navigate(['/ordenDescargadetallecuu']);
    } else {
      this.router.navigate(['/ordenDescargadetalle']);

    }

  }



  public incidenciaBlanco: Incidencias ={
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

  IncidenciasRow(row?){
    console.clear();

    console.log('%c⧭', 'color: #994d75', row);

this.incidenciasService.GetIncidenciaFolioProcedencia(row.Folio, 'OrdenDescarga').subscribe(resIP => {
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
     modulo: 'OrdenDescarga',
   }
   this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
 }else{
   // !FUNCIONA SI NO HAY EXISTENTE
   console.log('%c%s', 'color: #e5de73', 'No hay');
   console.log('%c⧭', 'color: #ffa280', this.incidenciaBlanco);

   this.incidenciasService.incidenciaObject = null;
     this.incidenciasService.getIncidenciaNewFolio().subscribe(resFolio=>{
       console.log(resFolio);
       this.incidenciaBlanco.Folio = +resFolio;
       this.incidenciaBlanco.Procedencia = 'OrdenDescarga'
       this.incidenciaBlanco.FolioProcedencia = row.Folio
       this.incidenciaBlanco.IdDetalle = row.IdOrdenCarga
       console.log('%c⧭', 'color: #ffa280', this.incidenciaBlanco);
       this.incidenciasService.addIncidencia(this.incidenciaBlanco).subscribe(resAdd=>{
         console.log(resAdd);
         this.incidenciasService.getIncidenciaFolio(+resFolio).subscribe(resIncidencia=>{
           console.log(resIncidencia[0]);
           this.incidenciasService.incidenciaObject = resIncidencia[0];
           const dialogConfig = new MatDialogConfig();
           dialogConfig.disableClose = true;
           dialogConfig.autoFocus = true;
           dialogConfig.height = "90%";
           dialogConfig.data = {
             modulo: 'OrdenDescarga',
           }
           this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
         })
       })
     })

 }

})


}
}
