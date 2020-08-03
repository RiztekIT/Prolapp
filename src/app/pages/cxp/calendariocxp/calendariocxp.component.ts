import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarioService } from '../../../services/calendario/calendario.service';
@Component({
  selector: 'app-calendariocxp',
  templateUrl: './calendariocxp.component.html',
  styles: []
})
export class CalendariocxpComponent implements OnInit {

  constructor(public router: Router, public calendarioService:CalendarioService) { 
    
    
  }
  
  ngOnInit() {
    this.calendarioService.filter('CxP');
  }

}
