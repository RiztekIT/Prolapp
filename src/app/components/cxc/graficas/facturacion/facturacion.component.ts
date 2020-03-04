import { Component, OnInit, Input } from '@angular/core';
import * as Chart from 'chart.js';
import { ReporteMaster } from 'src/app/Models/cxc/reportecxcmaster-model';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';




@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  @Input() public chartLabels: string[] = [];
  @Input() public chartData: number[] = [];
  @Input() public chartType: string = '';



  graficos: any = {
    'grafico1': {
      'labels': ['Facturacion MXN',' Facturacion USD'],
      'data':  ['45','1000'],
      'type': 'doughnut',
      'leyenda': 'Ventas 2019'
    }
  };
  IdCliente: any;

  IdC: number;

  textoNombre: any;

  masterArray = new Array<ReporteMaster>();

  mxn;
  usd;
  mxn2;
  usd2;
  
 

  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService) { }
  con : string| number;
  arrcon: Array<any> = [];

  objconc: Array<any> = []; 


  ngOnInit() {
    
    this.getClientes();
  }

  getClientes(){

    this.mxn2 = 0;
    this.usd2 = 0;

    this.serviceCliente.getClientesList().subscribe(data=>{

      this.IdCliente = data;



      // console.log(this.IdCliente);

      this.objconc = []

      this.masterArray = []
      this.mxn = 0;
      this.usd = 0;

      for (let i = 0; i < data.length ; i++){
     
      // console.log( this.IdCliente[i].IdClientes);

      
      this.masterArray.push({
        IdCliente: this.IdCliente[i].IdClientes,
        Nombre: this.IdCliente[i].Nombre
      })

      this.textoNombre = this.masterArray[i].Nombre.length;
      // console.log(this.textoNombre);

      this.masterArray[i].Docs =[];
      

        this.serviceFactura.getReportes(this.IdCliente[i].IdClientes).subscribe(res=>{
          console.log(res);
          

          if(res.length > 0){

          for( let l = 0; l < res.length; l++){
            

           if (res[l].Tipo=='Ingreso'){
             if (res[l].Moneda=='MXN'){
               this.mxn = this.mxn + parseFloat(res[l].Total)
             }else if (res[l].Moneda=='USD') {
               this.usd = this.usd + parseFloat(res[l].TotalDlls);
             }
           }
            
            // this.masterArray[i].Docs.push(res[l]);

            //   this.objconc.push(res[l]);

            }
          }
          this.dataGraf(this.mxn,this.usd)
          // this.datosArray(this.masterArray);
        })
      }

    })
  }

dataGraf(mxn,usd){

  
console.log(mxn);
console.log(usd);



this.graficos.grafico1.data = []
this.graficos.grafico1.data.push(mxn.toString())
this.graficos.grafico1.data.push(usd.toString())
console.log(this.graficos.grafico1.data);

}

}
