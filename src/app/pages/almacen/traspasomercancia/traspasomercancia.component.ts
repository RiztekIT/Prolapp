import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TraspasoMercanciaService } from '../../../services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ResumentraspasoComponent } from './resumentraspaso/resumentraspaso.component';
import { DocumentacionFormularioImportacionComponent } from '../../importacion/documentacion-importacion/documentacion-formulario-importacion/documentacion-formulario-importacion.component';
import { OrdenCargaDescargaComponent } from 'src/app/components/orden-carga-descarga/orden-carga-descarga.component';

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
  }

  nuevoTraspaso(){
    // this.router.navigateByUrl('/embarque');
    let query = 'select top 1 folio, idtraspasomercancia from traspasomercancia order by folio desc;'
    let consulta = {
      'consulta':query
    };
    this.traspasoSVC.getQuery(consulta).subscribe(resp=>{
      console.log(resp);
      this.traspasoSVC.folionuevo = (+resp[0].folio + 1).toString();
      this.traspasoSVC.idnuevo = (+resp[0].idtraspasomercancia + 1).toString();
      
      this.router.navigateByUrl('/embarque');
    })

  }

  applyFilter(filtervalue: string){
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Folio.toString().toLowerCase().includes(filter)
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  obtenerTraspasos(){

    this.traspasoSVC.getTraspasoMercancia().subscribe(data=>{
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
    let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia=3'
    let consulta = {
      'consulta':query
    };

    this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
      console.log(detalles);
      this.traspasoSVC.formrow = detalles;
      console.log('%c⧭', 'color: #d90000', this.traspasoSVC.formrow);
    })
    // this.service.formrow = row;
    // console.log();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(OrdenCargaDescargaComponent, dialogConfig);
    
  }
  
  onDelete(row){
    console.log(row);
  }
  

}
