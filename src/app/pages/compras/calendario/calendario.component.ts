import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';
@Component({
  selector: 'app-ccalendario',
  templateUrl: './calendario.component.html',
  styles: []
})
export class CalendarioCComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('Compras');
  }
  calendario(){
    // this.router.navigate(['/angularCalendar']);
    // this.calendarioService.filter('Compras');
}
}
