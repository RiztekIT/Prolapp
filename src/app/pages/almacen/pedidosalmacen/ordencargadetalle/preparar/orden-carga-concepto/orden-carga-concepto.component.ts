import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-orden-carga-concepto',
  templateUrl: './orden-carga-concepto.component.html',
  styleUrls: ['./orden-carga-concepto.component.css']
})
export class OrdenCargaConceptoComponent implements OnInit {

  constructor(public ordenTemporalService: OrdenTemporalService, public dialogbox: MatDialogRef<OrdenCargaConceptoComponent>) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogbox.close();
    this.ordenTemporalService.filter('Register click');
  }

  onSubmit(form: NgForm) {
  
  }

}
