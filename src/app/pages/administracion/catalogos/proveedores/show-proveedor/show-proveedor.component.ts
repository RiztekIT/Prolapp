import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Proveedor } from '../../../../../Models/catalogos/proveedores-model';
import { ProveedoresService } from '../../../../../services/catalogos/proveedores.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddProveedorComponent } from '../add-proveedor/add-proveedor.component';
import { EditProveedorComponent } from '../edit-proveedor/edit-proveedor.component';

import Swal from 'sweetalert2';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';


@Component({
  selector: 'app-show-proveedor',
  templateUrl: './show-proveedor.component.html',
  styleUrls: ['./show-proveedor.component.css']
})
export class ShowProveedorComponent implements OnInit {
  usuariosesion
  listData: MatTableDataSource<any>;
  // displayedColumns : string [] = [ 'Nombre', 'RFC', 'RazonSocial', 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado', 'NumeroExterior', 'ClaveProveedor', 'Estatus', 'Options'];
  displayedColumns : string [] = [ 'Nombre', 'RFC', 'RazonSocial','Tipo', 'Contacto','Correo', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:ProveedoresService, 
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,) {

    this.service.listen().subscribe((m:any)=>{
      // console.log(m);
      this.refreshProveedoresList();
      });

   }

  ngOnInit() {
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    
    this.refreshProveedoresList();
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
       case ('Agregar Proveedores'):
         this.Agregar = true;
         break;
       case ('Editar Proveedores'):
         this.Editar = true;
         break;
       case ('Borrar Proveedores'):
         this.Borrar = true;
         break;
       default:
         break;
     }
   }
   //^ **** PRIVILEGIOS POR USUARIO *****

  refreshProveedoresList() {

    this.service.getProveedoresList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Proveedores por Pagina';
    console.log(this.listData);
    });

  }

  onDelete( id:number, movimiento?){

    Swal.fire({
      title: '¿Seguro de Borrar Proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteProveedor(id).subscribe(res => {
          this.refreshProveedoresList();
    this.movimiento(movimiento)
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
  }

  movimiento(movimiento){
    // let event = new Array<Evento>();
    let u = this.usuariosesion.user
    let fecha = new Date();
    
    let evento = new Evento();
    this.usuarioService.getUsuarioNombreU(u).subscribe(res => {
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
    this.dialog.open(AddProveedorComponent, dialogConfig);

  }

  onEdit(proveedor,movimiento?){
// console.log(usuario);
this.service.formData = proveedor;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento,
      tipo: proveedor.tipo
    }
    this.dialog.open(EditProveedorComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

}
