import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Usuario } from '../../../../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../../../../services/catalogos/usuarios-servie.service';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { ShowUsuarioPrivilegioComponent } from '../show-usuario-privilegio/show-usuario-privilegio.component';



@Component({
  selector: 'app-show-usuario-permiso',
  templateUrl: './show-usuario-permiso.component.html',
  styleUrls: ['./show-usuario-permiso.component.css']
})
export class ShowUsuarioPermisoComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'IdUsuario', 'Nombre', 'Nombre Usuario', 'Correo', 'Telefono', 'Opciones'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private service:UsuariosServieService, private dialog: MatDialog) { 

  this.service.listen().subscribe((m:any)=>{
    console.log(m);
    this.refreshUsuariosList();
    });
  }
  ngOnInit() {
    this.refreshUsuariosList();
  }

  refreshUsuariosList() {

    this.service.getUsuariosList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Usuarios por Pagina';
    //console.log(this.listData);
    });
  }

  showAreaPrivilegio(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ShowUsuarioPrivilegioComponent, dialogConfig);

  }

    applyFilter(filtervalue: string){  
      this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }

}
