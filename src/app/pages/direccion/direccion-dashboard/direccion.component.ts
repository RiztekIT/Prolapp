import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { MessageService } from '../../../services/message.service';
import { SwPush } from '@angular/service-worker'

const VAPID_PUBLIC =
  'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg'


@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styles: []
})
export class DireccionComponent implements OnInit {

  leche;

  constructor(private router: Router, private storageService: StorageServiceService, private messageService: MessageService, swPush: SwPush) {
    if (swPush.isEnabled) {
      swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC,
        })
        .then(subscription => {
          // send subscription to the server
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

    this.messageService.notpush().subscribe(data=>{
      console.log('entro')
    })

  }


  

}
