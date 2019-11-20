import { Component, OnInit } from '@angular/core';

declare function graficas_dbcalidad();
// declare function todo();

@Component({
  selector: 'app-dbcalidad',
  templateUrl: './dbcalidad.component.html',
  styles: []
})
export class DbcalidadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    graficas_dbcalidad();
    // todo();
  }

}
