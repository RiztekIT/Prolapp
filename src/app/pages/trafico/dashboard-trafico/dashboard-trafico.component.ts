import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild  } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
@Component({
  selector: 'app-dashboard-trafico',
  templateUrl: './dashboard-trafico.component.html',
  styleUrls: ['./dashboard-trafico.component.css']
})
export class DashboardTraficoComponent implements OnInit {

  constructor() { 
   
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
  checkedOrdenCarga = false;
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
  //Variable para Filtrar  por Trafico
  checkedTrafico = true;
  disabledTrafico = false;
  

  onChangeTrafico() {
    if (this.checkedTrafico == true) {
      this.checkedTrafico = false;
    } else {
      this.checkedTrafico = true;
    }
  }


  

}
