import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dbcalidad',
  templateUrl: './dbcalidad.component.html',
  styles: []
})
export class DbcalidadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.altura = 10;


  }

  altura;

  ngAfterViewInit(){
    // console.log(document.getElementById("compras").offsetHeight);
    
}

ngAfterViewChecked(): void {
  //Called after every check of the component's view. Applies to components only.
  //Add 'implements AfterViewChecked' to the class.
  this.altura = document.getElementById("compras").offsetHeight
}

}
