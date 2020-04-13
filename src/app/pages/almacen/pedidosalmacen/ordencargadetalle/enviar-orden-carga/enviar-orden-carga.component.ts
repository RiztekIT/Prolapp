import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-enviar-orden-carga',
  templateUrl: './enviar-orden-carga.component.html',
  styleUrls: ['./enviar-orden-carga.component.css']
})
export class EnviarOrdenCargaComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['/ordencargadetalle']);
  }

}
