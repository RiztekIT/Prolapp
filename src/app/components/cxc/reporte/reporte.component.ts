import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ClientesService } from '../../../services/catalogos/clientes.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  IdCliente: any;

  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService) { }

  con : string| number;
  arrcon: Array<any> = [];

  objconc: any; 

  ngOnInit() {
    this.getClientes();
  }

  getClientes(){

    this.serviceCliente.getClientesList().subscribe(data=>{

      this.IdCliente = data;

      console.log(this.IdCliente);


      for (let i = 0; i < data.length ; i++){
     
      // console.log( this.IdCliente[i].IdClientes);
        this.serviceFactura.getReportes(this.IdCliente[i].IdClientes).subscribe(res=>{
          console.log(res);

          
          // ARREGLO PARA PINTAR




        })
      }

    })
  }

}
