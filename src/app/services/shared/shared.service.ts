import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx'
import { Workbook } from 'exceljs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  datePipe: any;

  constructor() { }

  logobase64 = "data:image/png;base64,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";

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     fs.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  public generarExcelCobranza(datos){
    const title = 'Reporte Cobranza';
const header = ["ID Cliente", "Cliente"]
const header1 = ["Folio","Fecha de Expedicion","Fecha de Vencimiento","Total MXN", "Total DLLS","Abonos","Saldo","Moneda", "T.C."]
const data = datos;
let workbook = new Workbook();
let worksheet = workbook.addWorksheet('Cobranza');
let titleRow = worksheet.addRow([title]);
titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
worksheet.addRow([]);
worksheet.addRow([]);
worksheet.addRow([]);
let subTitleRow = worksheet.addRow(['Fecha :','=Hoy()']);
const logoBase64 = "data:image/png;base64,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";
let logo = workbook.addImage({
  base64: logoBase64,
  extension: 'png',
});
worksheet.addImage(logo, 'F1:H5');
worksheet.mergeCells('A1:E4');
let headerRow = worksheet.addRow(header);
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
let headerRow1 = worksheet.addRow(header1);
headerRow1.eachCell((cell, number) => {
  
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000000' },
    bgColor: { argb: 'FFFFFF' }
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  cell.font = { color : {argb: 'FFFFFF'} }
});
worksheet.mergeCells('B6:I6');

console.log(data);
const dat: any[] = Array.of(data);
console.log(dat);

data.forEach((d) => {

  let registro = [d.IdCliente, d.Nombre];
  console.log(registro);
  let row = worksheet.addRow(registro);

  let totalMXN = 0;
  let totalUSD = 0;
  let totalAbono = 0;
  let totalSaldo = 0;

  d.Docs.forEach((docs)=>{

    let fechaexp = docs.FechaDeExpedicion.substring(0,10);
    let fechavenc = docs.FechaVencimiento.substring(0,10);

    let registro2 = [docs.Folio,fechaexp,fechavenc,+docs.Total,+docs.TotalDlls,+docs.Abonos,+docs.Saldo,docs.Moneda,+docs.TipoDeCambio]
    let row2 = worksheet.addRow(registro2);
    totalMXN = totalMXN + +docs.Total; 
    totalUSD = totalUSD + +docs.TotalDlls; 

    
    totalAbono = totalAbono + +docs.Abonos;

    totalSaldo = totalSaldo + +docs.Saldo;
  
    
    let pesos = row2.getCell(4);
    pesos.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    let dlls = row2.getCell(5);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(6);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(7);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(9);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
  })

  let suma = ['','','Total',totalMXN,totalUSD,totalAbono,totalSaldo]
  let sumarow = worksheet.addRow(suma);
  let totalformat = sumarow.getCell(4);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(5);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(6);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(7);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  
  


  
  
}
);


worksheet.getColumn(2).width = 15;
worksheet.getColumn(3).width = 15;
worksheet.getColumn(4).width = 15;
worksheet.getColumn(5).width = 15;
worksheet.getColumn(6).width = 15;
worksheet.getColumn(7).width = 15;


workbook.xlsx.writeBuffer().then((data) => {
  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fs.saveAs(blob, 'ReporteCobranza.xlsx');
});
  }


  generarReporteFacturacionFechas(datos,fechaini,fechafinal){
    const title = 'PRO LACTOINGREDIENTES S DE RL MI DE CV';
    const subtitle = 'Reporte Facturacion entre Fechas';
    const header = ["Folio", "Cliente", "Fecha", "Importe", "Moneda", "Estatus"]
    const data = datos;
    console.log('datos service',data);
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Facturas');
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.addRow([]);
    let subtitleRow = worksheet.addRow([subtitle])
    subtitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12 };
    
    
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Fecha : '+ fechaini+ ' al '+fechafinal]);
    const logoBase64 = "data:image/png;base64,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";
    let logo = workbook.addImage({
      base64: logoBase64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'E1:F5');
    worksheet.mergeCells('A1:D2');
    worksheet.mergeCells('A3:D4');
    worksheet.mergeCells('A5:D5');
    worksheet.addRow([]);
    worksheet.mergeCells('A6:D6');
    let headerRow = worksheet.addRow(header);
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
    
    // console.log(data);
    const dat: any[] = Array.of(data);
    // console.log(dat);

    let sumapesos = 0;
    let sumadolares = 0;
    let count = 0;
    
    data.forEach((d) => {
      let registro = []
      count = count +1;

      if (d.Moneda==='MXN'){

        registro = [d.Folio,d.IdCliente+' - '+d.Nombre,d.FechaDeExpedicion,+d.Total,d.Moneda,d.Estatus];
      }
      else if (d.Moneda==='USD'){
        registro = [d.Folio,d.IdCliente+' - '+d.Nombre,d.FechaDeExpedicion,+d.TotalDlls,d.Moneda,d.Estatus];
      }

      if (d.Estatus==='Timbrada'){
        sumapesos = sumapesos + +d.Total;
        sumadolares = sumadolares + +d.TotalDlls;
      }

      console.log('registro',registro);
      
      let row = worksheet.addRow(registro);
      let clienter = row.getCell(2);
      clienter.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' }
      }
      // let pesos = row.getCell(3);
      // pesos.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      let dlls = row.getCell(4);
      dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
      
    }
    );

    worksheet.addRow([]);
    let footersumamxn = worksheet.addRow(['','Total de Facturacion MXN','',sumapesos]); 
    footersumamxn.font = { name: 'Comic Sans MS', family: 4, size: 12 };
    let footersumamxn2 = footersumamxn.getCell(4)
    footersumamxn2.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'

    let footersumausd = worksheet.addRow(['','Total de Facturacion USD','',sumadolares]);
    footersumausd.font = { name: 'Comic Sans MS', family: 4, size: 12 };
    let footersumausd2 = footersumausd.getCell(4)
    footersumausd2.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'

    worksheet.addRow(['','Los Documentos Cancelados no se incluyen en el calculo de totales'])
    worksheet.addRow([])
    worksheet.addRow(['','Total de Registros - '+ count]);


    
    worksheet.getColumn(2).width = 50;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 22;
    
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ReporteFechas.xlsx');
    });

  }


  //-------------------------- Reportes --------------------------- //
  
  //***** Reportes Compras  *****//

  //recibe como parametro el arreglo con los datos del reporte
  public generarExcelReporteCompras(datos){
    const title = 'Reporte Compras';
const header = ["ID Proveedor", "Proveedor"]
const header1 = ["Folio","Fecha de Elaboracion","Fecha de Entrega","Total MXN", "Total DLLS","Sacos Totales","Peso Total","Moneda", "T.C."]
const data = datos;
let workbook = new Workbook();
let worksheet = workbook.addWorksheet('Compras');
let titleRow = worksheet.addRow([title]);
titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
worksheet.addRow([]);
worksheet.addRow([]);
worksheet.addRow([]);
let subTitleRow = worksheet.addRow(['Fecha :', new Date()]);
const logoBase64 = this.logobase64;
let logo = workbook.addImage({
  base64: logoBase64,
  extension: 'png',
});
worksheet.addImage(logo, 'F1:H5');
worksheet.mergeCells('A1:E4');
let headerRow = worksheet.addRow(header);
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
let headerRow1 = worksheet.addRow(header1);
headerRow1.eachCell((cell, number) => {
  
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000000' },
    bgColor: { argb: 'FFFFFF' }
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  cell.font = { color : {argb: 'FFFFFF'} }
});
worksheet.mergeCells('B6:I6');

console.log(data);
const dat: any[] = Array.of(data);
console.log(dat);

data.forEach((d) => {
console.log(d  );
  let registro = [d.IdProveedor, d.Nombre];
  console.log(registro);
  let row = worksheet.addRow(registro);

  let totalMXN = 0;
  let totalUSD = 0;
  let sacosTotales = 0;
  let pesoTotal = 0;

  d.Docs.forEach((docs)=>{

    let fechaela = docs.FechaElaboracion.substring(0,10);
    let fechaentre = docs.FechaEntrega.substring(0,10);

    let registro2 = [docs.Folio,fechaela,fechaentre,+docs.Total,+docs.TotalDlls,+docs.SacosTotales,+docs.PesoTotal,docs.Moneda,+docs.TipoCambio]
    let row2 = worksheet.addRow(registro2);
    totalMXN = totalMXN + +docs.Total; 
    totalUSD = totalUSD + +docs.TotalDlls; 

    
    sacosTotales = sacosTotales + +docs.SacosTotales;

    pesoTotal = pesoTotal + +docs.PesoTotal;
  
    
    let pesos = row2.getCell(4);
    pesos.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    let dlls = row2.getCell(5);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(6);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(7);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
    dlls = row2.getCell(9);
    dlls.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-'
  })

  let suma = ['','','Total',totalMXN,totalUSD,sacosTotales,pesoTotal]
  let sumarow = worksheet.addRow(suma);
  let totalformat = sumarow.getCell(4);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(5);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(6);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  totalformat = sumarow.getCell(7);
  totalformat.numFmt = '_-$* #,##0.00_-;-$* #,##0.00_-;_-$* "-"??_-;_-@_-';
  
  


  
  
}
);


worksheet.getColumn(2).width = 15;
worksheet.getColumn(3).width = 15;
worksheet.getColumn(4).width = 15;
worksheet.getColumn(5).width = 15;
worksheet.getColumn(6).width = 15;
worksheet.getColumn(7).width = 15;


workbook.xlsx.writeBuffer().then((data) => {
  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fs.saveAs(blob, 'ReporteCompras.xlsx');
});
  }

  //***** Reportes Compras  *****//
  
  
  //-------------------------- Reportes --------------------------- //

}
