import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteDireccionService } from '../../services/cliente-direccion/cliente-direccion.service';
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
  }

  //Variables
  NombreCliente: string;
  IdCliente: number;

  //Metodo para obtener los datos y llenarlos en la tabla
  refreshProveedoresList() {
    this.service.getDireccionIdCliente(this.service.IdCliente).subscribe(data => {
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
  AgregarDireccionCliente(){

  }
//Editar Direccion
  EditarDireccionCliente(){

  }
//Eliminar Direccion
  EliminarDireccionCliente(){

  }
}
