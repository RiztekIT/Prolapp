import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Usuario } from '../../../../../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddUsuarioComponent } from '../add-usuario/add-usuario.component';
import { EditUsuarioComponent } from '../edit-usuario/edit-usuario.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-usuario',
  templateUrl: './show-usuario.component.html',
  styleUrls: ['./show-usuario.component.css'],
})
export class ShowUsuarioComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'Usuario', 'ApellidoPaterno', 'ApellidoMaterno', 'Correo', 'Telefono', 'Contraseña', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Usuarios por Pagina';
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar Usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteUsuario(id).subscribe(res => {
          this.refreshUsuariosList();
    
          Swal.fire(
            'Borrado',
            'El Usuario ha sido borrado Correctamente',
            'success'
          )
          });
      }
    })


    // if ( confirm('Are you sure to delete?')) {
    //   this.service.deleteUsuario(id).subscribe(res => {
    //   this.refreshUsuariosList();
    //   this.snackBar.open(res.toString(), '', {
    //     duration: 3000,
    //     verticalPosition: 'top'
    //   });

    //   });
    // }

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
