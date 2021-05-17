import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm, FormGroup, FormArray, Validators, FormControl  } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { startWith, map } from 'rxjs/operators';
import { UnidadMedidaService } from '../../../../../services/unidadmedida/unidad-medida.service';


//evento
import {Inject} from '@angular/core';
import {MAT_DIALOG_DATA } from "@angular/material";
import { UsuariosServieService } from '../../../../../services/catalogos/usuarios-servie.service';
import { EventosService } from '../../../../../services/eventos/eventos.service';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { DatePipe } from '@angular/common';
import { MarcasProductos } from 'src/app/Models/catalogos/marcasproductos-model';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

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
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css']})
export class AddProductoComponent implements OnInit {
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  BodegaInfo
  movimiento
  usuariosesion
  //Clave Unidad
public listUM: Array<any> = [];

// ^ marcasRelacionadas
MarcasRel = false;

  constructor(public dialogbox: MatDialogRef<AddProductoComponent>,
    public service: ProductosService, 
    private snackBar: MatSnackBar,
    public enviarfact: EnviarfacturaService, 
    public ServiceUnidad: UnidadMedidaService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() {    
  this.ConnectionHubService.ConnectionHub(origen[0]);
  this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
  this.BodegaInfo = this.data;
  this.movimiento = this.BodegaInfo.movimiento
    this.resetForm();
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

   //Filter Unidad
   private _filterUnidad(value: any): any[] {
     console.log(value);
    const filterValueUnidad = value.toString().toLowerCase();
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
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
      Categoria: ''
    }

  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (form.controls['IVA'].value == true) {
    this.service.formData.IVA = '0.16';
    }  else {
      this.service.formData.IVA = '0';
    }
    // console.log(this.service.formData.IVA);
    console.log( this.service.formData);
    this.service.addProducto(this.service.formData).subscribe(res => {
      this.ConnectionHubService.on(origen[0])
      
      let datosExtra = this.service.formData.Nombre
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

// ^ Checkbox para marcas relacionadas
  check(checkbox: any) {
    if (checkbox == true) {
      this.MarcasRel = true
      console.log(this.MarcasRel);
    } else {
      this.MarcasRel = false
      console.log(this.MarcasRel);

    }
  }

  agregarMarcaRel() {
    console.clear();
    this.service.MarcasRelForm.ProductoMarca = this.service.formData.Nombre
    console.log('%c⧭', 'color: #0088cc', this.service.MarcasRelForm);

    this.service.addMarcasProductos(this.service.MarcasRelForm).subscribe(resMP => {
      console.log(resMP);
      this.service.MarcasRelForm = new MarcasProductos()
    })
  }

}
