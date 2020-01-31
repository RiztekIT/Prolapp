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

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditClienteComponent>,
    public service: ClientesService, private snackBar: MatSnackBar, public apicliente: EnviarfacturaService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dropdownRefresh();
  }

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
      this.apicliente.actualizarCliente(datos,this.service.formData.IdApi).subscribe(data =>{
        if (data.status==='success'){
          console.log(data);
        }
        else{
          console.log(data);
          
        }
      })

    // this.service.formData.IdApi = '5de771f1a1203';
    this.service.updateCliente(this.service.formData).subscribe(res => {
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'success',
        title: 'Cliente Actualizado',
        text: ''+this.service.formData.RazonSocial+'',
        timer: 1500
      })
      
    });
    // console.log(this.service.formData);
  }

}
