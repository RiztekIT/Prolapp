import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard-importacion',
  templateUrl: './dashboard-importacion.component.html',
  styleUrls: ['./dashboard-importacion.component.css']
})
export class DashboardImportacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.altura = 10;
  }
  
  altura;

  ngAfterViewChecked(): void {
    this.altura = document.getElementById("importacion").offsetHeight
  }
  

}
