import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { NgForm } from '@angular/forms';
import { Cliente } from '../../../../Models/catalogos/clientes-model';
import { Router, ActivatedRoute } from '@angular/router';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { FacturacioncxcProductoComponent } from '../facturacioncxc-producto/facturacioncxc-producto.component';
import { Factura } from 'src/app/Models/facturacioncxc/factura-model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DetalleFactura } from '../../../../Models/facturacioncxc/detalleFactura-model';
import { FacturacioncxcEditProductoComponent } from '../facturacioncxc-edit-producto/facturacioncxc-edit-producto.component';
import { FacturaTimbre } from '../../../../Models/facturacioncxc/facturatimbre-model';








@Component({
  selector: 'app-facturacioncxc-add',
  templateUrl: './facturacioncxc-add.component.html'
})
export class FacturacioncxcAddComponent implements OnInit {
  json: FacturaTimbre;
  folio: string;

  constructor(
    public service: FacturaService, private snackBar: MatSnackBar, private dialog: MatDialog, 
    private router: Router, public enviarfact: EnviarfacturaService,
    private activatedRoute: ActivatedRoute) { 
      
      this.activatedRoute.params.subscribe(  params =>{
        this.IdFactura = params['id'];
        console.log("El ID de la Factura es: "+this.IdFactura);
        // console.log(params['id']); 
        this.service.IdFactura = +this.IdFactura;
        
      });
      
      //Observable para actualizar tabla de Detalles Factura
      this.service.listen().subscribe((m:any)=>{
        console.log(m);
        this.refreshDetallesFacturaList();
        });
        
      }
      
      IdFactura: any;
  listClientes: Cliente[] = [];
  

  estatusfact;
  numfact;
  xml;
  
  ngOnInit() {
    this.resetForm();
    this.setfacturatimbre();
    this.dropdownRefresh();
    this.refreshDetallesFacturaList();
  }
   //Informacion para tabla de productos
   listData: MatTableDataSource<any>;
   displayedColumns: string[] = ['ClaveProducto', 'Producto', 'Cantidad', 'Precio', 'Options'];
   @ViewChild(MatSort, null) sort: MatSort;


   //Funcion Refresh Tabla Detalles Factura
  refreshDetallesFacturaList() {
    this.service.getDetallesFacturaList(this.IdFactura).subscribe(data => {
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
    //console.log(this.listData);
    });

  }

  //Filtro de Detalles Factura
  applyFilter(filtervalue: string){  
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();

  }


  dropdownRefresh() {
    this.service.getDepDropDownValues().subscribe((data) => {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
      }
      console.log(this.listClientes);
    });
  }
  //list Metodo Pago
  public listMP: Array<Object> = [
    { MetodoDePago: "PUE", text: "PUE-Pago en una sola exhibicion" },
    { MetodoDePago: "PPD", text: "PPD-Pago en parcialidades o diferido" }
  ];
  //Forma Pago
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
  //list CFDI
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

  Regresar() {
    this.router.navigateByUrl('/facturacionCxc');
  }
  
//Editar detalle factura
onEdit(detalleFactura: DetalleFactura){
  console.log(detalleFactura);
      this.service.formDataDF = detalleFactura;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width="70%";
      this.dialog.open(FacturacioncxcEditProductoComponent, dialogConfig);
    }
