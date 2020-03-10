import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ClientesService } from '../../../../../services/catalogos/clientes.service';


@Component({
  selector: 'app-edit-vendedor',
  templateUrl: './edit-vendedor.component.html',
  styleUrls: ['./edit-vendedor.component.css']
})
export class EditVendedorComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditVendedorComponent>,
    public service: ClientesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }


  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    this.service.updateVendedor(form.value).subscribe(res => {
      // this.snackBar.open(res.toString(), '', {
      //   duration: 5000,
      //   verticalPosition: 'top'
      // });
      Swal.fire({
        icon: 'success',
        title: 'Vendedor Actualizado'
      })
    });
  }

}
