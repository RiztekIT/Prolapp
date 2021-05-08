import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DetalleEntrada, Entrada, PosserviceService } from '../../posservice.service';
import { Location } from '@angular/common';
import { AddeditposentradaproductosComponent } from './addeditposentradaproductos/addeditposentradaproductos.component';



import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "POS", 
  "titulo": 'POSEntrada',
  "datosExtra": '',
  },
]

let origen: { origen: string, titulo: string }[] = [
  {"origen": "POS", "titulo": 'POSEntrada'}
]


@Component({
  selector: 'app-addeditposentrada',
  templateUrl: './addeditposentrada.component.html',
  styleUrls: ['./addeditposentrada.component.css'],
 
})
export class AddeditposentradaComponent implements OnInit {


  constructor(public posSVC: PosserviceService, public router: Router,
    private location: Location, private dialog: MatDialog,
    private ConnectionHubService: ConnectionHubServiceService,) { }
    Estatus;
    listData: MatTableDataSource<any>;
    @ViewChild(MatSort, null) sort: MatSort;
    displayedColumns: string[] = ['Clave', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];



  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.Estatus = 'Cerrada';
    this.posSVC.entradaForm = JSON.parse(localStorage.getItem('entradaMercancia'));
    console.log(this.posSVC.entradaForm);
    
    this.refreshTablaProductos();

    
  }

  Regresar(){
    this.location.back();
  }

  agregarProducto(){

    this.posSVC.addeditdetalleEntrada = 'Agregar'

    
    

    this.posSVC.detalleentradaForm = new DetalleEntrada;
    this.posSVC.detalleentradaForm = {
      iddetalleentrada:0,
      identrada:0,
      idproducto:0,
      nombreproducto:'',
      claveproducto:'',
      precioProducto:'',
      cantidad:'',
      subtotal:'',
      iva:'',
      total:'',
      observaciones:'',
      tipodecambio:'',
      precioProductodlls:'',
      subtotaldlls:'',
      ivadlls:'',
      totaldlls:'',}
    this.posSVC.detalleentradaForm.identrada = this.posSVC.entradaForm.idEntrada;

    
    

const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="80%";
let dlg = this.dialog.open(AddeditposentradaproductosComponent, dialogConfig);
dlg.afterClosed().subscribe(resp=>{
  this.refreshTablaProductos();
  this.guardar();
})
  }


  refreshTablaProductos(){

    let consulta = {
      'consulta':'select * from DetalleEntrada where identrada='+this.posSVC.entradaForm.idEntrada
    };
    console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe((data:any) => {
      console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.totales();
      

    })
  }

  totales(){

    this.posSVC.entradaForm.subtotal = '0';
    this.posSVC.entradaForm.total = '0';
    this.posSVC.entradaForm.iva = '0';

    /* console.log(this.listDataServicios); */

    for (let i=0; i<this.listData.data.length; i++){

      this.posSVC.entradaForm.subtotal = (+this.posSVC.entradaForm.subtotal + +this.listData.data[i].subtotal).toFixed(2);
      this.posSVC.entradaForm.total = (+this.posSVC.entradaForm.total + +this.listData.data[i].total).toFixed(2);
      this.posSVC.entradaForm.iva = (+this.posSVC.entradaForm.iva + +this.listData.data[i].iva).toFixed(2);

    }

    let entrada = this.posSVC.entradaForm;
    let fecha = new Date().toISOString().slice(0,10);

    let consulta = {
      'consulta':"update EntradaMercancia set idProveedor=" + entrada.idProveedor + ",nombreProveedor='" + entrada.nombreProveedor + "',folio='" + entrada.folio + "',descripcion='" + entrada.descripcion + "',estatus='" + entrada.estatus + "',categoria1='" + entrada.categoria1 + "',categoria2='" + entrada.categoria2 + "',categoria3='" + entrada.categoria3 + "',tipo='" + entrada.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + entrada.campoextra1 + "',campoextra2='" + entrada.campoextra2 + "',campoextra3='" + entrada.campoextra3 + "',subtotal='" + entrada.subtotal + "',iva='" + entrada.iva + "',total='" + entrada.total + "',subtotaldlls='" + entrada.subtotaldlls + "',ivadlls='" + entrada.ivadlls + "',totaldlls='" + entrada.totaldlls + "',sucursal='" + entrada.sucursal + "' where idEntrada=" +entrada.idEntrada+""
    };
    console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe();

  }

  guardar(){
    
      
    
    //console.log('%c%s', 'color: #e5de73', this.posSVC.entradaForm.sucursal);
    console.log(this.posSVC.entradaForm);
    this.posSVC.entradaForm.estatus='Guardada';
    let entrada = this.posSVC.entradaForm;
    let fecha = new Date(this.posSVC.entradaForm.fechaexpedicion).toISOString().slice(0,10);


    let consulta = {
      'consulta':"update EntradaMercancia set idProveedor=" + entrada.idProveedor + ",nombreProveedor='" + entrada.nombreProveedor + "',folio='" + entrada.folio + "',descripcion='" + entrada.descripcion + "',estatus='" + entrada.estatus + "',categoria1='" + entrada.categoria1 + "',categoria2='" + entrada.categoria2 + "',categoria3='" + entrada.categoria3 + "',tipo='" + entrada.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + entrada.campoextra1 + "',campoextra2='" + entrada.campoextra2 + "',campoextra3='" + entrada.campoextra3 + "',subtotal='" + entrada.subtotal + "',iva='" + entrada.iva + "',total='" + entrada.total + "',subtotaldlls='" + entrada.subtotaldlls + "',ivadlls='" + entrada.ivadlls + "',totaldlls='" + entrada.totaldlls + "',sucursal='" + entrada.sucursal + "' where idEntrada=" +entrada.idEntrada+""
    };
    this.posSVC.generarConsulta(consulta).subscribe((res:any)=>{
      
      this.ConnectionHubService.on(origen[0]);
      console.log(res);
      if (res.length==0){
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: ''+this.posSVC.entradaForm.folio+'',
          timer: 1500
        })
        
        
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error: '+ res,
          icon: 'error',  
        });
      }
    })
  
}

onEdit(row){
  console.log(row);
  this.posSVC.addeditdetalleEntrada = 'Editar'
  
      
      
  
  this.posSVC.detalleentradaForm = new DetalleEntrada;
  this.posSVC.detalleentradaForm = row;
  //this.ordenservicioService.detalleservicioForm.idservicio = this.ordenservicioService.servicioForm.idServicio;
  
  
  
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width="80%";
  let dlg = this.dialog.open(AddeditposentradaproductosComponent, dialogConfig);
  dlg.afterClosed().subscribe(resp=>{
  this.refreshTablaProductos();
  })

}

onDelete(row){

  console.log(row);
  Swal.fire({
    title: '¿Borrar Detalles?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {
      let consulta = {
        'consulta':'delete from DetalleEntrada where iddetalleentrada ='+row.iddetalleentrada
      };
      let consulta2 = {
        'consulta':'delete from inventarios where iddetalleorigen ='+row.iddetalleentrada
      };

      console.log(consulta);
      console.log(consulta2);
        this.posSVC.generarConsulta(consulta).subscribe(res=>{
          this.posSVC.generarConsulta(consulta2).subscribe(resp=>{

            this.ConnectionHubService.on(origen[0]);
            Swal.fire({
              title: 'Borrado',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
            }).then((result)=>{
              this.refreshTablaProductos();
              
            });
          })
        
  
          
        })
  
       
    }
  })

}


  

}
