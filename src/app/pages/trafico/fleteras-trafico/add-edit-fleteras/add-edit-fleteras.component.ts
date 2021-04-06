import { Component, Inject, OnInit } from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Fleteras } from 'src/app/Models/trafico/fleteras-model';
import { FleterasService } from '../../../../services/trafico/Fleteras/fleteras.service';

@Component({
  selector: 'app-add-edit-fleteras',
  templateUrl: './add-edit-fleteras.component.html',
  styleUrls: ['./add-edit-fleteras.component.css']
})
export class AddEditFleterasComponent implements OnInit {

  titulo: string
  tipo: string


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public FleterasService:FleterasService,
    public dialogbox: MatDialogRef<AddEditFleterasComponent>,
    ) { }
    
    ngOnInit() {
    this.AsignarDatos()
    
  }
  
  AsignarDatos(){
    
    this.titulo = this.data.movimiento
    this.tipo = this.data.tipo
    if (this.tipo == 'Editar') {
      this.FleterasService.dataFleteras = this.data.data
    }
  }
  
  onClose() {
    this.dialogbox.close();
  }
  
  AddEditFletera(){
    let data = this.FleterasService.dataFleteras
    console.log('%c⧭', 'color: #00ff00', data);
    if (this.tipo == 'Agregar') {
      
      this.FleterasService.addfleteras(data).subscribe(res => {
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()
      })
    } else {
      this.FleterasService.updatefleteras(data).subscribe(res => {
        console.log('%c⧭', 'color: #ff8800', res);
        this.onClose()

      })
      
    }
  }



}
