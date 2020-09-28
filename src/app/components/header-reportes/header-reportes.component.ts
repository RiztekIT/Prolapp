import { Component, OnInit } from '@angular/core';
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

  constructor( public enviarfact: EnviarfacturaService) { }

  ngOnInit() {
    this.rfcE = this.enviarfact.empresa.RFC;
    this.nombreE = this.enviarfact.empresa.RazonSocial;
    this.logo = '../../../assets/images/'+this.rfcE+'.png'
  }

}
