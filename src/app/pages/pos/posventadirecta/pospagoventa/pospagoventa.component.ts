import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogRef } from '@angular/material';
import { Pagos, PosserviceService } from '../../posservice.service';
import Swal from 'sweetalert2';


interface Metodos {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-pospagoventa',
  templateUrl: './pospagoventa.component.html',
  styleUrls: ['./pospagoventa.component.css']
})
export class PospagoventaComponent implements OnInit {

  
  selectMetodo
  credito;
  displayedColumns: string[] = ['Folio', 'Cantidad', 'Fecha', 'Metodo', 'Options'];
  listData: MatTableDataSource<any>;  
  @ViewChild(MatSort, null) sort: MatSort;
  cantidadPago;
  saldo

  constructor(public posSVC: PosserviceService, public dialogbox: MatDialogRef<PospagoventaComponent>) { }

  Metodos: Metodos[] = [    
    {value: '01', viewValue: 'Efectivo'},
    {value: '02', viewValue: 'Transferencia Electronica'},
    {value: '03', viewValue: 'Cheque'},
    {value: '04', viewValue: 'Tarjeta de Credito'},
    {value: '05', viewValue: 'Tarjeta de Debito'},    
    
  ];

  public pagoBlanco: Pagos = {
    idpago: 0,
    idventas: this.posSVC.ventasForm.idVentas,
    folio: '',
    cantidad: '',
    campoextra1:'' ,
    campoextra2:'' ,
    campoextra3:'' ,
    fechapago:new Date() ,
    metodopago:'' ,
  }

  ngOnInit() {
    this.credito = false
    this.saldo = this.posSVC.ventasForm.total;
    this.posSVC.pagosForm = this.pagoBlanco;
    this.refreshPagos();
    this.posSVC.addeditpago = 'Agregar'
  }

