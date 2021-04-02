import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DireccionService } from '../../services/direccion/direccion.service';
import { PrecioLeche } from '../../Models/precioLeche-model';
import { DatePipe } from '@angular/common';
import { TipoCambioService } from '../../services/tipo-cambio.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leche-historial',
  templateUrl: './leche-historial.component.html',
  styleUrls: ['./leche-historial.component.css'],
})
export class LecheHistorialComponent implements OnInit {

  precioLeche:string;
  diaPrecio:string;
  ultimodiaPrecio:string;
  precioayer:string;
  varianteAyer:string;
  precioL;
  myDate: string;
  myDateD: string;
  diaPrecioD: string;
  TipoCambio: number;
  PrecioPesos: number;

  isVisible: boolean;
  isVisiblebtnHL: boolean;
  son11:any;
  diasemana:any;
  diacomparar:any;
  yaActualizado:boolean;

  fecha2;
  fechaSelec: any;
  fechaSelecd: any;
  fechaCaducidadhl: Date;


  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['FechaPrecio', 'PrecioLeche', 'VarianteDiaAnterior'];
  
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor( private DireccionService: DireccionService, private datePipe: DatePipe, private tcService: TipoCambioService) { 
    this.DireccionService.listen().subscribe((m: any) => {
      console.log(m);
      this.refreshTablaHistorico();
    });
  }
  
  ngOnInit() {
    //busca los valores en la pagina de historico
    this.refreshTablaHistorico();
    this.queDia();
    this.validacionMostrarBtn();
    this.isVisible=false;
    this.btnactualizar();
    
  }
  
  //se saca que dia de la semana es, se obtiene el numero de dia que es hoy y la fecha formateada para usarse mas adelante
  queDia(){
  // son las 11?
  this.son11 = new Date();
  // que dia de la semana es
  console.log(this.son11);
  this.diasemana =this.son11.getDay();
  this.diacomparar = this.datePipe.transform(this.son11, 'yyyy-MM-dd');
  this.son11 = this.datePipe.transform(this.son11, 'h:mm a');


  }
  // 
  btnactualizar(){
    this.DireccionService.GetHistorialLeche().subscribe(res => {

      this.diaPrecio = res[0].FechaPrecio
      this.diaPrecio = this.datePipe.transform(this.diaPrecio, 'yyyy-MM-dd');

      if (this.son11 >= '11:00 AM' || this.yaActualizado == false ) {
        if(this.diacomparar != this.diaPrecio){
          this.isVisiblebtnHL=true;
          console.log('si se muestra')
        }
        console.log('si entra pero es dia igual')
        this.isVisiblebtnHL=false;
      } else {
        this.isVisiblebtnHL=false;
        console.log('no se muestra')
      }
      
      console.log('que hora es?', this.son11);
      console.log('esta actualizado?', this.yaActualizado);
      console.log('Dia en DB', this.diaPrecio);
      console.log('dia de hoy', this.diacomparar);
    })
  }

  //revisa si el dia de hoy es igual al dia que esta ingresado en la tabla(el ultimo valor de la BD) y si es un dia diferente, muestra el boton de actualizar, 
  validacionMostrarBtn(){
    if (this.diacomparar != this.diaPrecio) {
      this.yaActualizado = false;
    }else{
      this.yaActualizado = true;
    }


  }
  
