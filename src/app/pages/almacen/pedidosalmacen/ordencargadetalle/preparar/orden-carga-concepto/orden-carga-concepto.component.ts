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

   this.cantidadSacos = +this.ordenTemporalService.ordenTemporalData.Sacos; 
   this.cantidadMaximaSacos = +this.ordenTemporalService.ordenTemporalData.Sacos; 
  }

  cantidadSacos: number;
  cantidadMaximaSacos: number;

  onClose() {
    this.dialogbox.close();
    
  }

  //metodo que se ejecuta cuando cambia la cantidad de sacos
  onChangeCantidadSacos(cantidad: any){
    console.log(cantidad);
    let elemHTML: any = document.getElementsByName('Cantidad')[0];
    this.validarCantidad(cantidad);
    elemHTML.value = this.cantidadSacos;
  }


  validarCantidad(cantidad: any) {
    console.log(cantidad + ' CANTIDAD');
    if (+cantidad >= this.cantidadMaximaSacos) {
      this.cantidadSacos = this.cantidadMaximaSacos;
    }
    if (+cantidad < 0) {
      this.cantidadSacos = 0;
    }
    if (cantidad == null) {
      this.cantidadSacos = 0;
    }
  }

  onSubmit(form: NgForm) {

//Actualizar concepto con el nuevo numero de sacos
console.log(this.ordenTemporalService.posicionOrdenTemporal);
console.log(this.ordenTemporalService.preOrdenTemporal);
console.log(this.cantidadSacos);
this.ordenTemporalService.preOrdenTemporal[this.ordenTemporalService.posicionOrdenTemporal].Sacos = this.cantidadSacos.toString();
console.log(this.ordenTemporalService.preOrdenTemporal);
    this.dialogbox.close();
    this.ordenTemporalService.filter('Register click');
  }

}
