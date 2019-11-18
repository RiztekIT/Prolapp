import { Component, OnInit } from '@angular/core';

declare function lecheData();

@Component({
  selector: 'app-leche-historial',
  templateUrl: './leche-historial.component.html',
  styles: []
})
export class LecheHistorialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    lecheData();
  }


}
