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
import * as signalr from 'signalr'

declare var $: any;

const httpOptions = {
  headers: new HttpHeaders({
    // 'Bmx-Token': '19b7c18b48291872e37dbfd89ee7e4ea26743de4777741f90b79059950c34544',
    'Bmx-Token': '410db2afc39118c6917da0778cf81b6becdf5614dabd10b92815768bc0a87e26',
    'Access-Control-Allow-Origin': '*',
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
   //readonly rootURL = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF63528/datos/oportuno"
  // rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  Cdolar: string;
  clienteLogin;
  public usuario: Usuario;
  public user;

  titulo = '';
  descripcion = '';
  fecha = new Date();


  /* SIGNALR */
  private connection: any;
  private proxy: any;  
  private proxyName: string = 'AlertasHub'; 
 
   private hubconnection: signalr;  
   notihub = 'https://riztekserver.ddns.net:44361/signalr'
  /* FIN */

  constructor(private http : HttpClient, public storageService: StorageServiceService, private tipoCambio:TipoCambioService, public enviarfact: EnviarfacturaService,public servicefactura: FacturaService,private service: ReciboPagoService, public serviceEmpresa: EmpresaService,private recibopagoSVC: ReciboPagoService) { }

  ngOnInit() {
    this.ConnectionHub();
    



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
        'CP': 31150,
        'Calle': "Fernando Montes de Oca",
        'Ciudad': "Chihuahua",
        'Colonia': "Nombre de Dios",
        'Estado': "Chihuahua",
        'Foto': "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AA",
        'IdEmpresa': 20089,
        'NumeroExterior': 3903,
        'NumeroInterior': 4,
        'Pais': "Mexico",
        'RFC': "AIN140101ME3",
        'RazonSocial': "ABARROTODO INSTITUCIONAL S. DE R.L. M.I.",
        'Regimen': "General de leyes",
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

  verMensajes(mensaje){

    this.titulo = mensaje.titulo;
    this.descripcion = mensaje.descripcion;
    this.fecha = mensaje.fecha;

  }


  

  ConnectionHub(){
  


    this.connection = $.hubConnection(this.notihub);
  
    this.proxy = this.connection.createHubProxy(this.proxyName); 
  
    this.proxy.on('AlertasHub', (data) => {  
      console.log('received in SignalRService: ', data);  
      this.verMensajes(data)
      
  }); 
  
  
  
    this.connection.start().done((data: any) => {  
      console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
      /* this.connectionEstablished.emit(true);  */ 
      /* this.connectionExists = true;   */
  })
  }

}
