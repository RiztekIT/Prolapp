import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { EmpresaService } from '../../../../services/empresas/empresa.service';
import Swal from 'sweetalert2';
import { NgForm, FormControl } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrls: ['./add-empresa.component.css']
})
export class AddEmpresaComponent implements OnInit {

  fotoSubir: string;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(public dialogbox: MatDialogRef<AddEmpresaComponent>, public router: Router,
    public service: EmpresaService, private snackBar: MatSnackBar, private _formBuilder: FormBuilder ) { }



  ngOnInit() {
    this.resetForm();
    this.onCreate();


    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
        IdEmpresa:0,
        RFC:'',
        RazonSocial:'',
        Calle:'',
        NumeroInterior:0,
        NumeroExterior:0,
        CP:0,
        Colonia:'',
        Ciudad:'',
        Estado:'',
        Pais:'',
        Regimen:'',
        Foto: ''       
    }
  }
  
  cambiarImagen(){
    // console.log(this.fotoSubir);
    this.service.formData.Foto = this.fotoSubir
    console.log(this.service.formData);

    this.service.updateEmpresaFoto(this.service.formData).subscribe(resp =>{
      console.log(resp)
        Swal.fire({
        icon: 'success',
        title: ' Foto de Empresa Actualizada'
      })
    })
  }

  onCreate(){
    this.service.addEmpresa(this.service.formData).subscribe(res =>{
      console.log(res);
         
    });
  }

  onSubmit(){
    this.service.updateEmpresa(this.service.formData).subscribe(resp =>{
      console.log(resp);
    })
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

}
