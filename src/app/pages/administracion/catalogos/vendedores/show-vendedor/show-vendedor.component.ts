import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddVendedorComponent } from '../add-vendedor/add-vendedor.component';
import { EditVendedorComponent } from '../edit-vendedor/edit-vendedor.component';
import Swal from 'sweetalert2';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { Vendedor } from '../../../../../Models/catalogos/vendedores.model';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';


@Component({
  selector: 'app-show-vendedor',
  templateUrl: './show-vendedor.component.html',
  styleUrls: ['./show-vendedor.component.css']
})
export class ShowVendedorComponent implements OnInit {


  usuariosesion
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['IdVendedor', 'Nombre', 'Options'];

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service: ClientesService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,) { 

    this.service.listen().subscribe((m:any)=>{
      this.refreshVendedorList();
    });
  }

  ngOnInit() {
    
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.refreshVendedorList();
  }

  refreshVendedorList() {

    this.service.getVendedoresList().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Vendedores por Pagina';
    //console.log(this.listData);
    });

  }


  onDelete( id:number, movimiento?){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar el Vendedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteVendedor(id).subscribe(res => {
          this.movimiento(movimiento)
          this.refreshVendedorList();
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
    this.dialog.open(AddVendedorComponent, dialogConfig);

  }

  onEdit(vendedor: Vendedor, movimiento?){
    // console.log(usuario);
    this.service.formDataV = vendedor;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        dialogConfig.data = {
          movimiento: movimiento
        }
        this.dialog.open(EditVendedorComponent, dialogConfig);
      }
    
      applyFilter(filtervalue: string){  
        this.listData.filter= filtervalue.trim().toLocaleLowerCase();
    
      }



}
