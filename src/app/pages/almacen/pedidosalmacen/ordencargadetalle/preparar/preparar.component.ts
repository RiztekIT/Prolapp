import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';



@Component({
  selector: 'app-preparar',
  templateUrl: './preparar.component.html',
  styleUrls: ['./preparar.component.css']
})
export class PrepararComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  //Informacion que vendra del QR
  QRdata = new DetalleTarima();   

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
  }

  simularQR(){

this.QRdata.ClaveProducto = 'LPD002';
this.QRdata.Lote = '123'
this.QRdata.Sacos = '70';

console.log(this.QRdata);


  }

traspaso(){

}

pdf(){

}

finalizar(){
}

}
