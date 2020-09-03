import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js';
import { processors } from 'xml2js'
import { MatTableDataSource } from '@angular/material';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-saldoscxp',
  templateUrl: './saldoscxp.component.html',
  styleUrls: ['./saldoscxp.component.css']
})
export class SaldoscxpComponent implements OnInit {

  files: File[] = [];
  fileUrl;
  empleados = [];
  listData: MatTableDataSource<any>;
terminado;
valor;
contador;
total;
valido;
  constructor() { }

  ngOnInit() {
    this.terminado= true;
    this.valor = 0;
    this.contador = 0;
    this.total = 0;
    
  }

  fileContent: string = '';

 /*  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function(x) {
      // self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
  } */


  onChange(files){
    console.log(files);
  }

  onRemove(event) {
    console.log(event);
    //Eliminar imagen del dropzone
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSelect(event) {
    console.log(event)
    this.valor = 0;
    this.contador = 0;
    this.total = event.addedFiles.length;
    
    this.empleados = [];
    for (let i=0; i<event.addedFiles.length;i++){

      const blob = new Blob([event.addedFiles[i] as BlobPart], { type: 'application/xml' });
      /* this.fileUrl = window.URL.createObjectURL(blob); */
      // console.log(this.fileUrl)
      let fileReader: FileReader = new FileReader();
      fileReader.readAsText(blob);
      
      console.log(fileReader); 
      
      fileReader.onload = e =>{
        /* console.log(e);
        console.log(fileReader.result); */
          this.fileUrl = fileReader.result;
          
          this.leerxml(this.fileUrl)
        }

      
    }

    

  
   
  }


  leerxml(xml){
    this.contador = this.contador + 1;
/*     let xml
    xml = localStorage.getItem('xmls') */
    // console.log(xml);
    const p = new xml2js.parseString(xml, { tagNameProcessors: [processors.stripPrefix] }, (err, result) => {

      // console.log(result.Comprobante.Receptor[0].$.Nombre);
      console.log(result);/*  */
      if (result.Comprobante.$.TipoDeComprobante=='N'){

        this.empleados.push(result)
      }

 /*      console.log(this.contador);
      console.log(this.total); */

      this.valor = ((this.contador)*100) / this.total;
      /* console.log(this.valor);
      console.log(event.addedFiles.length); */
      if(this.valor == 100){
        this.terminado = false;
        Swal.fire({
          title: 'XML Leidos',
          text: this.total + ' XMl',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        });
      }
      // console.log(err);
  })
}

excel(){
  let registropatronal;
  const title = 'RK-XML';
    const subtitle = 'Lectura de XML Nominas';
    const header1 = ["No. Emp", "Nombre", "RFC", "CURP", "NSS","Fecha Alta", "Departamento","Puesto","S.B.C.","S.D.I.","Periodicidad"]     
    const header21 = ["Fecha Pago","Fecha Inicial", "Fecha Final","Dias Pago", "Total Percepciones", "Total Deducciones","Registro Patronal", "UUID"]     
    const data = this.empleados;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('XML NOMINAS');
    worksheet.mergeCells('A1:D1');
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.mergeCells('A2:D2');
    let subtitleRow = worksheet.addRow([subtitle])
    subtitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12 };
    worksheet.addRow([]);
    let count = 0;
    data.forEach((d) => {
      count = count +1;
    let headerRow = worksheet.addRow(header1);
    headerRow.eachCell((cell, number) => {
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
        bgColor: { argb: 'FFFFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.font = { color : {argb: 'FFFFFF'} }
    });
  
    // worksheet.addRow([]);

    

    let h2 = [d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.NumEmpleado,d.Comprobante.Receptor[0].$.Nombre,d.Comprobante.Receptor[0].$.Rfc,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Curp,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.NumSeguridadSocial,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.FechaInicioRelLaboral,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Departamento,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Puesto,+d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.SalarioBaseCotApor,+d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.SalarioDiarioIntegrado, d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.PeriodicidadPago]
    let rowh = worksheet.addRow(h2);

    let headerRow2 = worksheet.addRow(header21);
    headerRow2.eachCell((cell, number) => {
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
        bgColor: { argb: 'FFFFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.font = { color : {argb: 'FFFFFF'} }
    });

    if (d.Comprobante.Complemento[0].Nomina[0].Emisor && d.Comprobante.Complemento[0].Nomina[0].Emisor[0].$){
      registropatronal = d.Comprobante.Complemento[0].Nomina[0].Emisor[0].$.RegistroPatronal
    }else{
      registropatronal = '';
    }

    h2 = [d.Comprobante.Complemento[0].Nomina[0].$.FechaPago,d.Comprobante.Complemento[0].Nomina[0].$.FechaInicialPago,d.Comprobante.Complemento[0].Nomina[0].$.FechaFinalPago,d.Comprobante.Complemento[0].Nomina[0].$.NumDiasPagados,d.Comprobante.Complemento[0].Nomina[0].$.TotalPercepciones,d.Comprobante.Complemento[0].Nomina[0].$.TotalDeducciones,registropatronal,d.Comprobante.Complemento[0].TimbreFiscalDigital[0].$.UUID]
    rowh = worksheet.addRow(h2);


    let header2 = ['Percepciones','Gravado','Exento','Deducciones','','']
    let rowh2 = worksheet.addRow(header2);

    let f;

    if ((d.Comprobante.Complemento[0].Nomina[0].Percepciones) && (d.Comprobante.Complemento[0].Nomina[0].Deducciones)){

      if(d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion.length>=d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion.length){
        f = d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion.length;
      }else{
        f = d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion.length
      }
    }else if (d.Comprobante.Complemento[0].Nomina[0].Percepciones){
      f = d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion.length;
    }else{
      f = d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion.length
    }

    for (let r=0; r<f; r++){
      let registro = [];

      if (d.Comprobante.Complemento[0].Nomina[0].Percepciones){

      
if (r<=d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion.length-1){

  registro[1]=d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion[r].$.Concepto;
  registro[2]=+d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion[r].$.ImporteGravado;
  registro[3]=+d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion[r].$.ImporteExento;
}
}

if (d.Comprobante.Complemento[0].Nomina[0].Deducciones){



if (r<=d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion.length-1){
  registro[4]=d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion[r].$.Concepto;
        registro[5]=+d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion[r].$.Importe;

}
}

      // for (let p=0; p<d.Comprobante.Complemento[0].Nomina[0].Percepciones[0].Percepcion.length;p++){
        
      // }
      // for (let de=0; de<d.Comprobante.Complemento[0].Nomina[0].Deducciones[0].Deduccion.length;de++){
        
        
      // }
    
      
      let row = worksheet.addRow(registro);
      let dlls = row.getCell(2);
      dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      dlls = row.getCell(3);
      dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      // worksheet.addRow([]);
      dlls = row.getCell(4);
      dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      // worksheet.addRow([]);
      dlls = row.getCell(5);
      dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      // worksheet.addRow([]);

    }
    

   
    



    

    
      
    })



    worksheet.addRow(['','Total de Registros - '+ count]);


    
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'XMLNominas Detallado- Riztek.xlsx');
    });

    
}


