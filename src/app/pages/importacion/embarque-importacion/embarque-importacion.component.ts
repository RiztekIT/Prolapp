import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare function steps();
declare function upload();

@Component({
  selector: 'app-embarque-importacion',
  templateUrl: './embarque-importacion.component.html',
  styles: []
})
export class EmbarqueImportacionComponent implements OnInit {

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
    upload();
  }

}
