import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { Usuario } from 'src/app/Models/catalogos/usuarios-model';
import { TipoCambioService } from '../../services/tipo-cambio.service';
import { from } from 'rxjs';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';
import { EmpresaService } from 'src/app/services/empresas/empresa.service';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';

const httpOptions = {
  headers: new HttpHeaders({
    // 'Bmx-Token': '19b7c18b48291872e37dbfd89ee7e4ea26743de4777741f90b79059950c34544',
    'Bmx-Token': '410db2afc39118c6917da0778cf81b6becdf5614dabd10b92815768bc0a87e26',
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // parche: string = 'https://cors-anywhere.herokuapp.com/'
  // readonly rootURL = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF63528/datos/oportuno"
  // rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: string;
  clienteLogin;
  public usuario: Usuario;
  public user;

  constructor(private http : HttpClient, public storageService: StorageServiceService, private tipoCambio:TipoCambioService, public enviarfact: EnviarfacturaService,public servicefactura: FacturaService,private service: ReciboPagoService, public serviceEmpresa: EmpresaService,private recibopagoSVC: ReciboPagoService) { }

  ngOnInit() {
    // console.log(localStorage.getItem("inicioCliente"));
    this.obtenerEmpresa();
  this.clienteLogin = localStorage.getItem("inicioCliente");
    this.tipoDeCambio();
    this.usuario = this.storageService.getCurrentUser();
    this.getUsuario();
  }

  getUsuario(){
    
    if (this.clienteLogin == 'true') {
      let u = JSON.parse(localStorage.getItem('ProlappSessionCliente'));
      // console.log(JSON.parse(localStorage.getItem('ProlappSessionCliente')));
      this.user = u.user.RFC;
      // console.log('this.user : ', this.user );
      
    } else {

    let u = JSON.parse(localStorage.getItem('ProlappSession'));
    // console.log(JSON.parse(localStorage.getItem('ProlappSession')));
    this.user = u.user;

    this.storageService.getUserAuth(this.user).subscribe(usuario=>{
      localStorage.setItem('userAuth',JSON.stringify(usuario[0]))
      this.storageService.currentUser = usuario[0];
      console.log(this.storageService.currentUser);
    })

    }
    
  }

  obtenerEmpresa(){
    let empresa = JSON.parse(localStorage.getItem('Empresa'));
    if (empresa=[]){
      console.log('vacio');
      empresa = {
        'CP': 31100,
'Calle': "CATALPA",
'Ciudad': "Chihuahua",
'Colonia': "Granjas",
'Estado': "Chihuahua",
'Foto': "data:image/png;base64,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",
'IdEmpresa': 20089,
'NumeroExterior': 0,
'NumeroInterior': 712,
'Pais': "Mexico",
'RFC': "AIN140101ME3",
'RazonSocial': "RIZTEK",
'Regimen': "General de leyes"
      }
    }
    console.log(empresa);
this.serviceEmpresa.empresaActual = empresa;
    this.enviarfact.empresa = empresa;
    this.enviarfact.rfc = empresa.RFC;
    this.servicefactura.rfcempresa=empresa.RFC;
      // this.service.rfcempresa = empresa.RFC;
      this.servicefactura.rfcempresa = empresa.RFC;
      this.recibopagoSVC.rfcempresa = empresa.RFC


  }


  tipoDeCambio(){
    let hora = new Date().getHours();
    let fechahoy = new Date();
    let fechaayer = new Date();
    

    fechaayer.setDate(fechahoy.getDate() - 1)
    let diaayer = new Date(fechaayer).getDate();
    let mesayer = new Date(fechaayer).getMonth();
    let añoayer = new Date(fechaayer).getFullYear();
    let diasemana = new Date(fechahoy).getDay();

    let i;
if (hora>10){
  i=2;
}else{
  i=1;
}
    this.traerApi().subscribe(data => {
      let l;
      
      l = data.bmx.series[0].datos.length;
      // console.log(i);
      // console.log(l);
      // console.log(data.bmx.series[0].datos.length);
      // console.log(data.bmx.series[0].datos[l-i].dato);
      
      
      this.Cdolar = data.bmx.series[0].datos[l-i].dato;
      this.tipoCambio.TipoCambio = this.Cdolar;
      this.tipoCambio.TC();
      // console.log('------CAMBIO------');
      // console.log(this.tipoCambio.TipoCambio);
      
    })

  }

  traerApi(): Observable<any>{

    return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  }

  cerrarSesion(){
    if (this.clienteLogin == 'true') {
      this.storageService.logoutCliente();
      
    } else {
      
      this.storageService.logout();
    }
  }



}
