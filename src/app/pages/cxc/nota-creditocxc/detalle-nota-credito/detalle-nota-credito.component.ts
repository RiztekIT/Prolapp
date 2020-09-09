import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig} from '@angular/material';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NotaCreditoService } from '../../../../services/cuentasxcobrar/NotasCreditocxc/notaCredito.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DetalleNotaCredito } from '../../../../Models/nota-credito/detalleNotaCredito-model';
import { FacturaService } from '../../../../services/facturacioncxc/factura.service';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import * as html2pdf from 'html2pdf.js';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NotaCredito } from '../../../../Models/nota-credito/notaCredito-model';
import { MessageService } from 'src/app/services/message.service';
import { NotacreditoComponent } from '../../../../components/notacredito/notacredito/notacredito.component';
import { EmailComponent } from 'src/app/components/email/email/email.component';

@Component({
  selector: 'app-detalle-nota-credito',
  templateUrl: './detalle-nota-credito.component.html',
  styleUrls: ['./detalle-nota-credito.component.css']
})
export class DetalleNotaCreditoComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(public dialogbox: MatDialogRef<DetalleNotaCreditoComponent>, public service: NotaCreditoService, public serviceFactura: FacturaService, public enviarfact: EnviarfacturaService, public _MessageService: MessageService, private dialog: MatDialog) { 
    this.service.listen().subscribe((m:any)=>{
      this.Inicializar();
      });
  }

  ngOnInit() {
    this.Inicializar();

    this.filteredOptionsDetalles = this.myControlDetalle.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
      this.setfacturatimbre();

      console.log(this.service.Timbrada);
  }

  folioparam;
