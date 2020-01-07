import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm, FormGroup, FormArray, Validators, FormControl  } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styles: []
})
export class AddProductoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<AddProductoComponent>,
    public service: ProductosService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      IdProducto: 0,
      Nombre: '',
      PrecioVenta: '',
      PrecioCosto: '',
      Cantidad: '',
      ClaveProducto: '',
      Stock: '',
      DescripcionProducto: '',
      Estatus: '',
      UnidadMedida: '',
      IVA: '',
      ClaveSAT: ''
    }

  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (form.controls['IVA'].value == true) {
    this.service.formData.IVA = '0.16';
    }  else {
      this.service.formData.IVA = '0';
    }
    // console.log(this.service.formData.IVA);
    this.service.addProducto(this.service.formData).subscribe(res => {
      // console.log(res);
      // console.log(this.service.formData);
      this.resetForm(form);
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
      })
    }
    );
  }


}
