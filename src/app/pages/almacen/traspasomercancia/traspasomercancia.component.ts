import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TraspasoMercanciaService } from '../../../services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ResumentraspasoComponent } from './resumentraspaso/resumentraspaso.component';
import { DocumentacionFormularioImportacionComponent } from '../../importacion/documentacion-importacion/documentacion-formulario-importacion/documentacion-formulario-importacion.component';
import { OrdenCargaDescargaComponent } from 'src/app/components/orden-carga-descarga/orden-carga-descarga.component';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-traspasomercancia',
  templateUrl: './traspasomercancia.component.html',
  styleUrls: ['./traspasomercancia.component.css']
})
export class TraspasomercanciaComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Fecha','Estatus','Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  

  constructor(public traspasoSVC: TraspasoMercanciaService, public router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerTraspasos();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }

  ngOnDestroy(): void {
    this.subs1.unsubscribe();
    // this.subs2.unsubscribe();
  }

   //^ **** PRIVILEGIOS POR USUARIO *****
   privilegios: any;
   privilegiosExistentes: boolean = false;
   modulo = 'Almacen';
   area = 'Importaciones';
 
   //^ VARIABLES DE PERMISOS
   Vista: boolean = false;
   Agregar: boolean = false;
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
      case ('Editar Traspaso'):
        this.Editar = true;
        break;
      case ('Borrar Traspaso'):
        this.Borrar = true;
        break;
      case ('Agregar Traspaso'):
        this.Agregar = true;
        break;
      case ('Vista'):
        this.Vista = true;
        break;
      default:
        break;
    }
  }
   //^ **** PRIVILEGIOS POR USUARIO *****

  nuevoTraspaso(){
    // this.router.navigateByUrl('/embarque');
    let query = 'select top 1 folio, idtraspasomercancia from traspasomercancia order by folio desc;'
    let consulta = {
      'consulta':query
    };
    this.traspasoSVC.getQuery(consulta).subscribe((resp: any)=>{
      console.log(resp);
      if (resp.lenght>0){

        this.traspasoSVC.folionuevo = (+resp[0].folio + 1).toString();
        this.traspasoSVC.idnuevo = (+resp[0].idtraspasomercancia + 1).toString();
        this.router.navigateByUrl('/embarque');
      }else {
        this.traspasoSVC.folionuevo = '1';
        this.traspasoSVC.idnuevo = '1';
        this.router.navigateByUrl('/embarque');

      }
      
    })

  }

  applyFilter(filtervalue: string){
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Folio.toString().toLowerCase().includes(filter)
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
subs1: Subscription
  obtenerTraspasos(){

  this.subs1 =  this.traspasoSVC.getTraspasoMercancia().subscribe(data=>{
      console.log(data,'TRASPASO');
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Traspasos por Pagina';
    })



  }

  onEdit(row){
    console.log(row);
    this.traspasoSVC.selectTraspaso = row;
    const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = false;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "80%";
          /* let dl = this.dialog.open(DocumentacionFormularioImportacionComponent, dialogConfig); */
          let dl = this.dialog.open(ResumentraspasoComponent, dialogConfig);
  }

  accederPDF(row) {
    console.log(row);
    this.traspasoSVC.formrow = []
    let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia='+row.IdTraspasoMercancia;
    console.log('%c⧭', 'color: #731d6d', query);
    let consulta = {
      'consulta':query
    };
    console.log('%c⧭', 'color: #e57373', consulta);

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
      console.log('%c⧭', 'color: #997326', detalles);
      this.traspasoSVC.formrow[0] = detalles;
      console.log('%c⧭', 'color: #d90000', this.traspasoSVC.formrow);


      console.log('%c%s', 'color: #364cd9', detalles.length);
      console.log('%c⧭', 'color: #ffa280', detalles[0]);

      if (detalles.length == 0) {
        Swal.fire({
          title: 'No Hay Registro',
          icon: 'error',
        })
        
      } else {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
  
        this.dialog.open(OrdenCargaDescargaComponent, dialogConfig);
      }

    })
    // this.service.formrow = row;
    // console.log();
    
  }
  
  onDelete(row){
    console.log(row);
  }

 
  

}
