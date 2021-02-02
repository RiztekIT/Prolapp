import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PosserviceService } from '../../../posservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-posaddeditclientes',
  templateUrl: './posaddeditclientes.component.html',
  styleUrls: ['./posaddeditclientes.component.css']
})
export class PosaddeditclientesComponent implements OnInit {

  estados = [
    {
      "id": 1,
      "name": "Aguascalientes"
    },
    {
      "id": 2,
      "name": "Baja California"
    },
    {
      "id": 3,
      "name": "Baja California Sur"
    },
    {
      "id": 4,
      "name": "Campeche"
    },
    {
      "id": 5,
      "name": "Coahuila"
    },
    {
      "id": 6,
      "name": "Colima"
    },
    {
      "id": 7,
      "name": "Chiapas"
    },
    {
      "id": 8,
      "name": "Chihuahua"
    },
    {
      "id": 9,
      "name": "Distrito Federal"
    },
    {
      "id": 10,
      "name": "Durango"
    },
    {
      "id": 11,
      "name": "Guanajuato"
    },
    {
      "id": 12,
      "name": "Guerrero"
    },
    {
      "id": 13,
      "name": "Hidalgo"
    },
    {
      "id": 14,
      "name": "Jalisco"
    },
    {
      "id": 15,
      "name": "México"
    },
    {
      "id": 16,
      "name": "Michoacán"
    },
    {
      "id": 17,
      "name": "Morelos"
    },
    {
      "id": 18,
      "name": "Nayarit"
    },
    {
      "id": 19,
      "name": "Nuevo León"
    },
    {
      "id": 20,
      "name": "Oaxaca"
    },
    {
      "id": 21,
      "name": "Puebla"
    },
    {
      "id": 22,
      "name": "Querétaro"
    },
    {
      "id": 23,
      "name": "Quintana Roo"
    },
    {
      "id": 24,
      "name": "San Luis Potosí"
    },
    {
      "id": 25,
      "name": "Sinaloa"
    },
    {
      "id": 26,
      "name": "Sonora"
    },
    {
      "id": 27,
      "name": "Tabasco"
    },
    {
      "id": 28,
      "name": "Tamaulipas"
    },
    {
      "id": 29,
      "name": "Tlaxcala"
    },
    {
      "id": 30,
      "name": "Veracruz"
    },
    {
      "id": 31,
      "name": "Yucatán"
    },
    {
      "id": 32,
      "name": "Zacatecas"
    }
  ]

  MetododePago = [ { "FormaDePago": "01", "text": "01-Efectivo" },
  { "FormaDePago": "02", "text": "02-Cheque nominativo" },
  { "FormaDePago": "03", "text": "03-Transferencia electrónica de fondos" },
  { "FormaDePago": "04", "text": "04-Tarjeta de crédito" },
  { "FormaDePago": "05", "text": "05-Monedero electrónico" },
  { "FormaDePago": "06", "text": "06-Dinero electrónico" },
  { "FormaDePago": "08", "text": "08-Vales de despensa" },
  { "FormaDePago": "12", "text": "12-Dación en pago" },
  { "FormaDePago": "13", "text": "13-Pago por subrogación" },
  { "FormaDePago": "14", "text": "14-Pago por consignación" },
  { "FormaDePago": "15", "text": "15-Condonación" },
  { "FormaDePago": "17", "text": "17-Compensación" },
  { "FormaDePago": "23", "text": "23-Novación" },
  { "FormaDePago": "24", "text": "24-Confusión" },
  { "FormaDePago": "25", "text": "25-Remisión de deuda" },
  { "FormaDePago": "26", "text": "26-Prescripción o caducidad" },
  { "FormaDePago": "27", "text": "27-A satisfacción del acreedor" },
  { "FormaDePago": "28", "text": "28-Tarjeta de débito" },
  { "FormaDePago": "29", "text": "29-Tarjeta de servicios" },
  { "FormaDePago": "30", "text": "30-Aplicación de anticipos" },
  { "FormaDePago": "31", "text": "31-Intermediario pagos" },
  { "FormaDePago": "99", "text": "99-Por definir" }]