excelresumen(){
  let registropatronal
  const title = 'RK-XML';
  const subtitle = 'Lectura de XML Nominas';
  const header1 = ["No. Emp", "Nombre", "RFC", "CURP", "NSS","Fecha Alta", "Departamento","Puesto","S.B.C.","S.D.I.","Fecha Pago","Fecha Inicial", "Fecha Final","Dias Pago", "Total Percepciones", "Total Deducciones","Registro Patronal","Contrato","Sindicalizado","Jornada","Regimen","Cuenta","Periodicidad", "UUID"]   

  const data = this.empleados;
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet('XML NOMINAS');
  worksheet.mergeCells('A1:D1');
  let titleRow = worksheet.addRow([title]);
  titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
  worksheet.mergeCells('A2:D2');
  let subtitleRow = worksheet.addRow([subtitle])
  subtitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12 };
  worksheet.addRow([]);
  let count = 0;
  let headerRow = worksheet.addRow(header1);
  data.forEach((d) => {
    count = count +1;
  headerRow.eachCell((cell, number) => {
    
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '000000' },
      bgColor: { argb: 'FFFFFF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    cell.font = { color : {argb: 'FFFFFF'} }
  });
  // worksheet.addRow([]);

  if (d.Comprobante.Complemento[0].Nomina[0].Emisor && d.Comprobante.Complemento[0].Nomina[0].Emisor[0].$){
    registropatronal = d.Comprobante.Complemento[0].Nomina[0].Emisor[0].$.RegistroPatronal
  }else{
    registropatronal = '';
  }

  let h2 = [d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.NumEmpleado,d.Comprobante.Receptor[0].$.Nombre,d.Comprobante.Receptor[0].$.Rfc,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Curp,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.NumSeguridadSocial,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.FechaInicioRelLaboral,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Departamento,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Puesto,+d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.SalarioBaseCotApor,+d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.SalarioDiarioIntegrado,d.Comprobante.Complemento[0].Nomina[0].$.FechaPago,d.Comprobante.Complemento[0].Nomina[0].$.FechaInicialPago,d.Comprobante.Complemento[0].Nomina[0].$.FechaFinalPago,d.Comprobante.Complemento[0].Nomina[0].$.NumDiasPagados,d.Comprobante.Complemento[0].Nomina[0].$.TotalPercepciones,d.Comprobante.Complemento[0].Nomina[0].$.TotalDeducciones,registropatronal,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.TipoContrato,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.Sindicalizado,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.TipoJornada,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.TipoRegimen,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.CuentaBancaria,d.Comprobante.Complemento[0].Nomina[0].Receptor[0].$.PeriodicidadPago,d.Comprobante.Complemento[0].TimbreFiscalDigital[0].$.UUID]  
  let rowh = worksheet.addRow(h2);

  

 
  



  

  
    
  })



  worksheet.addRow(['','Total de Registros - '+ count]);


  
  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 30;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 15;
  worksheet.getColumn(6).width = 10;
  worksheet.getColumn(7).width = 20;
  worksheet.getColumn(8).width = 15;
  worksheet.getColumn(9).width = 10;
  worksheet.getColumn(10).width = 10;


  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'XMLNominas Resumen- Riztek.xlsx');
  });


}

}
