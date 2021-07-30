import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';
import { RedhgfacturacionService } from '../../../../services/redholding/redhgfacturacion.service';
import Swal from 'sweetalert2';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { DatePipe } from '@angular/common';
import { EventosService } from 'src/app/services/eventos/eventos.service';
import { Evento } from 'src/app/Models/eventos/evento-model';
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

let origen: { origen: string, titulo: string }[] = [
  {"origen": "Administracion", "titulo": 'Cliente'}
]
let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Administracion", 
  "titulo": 'Cliente',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-redhgaddeditclientes',
  templateUrl: './redhgaddeditclientes.component.html',
  styleUrls: ['./redhgaddeditclientes.component.css']
})
export class RedhgaddeditclientesComponent implements OnInit {

  public listFP = [
    { 'FormaDePago': "01", 'text': "01-Efectivo" },
    { 'FormaDePago': "02", 'text': "02-Cheque nominativo" },
    { 'FormaDePago': "03", 'text': "03-Transferencia electrónica de fondos" },
    { 'FormaDePago': "04", 'text': "04-Tarjeta de crédito" },
    { 'FormaDePago': "05", 'text': "05-Monedero electrónico" },
    { 'FormaDePago': "06", 'text': "06-Dinero electrónico" },
    { 'FormaDePago': "08", 'text': "08-Vales de despensa" },
    { 'FormaDePago': "12", 'text': "12-Dación en pago" },
    { 'FormaDePago': "13", 'text': "13-Pago por subrogación" },
    { 'FormaDePago': "14", 'text': "14-Pago por consignación" },
    { 'FormaDePago': "15", 'text': "15-Condonación" },
    { 'FormaDePago': "17", 'text': "17-Compensación" },
    { 'FormaDePago': "23", 'text': "23-Novación" },
    { 'FormaDePago': "24", 'text': "24-Confusión" },
    { 'FormaDePago': "25", 'text': "25-Remisión de deuda" },
    { 'FormaDePago': "26", 'text': "26-Prescripción o caducidad" },
    { 'FormaDePago': "27", 'text': "27-A satisfacción del acreedor" },
    { 'FormaDePago': "28", 'text': "28-Tarjeta de débito" },
    { 'FormaDePago': "29", 'text': "29-Tarjeta de servicios" },
    { 'FormaDePago': "30", 'text': "30-Aplicación de anticipos" },
    { 'FormaDePago': "31", 'text': "31-Intermediario pagos" },
    { 'FormaDePago': "99", 'text': "99-Por definir" }
  ];
  //list CFDI
  public listCFDI = [
    { 'UsoDelCFDI': "G01", 'text': "G01-Adquisición de mercancias" },
    { 'UsoDelCFDI': "G02", 'text': "G02-Devoluciones, descuentos o bonificaciones" },
    { 'UsoDelCFDI': "G03", 'text': "G03-Gastos en general" },
    { 'UsoDelCFDI': "I01", 'text': "I01-Construcciones" },
    { 'UsoDelCFDI': "I02", 'text': "I02-Mobilario y equipo de oficina por inversiones" },
    { 'UsoDelCFDI': "I03", 'text': "I03-Equipo de transporte" },
    { 'UsoDelCFDI': "I04", 'text': "I04-Equipo de computo y accesorios" },
    { 'UsoDelCFDI': "I05", 'text': "I05-Dados, troqueles, moldes, matrices y herramental" },
    { 'UsoDelCFDI': "I06", 'text': "I06-Comunicaciones telefónicas" },
    { 'UsoDelCFDI': "I07", 'text': "I07-Comunicaciones satelitales" },
    { 'UsoDelCFDI': "I08", 'text': "I08-Otra maquinaria y equipo" },
    { 'UsoDelCFDI': "D01", 'text': "D01-Honorarios médicos, dentales y gastos hospitalarios" },
    { 'UsoDelCFDI': "D02", 'text': "D02-Gastos médicos por incapacidad o discapacidad" },
    { 'UsoDelCFDI': "D03", 'text': "D03-Gastos funerales" },
    { 'UsoDelCFDI': "D04", 'text': "D04-Donativos" },
    { 'UsoDelCFDI': "D05", 'text': "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
    { 'UsoDelCFDI': "D06", 'text': "D06-Aportaciones voluntarias al SAR" },
    { 'UsoDelCFDI': "D07", 'text': "D07-Primas por seguros de gastos médicos" },
    { 'UsoDelCFDI': "D08", 'text': "D08-Gastos de transportación escolar obligatoria" },
    { 'UsoDelCFDI': "D09", 'text': "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
    { 'UsoDelCFDI': "D10", 'text': "D10-Pagos por servicios educativos (colegiaturas)" },
    { 'UsoDelCFDI': "P01", 'text': "P01-Por definir" }
  ];

  constructor(
    public dialogbox: MatDialogRef<RedhgaddeditclientesComponent>,
    public redhgSVC: RedhgfacturacionService,
    private ConnectionHubService: ConnectionHubServiceService,
    private usuarioService: UsuariosServieService,
    private datePipe: DatePipe,
    private eventosService: EventosService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  movimiento;
  usuariosesion;
  listVendedores: Vendedor[] = [];
  options: Vendedor[] = [];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  //BodegaInfo;

  tipomovimiento
  estatuscliente;

  ngOnInit() {

    this.ConnectionHubService.ConnectionHub(origen[0]);
    // console.log(this.service2.formprosp);
    // this.service.formData = new Cliente();
    this.usuariosesion = JSON.parse(localStorage.getItem('ProlappSession'));
    //this.BodegaInfo = this.data;
    this.movimiento = this.data.movimiento
    if (this.movimiento=='Agregar'){

      this.resetForm();
    }
    this.dropdownRefresh();  
    this.EstatusCliente()
  }

  dropdownRefresh(){

    let consulta='select * from Vendedor'
    /* getVendedoresList() */

    this.redhgSVC.consultaRedhg(consulta).subscribe((data:any) =>{
      for (let i = 0; i < data.length; i++){
        let vendedor = data[i];
        this.listVendedores.push(vendedor);
        this.options.push(vendedor)
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    });
  }

  private _filter(value: any): any[] {
    console.log(value);
     const filterValue = value.toString().toLowerCase();
     return this.options.filter(option =>
       option.Nombre.toLowerCase().includes(filterValue) ||
       option.IdVendedor.toString().includes(filterValue));
  }


  onClose() {
    this.dialogbox.close(this.redhgSVC.formDataClientes);
    //this.service.filter('Register click');
    //this.resetForm();
  }

  resetForm(form?: NgForm) {
    //if (this.redhgSVC.formDataClientes.Nombre != null){

      if (form){

        form.resetForm();
      }

    this.redhgSVC.formDataClientes = {
      IdClientes: 0,
      Nombre: '',
      RFC: '',
      RazonSocial: '',
      Calle: '',
      Colonia: '',
      CP: '',
      Ciudad: '',
      Estado: '',
      NumeroInterior: ''  ,
      NumeroExterior: '',
      ClaveCliente: '',
      Estatus: '',
      LimiteCredito: '',
      DiasCredito: '',
      MetodoPago: '',
      UsoCFDI: '',
      IdApi: '',
      MetodoPagoCliente: '',
      Vendedor: 7
    }

    this.redhgSVC.formDataClientesV = {
      IdVendedor: 7,
      Nombre: ''
    }
    /* }; */
  }

  onSubmit(form: NgForm, ) {
    this.movimiento;

    if (this.movimiento=='Agregar'){
      let email;
      let rfc;
      let razon;
      let codpos;
      let datos;
     
      email = 'riztekti@gmail.com';
      rfc = this.redhgSVC.formDataClientes.RFC;
      razon = this.redhgSVC.formDataClientes.RazonSocial;
      codpos = this.redhgSVC.formDataClientes.CP;
      datos = {
        "email" : email,
        "razons" : razon,
        "rfc" : rfc,
        "codpos" : codpos
      }
      
      datos = JSON.stringify(datos);
       this.redhgSVC.crearCliente(datos).subscribe(data =>{
          let respuesta = JSON.parse(data)
          console.log(respuesta);
         if (respuesta.status==='success'){
           console.log(respuesta);
  
           this.redhgSVC.formDataClientes.IdApi=respuesta.Data.UID
          //this.redhgSVC.formDataClientes.IdApi='';
          this.redhgSVC.formDataClientes.Estatus = 'Activo'
          
          let datosExtra = this.redhgSVC.formDataClientes.Nombre
          this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)


let cliente = this.redhgSVC.formDataClientes
          

let consulta= 'insert into redhgCliente(Nombre,RFC,RazonSocial,Calle,Colonia,CP,Ciudad,Estado,NumeroInterior,NumeroExterior, ClaveCliente, Estatus, LimiteCredito, DiasCredito, MetodoPago, UsoCFDI, IdApi, MetodoPagoCliente, Vendedor) values('+
"'"+cliente.Nombre+"',"+
"'"+cliente.RFC+"',"+
"'"+cliente.RazonSocial+"',"+
"'"+cliente.Calle+"',"+
"'"+cliente.Colonia+"',"+
"'"+cliente.CP+"',"+
"'"+cliente.Ciudad+"',"+
"'"+cliente.Estado+"',"+
"'"+cliente.NumeroInterior+"',"+
"'"+cliente.NumeroExterior+"',"+
"'"+cliente.ClaveCliente+"',"+
"'"+cliente.Estatus+"',"+
"'"+cliente.LimiteCredito+"',"+
"'"+cliente.DiasCredito+"',"+
"'"+cliente.MetodoPago+"',"+
"'"+cliente.UsoCFDI+"',"+
"'"+cliente.IdApi+"',"+
"'"+cliente.MetodoPagoCliente+"',"+
"'"+cliente.Vendedor+"')"

          /*  addCliente(this.redhgSVC.formDataClientes)*/

          console.log(consulta);


          this.redhgSVC.consultaRedhg(consulta).subscribe(res => {
  
            this.ConnectionHubService.on(origen[0])
            console.log(res);
            
          this.movimientos(this.movimiento)
  
          //this.otrocliente()
            
        Swal.fire({
              icon: 'success',
              title: 'Cliente Agregado',
              text: ''+this.redhgSVC.formDataClientes.RazonSocial+'',
              timer: 1500
            }) 
            
          
          });
  
          
      
         }
         else{
           console.log(data);
          
         }
        this.resetForm(form);
  
       })

    }else if(this.movimiento=='Editar'){


      let datosExtra = this.redhgSVC.formDataClientes.Nombre
      this.ConnectionHubService.generarNotificacion(origenNotificacion[0], datosExtra)


let cliente = this.redhgSVC.formDataClientes
      

let consulta= 'update redhgCliente set '+
"Nombre='"+cliente.Nombre+"',"+
"RFC='"+cliente.RFC+"',"+
"RazonSocial='"+cliente.RazonSocial+"',"+
"Calle='"+cliente.Calle+"',"+
"Colonia='"+cliente.Colonia+"',"+
"CP='"+cliente.CP+"',"+
"Ciudad='"+cliente.Ciudad+"',"+
"Estado='"+cliente.Estado+"',"+
"NumeroInterior='"+cliente.NumeroInterior+"',"+
"NumeroExterior='"+cliente.NumeroExterior+"',"+
"ClaveCliente='"+cliente.ClaveCliente+"',"+
"Estatus='"+cliente.Estatus+"',"+
"LimiteCredito='"+cliente.LimiteCredito+"',"+
"DiasCredito='"+cliente.DiasCredito+"',"+
"MetodoPago='"+cliente.MetodoPago+"',"+
"UsoCFDI='"+cliente.UsoCFDI+"',"+
"IdApi='"+cliente.IdApi+"',"+
"MetodoPagoCliente='"+cliente.MetodoPagoCliente+"',"+
"Vendedor='"+cliente.Vendedor+"' where IdClientes=+"+cliente.IdClientes+""

      /*  addCliente(this.redhgSVC.formDataClientes)*/

      console.log(consulta);


      this.redhgSVC.consultaRedhg(consulta).subscribe(res => {

        this.ConnectionHubService.on(origen[0])
        console.log(res);
        
      this.movimientos(this.movimiento)

      //this.otrocliente()
        
    Swal.fire({
          icon: 'success',
          title: 'Cliente Actualizado',
          text: ''+this.redhgSVC.formDataClientes.RazonSocial+'',
          timer: 1500
        }) 
        
      
      });


      









    }
       
    
    
    
        
        
      }

      movimientos(movimiento){
        // let event = new Array<Evento>();
        let u = this.usuariosesion.user
        let fecha = new Date();
        
        let evento = new Evento();
        this.usuarioService.getUsuarioNombreU(u).subscribe(res => {
        let idU=res[0].IdUsuario
    
        evento.IdUsuario = idU
        evento.Autorizacion = '0'
        evento.Fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd, h:mm:ss a');
        evento.Movimiento = movimiento
        
        console.log(evento);
        this.eventosService.addEvento(evento).subscribe(respuesta =>{
          console.log(respuesta);
        })
        })
      }

      onSelectionChange(options:Vendedor, event: any){
        if(event.isUserInput){
          this.redhgSVC.formDataClientesV.IdVendedor = options.IdVendedor;
          this.redhgSVC.formDataClientesV.Nombre = options.Nombre;
        }
      }

      changeEstatus(event){
        console.log(event);
        if (event.checked){
          this.redhgSVC.formDataClientes.Estatus='Activo'
          
        }else{
          this.redhgSVC.formDataClientes.Estatus='Inactivo'
    
        }
        
      }
      EstatusCliente(){

        if (this.redhgSVC.formDataClientes.Estatus=='Activo'){
          this.estatuscliente = true
    
        }else if (this.redhgSVC.formDataClientes.Estatus=='Inactivo'){
          this.estatuscliente = false
        }
    
      }


      verdata(){
        console.log(this.redhgSVC.formDataClientes);
      }

}