  refreshPagos(){
    let consulta = {
      'consulta':"select * from pagosclientes where idventas="+this.posSVC.ventasForm.idVentas
    };
    
    
    console.log(consulta);
    this.saldo = this.posSVC.ventasForm.total;
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.posSVC.ventasForm.DetalleVentas = null;

      for (let i=0; i<data.length; i++){
        this.saldo = +this.saldo - +data[i].cantidad

      }
      
      
      
    })
  }

  totales(){



  }

  onEdit(row){
    console.log(row);
    this.posSVC.pagosForm = row;
    this.posSVC.addeditpago = 'Editar'
    this.saldo = +this.saldo + +row.cantidad

  }

  onDelete(row){

      console.log(row);
      Swal.fire({
        title: '¿Borrar Pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
  
          let consulta = {
            'consulta':'delete from pagosclientes where idpago ='+row.pago
          };
        /*   let consulta2 = {
            'consulta':'delete from inventarios where iddetalleorigen ='+row.iddetalleventas
          }; */
          
          console.log(consulta);
          /* console.log(consulta2); */
          this.posSVC.generarConsulta(consulta).subscribe(res=>{
         /*    this.posSVC.generarConsulta(consulta2).subscribe(resp=>{
              
              // this.files.splice(this.files.indexOf(event),1);
            }); */
          })
          
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          }).then((result) => {
            this.refreshPagos();
            
            
            
            
          })
          
          
        }
      })

  }

  agregarPago(){


    if (this.posSVC.pagosForm.cantidad>this.saldo){

      Swal.fire({
        icon: 'error',
        title: 'El Pago excede el Saldo de la Venta',
        /* text: 'Favor de seleccionar el Producto desde la lista', */
        timer: 1500
      })

    }else{

    

    let consulta = {
      'consulta':"select top 1 cast(folio as int) as folio from pagosclientes where idventas="+this.posSVC.ventasForm.idVentas+" order by folio desc"
    };
    console.log(consulta);
  

    this.posSVC.generarConsulta(consulta).subscribe((data:any) => {
      console.log(data);
  let folio    
if (data.length>0){
  folio = +data[0].folio + 1
}else{

  folio = 1;
}

this.posSVC.pagosForm.folio = folio;
let fecha = new Date().toISOString();
let consulta2 = {
  'consulta':"insert into pagosclientes values ("+this.posSVC.ventasForm.idVentas+",'"+this.posSVC.pagosForm.folio+"','"+this.posSVC.pagosForm.cantidad+"','"+this.posSVC.pagosForm.campoextra1+"','"+this.posSVC.pagosForm.campoextra2+"','"+this.posSVC.pagosForm.campoextra3+"','"+fecha+"','"+this.posSVC.pagosForm.metodopago+"');"
};



this.posSVC.generarConsulta(consulta2).subscribe((data:any)=>{
  console.log(data);
  this.refreshPagos();
  this.posSVC.pagosForm = {
    idpago: 0,
    idventas: this.posSVC.ventasForm.idVentas,
    folio: '',
    cantidad: '',
    campoextra1:'' ,
    campoextra2:'' ,
    campoextra3:'' ,
    fechapago:new Date() ,
    metodopago:'' ,
  }

})



    })

  }

  }

  actualizarPago(){

   
    if (this.posSVC.pagosForm.cantidad>this.saldo){

      Swal.fire({
        icon: 'error',
        title: 'El Pago excede el Saldo de la Venta',
        /* text: 'Favor de seleccionar el Producto desde la lista', */
        timer: 1500
      })

    }else{

 


let fecha = new Date().toISOString();
let consulta2 = {
  'consulta':"update pagosclientes set cantidad = '"+this.posSVC.pagosForm.cantidad+"',fechapago='"+fecha+"', metodopago='"+this.posSVC.pagosForm.metodopago+"' where idpago="+this.posSVC.pagosForm.idpago
};


console.log(consulta2);
this.posSVC.generarConsulta(consulta2).subscribe((data:any)=>{
  console.log(data);
  this.refreshPagos();
  this.posSVC.addeditpago = 'Agregar'
  this.posSVC.pagosForm = {
    idpago: 0,
    idventas: this.posSVC.ventasForm.idVentas,
    folio: '',
    cantidad: '',
    campoextra1:'' ,
    campoextra2:'' ,
    campoextra3:'' ,
    fechapago:new Date() ,
    metodopago:'' ,
  }

})


  }


  }

  actualizarVenta(){
    this.posSVC.ventasForm.estatus = 'Credito'
    let servicio = this.posSVC.ventasForm
    let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
  console.log(fecha);
    //let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString().slice(0,10);
    let consulta = {
      'consulta':"update ventas set idCliente=" + servicio.idCliente + ",nombreCliente='" + servicio.nombreCliente + "',precioVenta='" + servicio.precioVenta + "',folio='" + servicio.folio + "',descripcion='" + servicio.descripcion + "',estatus='" + servicio.estatus + "',categoria1='" + servicio.categoria1 + "',categoria2='" + servicio.categoria2 + "',categoria3='" + servicio.categoria3 + "',tipo='" + servicio.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + servicio.campoextra1 + "',campoextra2='" + servicio.campoextra2 + "',campoextra3='" + servicio.campoextra3 + "',subtotal='" + servicio.subtotal + "',iva='" + servicio.iva + "',total='" + servicio.total + "',subtotaldlls='" + servicio.subtotaldlls + "',ivadlls='" + servicio.ivadlls + "',totaldlls='" + servicio.totaldlls + "',clasificacion1='" + servicio.clasificacion1 + "',clasificacion2='" + servicio.clasificacion2 + "',clasificacion3='" + servicio.clasificacion3 + "', sucursal='" + servicio.sucursal + "'  where idVentas=" + servicio.idVentas+";"
    };
    console.log(consulta);
    

    this.posSVC.generarConsulta(consulta).subscribe()
  }


  finalizarVenta(){
    this.posSVC.ventasForm.estatus = 'Pagada'
    let servicio = this.posSVC.ventasForm
    let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
  console.log(fecha);
    //let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString().slice(0,10);
    let consulta = {
      'consulta':"update ventas set idCliente=" + servicio.idCliente + ",nombreCliente='" + servicio.nombreCliente + "',precioVenta='" + servicio.precioVenta + "',folio='" + servicio.folio + "',descripcion='" + servicio.descripcion + "',estatus='" + servicio.estatus + "',categoria1='" + servicio.categoria1 + "',categoria2='" + servicio.categoria2 + "',categoria3='" + servicio.categoria3 + "',tipo='" + servicio.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + servicio.campoextra1 + "',campoextra2='" + servicio.campoextra2 + "',campoextra3='" + servicio.campoextra3 + "',subtotal='" + servicio.subtotal + "',iva='" + servicio.iva + "',total='" + servicio.total + "',subtotaldlls='" + servicio.subtotaldlls + "',ivadlls='" + servicio.ivadlls + "',totaldlls='" + servicio.totaldlls + "',clasificacion1='" + servicio.clasificacion1 + "',clasificacion2='" + servicio.clasificacion2 + "',clasificacion3='" + servicio.clasificacion3 + "', sucursal='" + servicio.sucursal + "'  where idVentas=" + servicio.idVentas+";"
    };
    console.log(consulta);
    

    this.posSVC.generarConsulta(consulta).subscribe(data=>{
      console.log(data);
      Swal.fire({
        icon: 'success',
        title: 'Venta Pagada',
        text: ''+this.posSVC.ventasForm.folio+'',
        timer: 1500
      })

      this.dialogbox.close();
    })

  }

}
