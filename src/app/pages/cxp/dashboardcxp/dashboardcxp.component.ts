import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CalendarioService } from 'src/app/services/calendario/calendario.service';

@Component({
  selector: 'app-dashboardcxp',
  templateUrl: './dashboardcxp.component.html',
  styles: []
})
export class DashboardcxpComponent implements OnInit {

  constructor(public calendarioService:CalendarioService) { }
  ngOnInit() {
    this.calendarioService.filter('CxP');
    this.altura = 10;
  }
  
  altura;

  ngAfterViewChecked(): void {
    this.altura = document.getElementById("importacion").offsetHeight
  }




}
