import { Component, OnInit } from '@angular/core';
import { ForwardsService } from '../../../../services/cxp/forwards/forwards.service';
import { MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    //'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-addfordward',
  templateUrl: './addfordward.component.html',
  styleUrls: ['./addfordward.component.css']
})
export class AddfordwardComponent implements OnInit {

  defaultData;
  onadd;
  edited;
  IdForward: number;

  constructor(public dialogbox: MatDialogRef<AddfordwardComponent>, private http: HttpClient, private datePipe: DatePipe, public ForwardsService: ForwardsService,) { }
  

  ngOnInit() {
    this.edited = false;
   this.onadd = this.ForwardsService.onadd
  //  this.tipoDeCambio();
   
    this.defaultData = this.ForwardsService.formDataForwards
   
    console.log(this.onadd);
    console.log(this.defaultData);
    this.getUltimaForward();
    console.log(this.IdForward  +'!!!!!!!!!!!!!!!!!!!!!!');
  }


  onEdit(form: NgForm) {
    this.edited = true;
      this.ForwardsService.OnEditForward(this.ForwardsService.formDataForwards).subscribe(res =>{
      console.log(res);
      this.ForwardsService.filter('Register click');
    })

    this.onClose() 

  }


  getUltimaForward(){
    this.ForwardsService.getUltimoForward().subscribe(res => {
      console.log(res[0]);
      this.IdForward = res[0].IdForward;
      console.log(this.IdForward);
    })
  }

  onClose() {
      this.dialogbox.close();
      this.delete();
      this.onadd = false;
      
    }

    delete(){
      if(this.edited == false && this.onadd == true){
        this.ForwardsService.deleteForward(this.IdForward).subscribe(data =>{
console.log(data);
        })

      }
    }

  changeMat(evento) {
    this.ForwardsService.formDataForwards.FechaCierre = new Date(evento.target.value);
    console.log(evento.target.value);
  }

  changeMat1(evento) {
    this.ForwardsService.formDataForwards.FechaPago = new Date(evento.target.value);

    console.log(evento.target.value);
  }

  onChangeTipoCambio(TipoCambio: any) {
    console.log(TipoCambio);
    let elemHTML: any = document.getElementsByName('TipoCambio')[0];
    elemHTML.value = this.ForwardsService.formDataForwards.TipoCambio;
    this.calcularCantidad();
  }

  onChangeCantidadMXN(CantidadDlls: any) {
    console.log(CantidadDlls);
    let elemHTML: any = document.getElementsByName('CantidadDlls')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    elemHTML.value = +this.ForwardsService.formDataForwards.CantidadDlls;
    this.calcularCantidad();
  }

  calcularCantidad(){
    this.ForwardsService.formDataForwards.CantidadMXN = (+this.ForwardsService.formDataForwards.CantidadDlls * +this.ForwardsService.formDataForwards.TipoCambio).toString()
  }

  onChangeGarantia(Garantia: any) {
    console.log(Garantia);
    let elemHTML: any = document.getElementsByName('Garantia')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    elemHTML.value = +this.ForwardsService.formDataForwards.Garantia;
    this.calcularCantidadPendiente();
  }

  onChangeGarantiaPagada(GarantiaPagada: any) {
    console.log(GarantiaPagada);
    let elemHTML: any = document.getElementsByName('GarantiaPagada')[0];
    // //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
    elemHTML.value = +this.ForwardsService.formDataForwards.GarantiaPagada;
    this.calcularCantidadPendiente();
  }

  calcularCantidadPendiente(){
    this.ForwardsService.formDataForwards.CantidadPendiente = (+this.ForwardsService.formDataForwards.Garantia - +this.ForwardsService.formDataForwards.GarantiaPagada).toString()
  }








  // rootURL = "/SieAPIRest/service/v1/series/SF63528/datos/"
  // Cdolar: String;
  //TipoCambio
  // TipoCambio: any;

  // tipoDeCambio() {
  //   let hora = new Date().getHours();
  //   let fechahoy = new Date();
  //   let fechaayer = new Date();


  //   fechaayer.setDate(fechahoy.getDate() - 1)
  //   let diaayer = new Date(fechaayer).getDate();
  //   let mesayer = new Date(fechaayer).getMonth();
  //   let añoayer = new Date(fechaayer).getFullYear();
  //   let diasemana = new Date(fechahoy).getDay();

  //   let i;
  //   if (hora > 11) {
  //     i = 2;
  //   } else {
  //     i = 1;
  //   }
  //   this.traerApi().subscribe(data => {
  //     let l;

  //     l = data.bmx.series[0].datos.length;
  //     // console.log(i);
  //     // console.log(l);
  //     // console.log(data.bmx.series[0].datos.length);
  //     // console.log(data.bmx.series[0].datos[l-i].dato);


  //     this.Cdolar = data.bmx.series[0].datos[l - i].dato;
  //     console.log('------CAMBIO------');
  //     console.log(this.Cdolar);
  //     this.TipoCambio = this.Cdolar;
  //     console.log('------CAMBIO------');
  //     if (this.onadd == true) {
  //       this.ForwardsService.formDataForwards.TipoCambio = this.Cdolar.toString();
  //       console.log('this.ForwardsService.formDataForwards.TipoCambio: ', this.ForwardsService.formDataForwards.TipoCambio);
    
  //     }
  //   })

  // }

  // traerApi(): Observable<any> {

  //   return this.http.get("/SieAPIRest/service/v1/series/SF63528/datos/", httpOptions)

  // }


}

