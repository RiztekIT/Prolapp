import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Usuario } from '../../../../../Models/catalogos/usuarios-model';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddUsuarioComponent } from '../add-usuario/add-usuario.component';
import { EditUsuarioComponent } from '../edit-usuario/edit-usuario.component';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-usuario',
  templateUrl: './show-usuario.component.html',
  styleUrls: ['./show-usuario.component.css'],
})
export class ShowUsuarioComponent implements OnInit {
  
  usuariosesion
  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'Usuario', 'ApellidoPaterno', 'ApellidoMaterno', 'Correo', 'Telefono', 'Contraseña', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:UsuariosServieService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private eventosService: EventosService,) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshUsuariosList();
      });

   }

  ngOnInit() {
    
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.refreshUsuariosList();
 
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }


  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Administracion';
  area = 'Catalogos';

  //^ VARIABLES DE PERMISOS
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
      case ('Agregar Usuarios'):
        this.Agregar = true;
        break;
      case ('Editar Usuarios'):
        this.Editar = true;
        break;
      case ('Borrar Usuarios'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  refreshUsuariosList() {

    this.service.getUsuariosList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Usuarios por Pagina';
    //console.log(this.listData);
    });

  }

  onDelete( id:number, movimiento?){
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
          
        this.movimiento(movimiento)
          this.refreshUsuariosList();
    
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
        });
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
        
      movimiento(movimiento){
        // let event = new Array<Evento>();
        let u = this.usuariosesion.user
        let fecha = new Date();
        
        let evento = new Evento();
        this.service.getUsuarioNombreU(u).subscribe(res => {
        let idU=res[0].IdUsuario
    
        evento.IdUsuario = idU
        evento.Autorizacion = '0'
        evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
        evento.Movimiento = movimiento
        
        console.log(evento);
        this.eventosService.addEvento(evento).subscribe(respuesta =>{
          console.log(respuesta);
        })
        })
      }

  onAdd(movimiento?){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(AddUsuarioComponent, dialogConfig);

  }

  onEdit(usuario: Usuario,movimiento?){
// console.log(usuario);
this.service.formData = usuario;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(EditUsuarioComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
