import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-calendario-ventas',
  templateUrl: './calendario-ventas.component.html',
  styles: []
})
export class CalendarioVentasComponent implements OnInit {
  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('Ventas');
  }

}
