import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { IncidenciasService } from '../../../services/almacen/incidencias/incidencias.service';
import { Incidencias } from '../../../Models/Incidencias/incidencias-model';
import { IncidenciaAlmacenComponent } from '../../../components/almacen/incidencia-almacen/incidencia-almacen.component';


@Component({
  selector: 'app-incidenciasalmacen',
  templateUrl: './incidenciasalmacen.component.html',
  styleUrls: ['./incidenciasalmacen.component.css'],
})
export class IncidenciasalmacenComponent implements OnInit {

  constructor(public router: Router, public incidenciasService: IncidenciasService,  private dialog: MatDialog,) {

    this.incidenciasService.listen().subscribe((m:any)=>{
      // console.log(m);
      this.obtenerIncidenciasOrdenCarga();
      this.obtenerIncidenciasOrdenDescarga();
      });

   }

  ngOnInit() {
    this.obtenerIncidenciasOrdenCarga();
    this.obtenerIncidenciasOrdenDescarga();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }

  listDataOrdenCarga: MatTableDataSource<any>;
  displayedColumnsOrdenCarga: string[] = ['Folio', 'TipoIncidencia', 'Estatus', 'FechaElaboracion', 'FechaFinalizacion', 'Observaciones', 'Options'];
  @ViewChild(MatSort, null) sortOC: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOC: MatPaginator;

  arrOrdenCarga: any;

  listDataOrdenDescarga: MatTableDataSource<any>;
  displayedColumnsOrdenDescarga: string[] = ['Folio',  'TipoIncidencia', 'Estatus', 'FechaElaboracion', 'FechaFinalizacion', 'Observaciones', 'Options'];
  @ViewChild(MatSort, null) sortOD: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOD: MatPaginator;

  arrOrdenDescarga: any;

  obtenerIncidenciasOrdenCarga(){
    this.incidenciasService.getIncidenciaProcedencia('OrdenCarga').subscribe(res=>{
      this.arrOrdenCarga = [];
      console.log(res);
                  this.arrOrdenCarga = res;
                  this.listDataOrdenCarga = new MatTableDataSource(this.arrOrdenCarga);
                  this.listDataOrdenCarga.sort = this.sortOC;
                  this.listDataOrdenCarga.paginator = this.paginatorOC;
      
    })
  }
  obtenerIncidenciasOrdenDescarga(){
    this.incidenciasService.getIncidenciaProcedencia('OrdenDescarga').subscribe(res=>{
      this.arrOrdenDescarga = [];
      console.log(res);
      this.arrOrdenDescarga = res;
                this.listDataOrdenDescarga = new MatTableDataSource(this.arrOrdenDescarga);
                this.listDataOrdenDescarga.sort = this.sortOD;
                this.listDataOrdenDescarga.paginator = this.paginatorOD;
    })
  }

  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Almacen';
  area = 'Importaciones';

  //^ VARIABLES DE PERMISOS
  Vista: boolean = false;
Agregar: boolean = false;
AgregarOC: boolean = false;
AgregarOD: boolean = false;
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
     case ('Agregar'):
       this.Agregar = true;
       break;
     case ('AgregarOC'):
       this.AgregarOC = true;
       break;
     case ('AgregarOD'):
       this.AgregarOD = true;
       break;
     case ('Vista'):
       this.Vista = true;
       break;
     default:
       break;
   }
 }
  //^ **** PRIVILEGIOS POR USUARIO *****


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

  //Metodo para acceder a una Incidencia (CREARLA O EDITARLA)
  accederIncidencia(incidencia?:Incidencias){
    //Si recibe como parametro un objeto tipo incidecia, entonces lo editara si no, lo creara
    // console.log(incidencia);
    if (incidencia) {
      this.incidenciasService.incidenciaObject = incidencia;
      const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "90%";
    this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
    } else {
      this.incidenciasService.incidenciaObject = null;
      this.incidenciasService.getIncidenciaNewFolio().subscribe(resFolio=>{
        console.log(resFolio);
        this.incidenciaBlanco.Folio = +resFolio;
        this.incidenciasService.addIncidencia(this.incidenciaBlanco).subscribe(resAdd=>{
          console.log(resAdd);
          this.incidenciasService.getIncidenciaFolio(+resFolio).subscribe(resIncidencia=>{
            console.log(resIncidencia[0]);
            this.incidenciasService.incidenciaObject = resIncidencia[0];
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.height = "90%";
            this.dialog.open(IncidenciaAlmacenComponent, dialogConfig);
          })
        })
      })

    }
    // console.log(this.incidenciasService.incidenciaObject);
    


  }

  applyFilterOrdenCarga(filtervalue: string) {
    this.listDataOrdenCarga.filter = filtervalue.trim().toLocaleLowerCase();
  }
  applyFilterOrdenDescarga(filtervalue: string) {
    this.listDataOrdenDescarga.filter = filtervalue.trim().toLocaleLowerCase();
  }

}
