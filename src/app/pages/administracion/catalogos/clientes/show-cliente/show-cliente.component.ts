import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatSort, MatPaginator, MatTooltip } from '@angular/material';
import { Cliente } from '../../../../../Models/catalogos/clientes-model';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddClienteComponent } from '../add-cliente/add-cliente.component';
import { EditClienteComponent } from '../edit-cliente/edit-cliente.component';
import Swal from 'sweetalert2';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { ClienteDireccionComponent } from '../../../../../components/cliente-direccion/cliente-direccion.component';
import { ClienteDireccionService } from '../../../../../services/cliente-direccion/cliente-direccion.service';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';

//Registro de eventos
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from '../../../../../Models/eventos/evento-model';

@Component({
  selector: 'app-show-cliente',
  templateUrl: './show-cliente.component.html',
  styleUrls: ['./show-cliente.component.css']
})
export class ShowClienteComponent implements OnInit, OnDestroy {
  
  usuariosesion;
  listData: MatTableDataSource<any>;
  displaytt: any;
  myOptions: any;
  listEmpresa;
  //displayedColumns : string [] = [ 'ClaveCliente', 'Nombre', 'RFC', 'RazonSocial', 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado',  'NumeroExterior','Estatus', 'LimiteDeCredito', 'DiasDeCredito', 'Vendedor', 'Options'];
  displayedColumns : string [] = [ 'ClaveCliente', 'Nombre', 'RFC', 'RazonSocial', 'Contacto', 'Telefono', 'Correo' ,'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:ClientesService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    public apicliente: EnviarfacturaService,
    public serviceDireccion: ClienteDireccionService, 
    public serviceEmpresa: EmpresaService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshClientesList();
      });

   }
   

  ngOnInit() {
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    this.refreshClientesList();
    this.listaempresas();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }


  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Administracion';
  area = 'Catalogos';

  //^ VARIABLES DE PERMISOS
  Agregar: boolean = false;
  AgregarDireccion: boolean = false;
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
      case ('Agregar Clientes'):
        this.Agregar = true;
        break;
      case ('Agregar Direccion Cliente'):
        this.AgregarDireccion = true;
        break;
      case ('Editar Clientes'):
        this.Editar = true;
        break;
      case ('Borrar Clientes'):
        this.Borrar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****

  estatusCambio(event){
    
  }

  refreshClientesList() {

    this.service.getClientesContactoList().subscribe(data => {
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

  listaempresas(){
    this.serviceEmpresa.getEmpresaList().subscribe(data =>{
      console.log(data);
      this.listEmpresa = data;
      console.log(this.apicliente.empresa);
      this.apicliente.empresa = data[0];
      // this.enviarfact.rfc = data[0].RFC;
    })
  }

  rfc(){
    this.apicliente.saberRFC();
  }

  onDelete( id:number, movimiento?){
    //console.log(id);
    Swal.fire({
      title: '¿Seguro de Borrar el Cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.deleteCliente(id).subscribe(res => {
        this.movimiento(movimiento)
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

  //Abrir Modal para agregar Direccion(es) a cierto cliente
  onAddDireccionCliente(idCliente: number){
    this.serviceDireccion.IdCliente = idCliente;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ClienteDireccionComponent, dialogConfig);
  }

  onAdd(movimiento?){
    this.service.formData = new Cliente();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(AddClienteComponent, dialogConfig);


  }

  crearapi(){
    let email;
    let rfc;
    let razon;
    let codpos;
    let datos;
    this.service.getClientesList().subscribe(data => {

      for (let i =0; i < data.length; i++){
        email = 'riztekti@gmail.com';
        rfc = data[i].RFC;
        razon = data[i].RazonSocial;
        codpos = data[i].CP;
        datos = {
          "email" : email,
          "razons" : razon,
          "rfc" : rfc,
          "codpos" : codpos
        }

        datos = JSON.stringify(datos);
    this.apicliente.crearCliente(datos).subscribe(data =>{
        
      if (data.status==='success'){
        
        console.log('success');
        console.log(data);
      }
      else{
        console.log('error');
        console.log(data);
        
      }


        
      }

      
    //console.log(this.listData);
    );




    

  }
})
  }

  onEdit(cliente: Cliente,movimiento?){
// console.log(usuario);
this.service.formData = cliente;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    dialogConfig.data = {
      movimiento: movimiento
    }
    this.dialog.open(EditClienteComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }


  
}
