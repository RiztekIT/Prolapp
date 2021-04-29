import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { startWith, map } from 'rxjs/operators';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
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

@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent implements OnInit {
  
  BodegaInfo
  movimiento
  usuariosesion
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  //Clave Unidad
public listUM: Array<any> = [];

  constructor(public dialogbox: MatDialogRef<EditProductoComponent>,
    public service: ProductosService, 
    private snackBar: MatSnackBar, 
    public enviarfact: EnviarfacturaService , 
    public ServiceUnidad: UnidadMedidaService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private ConnectionHubService: ConnectionHubServiceService) { }

iva: boolean;

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
  this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
  this.BodegaInfo = this.data;
  this.movimiento = this.BodegaInfo.movimiento
     if (this.service.formData.IVA == '0.16'){
      this.iva = true;
    }else{
      this.iva = false;
    }
    // console.log(this.service.formData.IVA);
    // console.log(this.iva);
    

    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
  }

  unidadMedida(){
    this.listUM = [];
    // this.enviarfact.unidadMedida().subscribe(data=>{
    //   //console.log(JSON.parse(data).data);
    //   for (let i=0; i<JSON.parse(data).data.length; i++){
    //     this.listUM.push(JSON.parse(data).data[i])
    //   }
    //   console.log(this.listUM);      
    // })

    this.ServiceUnidad.GetUnidadesMedida().subscribe(data =>{
      console.log(data);
        this.listUM = data;
        console.log(this.listUM);

        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUnidad(value))
        );


    });
  }

  
  private _filterUnidad(value: any): any[] {
    const filterValueUnidad = value.toLowerCase();
    //return this.optionsUnidad.filter(optionUnidad => optionUnidad.toString().toLowerCase().includes(filterValueUnidad));
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {

    console.log(form);

    if (form.controls['IVA'].value == true) {
      this.service.formData.IVA = '0.16';
      }  else {
        this.service.formData.IVA = '0';
      }
 console.log(this.service.formData);
    this.service.updateProducto(this.service.formData).subscribe(res => {
      this.ConnectionHubService.on(origen[0])
      this.movimientos(this.movimiento)
      Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado'
      })
    });
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

// ^ marcasRelacionadas Variables
MarcasRel = false;

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