  refreshTablaHistorico(){
    //desplegar todas los registros para llenar tabla
    this.DireccionService.GetHistorialLeche().subscribe(res => {
    console.log(res);
    this.precioLeche = res[0].PrecioLeche;
    this.diaPrecio = res[0].FechaPrecio;
    this.ultimodiaPrecio = res[0].FechaPrecio;
    this.varianteAyer = res[0].VarianteDiaAnterior;
    this.diaPrecioD = this.datePipe.transform(this.diaPrecio, 'EEEE');
    this.diaPrecio = this.datePipe.transform(this.diaPrecio, 'yyyy-MM-dd');

    this.listData = new MatTableDataSource(res);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';
    
    

    console.log(this.diaPrecio,'dia prueba');
    
  })
  
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  
  tomarValores(){
    //traer el valor de la leche al dia de hoy
    this.DireccionService.readHistorico().subscribe(resP => {
      if(this.diasemana >= 5){
        resP = resP.title;
        resP = resP.split(' A')
        resP = resP[0];
        resP = resP.split('$')
        resP = resP[1];
        console.log(resP);
      }else{
        resP = resP.title;
        resP = resP.split('$')
        resP = resP[1];

      }


      
    
//obtener la fecha de hoy, para desplegar en la tabla ya sea como dia en letras o la fecha yyyy/MM/dd
let fechavarianza
    this.myDate= (new Date()).toString();
    this.myDateD= (new Date()).toString();
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.myDateD = this.datePipe.transform(this.myDate, 'EEEE');
    console.log(this.myDate);
    console.log(this.myDateD);

      
    let fechahoy = new Date();
    let fechaayer = new Date();
    let fechaantier = new Date();
    fechaayer.setDate(fechahoy.getDate() - 1)
    // dado que no se trabaja en domingo, en caso de ser lunes, no tomara la fecha del dia anterior, si no que tomara la del dia sabado que a su vez, es la del dia viernes
    fechaantier.setDate(fechahoy.getDate() - 2)


    let fechaHoyD = this.datePipe.transform(fechahoy, 'EEEE');
    let fechaayerD = this.datePipe.transform(fechaayer, 'EEEE');
    let fechaayerF = this.datePipe.transform(fechaayer, 'yyyy-MM-dd');
    let fechaantierF = this.datePipe.transform(fechaantier, 'yyyy-MM-dd');
    // console.log(fechaayerD);
    console.log(fechaayerF);

    if (fechaHoyD  == 'Monday') {
      console.log('hello monday');
      fechavarianza = fechaantierF;
      
    } else {
      console.log('no monday');
      fechavarianza = fechaayerF
    }

console.log(fechavarianza);
    this.DireccionService.GetHistorialLecheFecha(fechavarianza).subscribe(data =>{
     

      this.precioayer = data[0].PrecioLeche;
 
      let VarianteDiaAnterior = ((+this.precioayer) - (+resP)).toString();
      console.log(VarianteDiaAnterior);

      let hl = new PrecioLeche();
      
      hl.FechaPrecio = this.myDate;
      hl.PrecioLeche = resP;
      hl.VarianteDiaAnterior = VarianteDiaAnterior;
      console.log(hl);
      
    this.DireccionService.addHistoricoLeche(hl).subscribe(res => {
      console.log(res);
    })
  })

      })
      this.refreshTablaHistorico()
  }


displayTableHL(){

  if (this.isVisible == true) {
    this.isVisible=false;
  } else {
    this.isVisible=true;
  }
  

}

btnActualizarHL(){

  

    this.tomarValores();
    
    this.yaActualizado = true;

}

changeMat(evento) {
  this.fechaSelec = new Date();
  this.fechaSelec = evento.target.value;
  this.fechaSelec = this.datePipe.transform(this.fechaSelec, 'yyyy-MM-dd');
  this.fechaSelecd = this.datePipe.transform(this.fechaSelec, 'EEEE');

  console.log(this.fechaSelec);
  console.log(this.fechaSelecd);

  if (this.fechaSelecd == 'Sunday') {
    Swal.fire({
      icon: 'error',
      // showCancelButton: false,
      // showConfirmButton: false,
      // timer: 1200,
      title: 'Seleccionar otro dia',
      text: 'No se genera registro en Domingo'
    }).then((result) => {
      this.precioLeche = null;
      this.fechaCaducidadhl = null;
      this.varianteAyer = null;
      this.diaPrecio = this.fechaSelec;
      this.diaPrecioD = this.fechaSelecd;
      return

    })
  } else {

    if ( this.fechaSelec > this.ultimodiaPrecio && this.son11 <= '11:00 AM') {
      if (this.diacomparar == this.fechaSelec && this.son11 <= '11:00 AM') {
        Swal.fire({
          icon: 'error',
          // showCancelButton: false,
          // showConfirmButton: false,
          // timer: 1200,
          title: 'Aun no se ha generado el registro',
          text: 'Espere a las 11:00 AM'
        }).then((result) => {
          this.precioLeche = null;
          this.fechaCaducidadhl = null;
          this.varianteAyer = null;
          this.diaPrecio = this.fechaSelec;
          this.diaPrecioD = this.fechaSelecd;
          return
          
        })
        
      } 
      if ( this.fechaSelec > this.ultimodiaPrecio)  {
        
        Swal.fire({
          icon: 'error',
          // showCancelButton: false,
          // showConfirmButton: false,
          // timer: 1200,
          title: 'Error',
          text: 'No se ha generado registro para este dia'
        }).then((result) => {
          this.precioLeche = null;
          this.fechaCaducidadhl = null;
          this.varianteAyer = null;
          this.diaPrecio = this.fechaSelec;
          this.diaPrecioD = this.fechaSelecd;
          return
          
        })
      }
        
    } else {
      this.DireccionService.GetHistorialLecheFecha(this.fechaSelec).subscribe(data =>{
        this.diaPrecioD = this.datePipe.transform(data[0].FechaPrecio, 'EEEE');
        console.log(data);
        this.diaPrecio = data[0].FechaPrecio;
        this.precioLeche = data[0].PrecioLeche;
        this.varianteAyer = data[0].VarianteDiaAnterior;
        
      })
      
    }
    
    
  }
}
}




// en caso de necesitarse en dolares  
// this.tcService.getTc().subscribe(ress =>{
//   console.log(ress);
//   console.log(resP);
//   //la respuesta desde la pagina de historico leche viene con un "$" 
//   // entonces no se puede transformar a numero,dividimos el $ de los numeros, y agarramos el valor
//   resP = resP.split('$')
//   resP = resP[1];
//   this.TipoCambio = ress;
//   console.log(this.TipoCambio);
//   this.PrecioPesos = (+this.TipoCambio) * (+resP);

//   console.log(+this.PrecioPesos);
// })