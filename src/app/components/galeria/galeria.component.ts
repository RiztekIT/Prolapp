import { Component, OnInit } from '@angular/core';

declare function GaleriaInit();

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styles: []
})
export class GaleriaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    GaleriaInit();
  }

}
