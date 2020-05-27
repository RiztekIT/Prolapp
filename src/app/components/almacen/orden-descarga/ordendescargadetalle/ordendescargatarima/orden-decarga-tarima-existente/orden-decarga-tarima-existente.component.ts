import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { NgForm, FormControl } from '@angular/forms';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { Observable } from 'rxjs';
import { Tarima } from '../../../../../../Models/almacen/Tarima/tarima-model';
import { TarimaService } from '../../../../../../services/almacen/tarima/tarima.service';

@Component({
  selector: 'app-orden-decarga-tarima-existente',
  templateUrl: './orden-decarga-tarima-existente.component.html',
  styleUrls: ['./orden-decarga-tarima-existente.component.css']
})
export class OrdenDecargaTarimaExistenteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<OrdenDecargaTarimaExistenteComponent>, public ordenTemporalService: OrdenTemporalService, public tarimaService: TarimaService) { }
  
  ngOnInit() {
    // PREORDENTEMPORALTARIMAEXISTENTE
    this.POTSTE = this.ordenTemporalService.preOrdenTemporalSacos;
    console.log(this.POTSTE);
    this.toShowInput()

  }
  onClose() {
    this.dialogbox.close();
  }

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listQR: Tarima[] = [];
  options: Tarima[] = [];

  QR: string;
  Producto: string;
  Lote: string;
  SacosIngresadosAll = 0;
  POTSTE: any;

  dropdownRefresh() {
    
    this.tarimaService.getTarima().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let TQr = data[i].QR;
        this.listQR.push(TQr);
        this.options.push(TQr)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }

  toShowInput(){
  for(let i= 0; i<= this.POTSTE.length -1; i++){
    this.SacosIngresadosAll = +this.POTSTE[i].SacosIngresados + +this.SacosIngresadosAll;
  }

  this.Producto = this.POTSTE[0].Producto
  this.Lote = this.POTSTE[0].Lote


}

}