import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Producto } from '../../../../../Models/catalogos/productos-model';
import { ProductosService } from '../../../../../services/catalogos/productos.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddProductoComponent } from '../add-producto/add-producto.component';
import { EditProductoComponent } from '../edit-producto/edit-producto.component';

import Swal from 'sweetalert2';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';
import { MarcasProductos } from '../../../../../Models/catalogos/marcasproductos-model';
import { MarcasComponent } from '../marcas/marcas.component';


@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css']
})
export class ShowProductoComponent implements OnInit {

  usuariosesion
  listData: MatTableDataSource<any>;
  // displayedColumns : string [] = [ 'Nombre', 'PrecioVenta', 'PrecioCosto', 'Cantidad', 'Options'];
  displayedColumns : string [] = [ 'Nombre',  'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  // Marcas
  listDataMarcas: MatTableDataSource<any>;
  displayedColumnsMarcas : string [] = [ 'Clave','Nombre','Producto' , 'Options'];
  @ViewChild(MatSort, null) sortM: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorM: MatPaginator;


  constructor(private service:ProductosService, 
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshProductosList();
      });

   }

  ngOnInit() {
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    
    this.refreshProductosList();
    this.refreshMarcasList();
  }

  refreshProductosList() {

    this.service.getProductosList().subscribe(data => {
      this.listData = new MatTableDataSource(data);
      //console.log(this.listData);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
    });

  }

  refreshMarcasList() {

    this.service.GetMarcasProductos().subscribe(marcasres => {
      console.log('%c⧭', 'color: #d90000', marcasres);
      this.listDataMarcas = new MatTableDataSource(marcasres);
      //console.log(this.listData);
      this.listDataMarcas.sort = this.sortM;
      this.listDataMarcas.paginator = this.paginatorM;
      this.listDataMarcas.paginator._intl.itemsPerPageLabel = 'Marcas por Pagina';
      console.log('%c⧭', 'color: #ffaa00', this.listDataMarcas);
    });

  }

  onDelete( id:number, movimiento?){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar Producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteProducto(id).subscribe(res => {
          this.refreshProductosList();
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
    // if ( confirm('Are you sure to delete?')) {
    //   this.service.deleteProducto(id).subscribe(res => {
    //   this.refreshProductosList();
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
    this.dialog.open(AddProductoComponent, dialogConfig);

  }

  onEdit(producto: Producto,movimiento?){
// console.log(usuario);
    this.service.formData = producto;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(EditProductoComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }


  onAddMarcas(movimiento?){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento,
      tipo: 'Agregar'
    }
    let dlg =this.dialog.open(MarcasComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp=>{
      this.refreshMarcasList();
    })

  }

  onEditMarcas(marcas: MarcasProductos,movimiento?){
    // console.log(usuario);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        dialogConfig.data = {
          movimiento: movimiento,
          data: marcas,
          tipo: 'Editar'
        }
        let dlg = this.dialog.open(MarcasComponent, dialogConfig);
        dlg.afterClosed().subscribe(resp=>{
          this.refreshMarcasList();
        })
      }
    
      onDeleteMarcas(row:MarcasProductos){
        let id = row.IdMarca
        this.service.deleteMarcasProductos(id).subscribe(res =>{
        
          console.log('%c%s', 'color: #006dcc', res);
          this.refreshMarcasList();
        })
          }

}
