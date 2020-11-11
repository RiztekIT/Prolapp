import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from 'src/app/services/service.index';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  listEmpresa;

  constructor(public _ajustes: SettingsService,public enviarfact: EnviarfacturaService,public servicefactura: FacturaService, public serviceEmpresa: EmpresaService,private recibopagoSVC: ReciboPagoService ) { }

  ngOnInit() {
    this.colocarCheck();
    this.listaempresas();
    // this.obtenerEmpresa();
  }

  cambiarColor(tema: string , link: any){
    this.aplicarCheck(link);
    
    this._ajustes.aplicarTema(tema);

  }

  aplicarCheck( link: any ){

    let selectores: any = document.getElementsByClassName('selector');

    for (let ref of selectores) {
      ref.classList.remove('working');
    }

    link.classList.add('working');

  }

  colocarCheck(){
    let selectores: any = document.getElementsByClassName('selector');  
    
    let tema = this._ajustes.ajustes.tema;
    
    for (let ref of selectores) {
      ref.classList.remove('working');
      if (ref.getAttribute('data-theme') === tema){
        ref.classList.add('working');
        break;

      }
    }  
  }

  cambioEmpresa(event){
    

    this.enviarfact.empresa = event;
    this.serviceEmpresa.empresaActual = event;
    this.enviarfact.rfc = event.RFC;
    this.servicefactura.rfcempresa=event.RFC;
      this.recibopagoSVC.rfcempresa = event.RFC;
      this.servicefactura.rfcempresa = event.RFC;
      this.recibopagoSVC.rfcempresa = event.RFC
      localStorage.setItem('Empresa',JSON.stringify(this.enviarfact.empresa))

      console.clear();
      console.log(this.enviarfact.empresa);
      console.log(this.recibopagoSVC.rfcempresa);

      //this.refreshFacturaList();
      // this.detallesFactura();
      //this.Folio();
      // this.refreshReciboPagoList();
  }

  obtenerEmpresa(){
    let empresa = JSON.parse(localStorage.getItem('Empresa'));
    

    this.enviarfact.empresa = empresa;
    this.enviarfact.rfc = empresa.RFC;
    this.servicefactura.rfcempresa=empresa.RFC;
      this.recibopagoSVC.rfcempresa = empresa.RFC;
      this.servicefactura.rfcempresa = empresa.RFC;
      this.recibopagoSVC.rfcempresa = empresa.RFC
      this.serviceEmpresa.empresaActual = empresa;


  }

  listaempresas(){
    this.serviceEmpresa.getEmpresaList().subscribe(data =>{
      console.log(data);
      this.listEmpresa = data;
      
      // console.log(this.enviarfact.empresa);
      //this.enviarfact.empresa = data[0];
      this.recibopagoSVC.rfcempresa = this.enviarfact.empresa.RFC;
      this.obtenerEmpresa();
      console.log(this.enviarfact.empresa);
      // this.enviarfact.rfc = data[0].RFC;
    })
  }

}
