import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-ventas',
  templateUrl: './pedido-ventas.component.html',
  styles: []
})
export class PedidoVentasComponent implements OnInit {


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

  constructor() { }

  ngOnInit() {
  }

}





