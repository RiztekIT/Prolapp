import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProveedoresService } from '../../../../../services/catalogos/proveedores.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.css']
})
export class EditProveedorComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<EditProveedorComponent>,
    public service: ProveedoresService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    this.service.updateProveedor(form.value).subscribe(res => {
      this.snackBar.open(res.toString(), '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    });
  }

}
