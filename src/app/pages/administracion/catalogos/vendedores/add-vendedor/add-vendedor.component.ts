import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import Swal from 'sweetalert2';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { format } from 'url';

@Component({
  selector: 'app-add-vendedor',
  templateUrl: './add-vendedor.component.html',
  styleUrls: ['./add-vendedor.component.css']
})
export class AddVendedorComponent implements OnInit {

  constructor(public dialogbox:MatDialogRef<AddVendedorComponent>, public router: Router, 
              public service: ClientesService, private snackBar: MatSnackBar, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.resetForm();
  }

  onSubmit(form: NgForm){

    this.service.addVendedor(this.service.formDataV).subscribe(res =>{
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Vendedor Agregado',
        text: '',
        timer: 1500
      })
    })
    
  }


  resetForm(){
    // if (form != null)
    // format.resetForm();

    this.service.formDataV = {
      IdVendedor: 0,
      Nombre: ''
    }
  }
  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }
}
