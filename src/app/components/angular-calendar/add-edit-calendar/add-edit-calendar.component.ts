import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CalendarioService } from '../../../services/calendario/calendario.service';

@Component({
  selector: 'app-add-edit-calendar',
  templateUrl: './add-edit-calendar.component.html',
  styleUrls: ['./add-edit-calendar.component.css']
})
export class AddEditCalendarComponent implements OnInit {

  //variable para saber si se editara o agregara un evento
  accionEvento: string;
  //origen del calendario
  origenCalendario: string;

  constructor(public calendarService: CalendarioService,public dialogbox: MatDialogRef<AddEditCalendarComponent>,) { }

  ngOnInit() {
    this.origenCalendario = this.calendarService.origen;
    this.accionEvento = this.calendarService.accionEvento;
    console.log(this.origenCalendario);
    console.log(this.accionEvento);
  }

  onSubmit(form: NgForm){
    console.log(this.calendarService.formDataDetalleCalendario);
    // this.calendarService.addDetalleCalendario(this.calendarService.formDataDetalleCalendario).subscribe(res=>{
      // console.log(res);
    // })
    // form.resetForm();
  }

  actualizar(form: NgForm){
    this.calendarService.formDataDetalleCalendario.Draggable = 0;
    this.calendarService.formDataDetalleCalendario.ResizableBeforeStart = 0;
    this.calendarService.formDataDetalleCalendario.ResizableBeforeEnd = 0;
    this.calendarService.formDataDetalleCalendario.AllDay = 0
    this.calendarService.formDataDetalleCalendario.Start = new Date();
    this.calendarService.formDataDetalleCalendario.Endd = new Date();
    console.log(this.calendarService.formDataDetalleCalendario);
     switch (this.origenCalendario) {
      case ('Compras'):
        console.log('EDITANDO EVENTO COMPRAS');
        this.calendarService.editDetalleCalendario(this.calendarService.formDataDetalleCalendario).subscribe(res=>{
          console.log(res);
          this.onClose();
        })
        break;
      case ('Almacen'):
        break;
      default:
        break;
    }
  }
  agregar(form:NgForm){
    this.calendarService.formDataDetalleCalendario.Draggable = 0;
    this.calendarService.formDataDetalleCalendario.ResizableBeforeStart = 0;
    this.calendarService.formDataDetalleCalendario.ResizableBeforeEnd = 0;
    this.calendarService.formDataDetalleCalendario.AllDay = 0;
    this.calendarService.formDataDetalleCalendario.IdCalendario = this.calendarService.IdCalendario;
    console.log(this.calendarService.formDataDetalleCalendario);
     switch (this.origenCalendario) {
      case ('Compras'):
        console.log('AGREANDO EVENTO A COMPRAS');     
        this.calendarService.addDetalleCalendario(this.calendarService.formDataDetalleCalendario).subscribe(res=>{
          console.log(res);
          this.onClose();
        })
        break;
      case ('Almacen'):
        break;
      default:
        break;
    }
  }

  onClose(){
    switch (this.origenCalendario) {
    case ('Compras'):
      console.log('CARGANDO CALENDARIO COMPRAS');
      this.calendarService.filter('Compras');
      this.dialogbox.close();
      break;
    case ('Almacen'):
      console.log('CARGANDO CALENDARIO ALMACEN');
      this.calendarService.filter('Almacen');
      this.dialogbox.close();
      break;
    default:
      break;
  }
  }

}
