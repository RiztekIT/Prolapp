import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';

@Component({
  selector: 'app-orden-decarga-tarima-existente',
  templateUrl: './orden-decarga-tarima-existente.component.html',
  styleUrls: ['./orden-decarga-tarima-existente.component.css']
})
export class OrdenDecargaTarimaExistenteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<OrdenDecargaTarimaExistenteComponent>, public ordenTemporalService: OrdenTemporalService) {


   }
  
  ngOnInit() {
    // console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    // // for(let i= 0; i<= this.ordenTemporalService.preOrdenTemporalSacos.length -1; i++){
    // //   this.SacosIngresados = (+this.ordenTemporalService.preOrdenTemporalSacos[i].SacosIngresados + +this.SacosIngresados).toString();
    // // }
    
    // console.log(this.SacosIngresados,'totales');
    // this.Lote = this.ordenTemporalService.preOrdenTemporalSacos[0].Lote;

  }

  Lote: string;
  SacosIngresados: string;

  onClose() {
    this.dialogbox.close();
  }

}
