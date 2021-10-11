import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';

@Component({
  selector: 'app-cfdirelacionadoscxc',
  templateUrl: './cfdirelacionadoscxc.component.html',
  styleUrls: ['./cfdirelacionadoscxc.component.css']
})
export class CfdirelacionadoscxcComponent implements OnInit {

CFDIRelacionados;
UUIDRelacionados: any[]
  FolioFactura: string;
  tipoRelacion
  public listRel = [
    { Relacion: '01', text: 'Nota de crédito de los documentos relacionados' },
    { Relacion: '02', text: 'Nota de débito de los documentos relacionados' },
    { Relacion: '03', text: 'Devolución de mercancía sobre facturas o traslados previos' },
    { Relacion: '04', text: 'Sustitución de los CFDI previos' },
    { Relacion: '05', text: 'Traslados de mercancias facturados previamente' },
    { Relacion: '06', text: 'Factura generada por los traslados previos' },
    { Relacion: '07', text: 'CFDI por aplicación de anticipo' },
    { Relacion: '08', text: 'Factura generada por pagos en parcialidades' },
    { Relacion: '09', text: 'Factura generada por pagos diferidos' }
  ];

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Cliente','Total', 'FechaDeExpedicion', 'Estatus',  'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild('pagCFDI', {static: true}) paginator: MatPaginator;
  listDataRelacionados: MatTableDataSource<any>;
  displayedColumnsRelacionados: string[] = ['Folio', 'UUID'];
  @ViewChild(MatSort, null) sortRelacionados : MatSort;
  @ViewChild('pagRel', {static: true}) paginatorRelacionados: MatPaginator;

  constructor(
    public dialogbox: MatDialogRef<CfdirelacionadoscxcComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public facturaSVC: FacturaService
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.FolioFactura = this.data.factura.Folio;
    this.UUIDRelacionados = []
    this.getFacturasCliente()
    this.getUUIDRelaciones(this.data.factura)

  }

  onClose(){

    let consulta="select UUID from Relacion where IdFactura="+this.data.factura.Id

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{

    console.log(res);
  

    
        this.CFDIRelacionados = {
          TipoRelacion: this.tipoRelacion,
          UUID: res
        }
        this.dialogbox.close(this.CFDIRelacionados);
    })




    
  }


  getFacturasCliente(){

    let consulta

    if (this.facturaSVC.rfcempresa=='PLA11011243A'){
      
      
 consulta = "select Factura2.*, Cliente2.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from Relacion where IdFactura = Factura.Id and UUID=Factura.UUID) as checked from Factura Left join Cliente2 on Factura.IdCliente = Cliente2.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
    }else if(this.facturaSVC.rfcempresa=='AIN140101ME3'){
consulta = "select Factura2.*, Cliente.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from Relacion where IdFactura = Factura2.Id and UUID=Factura2.UUID) as checked from Factura2 Left join Cliente on Factura2.IdCliente = Cliente.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
    }else if(this.facturaSVC.rfcempresa=='DTM200220KRA'){
      consulta = "select Factura3.*, Cliente3.*, (select Top 1 case IdRelacion when NULL then 'False' else 'True' end from Relacion3 where IdFactura = Factura3.Id and UUID=Factura3.UUID) as checked from Factura3 Left join Cliente3 on Factura3.IdCliente = Cliente3.IdClientes where IdCliente="+this.data.factura.IdCliente+" order by FechaDeExpedicion desc;"
          }


    console.log(consulta);


    this.facturaSVC.consultaGeneral(consulta).toPromise().then((resp:any)=>{
      console.log(resp);
      this.listData = new MatTableDataSource(resp);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    })

  }

  seleccion(event, row){

    console.log(event);
    console.log(row);
    console.log(row.UUID);

    /* this.UUIDRelacionados.push(UUID) */

    


    if (event.checked){
      let consulta = "insert into Relacion values('"+row.UUID+"','"+this.tipoRelacion+"','"+this.facturaSVC.rfcempresa+"',"+this.data.factura.Id+")"

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
     console.log(res);
     this.getUUIDRelaciones(this.data.factura)
    })
    }else{

      let consulta = "delete from Relacion where UUID='"+row.UUID+"' and IdFactura="+this.data.factura.Id+" and RFCEmpresa='"+this.facturaSVC.rfcempresa+"'"

 

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{
      this.getUUIDRelaciones(this.data.factura)
    })

    }


 


  }


  getUUIDRelaciones(fact){

    let consulta="select * from Relacion where IdFactura="+fact.Id

    console.log(consulta);

    this.facturaSVC.consultaGeneral(consulta).toPromise().then((res:any)=>{

      this.listDataRelacionados = new MatTableDataSource(res);
      this.listDataRelacionados.sort = this.sortRelacionados;
      this.listDataRelacionados.paginator = this.paginatorRelacionados;

    })

   

  }



}
