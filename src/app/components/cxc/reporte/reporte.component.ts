import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ClientesService } from '../../../services/catalogos/clientes.service';
import { ReporteMaster } from '../../../Models/cxc/reportecxcmaster-model';
import { SharedService } from '../../../services/shared/shared.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  IdCliente: any;

  IdC: number;

  textoNombre: any;

  masterArray = new Array<ReporteMaster>();

  constructor(public serviceFactura: FacturaService, public serviceCliente: ClientesService, public sharedService: SharedService) { }

  con : string| number;
  arrcon: Array<any> = [];
  totalmxn;
  totaldlls;

  objconc: Array<any> = []; 

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

      this.textoNombre = this.masterArray[i].Nombre.length;
      // console.log(this.textoNombre);

      this.masterArray[i].Docs =[];

        this.serviceFactura.getReportes(this.IdCliente[i].IdClientes).subscribe(res=>{
          this.totaldlls = '0';
          this.totalmxn = '0';
          if(res.length > 0){

          for( let l = 0; l < res.length; l++){

           
            
            this.masterArray[i].Docs.push(res[l]);
            
            this.totalmxn = (+this.totalmxn + +res[l].Total).toString();
            this.totaldlls = (+this.totaldlls + +res[l].TotalDlls).toString();            
            this.masterArray[i].TotalMXN = this.totalmxn;
            this.masterArray[i].TotalDLLS = this.totaldlls;
              this.objconc.push(res[l]);

            }
          }
   
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


  exportAsXLSX():void {
console.log(this.arrcon);
this.sharedService.generarExcelCobranza(this.arrcon);
    // this.sharedService.exportAsExcelFile(this.arrcon,'ejemplo');
    //this.excelService.exportAsExcelFile(this.data, 'sample');
 }
}
