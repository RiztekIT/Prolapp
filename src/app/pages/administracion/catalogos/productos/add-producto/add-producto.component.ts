import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styles: []
})
export class AddProductoComponent implements OnInit {

  constructor(  public dialogbox: MatDialogRef<AddProductoComponent>,
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
      Cantidad: ''
    }
  }

onClose(){
  this.dialogbox.close();
  this.service.filter('Register click');
}

onSubmit(form: NgForm) {
  // console.log(form.value);
  this.service.addProducto(form.value).subscribe( res =>
    {
      this.resetForm(form);
      this.snackBar.open(res.toString(),'',{
        duration: 5000,
        verticalPosition: 'top'
      });
    }
    );
}


}
