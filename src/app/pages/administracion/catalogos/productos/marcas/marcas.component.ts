import { Component, Inject, OnInit } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ProductosService } from '../../../../../services/catalogos/productos.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  titulo: string
  tipo: string

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ProductosService:ProductosService,
    public dialogbox: MatDialogRef<MarcasComponent>,) { }

  ngOnInit() {
    console.clear();
    this.AsignarDatos()
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
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()
      })
    } else {
      this.ProductosService.updateMarcas(data).subscribe(res => {
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()

      })
      
    }
  }



}
