import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function steps();
declare function datepicker();

@Component({
  selector: 'app-formato-compras-compras',
  templateUrl: './formato-compras-compras.component.html',
  styles: []
})
export class FormatoComprasComprasComponent implements OnInit {

  ciudades: any = [
    'Seleccionar Ciudad',
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Coahuila',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Distrito Federal',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán de Ocampo',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas'
];
  constructor(public router: Router) { }

  ngOnInit() {
    steps();
    datepicker();
  }
  recargar() {
    // this.router.navigate(['/pedidoVentas']);
    this.ngOnInit();
  }

}
