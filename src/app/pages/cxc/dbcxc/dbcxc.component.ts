import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild  } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-dbcxc',
  templateUrl: './dbcxc.component.html',
  styleUrls: ['./dbcxc.component.css']
})
export class DbcxcComponent implements OnInit {

  constructor() { 
   
  }

  ngOnInit() {
    // this.altura = 10;
  }

  // altura;

  // ngAfterViewChecked(): void {
  //   //Called after every check of the component's view. Applies to components only.
  //   //Add 'implements AfterViewChecked' to the class.
  //   this.altura = document.getElementById("almacen").offsetHeight
  // }
  color: ThemePalette = 'accent';


  //Variable para Filtrar  por Cobranza
  checkedCobranza = true;
  disabledCobranza = false;

  onChangeCobranza() {
    if (this.checkedCobranza == true) {
      this.checkedCobranza = false;
    } else {
      this.checkedCobranza = true;
    }
  }

  //Variable para Filtrar  por Factura
  checkedFactura = false;
  disabledFactura = false;
  

  onChangeFactura() {
    if (this.checkedFactura == true) {
      this.checkedFactura = false;
    } else {
      this.checkedFactura = true;
    }
  }


}
