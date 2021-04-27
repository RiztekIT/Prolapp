import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { FleterasService } from '../../../services/trafico/Fleteras/fleteras.service';
import { Fleteras } from '../../../Models/trafico/fleteras-model';
import { AddEditFleterasComponent } from './add-edit-fleteras/add-edit-fleteras.component';
import { EventosService } from 'src/app/services/eventos/eventos.service';

@Component({
  selector: 'app-fleteras-trafico',
  templateUrl: './fleteras-trafico.component.html',
  styleUrls: ['./fleteras-trafico.component.css']
})
export class FleterasTraficoComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'Direccion', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private FleterasService: FleterasService,
    private dialog: MatDialog,
    private eventosService:EventosService,) { }

  ngOnInit() {
    this.refreshTablaFleteras();
  }

  refreshTablaFleteras(){
    
    console.log('entro');
    this.FleterasService.getFleterasList().subscribe(data=>{
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Fleteras por Pagina';
    console.log(this.listData);
    })
  }

  
  onAdd(movimiento?){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento,
      tipo: 'Agregar'
    }
    
    this.eventosService.movimientos('Agregar Fletera')
    let dlg =this.dialog.open(AddEditFleterasComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp=>{
      this.refreshTablaFleteras();
    })

  }

  onEdit(fletera: Fleteras,movimiento?){
// console.log(usuario);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento,
      data: fletera,
      tipo: 'Editar'
    }
    
    this.eventosService.movimientos('Editar Fletera')
    let dlg = this.dialog.open(AddEditFleterasComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp=>{
      this.refreshTablaFleteras();
    })
  }

  onDelete(row:Fleteras){
    let id = row.IdFletera
    this.FleterasService.deletefleteras(id).subscribe(res =>{
         
      console.log('%c%s', 'color: #006dcc', res);
      
      this.eventosService.movimientos('Fletera Borrada')
      this.refreshTablaFleteras();
    })
      }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }


}
