import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { RedhgfacturacionService } from '../../../../services/redholding/redhgfacturacion.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { map, startWith } from 'rxjs/operators';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Producto'}
]
let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Administracion", 
  "titulo": 'Producto',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-redhgaddeditproductos',
  templateUrl: './redhgaddeditproductos.component.html',
  styleUrls: ['./redhgaddeditproductos.component.css']
})
export class RedhgaddeditproductosComponent implements OnInit {

  constructor(
    public dialogbox: MatDialogRef<RedhgaddeditproductosComponent>,
    public redhgSVC: RedhgfacturacionService,
    public ServiceUnidad: UnidadMedidaService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService,
  ) { }

  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  usuariosesion
  movimiento
  public listUM: Array<any> = [];
  iva
  retiva
  estatusproducto;

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    /* this.BodegaInfo = this.data; */
    this.movimiento = this.data.movimiento
    if (this.movimiento=='Agregar'){

      this.resetForm();
    }else{
      if (this.redhgSVC.formDataProductos.IVA == '0.16'){
        this.iva = true;
      }else{
        this.iva = false;
      }
      if (this.redhgSVC.formDataProductos.RETIVA == '0.04'){
        this.retiva = true;
      }else{
        this.retiva = false;
      }
      this.EstatusProducto();
    }
      this.unidadMedida();
  }

  unidadMedida(){
    // this.listUM = [];
    // this.enviarfact.unidadMedida().subscribe(data=>{
    //   //console.log(JSON.parse(data).data);
    //   for (let i=0; i<JSON.parse(data).data.length; i++){
    //     this.listUM.push(JSON.parse(data).data[i])
    //   }
    this.ServiceUnidad.GetUnidadesMedida().subscribe(data =>{
        this.listUM = data;
      

        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUnidad(value))
        );


    });
      

      
    // })
  }

  private _filterUnidad(value: any): any[] {
    console.log(value);
   const filterValueUnidad = value.toString().toLowerCase();
   return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
 }

  onClose() {
    this.dialogbox.close();
    //this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (this.movimiento=='Agregar'){

      if (form.controls['IVA'].value == true) {
        this.redhgSVC.formDataProductos.IVA = '0.16';
        }  else {
          this.redhgSVC.formDataProductos.IVA = '0';
        }
      if (form.controls['RETIVA'].value == true) {
        this.redhgSVC.formDataProductos.RETIVA = '0.04';
        }  else {
          this.redhgSVC.formDataProductos.RETIVA = '0';
        }

        this.redhgSVC.formDataProductos.Estatus='Activo'

        let producto = this.redhgSVC.formDataProductos
        // console.log(this.service.formData.IVA);
        console.log( this.redhgSVC.formDataProductos);
        let consulta = "Insert into redhgProducto(Nombre,PrecioVenta,PrecioCosto,Cantidad,ClaveProducto, Stock, DescripcionProducto, Estatus, UnidadMedida, Iva, CodigoBarras, ClaveSAT, Categoria,RETIVA) values ("+
          "'"+producto.Nombre+"',"+
          "'"+producto.PrecioVenta+"',"+
          "'"+producto.PrecioCosto+"',"+
          "'"+producto.Cantidad+"',"+
          "'"+producto.ClaveProducto+"',"+
          "'"+producto.Stock+"',"+
          "'"+producto.DescripcionProducto+"',"+
          "'"+producto.Estatus+"',"+
          "'"+producto.UnidadMedida+"',"+
          "'"+producto.IVA+"',"+
          "'"+producto.CodigoBarras+"',"+
          "'"+producto.ClaveSAT+"',"+
          "'"+producto.Categoria+"',"+
          "'"+producto.RETIVA+"'"+
          ")"





    
        /* addProducto(this.redhgSVC.formDataProductos) */
        console.log(consulta);
        this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
          this.ConnectionHubService.on(origen[0])
          
          let datosExtra = this.redhgSVC.formDataProductos.Nombre
          this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
    
          console.log(res);
          this.movimientos(this.movimiento)
          Swal.fire({
            icon: 'success',
            title: 'Producto Agregado',
          })
        }
        );
        this.resetForm(form);


    }else if (this.movimiento=='Editar'){


      if (form.controls['IVA'].value == true) {
        this.redhgSVC.formDataProductos.IVA = '0.16';
        }  else {
          this.redhgSVC.formDataProductos.IVA = '0';
        }
        if (form.controls['RETIVA'].value == true) {
          this.redhgSVC.formDataProductos.RETIVA = '0.04';
          }  else {
            this.redhgSVC.formDataProductos.RETIVA = '0';
          }

        let producto = this.redhgSVC.formDataProductos
        // console.log(this.service.formData.IVA);
        console.log( this.redhgSVC.formDataProductos);
        let consulta = "update redhgProducto set "+
          "Nombre='"+producto.Nombre+"',"+
          "PrecioVenta='"+producto.PrecioVenta+"',"+
          "PrecioCosto='"+producto.PrecioCosto+"',"+
          "Cantidad='"+producto.Cantidad+"',"+
          "ClaveProducto='"+producto.ClaveProducto+"',"+
          "Stock='"+producto.Stock+"',"+
          "DescripcionProducto='"+producto.DescripcionProducto+"',"+
          "Estatus='"+producto.Estatus+"',"+
          "UnidadMedida='"+producto.UnidadMedida+"',"+
          "Iva='"+producto.IVA+"',"+
          "CodigoBarras='"+producto.CodigoBarras+"',"+
          "ClaveSAT='"+producto.ClaveSAT+"',"+
          "Categoria='"+producto.Categoria+"',"+
          "RETIVA='"+producto.RETIVA+"'"+
          " where IdProducto=+"+producto.IdProducto+";"





    
        /* addProducto(this.redhgSVC.formDataProductos) */
        this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
          this.ConnectionHubService.on(origen[0])
          
          let datosExtra = this.redhgSVC.formDataProductos.Nombre
          this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
    
          console.log(res);
          this.movimientos(this.movimiento)
          Swal.fire({
            icon: 'success',
            title: 'Producto Actualizado',
          })
        }
        );
        /* this.resetForm(form); */







    }
   
  }

  movimientos(movimiento){
    // let event = new Array<Evento>();
    let u = this.usuariosesion.user
    let fecha = new Date();
    
    let evento = new Evento();
    this.usuarioService.getUsuarioNombreU(u).subscribe(res => {
    let idU=res[0].IdUsuario

    evento.IdUsuario = idU
    evento.Autorizacion = '0'
    evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
    evento.Movimiento = movimiento
    
    console.log(evento);
    this.eventosService.addEvento(evento).subscribe(respuesta =>{
      console.log(respuesta);
    })
    })
  }

  resetForm(form?: NgForm) {
    if (form != null){

      form.resetForm();
    }

    this.redhgSVC.formDataProductos = {
      IdProducto: 0,
      Nombre: '',
      PrecioVenta: '',
      PrecioCosto: '',
      Cantidad: '',
      ClaveProducto: '',
      Stock: '',
      DescripcionProducto: '',
      Estatus: '',
      UnidadMedida: '',
      CodigoBarras: '',
      IVA: '',
      ClaveSAT: '',
      Categoria: '',
      RETIVA: ''
    }

  }

  changeEstatus(event){
    console.log(event);
    if (event.checked){
      this.redhgSVC.formDataProductos.Estatus='Activo'
      
    }else{
      this.redhgSVC.formDataProductos.Estatus='Inactivo'

    }
    
  }

  EstatusProducto(){

    if (this.redhgSVC.formDataProductos.Estatus=='Activo'){
      this.estatusproducto = true

    }else if (this.redhgSVC.formDataProductos.Estatus=='Inactivo'){
      this.estatusproducto = false
    }

  }

}
