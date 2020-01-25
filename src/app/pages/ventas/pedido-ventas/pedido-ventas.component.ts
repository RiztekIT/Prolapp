import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { VentasPedidoService } from '../../../services/ventas/ventas-pedido.service';

declare function steps();
declare function datepicker();

@Component({
  selector: 'app-pedido-ventas',
  templateUrl: './pedido-ventas.component.html',
  styles: []
})
export class PedidoVentasComponent implements OnInit {

 

  constructor(public router: Router, public service: VentasPedidoService) { }

  ngOnInit() {
    steps();
    datepicker();
  }

  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;

  recargar() {
    // this.router.navigate(['/pedidoVentas']);
    this.ngOnInit();
  }

  // onSelectionChange(reciboPago: any, event: any) {

  //   if (event.isUserInput) {
      
  //     // this.service.updateReciboPago(this.service.formData).subscribe(data =>{
        
  //     })
  //     //Limpiar arreglo de Facturas dependiendo del cliente
  //     // this.options2 = [];
  //     // this.dropdownRefresh2(this.service.formData.IdCliente);
  //     // this.ClienteNombre = reciboPago.Nombre;
  //   }


  // }


  // onSubmit(form: NgForm){
    
  // }

  // this.service.addCliente(form.value).subscribe(res => {
     
  // });
  
  // ciudades: any = [
  //     'Seleccionar Ciudad',
  //     'Aguascalientes',
  //     'Baja California',
  //     'Baja California Sur',
  //     'Campeche',
  //     'Coahuila',
  //     'Colima',
  //     'Chiapas',
  //     'Chihuahua',
  //     'Distrito Federal',
  //     'Durango',
  //     'Guanajuato',
  //     'Guerrero',
  //     'Hidalgo',
  //     'Jalisco',
  //     'México',
  //     'Michoacán de Ocampo',
  //     'Morelos',
  //     'Nayarit',
  //     'Nuevo León',
  //     'Oaxaca',
  //     'Puebla',
  //     'Querétaro',
  //     'Quintana Roo',
  //     'San Luis Potosí',
  //     'Sinaloa',
  //     'Sonora',
  //     'Tabasco',
  //     'Tamaulipas',
  //     'Tlaxcala',
  //     'Veracruz',
  //     'Yucatán',
  //     'Zacatecas'
  // ];
}
