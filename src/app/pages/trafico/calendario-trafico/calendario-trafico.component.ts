import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-calendario-trafico',
  templateUrl: './calendario-trafico.component.html',
  styles: []
})
export class CalendarioTraficoComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('Trafico');
  }

}
