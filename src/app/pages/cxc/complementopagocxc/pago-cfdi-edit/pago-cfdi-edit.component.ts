import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { ReciboPagoService } from '../../../../services/complementoPago/recibo-pago.service';

@Component({
  selector: 'app-pago-cfdi-edit',
  templateUrl: './pago-cfdi-edit.component.html',
  styleUrls: ['./pago-cfdi-edit.component.css']
})
export class PagoCFDIEditComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<PagoCFDIEditComponent>, public service: ReciboPagoService,) { }

  ngOnInit() {
  }
  NuevoSaldo: number;

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(){

  }

}