//Eliminar Detalle Factura
    onDelete( id:number){
      console.log(id);
      if ( confirm('Are you sure to delete?')) {
        this.service.deleteDetalleFactura(id).subscribe(res => {
        this.refreshDetallesFacturaList();
        this.snackBar.open(res.toString(), '', {
          duration: 3000,
          verticalPosition: 'top'
        });
  
        });
      }
  
    }
    //Agregar Detalle Factura
  onAddProducto() {
    
    // console.log(usuario);
    // this.service.formData = factura;
    // console.log(form.value);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    this.dialog.open(FacturacioncxcProductoComponent, dialogConfig);
  }


  // applyFilter(filtervalue: string) {
  //   this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  // }

  resetForm(form?: NgForm) {
    // if (form != null)
    //   form.resetForm();
 console.log(this.IdFactura + "ESTE ES EL ID FACTURA");
      this.service.getFacturaId(this.IdFactura).subscribe(res => {
        console.log(res);
        this.refreshDetallesFacturaList();
        this.service.formData = res[0];
        console.log(this.service.formData);
        });

    //this.service.formData = {
      //Factura
      // Id: 0,
      // IdCliente: 0,
      // Serie: '',
      // Folio: '',
      // Tipo: '',
      // FechaDeExpedicion: new Date(),
      // LugarDeExpedicion: '',
      // Certificado: '',
      // NumeroDeCertificado: '',
      // UUID: '',
      // UsoDelCFDI: '',
      // Subtotal: '',
      // Descuento: '',
      // ImpuestosRetenidos: '',
      // ImpuestosTrasladados: '',
      // Total: '',
      // FormaDePago: '',
      // MetodoDePago: '',
      // Cuenta: '',
      // Moneda: '',
      // CadenaOriginal: '',
      // SelloDigitalSAT: '',
      // SelloDigitalCFDI: '',
      // NumeroDeSelloSAT: '',
      // RFCdelPAC: '',
      // Observaciones: '',
      // FechaVencimiento: new Date(),
      // OrdenDeCompra: '',
      // TipoDeCambio: '',
      // FechaDeEntrega: new Date(),
      // CondicionesDePago: '',
      // Vendedor: '',
      // Estatus: '',
      // Version: '',
      // Usuario: '',
    // }

  }

  crearjsonfactura(id:number){

    this.service.getFacturasClienteID(id).subscribe{data =>{
      this.json.Receptor.UID=
    }}
    

    
    this.json.Receptor.UID = '5de771f1a1203';
    this.json.TipoDocumento = 'factura';
    this.json.Conceptos.pop();
    this.json.Conceptos.push({
      ClaveProdServ: '43232408',
      NoIdentificacion: 'WEBDEV10',
      Cantidad: '1.000000',
      ClaveUnidad: 'E48',
      Unidad: 'Unidad de servicio',
      Descripcion: 'Desarrollo web a la medida',
      ValorUnitario: '15000.000000',
      Importe: '15000.000000',
      Descuento: '0',
      tipoDesc: 'porcentaje',
      honorarioInverso: '',
      montoHonorario: '0',
      Impuestos:{
        Traslados:[{
            Base: '15000.000000',
            Impuesto: '002',
            TipoFactor: 'Tasa',
            TasaOCuota: '0.16',
            Importe: '2400.000000'
        }]
      },
      NumeroPedimento: "",
          Predial: "",
          Partes: "0",
          Complemento: "0"
    });
    this.json.Impuestos.Traslados.pop();
    this.json.Impuestos.Traslados.push({
      "Base": "15000.000000",
      "Impuesto": "002",
      "TipoFactor": "Tasa",
      "TasaOCuota": "0.16",
      "Importe": "2400.000000"
    });
    this.json.Impuestos.Retenidos.pop();
    this.json.Impuestos.Locales.pop();
    this.json.CfdiRelacionados.TipoRelacion = '';
    this.json.CfdiRelacionados.UUID.push();
    this.json.UsoCFDI = 'G03';
    this.json.Serie = 5352;
    this.json.FormaPago = '03';
    this.json.MetodoPago = 'PUE';
    this.json.Moneda = 'MXN';
    this.json.EnviarCorreo = false;


      
      


    // let datosfact = JSON.stringify(
    //   {
    //     "Receptor": {
    //       "UID": "5de771f1a1203"
    //     },
    //     "TipoDocumento": "factura",
    //     "Conceptos": [
    //       {
    //         "ClaveProdServ": "43232408",
    //         "NoIdentificacion": "WEBDEV10",
    //         "Cantidad": "1.000000",
    //         "ClaveUnidad": "E48",
    //         "Unidad": "Unidad de servicio",
    //         "Descripcion": "Desarrollo web a la medida",
    //         "ValorUnitario": "15000.000000",
    //         "Importe": "15000.000000",
    //         "Descuento": "0",
    //         "tipoDesc": "porcentaje",
    //         "honorarioInverso": "",
    //         "montoHonorario": "0",
    //         "Impuestos": {
    //           "Traslados": [
    //             {
    //               "Base": "15000.000000",
    //               "Impuesto": "002",
    //               "TipoFactor": "Tasa",
    //               "TasaOCuota": "0.16",
    //               "Importe": "2400.000000"
    //             }
    //           ],
    //           "Retenidos": [],
    //           "Locales": []
    //         },
    //         "NumeroPedimento": "",
    //         "Predial": "",
    //         "Partes": "0",
    //         "Complemento": "0"
    //       }
    //     ],
    //     "Impuestos": {
    //       "Traslados": [
    //         {
    //           "Base": "15000.000000",
    //           "Impuesto": "002",
    //           "TipoFactor": "Tasa",
    //           "TasaOCuota": "0.16",
    //           "Importe": "2400.000000"
    //         }
    //       ],
    //       "Retenidos": [],
    //       "Locales": []
    //     },
    //     "CfdiRelacionados": {
    //       "TipoRelacion": "",
    //       "UUID": []
    //     },
    //     "UsoCFDI": "G03",
    //     "Serie": 5352,
    //     "FormaPago": "03",
    //     "MetodoPago": "PUE",
    //     "Moneda": "MXN",
    //     "EnviarCorreo": false
    //   });

      return JSON.stringify(this.json);

  }



  onSubmit(form: NgForm) {
    this.service.formData.Tipo = 'Ingreso';
    this.service.formData.Estatus = 'Creada';
    this.service.formData.Version = '3.3';
    this.service.formData.Id= +this.IdFactura;
    this.service.updateFactura(this.service.formData).subscribe( res =>
      {
        this.resetForm(form);
        this.snackBar.open(res.toString(),'',{
          duration: 5000,
          verticalPosition: 'top'
        });
        this.enviar(this.IdFactura);

      }
      );

    console.log(this.service.formData);
  }

  enviar(id:number) {
    let datosfact = this.crearjsonfactura(id);
    //Aqui manda la factura
    this.enviarfact.enviarFactura(datosfact).subscribe(data => {
      console.log('JSON'+ data);
      if (data.response === 'success') {
        console.log('Factura Creada');
        this.numfact = data.invoice_uid;
        //* this.xml = 'devfactura.in/admin/cfdi33/'+this.numfact+'xml';

        // *this.enviarfact.xml(this.xml);
        this.estatusfact = 'Factura Creada ' + data.invoice_uid;
        // this.dxml(this.numfact);
        // this.dpdf(this.numfact);
      }
      if (data.response === 'error') {
        console.log('error');
        this.estatusfact = data.response + ' ' + data.message;
      }
    })

    console.log(datosfact);
    

  }

  verfolios() {

    //5df9887b8fa49
  }

  dxml(id: string) {
    // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/xml";
    let xml = window.open('http://devfactura.in/admin/cfdi33/' + id + '/xml', 'XML');
  }

  dpdf(id: string) {
    // window.location.href="http://devfactura.in/admin/cfdi33/5df9887b8fa49/pdf";
    let pdf = window.open('http://devfactura.in/admin/cfdi33/' + id + '/pdf', 'PDF');
  }

  dpdfxml() {
    this.dxml('5df9887b8fa49');
    this.dpdf('5df9887b8fa49');
  }


  setfacturatimbre(){
    this.json = {
      Receptor: {
        UID: ''
    },
    TipoDocumento: '',
    Conceptos: [{
        ClaveProdServ:'',
          NoIdentificacion:'',
          Cantidad:'',
          ClaveUnidad:'',
          Unidad:'',
          Descripcion:'',
          ValorUnitario:'',
          Importe:'',
          Descuento:'',
          tipoDesc:'',
          honorarioInverso:'',
          montoHonorario:'',
          Impuestos:{
            Traslados: [
              {
                Base: '',
                Impuesto: '',
                TipoFactor: '',
                TasaOCuota: '',
                Importe: ''
              }],
            Retenidos: [{
                Base: '',
                Impuesto: '',
                TipoFactor: '',
                TasaOCuota: '',
                Importe: ''
              }],
            Locales: [{
                Impuesto: '',
                TasaOCuota: '',
              }],
          },
          NumeroPedimento: '',
          Predial: '',
          Partes: '',
          Complemento:''
    }],
      Impuestos: {
          Traslados: 
          [{
            Base: '',
            Impuesto: '',
            TipoFactor: '',
            TasaOCuota: '',
            Importe: ''   
       }],
        Retenidos: [{
            Base: '',
            Impuesto: '',
            TipoFactor: '',
            TasaOCuota: '',
            Importe: '',
        }],
        Locales: [{
            Impuesto: '',
            TasaOCuota: '',  
       }]
      },
      CfdiRelacionados: {
              TipoRelacion: '',
              UUID: []
            },
      UsoCFDI: '',
      Serie: 0,
      FormaPago: '',
      MetodoPago: '',
      Moneda: '',
      EnviarCorreo: false,
    }
  }

  


}
