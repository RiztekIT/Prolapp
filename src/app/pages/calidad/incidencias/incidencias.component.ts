import { Component, OnInit } from '@angular/core';

declare function steps();

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styles: []
})
export class IncidenciasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    steps()
  }

}
