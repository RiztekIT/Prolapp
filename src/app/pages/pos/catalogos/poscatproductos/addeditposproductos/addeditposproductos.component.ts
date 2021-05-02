import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PosserviceService } from '../../../posservice.service';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';


import { ConnectionHubServiceService } from '../../../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "POS", "titulo": 'POSProducto'}
]

@Component({
  selector: 'app-addeditposproductos',
  templateUrl: './addeditposproductos.component.html',
  styleUrls: ['./addeditposproductos.component.css']
})
export class AddeditposproductosComponent implements OnInit {

  IVA;
  Tipo;
  Info;
  idproductoservicio: number;

  constructor(public posSVC: PosserviceService,
    public dialogbox: MatDialogRef<AddeditposproductosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() {

    this.ConnectionHubService.ConnectionHub(origen[0]);
    
    
    if(this.data){

      this.Tipo = this.data.Tipo;
      this.Info = this.data.Info;
    }

    
    if (this.posSVC.productosForm.iva == '0.16') {
      this.IVA = true

    } else {
      this.IVA = false

    }
  }



  onClose(){
    this.dialogbox.close();
  }

  agregar() {

    if (this.posSVC.addedit == 'Agregar Producto') {
      this.posSVC.productosForm.tipo = 'Producto';

    } else if (this.posSVC.addedit == 'Agregar Servicio') {
      this.posSVC.productosForm.tipo = 'Servicio';
    }

    this.posSVC.productosForm.Estatus = 'Activo';

    this.posSVC.productosForm.UnidadMedida = this.posSVC.productosForm.unidadMedidaSAT
    this.posSVC.productosForm.campoextra1 = '';
    this.posSVC.productosForm.campoextra2 = '';
    this.posSVC.productosForm.campoextra3 = '';
    this.posSVC.productosForm.fechalta = new Date();
    this.posSVC.productosForm.fechabaja = new Date();
    this.posSVC.productosForm.categoria1 = '';
    this.posSVC.productosForm.categoria2 = '';
    this.posSVC.productosForm.categoria3 = '';

    if (this.IVA == true) {
      this.posSVC.productosForm.iva = '0.16';
    } else {
      this.posSVC.productosForm.iva = '0';
    }



    console.log(this.posSVC.productosForm);

      
      let nombre = this.posSVC.productosForm.nombre
      let precioVenta = this.posSVC.productosForm.precioVenta
      let precioCosto = this.posSVC.productosForm.precioCosto
      let Clave = this.posSVC.productosForm.Clave
      let descripcion = this.posSVC.productosForm.descripcion
      let Estatus = 'Activo';
      let UnidadMedida = this.posSVC.productosForm.UnidadMedida
      let unidadMedidaSAT = this.posSVC.productosForm.unidadMedidaSAT
      let codigoBarras = this.posSVC.productosForm.codigoBarras
      let ClaveSAT = this.posSVC.productosForm.ClaveSAT
      let categoria1 = ''
      let categoria2 = ''
      let categoria3 = ''
      let tipo = this.posSVC.productosForm.tipo
      let fechalta = new Date().toISOString().slice(0,10);
      let fechabaja = new Date(10/10/10).toISOString().slice(0,10);
      let iva = this.posSVC.productosForm.iva
      let campoextra1 = ''
      let campoextra2 = ''
      let campoextra3 = ''

    let consulta = {
      'consulta':"insert into productos values('"+nombre+"','"+precioVenta+"','"+precioCosto+"','"+Clave+"','"+descripcion+"','"+Estatus+"','"+UnidadMedida+"','"+unidadMedidaSAT+"','"+codigoBarras+"','"+ClaveSAT+"','"+categoria1+"','"+categoria2+"','"+categoria3+"','"+tipo+"','"+fechalta+"','"+fechabaja+"','"+iva+"','"+campoextra1+"','"+campoextra2+"','"+campoextra3+"')"
    };

    
    console.log(consulta);
      // this.productosService.productosForm.campoextra1 = id.toString();
      this.posSVC.generarConsulta(consulta).subscribe((resp:any) => {
        console.log(resp);
        this.ConnectionHubService.on(origen[0]);
        // ! paquetes agregar el idservicio para relacionar paquete con servicio
    


        if (resp.length==0 ) {

          Swal.fire({
            icon: 'success',
            title: 'Producto / Servicio Agregado',
            text: '' + this.posSVC.productosForm.nombre + '',
            timer: 1500
          })
          this.dialogbox.close();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error: ' + resp,
            icon: 'error',
          });
        }

      })
    
    // console.log('%c%s', 'color: #00bf00', );



  }

  editar(){
    if (this.IVA == true) {
      this.posSVC.productosForm.iva = '0.16';
    } else {
      this.posSVC.productosForm.iva = '0';
    }

    let idproductos = this.posSVC.productosForm.idProductos
    let nombre = this.posSVC.productosForm.nombre
    let precioVenta = this.posSVC.productosForm.precioVenta
    let precioCosto = this.posSVC.productosForm.precioCosto
    let Clave = this.posSVC.productosForm.Clave
    let descripcion = this.posSVC.productosForm.descripcion
    let Estatus = 'Activo';
    let UnidadMedida = this.posSVC.productosForm.UnidadMedida
    let unidadMedidaSAT = this.posSVC.productosForm.unidadMedidaSAT
    let codigoBarras = this.posSVC.productosForm.codigoBarras
    let ClaveSAT = this.posSVC.productosForm.ClaveSAT
    let categoria1 = ''
    let categoria2 = ''
    let categoria3 = ''
    let tipo = this.posSVC.productosForm.tipo
    let iva = this.posSVC.productosForm.iva



    let consulta = {
      'consulta':"update productos set nombre='"+nombre+"',precioVenta='"+precioVenta+"',precioCosto='"+precioCosto+"',Clave='"+Clave+"',descripcion='"+descripcion+"',Estatus='"+Estatus+"',UnidadMedida='"+UnidadMedida+"',unidadMedidaSAT='"+unidadMedidaSAT+"',codigoBarras='"+codigoBarras+"',ClaveSAT='"+ClaveSAT+"',categoria1='"+categoria1+"',categoria2='"+categoria2+"',categoria3='"+categoria3+"',tipo='"+tipo+"',iva='"+iva+"' where idproductos="+idproductos+";"
    };
    console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe((resp:any) => {
      console.log(resp);
      this.ConnectionHubService.on(origen[0]);
      if (resp.length==0 ) {
        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado',
          text: '' + this.posSVC.productosForm.nombre + '',
          timer: 1500
        })
        this.dialogbox.close();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error: ' + resp,
          icon: 'error',
        });
      }

    })

  }

}
