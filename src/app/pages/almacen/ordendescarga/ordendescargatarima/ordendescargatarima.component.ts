import { Component, OnInit } from '@angular/core';
import { OrdenDescargaService } from '../../../../services/almacen/orden-descarga/orden-descarga.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordendescargatarima',
  templateUrl: './ordendescargatarima.component.html',
  styleUrls: ['./ordendescargatarima.component.css']
})
export class OrdendescargatarimaComponent implements OnInit {

  IdTarima: any;
  Sacos: any;
  PesoTotal: any;
  QR: any;



  constructor(public service: OrdenDescargaService, public router: Router,) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['/ordenDescargadetalle']);
 }

  crearTarima(){
console.log(this.service.formDataTarima);
  }
}
