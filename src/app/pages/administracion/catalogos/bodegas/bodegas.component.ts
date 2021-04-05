import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { BodegasService } from '../../../../services/catalogos/bodegas.service';
import { AEBodegaComponent } from './aebodega/aebodega.component';
import { UsuariosServieService } from '../../../../services/catalogos/usuarios-servie.service';
import { DatePipe } from '@angular/common';
import { EventosService } from '../../../../services/eventos/eventos.service';
import { Evento } from '../../../../Models/eventos/evento-model';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.css']
})
export class BodegasComponent implements OnInit {
  usuariosesion;

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdBodega', 'Nombre', 'Direccion', 'Origen', 'Options'];

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dialog: MatDialog, 
    private Bodegaservice: BodegasService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,

    ) {

      this.Bodegaservice.listen().subscribe((m:any)=>{
        this.BodegasList();
      });

     }

  ngOnInit() {
    console.log('oninitbodega');
    this.BodegasList();
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));

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
      case ('Agregar Bodegas'):
        this.Agregar = true;
        break;
      case ('Editar Bodegas'):
        this.Editar = true;
        break;
      case ('Borrar Bodegas'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  BodegasList() {
    this.Bodegaservice.getBodegasList().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Vendedores por Pagina';
    //console.log(this.listData);
    });

  }

  
  AEBodega(tipo, datos?,movimiento?){
console.log(tipo);



    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    if (tipo == 'Editar') {
      console.log('entro editar');
      dialogConfig.data = {
        tipo: tipo,
        data: datos,
        movimiento: movimiento
      }
    }
    if (tipo == 'Agregar') {
      console.log('entro Agregar');
      dialogConfig.data = {
        tipo: tipo,
        movimiento: movimiento
      }
    }
    this.dialog.open(AEBodegaComponent, dialogConfig);
  }

      
      onDelete( id:number, movimiento?){
        //console.log(id);
        Swal.fire({
          title: '¿Seguro de Borrar esta Bodega?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
          confirmButtonText: 'Borrar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.Bodegaservice.deleteBodega(id).subscribe(res => {
              this.BodegasList();
              Swal.fire({
                title: 'Borrado',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            });
            // Guardar movimiento en DB
            this.movimiento(movimiento)
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






      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    
      }

    }
    