idparam;

   listData: MatTableDataSource<any>;
  displayedColumns : string [] = [ 'ClaveProducto', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  //valores de Detalle Conceptos Factura
  filteredOptionsDetalles: Observable<any[]>;
  myControlDetalle = new FormControl();
  public listDetalle: Array<any> = [];
  ProductoSelect: string;
  //Cantidad que se modificara
  CantidadDetalle: number;
  //Cantidad Original del concepto proveniente de detalle factura
  CantidadOriginal: number;
  //IdNotaCredito
  IdNotaCredito: number;

  //Variable tipo Cambio
  tipoCambio: string;

  //Nombre Cliente
  ClienteNombre: string;

  //Variable Booleana para activar el boton Cancelar
  CancelarOperacion: boolean;

  Importe: number;
  ImporteDlls: number;
  ImporteIVA: number;
  ImporteIVADLLS: number;
  iva: number;
  public loading = false;
  fileUrl;
  a = document.createElement('a');
  xmlparam;

  json1;

  //Variable para ver si se agregara o actualizara un detalle Nota Credito
  agregar: boolean;

  public listRel: Array<Object> = [
    { Relacion: '01', text: 'Nota de crédito de los documentos relacionados' },
    { Relacion: '02', text: 'Nota de débito de los documentos relacionados' },
    { Relacion: '03', text: 'Devolución de mercancía sobre facturas o traslados previos' },
    { Relacion: '04', text: 'Sustitución de los CFDI previos' },
    { Relacion: '05', text: 'Traslados de mercancias facturados previamente' },
    { Relacion: '06', text: 'Factura generada por los traslados previos' },
    { Relacion: '07', text: 'CFDI por aplicación de anticipo' },
    { Relacion: '08', text: 'Factura generada por pagos en parcialidades' },
    { Relacion: '09', text: 'Factura generada por pagos diferidos' }
  ];


  Inicializar(){
    this.tipoCambio = this.service.TipoCambio;
    this.IdNotaCredito = this.service.idNotaCredito;
    this.ClienteNombre = this.service.ClienteNombre;
    this.agregar=true;
    this.CancelarOperacion = false;
    this.IniciarImportes();
    this.DetalleNotaCredito();
    this.refreshTablaDetalles();
    console.log(this.IdNotaCredito);
    // console.clear();
    console.log(this.service.formData);
    console.log(this.service.DetalleformData);
  }

  IniciarImportes(){
    this.Importe =0;
    this.ImporteDlls =0;
    this.ImporteIVA =0;
    this.ImporteIVADLLS =0;
     
    this.iva =0.16;
    this.ProductoSelect= "";
    this.service.DetalleformData = new DetalleNotaCredito();
  }

refreshTablaDetalles(){

  this.service.getDetalleNotaCreditoList(this.IdNotaCredito).subscribe(data=>{
    if(data.length > 0){
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      // this.listData.paginator._intl.itemsPerPageLabel = 'Clientes por Pagina';
    console.log(data);
    this.service.formData.Subtotal='0';
    this.service.formData.ImpuestosTrasladados='0';
    this.service.formData.Total='0';
    this.service.formData.SubtotalDlls='0';
    this.service.formData.ImpuestosTrasladadosDlls='0';
    this.service.formData.TotalDlls='0'; 
    for (let i=0; i< data.length; i++){
      this.service.formData.Subtotal = ( parseFloat(this.service.formData.Subtotal) + parseFloat(data[i].PrecioUnitario)*parseFloat(data[i].Cantidad)).toFixed(4);
      this.service.formData.ImpuestosTrasladados = (parseFloat(this.service.formData.ImpuestosTrasladados) + parseFloat(data[i].ImporteIVA)).toFixed(4);
      this.service.formData.Total = (parseFloat(this.service.formData.Total) + parseFloat(data[i].Importe)).toFixed(4);
      
      this.service.formData.SubtotalDlls = ( parseFloat(this.service.formData.SubtotalDlls) + parseFloat(data[i].PrecioUnitarioDlls)*parseFloat(data[i].Cantidad)).toFixed(4);
      this.service.formData.ImpuestosTrasladadosDlls = (parseFloat(this.service.formData.ImpuestosTrasladadosDlls) + parseFloat(data[i].ImporteIVADlls)).toFixed(4);
      this.service.formData.TotalDlls = (parseFloat(this.service.formData.TotalDlls) + parseFloat(data[i].ImporteDlls)).toFixed(4);

    }
    }else{
      console.log('No hay VALORES');
      this.listData = new MatTableDataSource(data)
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }
    console.log(this.service.formData);
    this.service.updateNotaCredito(this.service.formData).subscribe(res=>{
      console.log(res);
    })
  })
}


ObtenerDetalles(){
     //obtener los detalles de cierta factura en especifico
     this.serviceFactura.getDetallesFacturaList(this.service.IdFactura).subscribe(data => {
      this.service.DetalleFactura = data;
      for (let i = 0; i <= data.length - 1; i++) {
        console.log(data[i]);
        //sumas las cantidades de cierto producto en cierta factura
        this.service.getSumaCantidades(data[i].IdFactura, data[i].ClaveProducto).subscribe(data2 => {
          console.log(data2[0].Cantidad);
          //si la cantidad es diferente de null (ya existen notas de credito con el mismo producto en la misma factura)
          if (data2 !== null) {
            console.log(+this.service.DetalleFactura[i].Cantidad);
            console.log(+data2[0].Cantidad);
            //asignarle la cantidad a DetalleFactura. Calcular la cantidad, restando las cantidad de ese producto en la misma factura y asi colocar el maximo que se podra ingresar en el form.
            this.service.DetalleFactura[i].Cantidad = (+this.service.DetalleFactura[i].Cantidad - +data2[0].Cantidad).toString();
          }
          console.log(this.service.DetalleFactura);
        })
      }
         this.listDetalle = this.service.DetalleFactura;
         
      this.filteredOptionsDetalles = this.myControlDetalle.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );

        });
}



DetalleNotaCredito() {  
    this.listDetalle = [];
      
console.log(this.service.IdFactura);

this.ObtenerDetalles();

}

 //Filter Unidad
 private _filterUnidad(value: any): any[] {
    const filterValueDetalle = value.toLowerCase();
    return this.listDetalle.filter(optionDetalle => optionDetalle.ClaveProducto.toString().toLowerCase().includes(filterValueDetalle) || optionDetalle.Producto.toString().toLowerCase().includes(filterValueDetalle));
  
}

onSelectionChange(detalle: DetalleNotaCredito, event: any){
  console.log(event);
  if (event.isUserInput) {
    console.log(detalle);
    this.service.DetalleformData  = detalle;
    this.CantidadDetalle = +detalle.Cantidad;
    this.CantidadOriginal = +detalle.Cantidad;
    console.log(this.ProductoSelect);
  }

}

