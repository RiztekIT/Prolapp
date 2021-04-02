import { Component, OnInit } from '@angular/core';

declare function init_cal();


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styles: []
})
export class CalendarioComponent implements OnInit {

  

  constructor() { }

  ngOnInit() {
    init_cal();
  }

  

}
