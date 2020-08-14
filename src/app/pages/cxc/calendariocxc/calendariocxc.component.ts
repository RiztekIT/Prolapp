import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-calendariocxc',
  templateUrl: './calendariocxc.component.html',
  styles: []
})
export class CalendariocxcComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('CxC');
  }

}
