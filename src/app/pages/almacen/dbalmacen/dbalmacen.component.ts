import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild  } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AlmacenTotalesComponent } from '../../../components/graficas/almacen/almacen-totales/almacen-totales.component';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';


@Component({
  selector: 'app-dbalmacen',
  templateUrl: './dbalmacen.component.html',
  styleUrls: ['./dbalmacen.component.css']
})
export class DbalmacenComponent implements OnInit {

  constructor(public ocService: OrdenCargaService) { 
   
  }

  ngOnInit() {
    this.altura = 10;
  }

  altura;

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.altura = document.getElementById("almacen").offsetHeight
  }
  color: ThemePalette = 'accent';
  //Variable para Filtrar  por Orden Carga
  checkedOrdenCarga = true;
  disabledOrdenCarga = false;
  


  onChangeOrdenCarga() {
    if (this.checkedOrdenCarga == true) {
      this.checkedOrdenCarga = false;
    } else {
      this.checkedOrdenCarga = true;
    }
  }
  //Variable para Filtrar  por Orden Descarga
  checkedOrdenDescarga = false;
  disabledOrdenDescarga = false;
  

  onChangeOrdenDescarga() {
    if (this.checkedOrdenDescarga == true) {
      this.checkedOrdenDescarga = false;
    } else {
      this.checkedOrdenDescarga = true;
    }
  }
  //Variable para Filtrar  por Traspaso
  checkedTraspaso = false;
  disabledTraspaso = false;
  

  onChangeTraspaso() {
    if (this.checkedTraspaso == true) {
      this.checkedTraspaso = false;
    } else {
      this.checkedTraspaso = true;
    }
  }
  //Variable para Filtrar  por OInventario
  checkedInventario = false;
  disabledInventario = false;
  

  onChangeInventario() {
    if (this.checkedInventario == true) {
      this.checkedInventario = false;
    } else {
      this.checkedInventario = true;
    }
  }

  



}
