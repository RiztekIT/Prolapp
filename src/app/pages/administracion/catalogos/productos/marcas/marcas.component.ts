import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import {MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/Models/catalogos/productos-model';
import { ProductosService } from '../../../../../services/catalogos/productos.service';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Marca'}
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
  "titulo": 'Marca',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  titulo: string
  tipo: string

  
  ProdsExistentes = false;

  // dropdown
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  options: Producto[] = [];
  listproducto: Producto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ProductosService:ProductosService,
    public dialogbox: MatDialogRef<MarcasComponent>,
    private ConnectionHubService: ConnectionHubServiceService,) { }

  ngOnInit() {
    this.ConnectionHubService.ConnectionHub(origen[0]);
    console.clear();
    this.AsignarDatos()
    this.dropdownRefresh()
  }

  AsignarDatos(){
    console.log('%c⧭', 'color: #731d6d', this.data);
    
    this.titulo = this.data.movimiento
    this.tipo = this.data.tipo
    if (this.tipo == 'Editar') {
      this.ProductosService.dataMarcas = this.data.data
    }
  }
  
  onClose() {
    this.dialogbox.close();
  }

  AddEditMarcas(){
    let data = this.ProductosService.dataMarcas
    console.log('%c⧭', 'color: #00ff00', data);
    if (this.tipo == 'Agregar') {
      
      this.ProductosService.addMarcasProductos(data).subscribe(res => {
        this.ConnectionHubService.on(origen[0])
        
        let datosExtra = this.ProductosService.dataMarcas.NombreMarca
        this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()
      })
    } else {
      this.ProductosService.updateMarcas(data).subscribe(res => {
        this.ConnectionHubService.on(origen[0])
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()

      })
      
    }
  }

  check(checkbox: any) {
    if (checkbox == true) {
      this.ProdsExistentes = true
      console.log(this.ProdsExistentes);
    } else {
      this.ProdsExistentes = false
      console.log(this.ProdsExistentes);

    }
  }


  // dropdown

  dropdownRefresh() {
    this.ProductosService.getProductosList().subscribe(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listproducto.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });
  }

  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdProducto.toString().includes(filterValue));
  }

  onSelectionChange(option: Producto, event){

    if (event.isUserInput){
      console.log('producto',option);
      this.ProductosService.dataMarcas.ProductoMarca = option.Nombre
    }

  }





}
