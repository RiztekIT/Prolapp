import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { RedhgfacturacionService } from '../../../../services/redholding/redhgfacturacion.service';
import { RedhgaddeditclientesComponent } from '../redhgaddeditclientes/redhgaddeditclientes.component';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Red Holding", "titulo": 'Cliente'}
]

@Component({
  selector: 'app-redhgclientes',
  templateUrl: './redhgclientes.component.html',
  styleUrls: ['./redhgclientes.component.css']
})
export class RedhgclientesComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'ClaveCliente', 'Nombre', 'RFC', 'RazonSocial' ,'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  usuariosesion;

  constructor(
    public redhgSVC: RedhgfacturacionService,
    private dialog: MatDialog, 
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    private ConnectionHubService: ConnectionHubServiceService,
  ) { }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.refreshClientesList();
    //this.listaempresas();
    //^ **** PRIVILEGIOS POR USUARIO *****
    //this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }

  onAdd(movimiento?){
    this.redhgSVC.formDataClientes = new Cliente();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    let dl = this.dialog.open(RedhgaddeditclientesComponent, dialogConfig);

    dl.afterClosed().toPromise().then(resp=>{
      this.refreshClientesList();
    })


  }
  onEdit(cliente: Cliente,movimiento?){
    // console.log(usuario);
    this.redhgSVC.formDataClientes = cliente;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        dialogConfig.data = {
          movimiento: movimiento
        }
        let dl = this.dialog.open(RedhgaddeditclientesComponent, dialogConfig);

        dl.afterClosed().toPromise().then(resp=>{
          this.refreshClientesList();
        })
      }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }

  onDelete( id:number, movimiento?){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar el Cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let consulta = ' Delete from redhgCliente where IdClientes = '+id
        /*  deleteCliente(id)*/
        this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
        this.movimiento(movimiento)
        this.ConnectionHubService.on(origen[0]);
          this.refreshClientesList();
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

  refreshClientesList() {

    let consulta ='select *  from redhgCliente order by Nombre'
/* getClientesContactoList() */
    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) => {
      // console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
    console.log(this.listData);

// if(this.displaytt){

//   this.myOptions={
//     'placement': 'left',
//     'theme': 'dark',
//     'display':true,
//   }

// }else {


  
    });

 
 
 
//   for (let i = 0; i < nodes.length; i++) {
//     console.log(nodes[i].classList[3]);
   
//       this.myOptions={
//        'placement': 'left',
//        'theme': 'dark',
//        'display':true,
//    }
//  }

  }

}
