import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-calendario-calidad',
  templateUrl: './calendario-calidad.component.html',
  styles: []
})
export class CalendarioCalidadComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('Calidad');
  }

}
