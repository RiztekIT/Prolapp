import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-direccion-calendario',
  templateUrl: './direccion-calendario.component.html',
  styles: []
})
export class DireccionCalendarioComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('Direccion');
  }

}
