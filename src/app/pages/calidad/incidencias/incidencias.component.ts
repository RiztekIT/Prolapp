import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function steps();

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styles: []
})
export class IncidenciasComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    steps()
  }

  recargar(){
    this.router.navigate(['/incidencias']);
  }

}
