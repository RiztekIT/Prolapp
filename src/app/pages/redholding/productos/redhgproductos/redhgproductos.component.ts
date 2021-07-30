import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Producto, redhgProducto } from 'src/app/Models/catalogos/productos-model';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';
import { RedhgfacturacionService } from '../../../../services/redholding/redhgfacturacion.service';
import { RedhgaddeditproductosComponent } from '../redhgaddeditproductos/redhgaddeditproductos.component';
import Swal from 'sweetalert2';
import { Evento } from 'src/app/Models/eventos/evento-model';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Producto'}
]

@Component({
  selector: 'app-redhgproductos',
  templateUrl: './redhgproductos.component.html',
  styleUrls: ['./redhgproductos.component.css']
})
export class RedhgproductosComponent implements OnInit {

  usuariosesion
  listDataProductos: MatTableDataSource<any>;
  // displayedColumns : string [] = [ 'Nombre', 'PrecioVenta', 'PrecioCosto', 'Cantidad', 'Options'];
  displayedColumns : string [] = [ 'Nombre',  'Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('pag1', {static: true}) paginator: MatPaginator;

  constructor(
    public redhgSVC: RedhgfacturacionService,
    private dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    private ConnectionHubService: ConnectionHubServiceService,
  ) { }

  ngOnInit() {

    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.refreshProductosList();
    //^ **** PRIVILEGIOS POR USUARIO *****
    
  }

  onAdd(movimiento?){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(RedhgaddeditproductosComponent, dialogConfig);

  }

  onEdit(producto: redhgProducto,movimiento?){
    // // console.log(usuario);
        this.redhgSVC.formDataProductos = producto;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        dialogConfig.data = {
          movimiento: movimiento
        }
        this.dialog.open(RedhgaddeditproductosComponent, dialogConfig);
      }

  applyFilter(filtervalue: string){  
    this.listDataProductos.filter= filtervalue.trim().toLocaleLowerCase();

  }

  onDelete( id:number, movimiento?){
    //// console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar Producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let consulta = 'delete from redhgProducto where IdProducto = '+id
        /* deleteProducto(id) */
        this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
          
          this.ConnectionHubService.on(origen[0]);
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

  refreshProductosList() {

    let consulta = "select * from redhgProducto where Estatus='Activo'"

    /* getProductosList() */

    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
      this.listDataProductos = new MatTableDataSource(data);
      //// console.log(this.listData);
      this.listDataProductos.sort = this.sort;
      this.listDataProductos.paginator = this.paginator;
      this.listDataProductos.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
      console.log('%c⧭', 'color: #ffaa00', this.listDataProductos);
    });

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
    
    // console.log(evento);
    this.eventosService.addEvento(evento).subscribe(respuesta =>{
      // console.log(respuesta);
    })
    })
  }

}
