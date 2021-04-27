import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { NgForm, FormControl } from '@angular/forms';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';

import { map, startWith } from 'rxjs/operators';

import { Vendedor } from '../../../../../Models/catalogos/vendedores.model';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

//evento
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA } from "@angular/material";
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { DatePipe } from '@angular/common';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Cliente'}
]

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})

export class EditClienteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditClienteComponent>,
    public service: ClientesService, private snackBar: MatSnackBar, 
    public apicliente: EnviarfacturaService, 
    private _formBuilder: FormBuilder,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService,
	) { }

  ngOnInit() {
    
    this.ConnectionHubService.ConnectionHub(origen[0]);
  this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
  this.BodegaInfo = this.data;
  this.movimiento = this.BodegaInfo.movimiento
    this.dropdownRefresh();
    this.EstatusCliente()
  }
  estatuscliente;
  BodegaInfo
  movimiento
  usuariosesion
  listVendedores: Vendedor[] = [];
  options: Vendedor[] = [];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();

  private _filter(value: any): any[] {
    console.log(value);
     const filterValue = value.toString().toLowerCase();
     return this.options.filter(option =>
       option.Nombre.toLowerCase().includes(filterValue) ||
       option.IdVendedor.toString().includes(filterValue));
  }

  EstatusCliente(){

    if (this.service.formData.Estatus=='Activo'){
      this.estatuscliente = true

    }else if (this.service.formData.Estatus=='Inactivo'){
      this.estatuscliente = false
    }

  }
  changeEstatus(event){
    console.log(event);
    if (event.checked){
      this.service.formData.Estatus='Activo'
      
    }else{
      this.service.formData.Estatus='Inactivo'

    }
    
  }

  dropdownRefresh(){
    this.service.getVendedoresList().subscribe(data =>{
      for (let i = 0; i < data.length; i++){
        let vendedor = data[i];
        this.listVendedores.push(vendedor);
        this.options.push(vendedor)
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
  }

  onSelectionChange(options:Vendedor, event: any){
    if(event.isUserInput){
      this.service.formDataV.IdVendedor = options.IdVendedor;
      this.service.formDataV.Nombre = options.Nombre;
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {

    
    let email;
    let rfc;
    let razon;
    let codpos;
    let datos;


      email = 'riztekti@gmail.com';
      rfc = this.service.formData.RFC;
      razon = this.service.formData.RazonSocial;
      codpos = this.service.formData.CP;
      datos = {
        "email" : email,
        "razons" : razon,
        "rfc" : rfc,
        "codpos" : codpos
      }
      datos = JSON.stringify(datos);
   /*    this.apicliente.actualizarCliente(datos,this.service.formData.IdApi).subscribe(data =>{
        if (data.status==='success'){
          console.log(data);
          this.apicliente.actualizarCliente2(datos,this.service.formData.IdApi).subscribe(data =>{
            if (data.status==='success'){
              console.log(data);
            }
            else{
              console.log(data);
              
            }
          })
        }
        else{
          console.log(data);
          
        }
      }) */

    // this.service.formData.IdApi = '5de771f1a1203';
    this.service.updateCliente(this.service.formData).subscribe(res => {
      
      this.ConnectionHubService.on(origen[0])
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      this.service.updateCliente2(this.service.formData).subscribe(res => {
        // this.snackBar.open(res.toString(), '', {
        //   duration: 5000,
        //   verticalPosition: 'top'
        // });
        
        this.movimientos(this.movimiento)
        Swal.fire({
          icon: 'success',
          title: 'Cliente Actualizado',
          text: ''+this.service.formData.RazonSocial+'',
          timer: 1500
        })
        
      });
   
      
    });
    // console.log(this.service.formData);
  }

  movimientos(movimiento){
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

}
