import { Component, OnInit, ViewChild } from '@angular/core';
import { TraspasoMercanciaService } from '../../../services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ResumentraspasoComponent } from './resumentraspaso/resumentraspaso.component';
import { DocumentacionFormularioImportacionComponent } from '../../importacion/documentacion-importacion/documentacion-formulario-importacion/documentacion-formulario-importacion.component';

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
    let query = 'select top 1 folio, idtraspasomercancia from traspasomercancia;'
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

  onDelete(row){
    console.log(row);
  }
  

}
