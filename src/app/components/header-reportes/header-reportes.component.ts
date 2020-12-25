import { Component, Inject, OnInit } from '@angular/core';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';


@Component({
  selector: 'app-header-reportes',
  templateUrl: './header-reportes.component.html',
  styleUrls: ['./header-reportes.component.css']
})
export class HeaderReportesComponent implements OnInit {
  logo;
  rfcE;
  nombreE;
  titulo;

  constructor( public enviarfact: EnviarfacturaService) { }

  ngOnInit() {
this.titulo = this.enviarfact.titulo
    this.rfcE = this.enviarfact.empresa.RFC;
    console.log('%c⧭', 'color: #e57373', this.enviarfact.empresa.RFC);
    this.nombreE = this.enviarfact.empresa.RazonSocial;
    this.logo = '../../../assets/images/'+this.rfcE+'.png'
  }

}
