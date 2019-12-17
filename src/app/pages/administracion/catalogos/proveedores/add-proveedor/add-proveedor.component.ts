import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProveedoresService } from '../../../../../services/catalogos/proveedores.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styles: []
})
export class AddProveedorComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<AddProveedorComponent>,
    public service: ProveedoresService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      IdProveedor: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia: '',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: '',
      NumeroExterior: '',
      ClaveProveedor: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: ''
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    this.service.addProveedor(form.value).subscribe(res => {
      this.resetForm(form);
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }
    );
  }



}
