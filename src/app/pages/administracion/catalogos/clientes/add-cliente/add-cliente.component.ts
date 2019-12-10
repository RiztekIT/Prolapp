import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styles: []
})
export class AddClienteComponent implements OnInit {

  constructor(  public dialogbox: MatDialogRef<AddClienteComponent>,
    public service: ClientesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
  }


  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();

    this.service.formData = {
      IdClientes: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia:'',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: '',
      NumeroExterior: ''
    }
  }

onClose(){
  this.dialogbox.close();
  this.service.filter('Register click');
}

onSubmit(form: NgForm) {
  // console.log(form.value);
  this.service.addCliente(form.value).subscribe( res =>
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
