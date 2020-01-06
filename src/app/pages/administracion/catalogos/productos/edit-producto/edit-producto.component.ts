import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditProductoComponent>,
    public service: ProductosService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {

    let iva;
    iva = form.controls['IVA'].value;
    if (iva == true) {
    this.service.formData.IVA = 1;
    }  else {
      this.service.formData.IVA = 0;
    }
    // console.log(this.service.formData);

    this.service.updateProducto(this.service.formData).subscribe(res => {
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    });
  }

}