 UsoCFDI = [  { "UsoDelCFDI": "G01", "text": "G01-Adquisición de mercancias" },
 { "UsoDelCFDI": "G02", "text": "G02-Devoluciones, descuentos o bonificaciones" },
 { "UsoDelCFDI": "G03", "text": "G03-Gastos en general" },
 { "UsoDelCFDI": "I01", "text": "I01-Construcciones" },
 { "UsoDelCFDI": "I02", "text": "I02-Mobilario y equipo de oficina por inversiones" },
 { "UsoDelCFDI": "I03", "text": "I03-Equipo de transporte" },
 { "UsoDelCFDI": "I04", "text": "I04-Equipo de computo y accesorios" },
 { "UsoDelCFDI": "I05", "text": "I05-Dados, troqueles, moldes, matrices y herramental" },
 { "UsoDelCFDI": "I06", "text": "I06-Comunicaciones telefónicas" },
 { "UsoDelCFDI": "I07", "text": "I07-Comunicaciones satelitales" },
 { "UsoDelCFDI": "I08", "text": "I08-Otra maquinaria y equipo" },
 { "UsoDelCFDI": "D01", "text": "D01-Honorarios médicos, dentales y gastos hospitalarios" },
 { "UsoDelCFDI": "D02", "text": "D02-Gastos médicos por incapacidad o discapacidad" },
 { "UsoDelCFDI": "D03", "text": "D03-Gastos funerales" },
 { "UsoDelCFDI": "D04", "text": "D04-Donativos" },
 { "UsoDelCFDI": "D05", "text": "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
 { "UsoDelCFDI": "D06", "text": "D06-Aportaciones voluntarias al SAR" },
 { "UsoDelCFDI": "D07", "text": "D07-Primas por seguros de gastos médicos" },
 { "UsoDelCFDI": "D08", "text": "D08-Gastos de transportación escolar obligatoria" },
 { "UsoDelCFDI": "D09", "text": "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
 { "UsoDelCFDI": "D10", "text": "D10-Pagos por servicios educativos (colegiaturas)" },
 { "UsoDelCFDI": "P01", "text": "P01-Por definir" }]

  constructor(public posSVC: PosserviceService, public dialogbox: MatDialogRef<PosaddeditclientesComponent>) { }

  ngOnInit() {
  }

  onClose(){
    this.dialogbox.close();

  }

  agregar(){

    this.posSVC.clientesForm.estatus = 'Activo';
    this.posSVC.clientesForm.nombre = this.posSVC.clientesForm.RazonSocial;
    this.posSVC.clientesForm.campoextra1 = '';
    this.posSVC.clientesForm.campoextra2 ='' ;
    this.posSVC.clientesForm.campoextra3 ='' ;
    this.posSVC.clientesForm.fechaalta = new Date();
    this.posSVC.clientesForm.fechabaja = new Date();
    this.posSVC.clientesForm.clasificacion1 ='' ;
    this.posSVC.clientesForm.clasificacion2 ='' ;
    this.posSVC.clientesForm.clasificacion3 ='' ;

    //select * from Cliente where nombre = '" + nombre + "'

    let consulta = {
      'consulta':"select * from cliente where rfc ='"+this.posSVC.clientesForm.RFC+"'"
    };
    
    
    console.log(consulta);


    this.posSVC.generarConsulta(consulta).subscribe(res =>{
      console.log('%c⧭', 'color: #735656', res);
      if (res == [] || res.length == 0) {
    
        console.log('%c%s', 'color: #cc0088', 'Arriba');
        this.posSVC.agregarCliente(this.posSVC.clientesForm).subscribe(resp =>{
          console.log(resp);
          if (resp=='Cliente Agregado'){
            Swal.fire({
              icon: 'success',
              title: 'Cliente Agregado',
              text: ''+this.posSVC.clientesForm.RazonSocial+'',
              timer: 1500
            })
            this.dialogbox.close();
          }else{
            Swal.fire({
              title: 'Error',
              text: 'Error: '+ resp,
              icon: 'error',  
            });
          }
          
        })
        
      } else{
        console.log('%c%s', 'color: #cc0088', 'abajo');
        Swal.fire({
          icon: 'error',
          title: 'Cliente Existente',
          text: 'El Cliente '+this.posSVC.clientesForm.RazonSocial+' Ya Existe',
          timer: 1500
        })
      }
    
    })

  }

  editar(){

    this.posSVC.actualizarCliente(this.posSVC.clientesForm).subscribe(resp =>{
      console.log(resp);
      if (resp=='Actualizacion Existosa'){
        Swal.fire({
          icon: 'success',
          title: 'Cliente Actualizado',
          text: ''+this.posSVC.clientesForm.RazonSocial+'',
          timer: 1500
        })
        this.dialogbox.close();
      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error: '+ resp,
          icon: 'error',  
        });
      }

    })

  }

}
