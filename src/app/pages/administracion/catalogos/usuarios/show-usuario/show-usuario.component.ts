import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort} from '@angular/material';
import { Usuario } from '../../../../../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddUsuarioComponent } from '../add-usuario/add-usuario.component';
import { EditUsuarioComponent } from '../edit-usuario/edit-usuario.component';

@Component({
  selector: 'app-show-usuario',
  templateUrl: './show-usuario.component.html',
  styleUrls: ['./show-usuario.component.css'],
})
export class ShowUsuarioComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['IdUsuario', 'Nombre', 'Usuario', 'ApellidoPaterno', 'ApellidoMaterno', 'Correo', 'Telefono', 'Contraseña', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;

  constructor(private service:UsuariosServieService, private dialog: MatDialog, private snackBar: MatSnackBar) {

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
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
    //console.log(id);
    if ( confirm('Are you sure to delete?')) {
      this.service.deleteUsuario(id).subscribe(res => {
      this.refreshUsuariosList();
      this.snackBar.open(res.toString(), '', {
        duration: 3000,
        verticalPosition: 'top'
      });

      });
    }

  }

  onAdd(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(AddUsuarioComponent, dialogConfig);

  }

  onEdit(usuario: Usuario){
// console.log(usuario);
this.service.formData = usuario;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EditUsuarioComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
