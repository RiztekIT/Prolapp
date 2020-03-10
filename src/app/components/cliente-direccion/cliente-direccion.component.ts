import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteDireccionService } from '../../services/cliente-direccion/cliente-direccion.service';
import { ClienteDireccion } from '../../Models/cliente-direccion/clienteDireccion-model';
@Component({
  selector: 'app-cliente-direccion',
  templateUrl: './cliente-direccion.component.html',
  styleUrls: ['./cliente-direccion.component.css']
})
export class ClienteDireccionComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado','NumeroInterior', 'NumeroExterior', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public service: ClienteDireccionService, public dialogbox: MatDialogRef<ClienteDireccionComponent>,) { 

    this.service.listen().subscribe((m:any)=>{
      this.refreshDireccionesList();
      });
      
  }

  ngOnInit() {
    this.Inicializar();
    this.refreshDireccionesList();
    this.agregarDireccion = true;
  }

  //Variables
  NombreCliente: string;
  IdCliente: number;

  //Variable para verificar si se actualizara o agregara una Direccion
  agregarDireccion: boolean;

  //Metodo para obtener los datos y llenarlos en la tabla
  refreshDireccionesList() {
    this.service.formData = new ClienteDireccion();
    this.service.getDireccionIdCliente(this.service.IdCliente).subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Direcciones por Pagina';
    });
  }

  //Cerrar Modal y hacerle update a los campos
  onClose() {
    this.dialogbox.close();
    this.service.filter('');
  }

  //Inicializar Valores
  Inicializar(){
    this.IdCliente = this.service.IdCliente
    console.log(this.IdCliente);
    this.GetCliente(this.IdCliente);
        // this.JoinClienteDireccion();
  }

  //Obtener Datos del Cliente en base a ID Cliente
  GetCliente(id : number){
    this.service.getObtenerClienteID(id).subscribe( data =>{
// console.log(data);
this.NombreCliente = data[0].Nombre;
    });
  }

  //Join Cliente con Direccion Cliente
// JoinClienteDireccion(){
//   console.log(this.IdCliente);
//   this.service.getJoinDireccionCliente(this.IdCliente).subscribe(data=>{
//     console.log(data);
//     if(data.length > 0){
//     this.NombreCliente = data[0].Nombre;
//     }
//   });
// }

//Agregar Nueva Direccion
  AgregarDireccionCliente(form: NgForm){
    console.log(form);
    console.log(this.service.IdCliente); 
    this.service.formData.IdCliente = this.IdCliente; 
    console.log(this.service.formData);
this.service.addClienteDireccion(this.service.formData).subscribe(res =>{
console.log(res);
Swal.fire({
  icon: 'success',
  title: 'Direccion Agregada',
  timer: 1500,
  showCancelButton: false,
  showConfirmButton: false
})
form.resetForm();
this.refreshDireccionesList();
})
// this.Inicializar();
  }

//Editar Direccion
  EditarDireccionCliente(dc: ClienteDireccion){
    this.agregarDireccion = false;
console.log(dc);
this.service.formData = dc;
  }

  //Limpiar campos
  LimpiarCampos(form: NgForm){
form.resetForm();
console.log(this.service.formData);
  }

  //Cancelar Operacion 
  Cancelar(form: NgForm){
    this.agregarDireccion = true;
form.resetForm();
this.refreshDireccionesList();
  }

  //Actualizar direccion cliente
  ActualizarDireccion(form: NgForm){
    this.service.formData.IdCliente = this.IdCliente; 
    this.service.updateClienteDireccion(this.service.formData).subscribe(res =>{
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Direccion Actualizada',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      })
      this.agregarDireccion = true;
      form.resetForm();
      this.refreshDireccionesList();
      });
  }

//Eliminar Direccion
  EliminarDireccionCliente(id: number){
console.log(id);

Swal.fire({
  title: '¿Segur@ de Borrar Direccion?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Borrar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.value) {
    this.service.deleteClienteDireccion(id).subscribe( res=>{
      this.refreshDireccionesList();

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

}