onChangeCantidad(Cantidad: any){
 
    console.log(this.CantidadDetalle);
    //  //Obtener el valor que se ingresa en cierto input en la posicion 0
     let elemHTML: any = document.getElementsByName('CantidadConcepto')[0];
    //  //Transformar la Cantidad en entero e igualarlo a la variable CantidadF2
     this.CalcularCantidades(Cantidad);
     this.MultiplicarImportes(this.CantidadDetalle);
      elemHTML.value = this.CantidadDetalle;
}

  CalcularCantidades(Cantidad: any) {
    console.log(Cantidad);
    if (Cantidad >= 0) {
      if (Cantidad >= this.CantidadOriginal) {
        this.CantidadDetalle = this.CantidadOriginal;
      }else if(Cantidad <= this.CantidadOriginal){
        this.CantidadDetalle = Cantidad;
      }
    } else {
      this.CantidadDetalle = 0;
    }
  }

  //Metodo para calcular/multiplicar importes
  MultiplicarImportes(Cantidad: any){
    this.service.DetalleformData.Importe = (Cantidad * +this.service.DetalleformData.PrecioUnitario).toString();
    this.service.DetalleformData.ImporteDlls = (Cantidad * +this.service.DetalleformData.PrecioUnitarioDlls).toString();
    if (+this.service.DetalleformData.ImporteIVA > 0) {
      console.log('SI LLEVA IVAAAAAAA');
      this.service.DetalleformData.ImporteIVA = (+this.service.DetalleformData.PrecioUnitario * this.iva).toString();
      this.service.DetalleformData.ImporteIVADlls = (+this.service.DetalleformData.PrecioUnitarioDlls * this.iva).toString();
    }
  }

  onClose(){
    this.dialogbox.close();
    this.service.filter('Register click');
  }


  onSubmit(form: NgForm){
    this.service.DetalleformData.Cantidad = this.CantidadDetalle.toString();
    this.service.DetalleformData.IdNotaCredito = this.IdNotaCredito;
console.log(form);
console.log(this.service.DetalleformData);
this.service.formData.IdNotaCredito = this.IdNotaCredito ;
this.service.formData.Estatus = 'Guardada';
  this.service.addDetalleNotaCredito(this.service.DetalleformData).subscribe(res=>{
    console.log(res);
    this.IniciarImportes();
    form.resetForm();
    this.refreshTablaDetalles();
    });
  }

  onEdit(detalle: DetalleNotaCredito){
console.log(detalle);
this.agregar = false;
this.CancelarOperacion = true;

//Obtener la Cantidad de cierto detalle Factura por IdFactura y Clave producto
this.service.getDetalleFactura(this.service.IdFactura, detalle.ClaveProducto).subscribe(data =>{
  console.log(data[0]);
  //sumas las cantidades de cierto producto en cierta factura
  this.service.getSumaCantidades(this.service.IdFactura, detalle.ClaveProducto).subscribe(data2 => {
    console.log(data2[0].Cantidad);
    //si la cantidad es diferente de null (ya existen notas de credito con el mismo producto en la misma factura)
    // if (data2 !== null) {
    //   console.log(+this.service.DetalleFactura[i].Cantidad);
    //   console.log(+data2[0].Cantidad);
    //   //asignarle la cantidad a DetalleFactura. Calcular la cantidad, restando las cantidad de ese producto en la misma factura y asi colocar el maximo que se podra ingresar en el form.
    //   this.service.DetalleFactura[i].Cantidad = (+this.service.DetalleFactura[i].Cantidad - +data2[0].Cantidad).toString();
    // }
    // console.log(this.service.DetalleFactura);
    this.service.DetalleformData = detalle;
    this.ProductoSelect = detalle.ClaveProducto;
    this.CantidadDetalle = +detalle.Cantidad;
    this.CantidadOriginal = (+data[0].Cantidad) - ((data2[0].Cantidad) - (+detalle.Cantidad));
    this.onChangeCantidad(this.CantidadDetalle);
  })
})


// this.onSelectionChange();

  }

  ActualizarDetalleNotaCredito(form: NgForm){

//Activar boton de cancelar operacion


    this.service.DetalleformData.Cantidad = this.CantidadDetalle.toString();
    this.service.DetalleformData.IdNotaCredito = this.IdNotaCredito;
    console.log(this.service.DetalleformData.IdDetalleNotaCredito);
    console.log(this.service.DetalleformData);
    this.service.updateDetalleNotaCredito(this.service.DetalleformData).subscribe(res=>{
      console.log(res);
      this.agregar = true;
    this.IniciarImportes();
    form.resetForm();
    this.refreshTablaDetalles();
    });
  }

  Cancelar(form:NgForm){
    this.CancelarOperacion = false;
    this.IniciarImportes();
    form.resetForm();
    this.refreshTablaDetalles();
  }

  onDelete(id: number){
// console.log(id);
this.service.DeleteDetalleNotaCredito(id).subscribe(res =>{
console.log(res);
this.refreshTablaDetalles();
});
  }

  onTimbrar(){
    console.log(this.service.formData);
    console.log(this.listData.data);
    console.log(this.serviceFactura.formData);
    
    this.service.formData.LugarDeExpedicion = this.serviceFactura.formData.LugarDeExpedicion;
    this.service.formData.MetodoDePago = this.serviceFactura.formData.MetodoDePago;
    this.service.formData.FormaDePago = this.serviceFactura.formData.FormaDePago;
    this.service.formData.UsoDelCFDI = this.serviceFactura.formData.UsoDelCFDI;
    this.service.formData.Tipo = 'Egreso';
    this.service.formData.Estatus = 'Guardada';
    this.service.formData.Ver = '1.1';
    
    if (this.enviarfact.empresa.RFC==='PLA11011243A'){

      this.service.formData.Serie = '315384';
    }
    else if (this.enviarfact.empresa.RFC==='AIN140101ME3'){
      
      this.service.formData.Serie = '407292';
    }
    //this.service.formData.Serie = '5631';
    this.crearJson();
    this.service.updateNotaCredito(this.service.formData).subscribe(res=>{
      console.log(res);
    });
    console.log(this.json1);
    this.enviarfact.enviarFactura(JSON.stringify(this.json1)).subscribe(data => {
      console.log(data);
      if (data.response === 'success') {
        this.service.formData.LugarDeExpedicion = '31203';
        this.service.formData.NumeroDeCertificado = '00001000000403628664';
        // tslint:disable-next-line: max-line-length
        this.service.formData.Certificado = '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';
        this.service.formData.UUID = data.UUID;
        this.service.formData.CadenaOriginal = '||' + data.SAT.Version + '|' + data.SAT.UUID + '|' + data.SAT.FechaTimbrado + '|LSO1306189R5|' + data.SAT.SelloCFD + '|' + data.SAT.NoCertificadoSAT + '||';
        this.service.formData.SelloDigitalSAT = data.SAT.SelloSAT;
        this.service.formData.SelloDigitalCFDI = data.SAT.SelloCFD;
        this.service.formData.NumeroDeSelloSAT = data.SAT.NoCertificadoSAT;
        this.service.formData.RFCDelPAC = 'LSO1306189R5';
        this.service.formData.Estatus = 'Timbrada';
        // this.numfact = data.UUID;
        console.log(this.service.formData);
        this.service.updateNotaCredito(this.service.formData).subscribe(data => {
          this.service.Timbrada = true;
          // this.loading = false;
          console.log(data);
          document.getElementById('cerrarmodal').click();
          Swal.fire(
            'Nota de Credito Creada',
            '' + this.service.formData.UUID + '',
            'success'
          )

      })
    }
    })
  }
  setfacturatimbre() {
    this.json1 = {
        Receptor: {
          UID: ''
        },
        TipoDocumento: '',
        Conceptos: [{
          ClaveProdServ: '',
          NoIdentificacion: '',
          Cantidad: '',
          ClaveUnidad: '',
          Unidad: '',
          Descripcion: '',
          ValorUnitario: '',
          Importe: '',
          Descuento: '',
          tipoDesc: '',
          honorarioInverso: '',
          montoHonorario: '',
          Impuestos: {
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
          Complemento: ''
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
        TipoCambio: '',
        EnviarCorreo: false,
      }
    }

  crearJson(){
    let cadena: string;
    let ivajson;
    if (+this.service.DetalleformData.ImporteIVA > 0) {
      console.log('SI LLEVA IVAAAAAAA');
      ivajson = '0.16'
    }else{
      ivajson = '0'
    }
    

      this.json1.Receptor.UID = this.service.IdApi;
      this.json1.Moneda = this.service.formData.Moneda;
      if (this.service.formData.Moneda == 'MXN') {
        this.json1.Impuestos.Traslados.pop();
        this.json1.Impuestos.Traslados.push({
          "Base": this.service.formData.Subtotal,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": this.service.formData.ImpuestosTrasladados
        });
      } else if (this.service.formData.Moneda == 'USD') {
        this.json1.TipoCambio = this.service.formData.TipoDeCambio;
        this.json1.Impuestos.Traslados.pop();
        this.json1.Impuestos.Traslados.push({
          "Base": this.service.formData.SubtotalDlls,
          "Impuesto": "002",
          "TipoFactor": "Tasa",
          "TasaOCuota": "0.16",
          "Importe": this.service.formData.ImpuestosTrasladadosDlls
        });

      }
      this.json1.TipoDocumento = 'nota_credito';

      this.json1.Impuestos.Retenidos.pop();
      this.json1.Impuestos.Locales.pop();
      this.json1.CfdiRelacionados.TipoRelacion = this.service.formData.Relacion;
      this.json1.CfdiRelacionados.UUID.pop();
      this.json1.CfdiRelacionados.UUID.push(this.serviceFactura.formData.UUID);
      this.json1.UsoCFDI = this.service.formData.UsoDelCFDI;
      this.json1.Serie = this.service.formData.Serie;
      this.json1.FormaPago = this.service.formData.FormaDePago;
      this.json1.MetodoPago = this.service.formData.MetodoDePago;

      this.json1.EnviarCorreo = false;


        this.json1.Conceptos.pop();
        if (this.json1.Moneda == 'MXN') {
          for (let i = 0; i < this.listData.data.length; i++) {
            this.json1.Conceptos.push({
              ClaveProdServ: '84111506',
              NoIdentificacion: this.listData.data[i].ClaveProducto,
              Cantidad: this.listData.data[i].Cantidad,
              ClaveUnidad: 'ACT',
              Unidad: this.listData.data[i].Unidad,
              Descripcion: this.listData.data[i].Producto,
              ValorUnitario: this.listData.data[i].PrecioUnitario,
              Importe: this.listData.data[i].Importe,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: this.listData.data[i].Importe,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: ivajson,
                  Importe: ((parseFloat(this.listData.data[i].Importe) * parseFloat(ivajson)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });

          }

        }
        else if (this.json1.Moneda == 'USD') {
          for (let i = 0; i < this.listData.data.length; i++) {
            this.json1.Conceptos.push({
              ClaveProdServ: this.listData.data[i].ClaveSAT,
              NoIdentificacion: this.listData.data[i].ClaveProducto,
              Cantidad: this.listData.data[i].Cantidad,
              ClaveUnidad: this.listData.data[i].Unidad,
              Unidad: this.listData.data[i].Unidad,
              Descripcion: this.listData.data[i].Producto,
              ValorUnitario: this.listData.data[i].PrecioUnitarioDlls,
              Importe: this.listData.data[i].ImporteDlls,
              Descuento: '0',
              tipoDesc: 'porcentaje',
              honorarioInverso: '',
              montoHonorario: '0',
              Impuestos: {
                Traslados: [{
                  Base: this.listData.data[i].ImporteDlls,
                  Impuesto: '002',
                  TipoFactor: 'Tasa',
                  TasaOCuota: ivajson,
                  Importe: ((parseFloat(this.listData.data[i].ImporteDlls) * parseFloat(ivajson)).toFixed(6)).toString()
                }]
              },
              NumeroPedimento: "",
              Predial: "",
              Partes: "0",
              Complemento: "0"
            });
          }
        }
        // cadena = JSON.stringify(this.json1);
      
    
    // return cadena;
  }


  dxml(uuid, folio){
    console.log(uuid);
    console.log(folio);
    console.log(this.service.formData);

    this.loading = true;
    // document.getElementById('enviaremail').click();
    let xml = 'http://devfactura.in/api/v3/cfdi33/' + uuid + '/xml';
    this.enviarfact.xml(uuid).subscribe(data => {
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';
      document.body.appendChild(this.a);
      this.a.click();
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "100%";
      dialogConfig.height = "80%";
      dialogConfig.data =  {
        param : folio
      }
      
     
      this.dialog.open(NotacreditoComponent, dialogConfig);

      setTimeout(()=>{
        this.onExportClick(folio);    
        this.dialog.closeAll();
        this.loading = false;
        
       },1000)
    });

    
 

  }

  onExportClick(folio?: string) {
    // this.proceso = 'xml';
    // document.getElementById('element-to-PDFNC').style.zIndex = "1";
    const content: Element = document.getElementById('element-to-PDFNC');
    const option = {
      margin: [.5,.5,.5,0],
      filename: 'F-' + folio + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {scale: 2, logging: true, scrollY: -2, scrollX: -15},
      jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
      pagebreak:{ avoid: '.pgbreak'}
      
    };

    html2pdf().from(content).set(option).save(); 
    // this.proceso = '';
  }

  dxml2(uuid, folio){
    // this.proceso = 'xml';
    this.xmlparam = folio
    let xml = 'https://factura.com/api/v3/cfdi33/' + uuid + '/xml';
    this.enviarfact.xml(uuid).subscribe(data => {
      localStorage.removeItem('xml' + folio)
      localStorage.setItem('xml' + folio, data)
      const blob = new Blob([data as BlobPart], { type: 'application/xml' });
      this.fileUrl = window.URL.createObjectURL(blob);
      this.a.href = this.fileUrl;
      this.a.target = '_blank';
      this.a.download = 'F-' + folio + '.xml';
      document.body.appendChild(this.a);
      // this.resetForm();
      
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = "100%";
      dialogConfig.height = "80%"
      dialogConfig.data =  {
        param : folio
      }
      
     
      this.dialog.open(NotacreditoComponent, dialogConfig);
      return this.fileUrl;
    });

   

  }

  email(){
    console.log(this.service.formData); 
    localStorage.removeItem('xml' + this.service.formData.Folio);
    localStorage.removeItem('pdf' + this.service.formData.Folio);
    let folio = this.service.formData.Folio;
    // document.getElementById('enviaremail2').click();
    // localStorage.setItem('rowfact',JSON.stringify(this.service.formData));

    this.folioparam = this.service.formData.Folio;
    this.idparam = this.service.formData.UUID;
    this._MessageService.correo='ivan.talamantes@live.com';
    this._MessageService.cco='ivan.talamantes@riztek.com.mx';
    this._MessageService.asunto='Envio Nota de Credito '+this.service.formData.Folio;
    this._MessageService.cuerpo='Se ha enviado un comprobante fiscal digital con folio '+this.service.formData.Folio;
    this._MessageService.nombre='ProlactoIngredientes';
      this.enviarfact.xml(this.service.formData.UUID).subscribe(data => {
        localStorage.setItem('xml' + this.service.formData.Folio, data)
        const dialogConfig2 = new MatDialogConfig();
        dialogConfig2.autoFocus = false;
        dialogConfig2.width = "0%";    
        dialogConfig2.data =  {
          param : folio
        }
        let dialogFact = this.dialog.open(NotacreditoComponent, dialogConfig2); 
        setTimeout(()=>{
  
          // this.xmlparam = folio;
            const content: Element = document.getElementById('element-to-PDFNC');
            const option = {
              margin: [0, 0, 0, 0],
              filename: 'F-' + this.service.formData.Folio + '.pdf',
              image: { type: 'jpeg', quality: 1 },
              html2canvas: { scale: 2, logging: true, scrollY: 0 },
              jsPDF: { format: 'letter', orientation: 'portrait' },
            };
            html2pdf().from(content).set(option).output('datauristring').then(function(pdfAsString){
              localStorage.setItem('pdf'+folio, pdfAsString);
              this.statusparam=true;          
              console.log(this.statusparam);                
            })
            dialogFact.close()
            
          },1000)
          
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          // dialogConfig.width = "90%";
          dialogConfig.height = "90%";
          dialogConfig.data = {
            foliop: this.service.formData.Folio,
            idp: this.service.formData.UUID,
            status: true
          }
          this.dialog.open(EmailComponent, dialogConfig);
      })
  
      
  
      
  }

  cancelar(id: string, folio: number) {
    
    Swal.fire({
      title: '¿Segur@ de Cancelar la Factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Deshacer'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.enviarfact.cancelar(id).subscribe(data => {
          let data2 = JSON.parse(data);
          if (data2.response === 'success') {
            // this.service.updateCancelarFactura(this.service.formData.Id).subscribe(data => {
            //   this.loading = false;
            //   Swal.fire({
            //     title: 'Factura Cancelada',
            //     icon: 'success',
            //     timer: 1000,
            //     showCancelButton: false,
            //     showConfirmButton: false
            //   });
            // });
          }
          else if (data2.response === 'error') {
            this.loading = false;
            // this.resetForm();
            Swal.fire(
              'Error en Cancelacion',
              '' + data2.message + '',
              'error'
            )
          }
        })
      }

    })
  }

}
