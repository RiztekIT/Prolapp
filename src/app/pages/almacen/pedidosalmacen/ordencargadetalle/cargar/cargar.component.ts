import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.css']
})
export class CargarComponent implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
    

  }


}
