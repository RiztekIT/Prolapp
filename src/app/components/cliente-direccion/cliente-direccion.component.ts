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
      // console.log(m);
      this.refreshProveedoresList();
      });
  }

  ngOnInit() {
    this.Inicializar();
    this.refreshProveedoresList();
    this.agregarDireccion = true;
  }

  //Variables
  NombreCliente: string;
  IdCliente: number;

  //Variable para verificar si se actualizara o agregara una Direccion
  agregarDireccion: boolean;

  //Metodo para obtener los datos y llenarlos en la tabla
  refreshProveedoresList() {
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
    this.JoinClienteDireccion();
  }

  //Join Cliente con Direccion Cliente
JoinClienteDireccion(){
  console.log(this.IdCliente);
  this.service.getJoinDireccionCliente(this.IdCliente).subscribe(data=>{
    console.log(data);
    if(data.length > 0){
    this.NombreCliente = data[0].Nombre;
    }
  });
}

//Agregar Nueva Direccion
  AgregarDireccionCliente(form: NgForm){
    console.log(form);
console.log(this.service.formData);
form.resetForm();
  }
//Editar Direccion
  EditarDireccionCliente(dc: ClienteDireccion){
    this.agregarDireccion = false;
console.log(dc);
this.service.formData = dc;
  }
  //Actualizar direccion cliente
  ActualizarDireccion(){
this.agregarDireccion = false;
  }
//Eliminar Direccion
  EliminarDireccionCliente(id: number){
console.log(id);
  }

}
