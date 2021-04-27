import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import {MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { Fleteras } from 'src/app/Models/trafico/fleteras-model';
import { FleterasService } from '../../../../services/trafico/Fleteras/fleteras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-fleteras',
  templateUrl: './add-edit-fleteras.component.html',
  styleUrls: ['./add-edit-fleteras.component.css']
})
export class AddEditFleterasComponent implements OnInit {

  titulo: string
  tipo: string

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'Nombre', 'Telefono', 'Celular','Correo', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  nombreContacto;
  telefonoContacto;
  celularContacto;
  correoContacto;
  idContacto;

  editar = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public FleterasService:FleterasService,
    public dialogbox: MatDialogRef<AddEditFleterasComponent>,
    ) { }
    
    ngOnInit() {
    this.AsignarDatos()
    
  }
  
  AsignarDatos(){
    
    this.titulo = this.data.movimiento
    this.tipo = this.data.tipo
    if (this.tipo == 'Editar') {
      this.FleterasService.dataFleteras = this.data.data
      this.obtenerContacto();
    }
  }

  obtenerContacto(){
    console.log(this.FleterasService.dataFleteras,'DATOS FLETERA');
    let query = 'select * from FleterasDatos where idFletera='+this.FleterasService.dataFleteras.IdFletera
    let consulta = {
      'consulta': query
    };
    this.FleterasService.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta,'DATOS CONTACTO');
      this.listData = new MatTableDataSource(detallesConsulta);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Contactos por Pagina';

    })

  }

  onAddContacto(){

    let query = "insert into FleterasDatos values("+this.FleterasService.dataFleteras.IdFletera+",'"+this.nombreContacto+"','"+this.telefonoContacto+"','"+this.celularContacto+"','"+this.correoContacto+"');"
    let consulta = {
      'consulta': query
    };
    this.FleterasService.getQuery(consulta).subscribe((detallesConsulta: any) => {
      console.log(detallesConsulta,'DATOS CONTACTO');
      Swal.fire({
        title: 'Contacto Guardado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      this.nombreContacto = '';
      this.telefonoContacto = '';
      this.celularContacto = '';
      this.correoContacto = '';
      this.obtenerContacto();

    })

  }

  onEditContacto(row){
    console.log(row);
    this.nombreContacto = row.nombreContacto;
    this.telefonoContacto = row.telefonoContacto;
    this.celularContacto = row.celularContacto;
    this.correoContacto = row.correoContacto;
    this.idContacto = row.idDatosFleteras;
    this.editar = true;



  }

  cancelarEditContacto(){
    this.editar = false;
    this.nombreContacto = '';
    this.telefonoContacto = '';
    this.celularContacto = '';
    this.correoContacto = '';

  }

  editContacto(){


    let query = "update FleterasDatos set nombreContacto='"+this.nombreContacto+"', telefonoContacto='"+this.telefonoContacto+"', celularContacto='"+this.celularContacto+"', correoContacto='"+this.correoContacto+"' where idDatosFleteras="+this.idContacto
    let consulta = {
      'consulta': query
    };
    this.FleterasService.getQuery(consulta).subscribe((detallesConsulta: any) => {
      Swal.fire({
        title: 'Contacto Editado',
        icon: 'success',
        timer: 1000,
        showCancelButton: false,
        showConfirmButton: false
      });
      this.editar = false;
      this.nombreContacto = '';
      this.telefonoContacto = '';
      this.celularContacto = '';
      this.correoContacto = '';
      this.obtenerContacto();


    })




  }

  onDeleteContacto(row){

    Swal.fire({
      title: '¿Seguro de Borrar Contacto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {


        let query = "delete from FleterasDatos where idDatosFleteras="+row.idDatosFleteras
        let consulta = {
          'consulta': query
        };
        this.FleterasService.getQuery(consulta).subscribe((detallesConsulta: any) => {
          Swal.fire({
            title: 'Contacto Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
        
          this.obtenerContacto();
    
    
        })


      }
    })



  }
  
  onClose() {
    this.dialogbox.close();
  }
  
  AddEditFletera(){
    let data = this.FleterasService.dataFleteras
    console.log('%c⧭', 'color: #00ff00', data);
    if (this.tipo == 'Agregar') {
      
      this.FleterasService.addfleteras(data).subscribe(res => {
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()
      })
    } else {
      this.FleterasService.updatefleteras(data).subscribe(res => {
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()

      })
      
    }
  }



}
