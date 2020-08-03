import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CalendarioService } from '../../../services/calendario/calendario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css']
})
export class EventCalendarComponent implements OnInit {

  constructor(public calendarService: CalendarioService,public dialogbox: MatDialogRef<EventCalendarComponent>,public router: Router,) { }

  ngOnInit() {
    this.procedencia = this.calendarService.origen;
    console.log(this.procedencia);
    console.log(this.calendarService.eventoInfo);
  }

  procedencia: string;

  
  onClose(){
      this.dialogbox.close();
  }

  accederEvento(){

    switch (this.procedencia) {
      case ('Compras'):
        console.log('ACCEDIENDO A COMPRAS');
    
        localStorage.setItem('IdCompra', this.calendarService.formDataCompras.IdCompra.toString())
        this.onClose();
        this.router.navigate(['/formatoCompras']);
        break;
      case ('Almacen'):
        console.log('ACCEDIENDO A ALMACEN');
        break;
      default:
        break;
    }

}


}
