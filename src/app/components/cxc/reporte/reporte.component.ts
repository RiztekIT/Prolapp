import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ClientesService } from '../../../services/catalogos/clientes.service';
import { ReporteMaster } from '../../../Models/cxc/reportecxcmaster-model';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  IdCliente: any;

  IdC: number;

  masterArray = new Array<ReporteMaster>();

  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService) { }

  con : string| number;
  arrcon: Array<any> = [];

  objconc: Array<any> = []; 

  ngOnInit() {
    this.getClientes();
  }

  getClientes(){


    
    

    this.serviceCliente.getClientesList().subscribe(data=>{

      this.IdCliente = data;



      // console.log(this.IdCliente);

      this.objconc = []

      this.masterArray = []

      for (let i = 0; i < data.length ; i++){
     
      // console.log( this.IdCliente[i].IdClientes);

      
      this.masterArray.push({
        IdCliente: this.IdCliente[i].IdClientes,
        Nombre: this.IdCliente[i].Nombre
      })

      this.masterArray[i].Docs =[];

        this.serviceFactura.getReportes(this.IdCliente[i].IdClientes).subscribe(res=>{

          // console.log(res);


          if(res.length > 0){

          for( let l = 0; l < res.length; l++){

            // console.log(res[l]);
            
            this.masterArray[i].Docs.push(res[l]);

              this.objconc.push(res[l]);

            }
          }
          // console.log(this.objconc.includes('Folio'));
          
          // console.log(this.objconc);
          this.datosArray(this.masterArray);
        })

        
      }

    })
  }

  datosArray(datos){

    // console.log(datos);

    this.arrcon = [];
    if(datos.length > 0){
      for(let j = 0; j < datos.length; j++){
        //var info = datos[j];
        //console.log(info);
        if (datos[j].Docs.length>0){
          this.arrcon.push(datos[j])
        }
      }
       console.log(this.arrcon);
      
    }
  }

  

}
