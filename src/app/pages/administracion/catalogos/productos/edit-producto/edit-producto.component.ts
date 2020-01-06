import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditProductoComponent>,
    public service: ProductosService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.service.formData.IVA == '0'){
      this.service.formData.IVA = 'False';
    }
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {

    if (form.controls['IVA'].value == true) {
      this.service.formData.IVA = '0.16';
      }  else {
        this.service.formData.IVA = '0';
      }

    this.service.updateProducto(this.service.formData).subscribe(res => {
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado'
      })
    });
  }

}
