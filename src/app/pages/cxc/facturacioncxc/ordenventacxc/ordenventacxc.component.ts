import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DetalleFactura } from 'src/app/Models/facturacioncxc/detalleFactura-model';
import { pedidoMaster } from 'src/app/Models/Pedidos/pedido-master';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { VentasPedidoService } from 'src/app/services/ventas/ventas-pedido.service';
import Swal from 'sweetalert2';

import { ConnectionHubServiceService } from '../../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxc", "titulo": 'OCompra'}
]

@Component({
  selector: 'app-ordenventacxc',
  templateUrl: './ordenventacxc.component.html',
  styleUrls: ['./ordenventacxc.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdenventacxcComponent implements OnInit {

  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public listEstatus: Array<any> = [
    { Estatus: 'Todos' },
    { Estatus: 'Guardada' },
    { Estatus: 'Cerrada' },
    
  ];
  
  estatusSelect;
  IdPedido: any;
  MasterDetalle = new Array<pedidoMaster>();
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Nombre', 'Subtotal', 'Total', 'FechaDeExpedicion', 'Estatus',  'Options'];
  
  displayedColumnsVersion: string[] = ['ClaveProducto', 'Producto', 'Cantidad'];

  expandedElement: any;

  constructor(public ventasPedidoSVC: VentasPedidoService, 
    public facturaSVC: FacturaService, 
    public dialogbox: MatDialogRef<OrdenventacxcComponent>,
    private ConnectionHubService: ConnectionHubServiceService,) {

     /*  this.ConnectionHubService.listenOCompra().subscribe((m:any)=>{
        this.refreshPedidoList();
        });  */
      }

  ngOnInit() {
   /*  this.ConnectionHubService.ConnectionHub(origen[0]); */
    this.refreshPedidoList();
  }

  onClose(){
    this.dialogbox.close();
  }

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdPedido.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  refreshPedidoList() {
    let consulta;

    if(this.facturaSVC.formData.IdCliente==78){
      
      consulta = {
        'consulta':"select Pedidos.*, Cliente.*, (select Top 1 case idovfactura when NULL then 'False' else 'True' end from OvFactura where folioPedido = Pedidos.Folio and idfactura="+this.facturaSVC.formData.Id+") as checked from Pedidos Left join Cliente on Pedidos.IdCliente = Cliente.IdClientes where Pedidos.Estatus<>'Borrado' order by FechaDeExpedicion desc;"
      };
    }else{
      consulta = {
        'consulta':"select Pedidos.*, Cliente.*, (select Top 1 case idovfactura when NULL then 'False' else 'True' end from OvFactura where folioPedido = Pedidos.Folio and idfactura="+this.facturaSVC.formData.Id+") as checked from Pedidos Left join Cliente on Pedidos.IdCliente = Cliente.IdClientes where Pedidos.Estatus<>'Borrado' and IdCliente="+this.facturaSVC.formData.IdCliente+" order by FechaDeExpedicion desc;"
      };

    }

    console.log(consulta);
    
    this.facturaSVC.getQuery(consulta).subscribe((data:any)=>{
    // this.service.getPedidoList().subscribe(data => {
    //this.ventasPedidoSVC.getPedidoCliente().subscribe(data => {
      console.log(data);
      for (let i = 0; i <= data.length - 1; i++) {
      /*   if (data[i].Estatus == 'Creada') {
          // console.log(data[i]);
          // console.log('ELIMINAR ESTE PEDIDO');
          // console.log(i + 1);
          this.ventasPedidoSVC.onDelete(data[i].IdPedido).subscribe(res => {
            this.refreshPedidoList();
          });
        } */
        this.ventasPedidoSVC.master[i] = data[i]
        this.ventasPedidoSVC.master[i].DetallePedido = [];
        this.ventasPedidoSVC.getDetallePedidoId(data[i].IdPedido).subscribe(res => {
          for (let l = 0; l <= res.length - 1; l++) {
            this.ventasPedidoSVC.master[i].DetallePedido.push(res[l]);
          }
        });
      }

      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Pedidos por Pagina';
      console.log(this.ventasPedidoSVC.master);
    });
  }


  seleccion(event, row){
    console.log(event);
    if (this.facturaSVC.formData.Estatus=='Timbrada' || this.facturaSVC.formData.Estatus=='Pagada' ){

      if (event.checked){
        let query = "insert into ovfactura values("+this.facturaSVC.formData.Id+","+row.Folio+")"

      let consulta = {
        'consulta':query
      };

      console.log(consulta);

      this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
       console.log(res);
      })
      }else{

        let query = "delete from ovfactura where idFactura="+this.facturaSVC.formData.Id+" and folioPedido="+row.Folio+""

      let consulta = {
        'consulta':query
      };

      console.log(consulta);

      this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
       console.log(res);
      })

      }

      


    }else{

    
    if (event.checked){

      


      this.agregarDetalles(row);

    }else{

      let query = "delete from ovfactura where idFactura="+this.facturaSVC.formData.Id+" and folioPedido="+row.Folio+""

      let consulta = {
        'consulta':query
      };

      console.log(consulta);

      this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
       console.log(res);
      })

      for (let i=0; i<row.DetallePedido.length; i++){
        if (this.facturaSVC.rfcempresa==='PLA11011243A'){

          query = "delete from detallefactura where idfactura="+this.facturaSVC.formData.Id+" and claveproducto='"+row.DetallePedido[i].ClaveProducto+"'"
        }
        else if (this.facturaSVC.rfcempresa=='AIN140101ME3'){
          query = "delete from detallefactura2 where idfactura="+this.facturaSVC.formData.Id+" and claveproducto='"+row.DetallePedido[i].ClaveProducto+"'"
        }      else if (this.facturaSVC.rfcempresa=='DTM200220KRA'){
          query = "delete from detallefactura3 where idfactura="+this.facturaSVC.formData.Id+" and claveproducto='"+row.DetallePedido[i].ClaveProducto+"'"
        }
  
         consulta = {
          'consulta':query
        };

        console.log(consulta);
  
        this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
         console.log(res);
        })
      }



      



    }
  }
    console.log(row);
  }

  agregarDetalles(row){
    let count = 0;
    let query
      //let clave 
      //let saldo 
      //let saldoanterior
    for (let i=0; i<row.DetallePedido.length; i++){

      
      let clave = row.DetallePedido[i].ClaveProducto;
      let saldo = 0;
      let saldoanterior = 0;

      if (this.facturaSVC.rfcempresa==='PLA11011243A'){

        query = "select top 1 factura.*, DetalleFactura.* from factura left join ovfactura on factura.Id=ovfactura.idFactura left join DetalleFactura on Factura.Id=DetalleFactura.IdFactura where ovfactura.FolioPedido='"+row.Folio+"' and DetalleFactura.ClaveProducto='"+clave+"' order by Factura.Id desc, DetalleFactura.IdDetalle desc"
      }
      else if (this.facturaSVC.rfcempresa=='AIN140101ME3'){
        query = "select top 1 factura2.*, DetalleFactura2.* from factura2 left join ovfactura on factura2.Id=ovfactura.idFactura left join DetalleFactura2 on Factura2.Id=DetalleFactura2.IdFactura where ovfactura.FolioPedido='"+row.Folio+"' and DetalleFactura2.ClaveProducto='"+clave+"' order by Factura2.Id desc, DetalleFactura2.IdDetalle desc"
      }  else if (this.facturaSVC.rfcempresa=='DTM200220KRA'){
        query = "select top 1 factura3.*, DetalleFactura3.* from factura3 left join ovfactura on factura3.Id=ovfactura.idFactura left join DetalleFactura3 on Factura3.Id=DetalleFactura3.IdFactura where ovfactura.FolioPedido='"+row.Folio+"' and DetalleFactura3.ClaveProducto='"+clave+"' order by Factura3.Id desc, DetalleFactura3.IdDetalle desc"
      }

      let consulta = {
        'consulta':query
      };


      console.log(consulta);

      this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
        console.log(res,'SALDO');
        if (res.length>0){

          saldo = res[0].TextoExtra
          saldoanterior = res[0].TextoExtra
        }else{
          saldo = row.DetallePedido[i].Cantidad
          saldoanterior = row.DetallePedido[i].Cantidad;
        }

        if (+saldo>=0){

          count = count + 1;

      consulta = {
        'consulta':"select ClaveSAT from Producto where ClaveProducto='"+clave.slice(0,2)+"'"
      };
  
      console.log(consulta);
  
      this.facturaSVC.getQuery(consulta).subscribe((res1:any)=>{
        console.log(res1,'CLAVESAT');
        if(res1.length>0){
          
          let temp = Object.assign({}, res1[0]); 
          console.log(temp);
          this.facturaSVC.ClaveSAT =  temp.ClaveSAT
        }else{
          this.facturaSVC.ClaveSAT = '01010101'
        }

        //this.obtenerClaveSAT(row.DetallePedido[i].ClaveProducto)

        let detalleFactura : DetalleFactura = {
          IdDetalle: 0,
          IdFactura: this.facturaSVC.formData.Id,
          ClaveProducto: row.DetallePedido[i].ClaveProducto,
          Producto: row.DetallePedido[i].Producto,
          Unidad: row.DetallePedido[i].Unidad,
          ClaveSAT: this.facturaSVC.ClaveSAT,
          PrecioUnitario: row.DetallePedido[i].PrecioUnitario,
          PrecioUnitarioDlls: row.DetallePedido[i].PrecioUnitarioDlls,
          Cantidad: (+saldo).toFixed(4),
          Importe: (+saldo * +row.DetallePedido[i].PrecioUnitario).toFixed(4),
          ImporteDlls: (+saldo * +row.DetallePedido[i].PrecioUnitarioDlls).toFixed(4),
          Observaciones: '',
          TextoExtra: (+saldo - +saldoanterior).toString(),
          ImporteIVA: '0.0000',
          ImporteIVADlls: '0.0000'
        }

        console.log(detalleFactura);

        this.facturaSVC.addDetalleFactura(detalleFactura).subscribe(res => {                    
         console.log(res);

         if ((i+1)==row.DetallePedido.length){

          if (count>0){

           /*  localStorage.setItem('FacturaID',this.facturaSVC.formData.Id.toString())
          this.router.navigate(['/facturacionCxcAdd', Id]); */
          let query = "insert into ovfactura values("+this.facturaSVC.formData.Id+","+row.Folio+")"

      let consulta = {
        'consulta':query
      };

      console.log(consulta);

      this.facturaSVC.getQuery(consulta).subscribe((res:any)=>{
       console.log(res);
      })
          }else{
            Swal.fire({
              title: 'No hay productos para agregar',
              icon: 'error',
            });
          }



        }
        });
  
  
      })


        }else{

          if ((i+1)==row.DetallePedido.length){
  
            if (count==0){
              Swal.fire({
                title: 'No hay productos para agregar',
                icon: 'error',
              });
            }
          }
        }//fin del si del saldo
        


      })





      
      
     
    }
  }

}
