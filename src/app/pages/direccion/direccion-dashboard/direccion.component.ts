import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { MessageService } from '../../../services/message.service';
import { SwPush } from '@angular/service-worker'
import { NotificacionespushService } from '../../../services/shared/notificacionespush.service';

const VAPID_PUBLIC =
  'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg'


@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styles: []
})
export class DireccionComponent implements OnInit {

  leche;

  constructor(private router: Router, private storageService: StorageServiceService, private messageService: MessageService, public swPush: SwPush, public pushService: NotificacionespushService) {
    if (swPush.isEnabled) {
      swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC,
        })
        .then(subscription => {
          // send subscription to the server
          pushService.sendSubscriptionToTheServer(subscription).subscribe()
        })
        .catch(console.error)
    }
   }

  ngOnInit() {

    

  }

  leche2(){
    this.messageService.leche().subscribe(data=>{
      console.log(data);
      this.leche = data.title;
    })
  }

  notpush(){
    const formData = new FormData();

    formData.append('titulo', 'Compras')
    formData.append('mensaje', 'Se realizo una Compra con folio 23')

   this.pushService.enviarNotificacion(formData).subscribe(data=>{
     console.log('1');
   });

  }

  preguntarnot(){
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC,
        })
        .then(subscription => {
          // send subscription to the server
          this.pushService.sendSubscriptionToTheServer(subscription).subscribe()
        })
        .catch(console.error)
    }
  }
  


  

}
