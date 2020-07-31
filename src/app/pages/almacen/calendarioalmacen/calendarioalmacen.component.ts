import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-calendarioalmacen',
  templateUrl: './calendarioalmacen.component.html',
  styles: []
})
export class CalendarioalmacenComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
  
  }
  
  ngOnInit() {
    this.calendarioService.filter('Almacen');
  }

}
