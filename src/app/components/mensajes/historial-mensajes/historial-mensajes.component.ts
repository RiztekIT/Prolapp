import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-historial-mensajes',
  templateUrl: './historial-mensajes.component.html',
  styleUrls: ['./historial-mensajes.component.css']
})
export class HistorialMensajesComponent implements OnInit {
  dataMensajes: any;
  idDestino: number;
  idOrigen: number;
  user: string;
  tipo:boolean;
  ChatActivo:string;

  constructor(private notificacionesService: NotificacionesService) {

    this.notificacionesService.listen().subscribe((m: any) => {
      console.log(m);
      this.ngOnInit();
    });
  }

  MensajesEntrantes: any = []
  MensajesSalientes: any = []
  MensajesGeneral: any = []
  sortedMsj = []

  ngOnInit() {
    this.asignarValores()
    
  }
  
  asignarValores() {
    let u = JSON.parse(localStorage.getItem('ProlappSession'));
    this.user = u.user;
    
    this.dataMensajes = this.notificacionesService.mensajesData;
    this.idOrigen = this.dataMensajes.IdUsuario
    this.idDestino = this.dataMensajes.IdUsuarioDestino
    this.ChatActivo = this.dataMensajes.Usuario
    this.getMensajes()
  }

  getMensajes(){
    // ! OBTENER MENSAJES ENTRANTES
    this.MensajesEntrantes = []
    this.MensajesSalientes = []
    this.notificacionesService.GetMensajesLogIdDestinoIdUsuario(this.idDestino,this.idOrigen).subscribe(MsjEntrantes =>{
      
      console.log('%c⧭', 'color: #00ff88', MsjEntrantes);
      
      MsjEntrantes.forEach(element => {
        this.MensajesGeneral.push(element)
      })
      // console.log('%c⧭', 'color: #ffee00', this.MensajesGeneral);
      
      //  ! OBTENER MENSAJES SALIENTES
      this.notificacionesService.GetMensajesLogIdDestinoIdUsuario(this.idOrigen,this.idDestino).subscribe(MsjSalientes =>{
        
        console.log('%c⧭', 'color: #00ff88', MsjSalientes);
        
        MsjSalientes.forEach(res => {
          this.MensajesGeneral.push(res)
        })
        // console.log('%c⧭', 'color: #ffee00', this.MensajesGeneral);
        this.SortbyDate()
      })
    })
    
    this.MensajesGeneral = []
    
  }
  
  
  
  SortbyDate(){
    // !ACOMODAR POR FECHA EL ARREGLO QUE SE USARA EN EL HTML
    this.MensajesGeneral.forEach(mj => {
      mj.FechaEnvio = new Date(mj.FechaEnvio)
      console.clear();
      console.log('%c%s', 'color: #f200e2', mj.Usuario);
      console.log('%c%s', 'color: #00b300', this.user);
    });
    this.sortedMsj = this.MensajesGeneral.sort((a, b) => b.FechaEnvio - a.FechaEnvio)
  }




}
