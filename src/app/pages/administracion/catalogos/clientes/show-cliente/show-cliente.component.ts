import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Cliente } from '../../../../../Models/catalogos/clientes-model';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddClienteComponent } from '../add-cliente/add-cliente.component';
import { EditClienteComponent } from '../edit-cliente/edit-cliente.component';
import Swal from 'sweetalert2';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';


@Component({
  selector: 'app-show-cliente',
  templateUrl: './show-cliente.component.html',
  styleUrls: ['./show-cliente.component.css']
})
export class ShowClienteComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'ClaveProveedor', 'Nombre', 'RFC', 'RazonSocial', 'Calle', 'Colonia', 'CP', 'Ciudad', 'Estado',  'NumeroExterior','Estatus', 'LimiteDeCredito', 'DiasDeCredito', 'Vendedor', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private service:ClientesService, private dialog: MatDialog, private snackBar: MatSnackBar, public apicliente: EnviarfacturaService) {

    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshClientesList();
      });

   }

  ngOnInit() {
    this.refreshClientesList();
  }

  refreshClientesList() {

    this.service.getClientesList().subscribe(data => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
    //console.log(this.listData);
    });

  }

  onDelete( id:number){
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

  onAdd(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
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

  onEdit(cliente: Cliente){
// console.log(usuario);
this.service.formData = cliente;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(EditClienteComponent, dialogConfig);
  }

  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }
}
