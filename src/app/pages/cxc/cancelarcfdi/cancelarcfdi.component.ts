import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancelarcfdi',
  templateUrl: './cancelarcfdi.component.html',
  styleUrls: ['./cancelarcfdi.component.css']
})
export class CancelarcfdiComponent implements OnInit {

  FolioFactura: string;

  tipoRelacion
  public listRel = [
    { Relacion: '01', text: 'Comprobante emitido con errores con relación' },
    { Relacion: '02', text: 'Comprobante emitido con errores sin relación' },
    { Relacion: '03', text: 'No se llevó a cabo la operación' },
    { Relacion: '04', text: 'Operación nominativa relacionada en la factura global' }    
  ];

  campos;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Cliente','Total', 'FechaDeExpedicion', 'Estatus',  'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild('pagCFDI', {static: true}) paginator: MatPaginator;
  listDataRelacionados: MatTableDataSource<any>;
  displayedColumnsRelacionados: string[] = ['Folio', 'UUID', 'Options'];
  @ViewChild(MatSort, null) sortRelacionados : MatSort;
  @ViewChild('pagRel', {static: true}) paginatorRelacionados: MatPaginator;

  necesariouuid = false;

  constructor(
    public dialogbox: MatDialogRef<CancelarcfdiComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public facturaSVC: FacturaService
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.FolioFactura = this.data.folio;
    this.getFacturasCliente()
    this.getUUIDRelaciones(this.data.folio)
  }

  onClose(){
this.dialogbox.close();
    




    
  }

  getFacturasCliente(){

    let consulta

    if (this.facturaSVC.rfcempresa=='PLA11011243A'){
      
      
 consulta = "select Factura2.*, Cliente2.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from RelacionCancelaciones where IdFactura = Factura.Id and UUID=Factura.UUID) as checked from Factura Left join Cliente2 on Factura.IdCliente = Cliente2.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
    }else if(this.facturaSVC.rfcempresa=='AIN140101ME3'){
consulta = "select Factura2.*, Cliente.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from RelacionCancelaciones where IdFactura = Factura2.Id and UUID=Factura2.UUID) as checked from Factura2 Left join Cliente on Factura2.IdCliente = Cliente.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
    }else if(this.facturaSVC.rfcempresa=='DTM200220KRA'){
      consulta = "select Factura3.*, Cliente3.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from RelacionCancelaciones where IdFactura = Factura3.Id and UUID=Factura3.UUID) as checked from Factura3 Left join Cliente3 on Factura3.IdCliente = Cliente3.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
          }


    console.log(consulta);


    this.facturaSVC.consultaGeneral(consulta).toPromise().then((resp:any)=>{
      console.log(resp);
      this.listData = new MatTableDataSource(resp);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    })

  }

  done(){
    console.log(this.tipoRelacion);
   
    console.log(this.campos);
    
    
if (this.tipoRelacion){


    if (this.tipoRelacion.Relacion=='01'){
      if (this.campos.folioSustituto !=''){
        this.dialogbox.close(this.campos);
        let tipo = this.tipoRelacion.Relacion + "-" + this.tipoRelacion.text
    console.log(tipo);

      }else{

        Swal.fire(
          'No Tiene UUID',   
          '',     
          'error'
        )
    
      }


    }else if(this.tipoRelacion.Relacion!=''){
      this.dialogbox.close(this.campos);
    }else{

      Swal.fire(
        'No Tiene Relacion',   
        '',     
        'error'
      )

    }
  }else{

    Swal.fire(
      'No Tiene Relacion',   
      '',     
      'error'
    )

  }

    
  }

  seleccion(event, row){

    console.log(event);
    console.log(row);
    console.log(row.UUID);

    /* this.UUIDRelacionados.push(UUID) */

    


    if (event.checked){
      this.campos = {
        'motivo':this.tipoRelacion.Relacion,
        'folioSustituto':row.UUID,
      }
      let consulta = "insert into RelacionCancelaciones values('"+row.UUID+"','"+this.tipoRelacion.Relacion+"','"+this.facturaSVC.rfcempresa+"',"+this.data.folio+")"

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
     console.log(res);
     this.getUUIDRelaciones(this.data.folio)
     
    })
    }else{

      let consulta = "delete from RelacionCancelaciones where UUID='"+row.UUID+"' and IdFactura="+this.data.folio+" and RFCEmpresa='"+this.facturaSVC.rfcempresa+"'"

 

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
      this.getUUIDRelaciones(this.data.folio)
    })

    }

  }


  getUUIDRelaciones(fact){

    let consulta="select * from RelacionCancelaciones where IdFactura="+fact

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{

      this.listDataRelacionados = new MatTableDataSource(res);
      this.listDataRelacionados.sort = this.sortRelacionados;
      this.listDataRelacionados.paginator = this.paginatorRelacionados;

    })

   

  }

  deleteRelacion(row){
    console.log(row);

    let consulta = "delete from RelacionCancelaciones where UUID='"+row.UUID+"' and IdFactura="+this.data.folio+" and RFCEmpresa='"+this.facturaSVC.rfcempresa+"'"

 

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
      this.getUUIDRelaciones(this.data.folio)
    })

  }

  onSelect(){
    console.log(this.tipoRelacion);
    if (this.tipoRelacion.Relacion=='01'){
      this.necesariouuid = true
      this.campos = {
        'motivo':this.tipoRelacion.Relacion,
        'folioSustituto':'',
      }


    }else{
      this.necesariouuid = false
      this.campos = {
        'motivo':this.tipoRelacion.Relacion,
        'folioSustituto':'',
      }
      let consulta = "delete from RelacionCancelaciones where IdFactura="+this.data.folio+" and RFCEmpresa='"+this.facturaSVC.rfcempresa+"'"

 

      console.log(consulta);
  
      this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
        this.getUUIDRelaciones(this.data.folio)
      })
    }
  }


 



}
