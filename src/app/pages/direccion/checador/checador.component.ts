import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { UsuariosServieService } from '../../../services/catalogos/usuarios-servie.service';
import { MatTableDataSource, MatSort, MatPaginator, MatCalendarCellCssClasses } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment/moment.js'
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-checador',
  templateUrl: './checador.component.html',
  styleUrls: ['./checador.component.css']
})

@Pipe({
  name: 'split'
})
export class ChecadorComponent implements OnInit {

  constructor(public usuarioservice: UsuariosServieService) { }

  displayedColumns : string [] = ['Usuario', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  listData: MatTableDataSource<any>;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  fecha1;
  fecha2;

  ngOnInit() {
    // this.getChecadas();

    this.fecha1 = new Date();
    this.fecha2 = new Date();

    this.formatCurrentDate();
    
  }


  getChecadas(){
    this.usuarioservice.checadas().subscribe((data: any)=>{
      console.log(data);
      this.listData = new MatTableDataSource(data);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Checadas por Pagina';
            this.applyFilter('');
    })
  }

  /* Metodo para el filtro de la tabla */
  applyFilter(filtervalue: string){  
    // console.log(this.listData);
    
    this.listData.filterPredicate = (data, filter: string) => {
      
        return data.Nombre.toLowerCase().includes(filter);
      
      
    };
    this.listData.filter= filtervalue.trim().toLocaleLowerCase();
  }

  filtrofecha(evento){
    console.log(evento.target.value);

    let date = evento.target.value;

    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const days = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    let dia;
    
    let mes;
    let año;
    let hora;
    let min;
    let seg;
    let fecha2;
    
    let fecha = new Date(date);

    
    dia = `${days[fecha.getDate()]}`;
    
    mes = `${months[fecha.getMonth()]}`;
    año = fecha.getFullYear();
    hora = fecha.getHours();
    min = fecha.getMinutes();
    seg = fecha.getSeconds();

    hora = '00';
    min = '00';
    seg = '00';

    fecha2 = año + '-' + mes + '-' + dia
    console.log(fecha);
    console.log(fecha2);

  



    this.usuarioservice.checadasfechas(fecha2).subscribe((data: any)=>{
      console.log(data);
      this.listData = new MatTableDataSource(data);
            this.listData.sort = this.sort;    
            this.listData.paginator = this.paginator;
            this.listData.paginator._intl.itemsPerPageLabel = 'Checadas por Pagina';
            this.applyFilter('');
    })
  }

  formatDates(){
    
  }


  //^ ******************* FUNCIONES PARA OBTENER INFORMACION DE LA SEMANA  ************************* // 
  
//^ Metodo que obtiene TODAS LAS SEMANAS DEL AÑO y las guarda en un arreglo

//  arregloSemanas = [];
//   formatDates() {
//     var firstDay = new Date(new Date().getFullYear(), 0, 1);
//     // console.log('%c%s', 'color: #731d6d', firstDay);
//     var lastDay = new Date(new Date().getFullYear(), 11, 31);
//     // console.log('%c%s', 'color: #e57373', lastDay);


//     let startDate = moment(firstDay);
//     // let startDate = moment('2020-01-01');
//     // let endDate = moment('2020-12-31');
//     let endDate = moment(lastDay);

//     let weekData = [];
//     while(startDate.isSameOrBefore(endDate)) {
//         if(weekData.length > 0) {
//             // Update end date
//             let lastObj = weekData[weekData.length - 1];
//             lastObj['endDate'] =  moment(startDate).format('MM/DD/YYYY');
//             lastObj['label'] = `${lastObj.startDate} - ${lastObj['endDate']} (Semana ${weekData.length})`
//             startDate.add(1, 'days');
//         }
//         weekData.push({startDate: moment(startDate).format('MM/DD/YYYY')});
//         startDate.add(6, 'days');
//     }
//     if(startDate.isAfter(endDate)) {
//         // Update last object
//         let lastObj = weekData[weekData.length - 1];
//         lastObj['endDate'] =  moment(endDate).format('MM/DD/YYYY');
//         lastObj['label'] = `${lastObj.startDate} - ${lastObj['endDate']} (Semana ${weekData.length})`
//     }
//     // console.log(weekData);

//     this.arregloSemanas = weekData;
//     // console.log(this.arregloSemanas);

//     //^ Darle formato a la fecha Actual
//       this.formatCurrentDate();

 
 
//     return weekData;
// }

        // console.log(this.informacionChecador);


        // switch(diaActual){
        //   case (0):
        //     console.log('ES DOMINGO');
        //   break;
        //   case (1):
        //     console.log('ES LUNES');
        //   break;
        //   case (2):
        //     console.log('ES MARTES');
        //   break;
        //   case (3):
        //     console.log('ES MIERCOLES');
        //   break;
        //   case (4):
        //     console.log('ES JUEVES');
        //   break;
        //   case (5):
        //     console.log('ES VIERNES');
        //   break;
        //   case (6):
        //     console.log('ES SABADO');
        //   break;
        // }



  //  console.log(days);
  //  console.log(moment('01/19/2016').format("MMMM Do,dddd"));



// const format = 'dd/MM/yyyy';
// const locale = 'en-US';
// const formattedDate = formatDate(actualDate, format, locale);
// console.log(actualDate);
// // console.log('%c%s', 'color: #731d1d', formattedDate);
// // this.transform(formattedDate, 10000)
// //^ Arreglo que contiene la fecha Dividida: Posicion 0: Dia, Posicion 1: Mes, Posicion 2: Año
// let fechaDividida = formattedDate.split('/', 10)
// console.log(fechaDividida);
// let day =  fechaDividida[0];
// console.log('%c%s', 'color: #807160', day);
// let month =  fechaDividida[1];
// console.log('%c%s', 'color: #007300', month);
// let year =  fechaDividida[2];
// console.log('%c%s', 'color: #006dcc', year);


// // var index:number = this.array.indexOf(this.array.find(x => x.idP == id)); 
// //^ Buscar las posibles semanas en las que se encuentra la Fecha Especificada
// let mesObtenido = [];
// this.arregloSemanas.forEach((element,a) => {    
//   let fechaObtenida = element.startDate.split('/', 3)
//   console.log(fechaObtenida);
//   if(fechaObtenida[0] == month && fechaObtenida[2] == year){
//     // console.log('Se ha encontrado el Mes');
//     let objetoSemana = {
//     informacion: element,
//     posicion:a
//     }
//     mesObtenido.push(objetoSemana);
    
//   }
//   // this.arregloSemanas.find(valor => valor.startDate)
// });
// console.log(mesObtenido);

// let semanaCorrecta;
// //^ Encontrar la Semana en la que se Encuentra la fecha Especificada
// mesObtenido.forEach((element, b) => {
//     let semanaInicio = element.informacion.startDate.split('/', 3)
//     let semanaFin = element.informacion.endDate.split('/', 3)
//     let diaInicio = +semanaInicio[1];
//     let diaFin = +semanaFin[1];
//   if(+day >= diaInicio && +day <= diaFin){
//     console.log('ESTA ES LA SEMANA CORRECTA');
//     console.log(element);
//     semanaCorrecta = element;
//   }
// });


informacionChecador;
userChecador;

formatCurrentDate(){
    //^ Obtener Fecha Actual y darle formato  
        // let actualDate = Date()
        let actualDate = this.fecha1;
        let diaActual = this.fecha1.getDay();
        console.log(diaActual);

        var currentDate = moment(actualDate);
        var weekStart = currentDate.clone().startOf('week');
        var weekEnd = currentDate.clone().endOf('week');
     
        var days = [];
     
        for (let i = 0; i <= 6; i++) {  
           let diaMochado = moment(weekStart).add(i, 'days').format('MMMM,dddd,D').split(',')
           let fechaCompleta = moment(weekStart).add(i, 'days').format('YYYY-MM-DDTHH:mm')
            // console.log(fechaCompleta);
          //  console.log(diaMochado);

           let objetoFecha = {
            day: diaMochado,
            fecha: fechaCompleta,
            }
            days.push(objetoFecha);
     
        };

        // console.log(days);
        this.informacionChecador = [];
        days.forEach((element, i) => {
          let diaSpanish
          switch(i){
            case (0):
              diaSpanish = 'Domingo'
            break;
            case (1):
              diaSpanish = 'Lunes'
            break;
            case (2):
              diaSpanish = 'Martes'
            break;
            case (3):
              diaSpanish = 'Miercoles'
            break;
            case (4):
              diaSpanish = 'Jueves'
            break;
            case (5):
              diaSpanish = 'Viernes'
            break;
            case (6):
              diaSpanish = 'Sabado'
            break;
          }
          let objetoDia = {
                day: element.day[1],
                dia: diaSpanish,
                numeroDia: element.day[2],
                fechaCompleta: element.fecha,
                informacion:[]
                }
          this.informacionChecador.push(objetoDia);
        });


this.obtenerInformacionChecador();



}

  obtenerInformacionChecador() {
    try {

      let fechaInicialSemana: Date = new Date(this.informacionChecador[0].fechaCompleta);
      let fechaFinalSemana: Date = new Date(this.informacionChecador[6].fechaCompleta);
      let dia = fechaInicialSemana.getDate();
      let mes = fechaInicialSemana.getMonth() + 1;
      let anio = fechaInicialSemana.getFullYear();
      let fecha1 = anio + '-' + mes + '-' + dia
 
      let dia2 = fechaFinalSemana.getDate();
      let mes2 = fechaFinalSemana.getMonth() + 1;
      let anio2 = fechaFinalSemana.getFullYear();
      let fecha2 = anio2 + '-' + mes2 + '-' + dia2
    

      this.userChecador = [];
      this.usuarioservice.checadorFechasSemana(fecha1, fecha2).subscribe(dataUsuarios => {

        this.userChecador = dataUsuarios;
        // console.log('%c⧭', 'color: #735656', this.userChecador);


        this.userChecador.forEach((usuario, key) => {

          this.userChecador[key].checador = [];

          this.informacionChecador.forEach((informacion, q) => {

            this.userChecador[key].checador.push(informacion);

            let fechaInicial: Date = new Date(informacion.fechaCompleta);
            let dia = fechaInicial.getDate();
            let mes = fechaInicial.getMonth() + 1;
            let anio = fechaInicial.getFullYear();
            let fechaBegin = anio + '-' + mes + '-' + dia

            console.log(usuario.username)
            this.usuarioservice.checadorSemanaFechasUsuario(fechaBegin, fechaBegin, usuario.username).subscribe(data => {
              console.log('****************');
              console.log('%c⧭', 'color: #99adcc', data);
              // console.log(data);
              console.log('****************');

              this.userChecador[key].checador[q].informacion = data

          // if (data.length > 0) {
            
          //   this.userChecador[key].checador[q].informacion.push(data);
          //   console.log('%c⧭', 'color: #ffcc00', this.userChecador[key]);
          //   console.log('%c⧭', 'color: #408059', this.userChecador[key].checador[q]);
          //   // this.userChecador[key].checador.push( data );
          // }

                // this.listData = new MatTableDataSource(this.userChecador);
                // this.listData.sort = this.sort;    
                // this.listData.paginator = this.paginator;
                // this.listData.paginator._intl.itemsPerPageLabel = 'Checadas por Pagina';
                // this.applyFilter('');
              });
            });
            console.log(this.userChecador);
        });
      });
    } catch {
      console.log('Ocurrio un error');
    }
  }

//^ Metodo para extraer valores de un string (NO SE ESTA UTILIZANDO)
transform(value: any, args?: any): any {
  // console.log( value.split('', args));
}


  //^ ******************* FUNCIONES PARA OBTENER INFORMACION DE LA SEMANA ************************* // 

}
