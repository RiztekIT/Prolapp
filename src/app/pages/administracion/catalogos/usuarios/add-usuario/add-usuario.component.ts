import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {

  constructor(  public dialogbox: MatDialogRef<AddUsuarioComponent>,
    public service: UsuariosServieService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();

    this.service.formData = {
      IdUsuario: 0,
      Nombre: '',
      NombreUsuario: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      Correo: '',
      Telefono: '',
      Contra: '',
      FechaUltimoAcceso: '2016/09/14',
      Dispositivo:'',
    }
  }

onClose(){
  this.dialogbox.close();
  this.service.filter('Register click');
}

onSubmit(form: NgForm) {
  // console.log(form.value);
  this.service.addUsuario(form.value).subscribe( res =>
    {
      console.log(res);
      // this.resetForm(form);
      // this.snackBar.open(res.toString(),'',{
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'success',
        title: 'Usuario Agregado'
      })
    }
    );
}

}
