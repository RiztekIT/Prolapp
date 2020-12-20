import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  user:any;
  IdUser:number

  constructor(private notificacionService:NotificacionesService,
    public storageService: StorageServiceService,
    ) {  }

  ngOnInit() {
    this.ObtenerUsuario()
  }
  
  
  ObtenerUsuario(){
    let u = JSON.parse(localStorage.getItem('ProlappSession'));
    // console.log(JSON.parse(localStorage.getItem('ProlappSession')));
    // console.log(u);
    
    this.user = u.user;
    
    this.storageService.getUserAuth(this.user).subscribe(usuario=>{
      localStorage.setItem('userAuth',JSON.stringify(usuario[0]))
      this.storageService.currentUser = usuario[0];
      // console.log(this.storageService.currentUser);
      // console.log(this.storageService.currentUser.IdUsuario);
      this.IdUser = this.storageService.currentUser.IdUsuario;
      // console.log('%c%s', 'color: #ff0000', this.IdUser);
      this.ObtenerMensajes()
    })
}


historialMsj:boolean = false;
MensajesAside:any = []

ObtenerMensajes(){
  console.clear();
this.notificacionService.GetNotificacionJNDetalleNotificacionIdUsuario(this.IdUser).subscribe(resMsj =>{
  console.log('%c⧭', 'color: #bfffc8', resMsj);
  
  // ! FILTRAR RESULTADO PARA NO REPETIR DATOS
  let MensajesAsideArr = resMsj.reduce((Arrusuario, current) => {
    if(!Arrusuario.some(item => item.Usuario === current.Usuario)) {
      Arrusuario.push(current);
    }
    return Arrusuario;
  },[]);
  console.log(MensajesAsideArr)

  MensajesAsideArr.forEach(element =>{

    this.MensajesAside.push(element)
    
  })


})
}

SelectedMsj(row,i){

  // console.log('%c⧭', 'color: #408059', row);
  // console.log('%c%s', 'color: #99adcc', i);
  this.historialMsj = true;
  
  this.notificacionService.mensajesData = row;
  // console.log('%c⧭', 'color: #ace2e6', this.notificacionService.mensajesData);

  
  this.notificacionService.filter('Register click');
}












}
