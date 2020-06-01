import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ClientesService } from '../../../services/catalogos/clientes.service';
import { ReporteMaster } from '../../../Models/cxc/reportecxcmaster-model';

@Component({
  selector: 'app-reporte-mxn',
  templateUrl: './reporte-mxn.component.html',
  styleUrls: ['./reporte-mxn.component.css']
})
export class ReporteMxnComponent implements OnInit {
  IdCliente: any;

  IdC: number;
  nombrelenght:number;

  masterArray = new Array<ReporteMaster>();

  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService) { }

  con : string| number;
  arrcon: Array<any> = [];

  objconc: Array<any> = []; 
  totalmxn;
  totaldlls;

  ngOnInit() {
    this.getClientes();
  }

  getClientes(){

    this.serviceCliente.getClientesListIDN().subscribe(data=>{

      this.IdCliente = data;


      // console.log(this.IdCliente);

      this.objconc = []

      this.masterArray = []

      for (let i = 0; i < data.length ; i++){
        this.totaldlls = '0';
        this.totalmxn = '0';
     
      // console.log( this.IdCliente[i].IdClientes);

      
      this.masterArray.push({
        IdCliente: this.IdCliente[i].IdClientes,
        Nombre: this.IdCliente[i].Nombre,
        TotalMXN: '0',
        TotalDLLS: '0'
      })

      this.masterArray[i].Docs =[];

        this.serviceFactura.getReportesM(this.IdCliente[i].IdClientes).subscribe(res=>{
          this.totaldlls = '0';
          this.totalmxn = '0';
          // console.log(res);


          if(res.length > 0){

          for( let l = 0; l < res.length; l++){

            // console.log(res[l]);
            
            this.masterArray[i].Docs.push(res[l]);
            this.totalmxn = (+this.totalmxn + +res[l].Total).toString();
            this.totaldlls = (+this.totaldlls + +res[l].TotalDlls).toString();            
            this.masterArray[i].TotalMXN = this.totalmxn;
            this.masterArray[i].TotalDLLS = this.totaldlls;

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
      //  console.log(this.arrcon);
      
    }
  }

}
