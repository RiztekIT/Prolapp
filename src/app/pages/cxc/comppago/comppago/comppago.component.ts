import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FacturaService } from 'src/app/services/facturacioncxc/factura.service';
import { EnviarfacturaService } from '../../../../services/facturacioncxc/enviarfactura.service';
import { pagoTimbre } from 'src/app/Models/ComplementoPago/pagotimbre';
import { NativeDateAdapter } from '@angular/material';
import { ReciboPagoService } from 'src/app/services/complementoPago/recibo-pago.service';
import { ReciboPago } from 'src/app/Models/ComplementoPago/recibopago';
import Swal from 'sweetalert2';


/* Constante y variables para la transformacion de los meses en los datetimepicker */
// const months =['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day}/${months[month]}/${year}`
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS =
{
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
/* ----------------------------------------- */

@Component({
  selector: 'app-comppago',
  templateUrl: './comppago.component.html',
  styleUrls: ['./comppago.component.css']
})
export class ComppagoComponent implements OnInit {

  @Input() foliop: any;
  @Input() idp: any;

  ClienteNombre: any;
  json1 = new pagoTimbre();
  FechaPago;
  cantidadPago;
  reciboPago = new ReciboPago();
  IdReciboPago: any;

  

   /* list Metodo Pago */
   public listMP: Array<Object> = [
    { MetodoDePago: 'PUE', text: 'PUE-Pago en una sola exhibicion' },
    { MetodoDePago: 'PPD', text: 'PPD-Pago en parcialidades o diferido' }
  ];

  /* Forma Pago */
  public listFP: Array<Object> = [
    { FormaDePago: "01", text: "01-Efectivo" },
    { FormaDePago: "02", text: "02-Cheque nominativo" },
    { FormaDePago: "03", text: "03-Transferencia electrónica de fondos" },
    { FormaDePago: "04", text: "04-Tarjeta de crédito" },
    { FormaDePago: "05", text: "05-Monedero electrónico" },
    { FormaDePago: "06", text: "06-Dinero electrónico" },
    { FormaDePago: "08", text: "08-Vales de despensa" },
    { FormaDePago: "12", text: "12-Dación en pago" },
    { FormaDePago: "13", text: "13-Pago por subrogación" },
    { FormaDePago: "14", text: "14-Pago por consignación" },
    { FormaDePago: "15", text: "15-Condonación" },
    { FormaDePago: "17", text: "17-Compensación" },
    { FormaDePago: "23", text: "23-Novación" },
    { FormaDePago: "24", text: "24-Confusión" },
    { FormaDePago: "25", text: "25-Remisión de deuda" },
    { FormaDePago: "26", text: "26-Prescripción o caducidad" },
    { FormaDePago: "27", text: "27-A satisfacción del acreedor" },
    { FormaDePago: "28", text: "28-Tarjeta de débito" },
    { FormaDePago: "29", text: "29-Tarjeta de servicios" },
    { FormaDePago: "30", text: "30-Aplicación de anticipos" },
    { FormaDePago: "31", text: "31-Intermediario pagos" },
    { FormaDePago: "99", text: "99-Por definir" }
  ];
  /* list CFDI */
  public listCFDI: Array<Object> = [
    { UsoDelCFDI: "G01", text: "G01-Adquisición de mercancias" },
    { UsoDelCFDI: "G02", text: "G02-Devoluciones, descuentos o bonificaciones" },
    { UsoDelCFDI: "G03", text: "G03-Gastos en general" },
    { UsoDelCFDI: "I01", text: "I01-Construcciones" },
    { UsoDelCFDI: "I02", text: "I02-Mobilario y equipo de oficina por inversiones" },
    { UsoDelCFDI: "I03", text: "I03-Equipo de transporte" },
    { UsoDelCFDI: "I04", text: "I04-Equipo de computo y accesorios" },
    { UsoDelCFDI: "I05", text: "I05-Dados, troqueles, moldes, matrices y herramental" },
    { UsoDelCFDI: "I06", text: "I06-Comunicaciones telefónicas" },
    { UsoDelCFDI: "I07", text: "I07-Comunicaciones satelitales" },
    { UsoDelCFDI: "I08", text: "I08-Otra maquinaria y equipo" },
    { UsoDelCFDI: "D01", text: "D01-Honorarios médicos, dentales y gastos hospitalarios" },
    { UsoDelCFDI: "D02", text: "D02-Gastos médicos por incapacidad o discapacidad" },
    { UsoDelCFDI: "D03", text: "D03-Gastos funerales" },
    { UsoDelCFDI: "D04", text: "D04-Donativos" },
    { UsoDelCFDI: "D05", text: "D05-Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)" },
    { UsoDelCFDI: "D06", text: "D06-Aportaciones voluntarias al SAR" },
    { UsoDelCFDI: "D07", text: "D07-Primas por seguros de gastos médicos" },
    { UsoDelCFDI: "D08", text: "D08-Gastos de transportación escolar obligatoria" },
    { UsoDelCFDI: "D09", text: "D09-Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones" },
    { UsoDelCFDI: "D10", text: "D10-Pagos por servicios educativos (colegiaturas)" },
    { UsoDelCFDI: "P01", text: "P01-Por definir" }
  ];
  

  constructor(private service:FacturaService, private servicetimbrado:EnviarfacturaService, private servicepago: ReciboPagoService) { }

  ngOnInit() {
    this.FechaPago = Date();
    this.setpagoTimbre();
  }

  /* Metodo para cambiar los datetimepicker al formato deseado */
  onChange(val) {
    var d = new Date(val);
    let date = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('01').slice(-2)].join('-')
  }

  setpagoTimbre(){

    this.json1 = {
      Receptor: {
        UID: '',
    },
    TipoCfdi:'',
    Conceptos:[
        {
            ClaveProdServ:'',
            Cantidad:'',
            ClaveUnidad:'',
            Descripcion:'',
            ValorUnitario:'',
            Importe:''
        }
    ],
    UsoCFDI:'',
    Serie:'',
    Moneda:'',
    Pagos:[
        {
            typeComplement:'',
            FechaPago:'',
            FormaDePagoP:'',
            MonedaP:'',
            Monto:'',
            relacionados:[
                {
                    IdDocumento:'',
                    MonedaDR:'',
                    TipoCambioDR:'',
                    MetodoDePagoDR:'',
                    NumParcialidad:'',
                    ImpSaldoAnt:'',
                    ImpPagado:'',
                    ImpSaldoInsoluto:''
                }
            ]
        }
    ]
    }
    
  }



  crearJSON(){
    let datos : any = this.service.formData

    this.json1.Receptor.UID = datos.IdApi;
    this.json1.TipoCfdi = 'pago';
    this.json1.Conceptos.pop();
    this.json1.Conceptos.push({
      "ClaveProdServ" : "84111506",
      "Cantidad" : "1",
      "ClaveUnidad" : "ACT",
      "Descripcion" : "Pago",
      "ValorUnitario" : "0",
      "Importe" : "0"
    });
    this.json1.UsoCFDI = "P01";
    this.json1.Serie = "6390";
    this.json1.Moneda = datos.Moneda;
    this.json1.Pagos.pop();
    this.json1.Pagos.push({
      "typeComplement" : "pagos",
      "FechaPago" : this.FechaPago,
      "FormaDePagoP": this.service.formData.FormaDePago,
      "MonedaP" : datos.Moneda,
      "Monto" : this.cantidadPago,
      "relacionados" : [{
        "IdDocumento": datos.UUID,
        "MonedaDR" : datos.Moneda,
        "TipoCambioDR" : datos.TipoDeCambio,
        "MetodoDePagoDR" : "PPD",
        "NumParcialidad" : "1",
        "ImpSaldoAnt" : datos.Total,
        "ImpPagado": this.cantidadPago,
        "ImpSaldoInsoluto": (parseFloat(datos.Total) - parseFloat(this.cantidadPago)).toString()
      }]
    })
  }

  ObtenerUltimaFactura() {
    // this.service.getUltimaFactura().subscribe(data => {
    //   // console.log(data);
    //   this.IdFactura = data[0].Id;
    //   if (!this.IdFactura){
    //     this.IdFactura='1';
    //   }
    //   // console.log(this.IdFactura);
    //   return this.IdFactura;
    //   // console.log(this.IdFactura);
    //   });

    this.servicepago.getUltimoReciboPago().subscribe(data => {
      this.servicepago.IdReciboPago = data[0].Id;
      this.IdReciboPago = this.servicepago.IdReciboPago
      console.log(this.servicepago.IdReciboPago);
    });

  }



  timbrar(){
// console.log(this.service.formData);
this.crearJSON();
console.log(JSON.stringify(this.json1));

this.servicetimbrado.timbrarPago(JSON.stringify(this.json1)).subscribe(data=>{
  console.log(data);
  if (data.response === 'success') {
    let datos : any = this.service.formData
    this.ObtenerUltimaFactura();


    this.reciboPago.Id = this.IdReciboPago;
    this.reciboPago.IdCliente =  datos.IdCliente;
    this.reciboPago.FechaExpedicion =  new Date();
    this.reciboPago.FechaPago = this.FechaPago;
    this.reciboPago.FormaPago = this.service.formData.FormaDePago;
    this.reciboPago.Moneda = datos.Moneda;
    this.reciboPago.TipoCambio = datos.TipoDeCambio;
    this.reciboPago.Cantidad = this.cantidadPago;
    this.reciboPago.Referencia = '';
    this.reciboPago.UUID = data.UUID;
    this.reciboPago.Tipo ='Pago';
    this.reciboPago.Certificado ='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';
    this.reciboPago.NoCertificado ='00001000000403628664';
    this.reciboPago.Cuenta ='';
    this.reciboPago.CadenaOriginal ='||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
    this.reciboPago.SelloDigitalSAT =data.SAT.SelloSAT;
    this.reciboPago.SelloDigitalCFDI =data.SAT.SelloCFD;
    this.reciboPago.NoSelloSAT =data.SAT.NoCertificadoSAT;
    this.reciboPago.RFCPAC ='LSO1306189R5';
    this.reciboPago.Estatus ='Timbrada';

    this.servicepago.addReciboPago(this.reciboPago).subscribe(res => {

      let Saldo = '0';
      this.servicepago.formDataPagoCFDI.IdReciboPago = this.IdReciboPago;
      this.servicepago.formDataPagoCFDI.IdFactura = this.service.formData.Id;
      this.servicepago.formDataPagoCFDI.UUID = this.service.formData.UUID;
      this.servicepago.formDataPagoCFDI.Cantidad = this.cantidadPago
      this.servicepago.formDataPagoCFDI.NoParcialidad = '1';
      this.servicepago.formDataPagoCFDI.Saldo = '0';
      console.log(this.servicepago.formDataPagoCFDI);
        this.servicepago.addPagoCFDI(this.servicepago.formDataPagoCFDI).subscribe(res =>{
          Swal.fire(
            'Factura Creada',
            '' + this.service.formData.UUID + '',
            'success'
          )
          console.log(res);
        })
      
    });



  }
})



  }



}
