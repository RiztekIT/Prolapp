import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const SERVER_URL = 'https://riztekserver.ddns.net:3000/subscription'
const SERVER_URL2 = 'https://riztekserver.ddns.net:3000/sendNotification'


@Injectable({
  providedIn: 'root'
})
export class NotificacionespushService {


  constructor(private http: HttpClient) {
    
   }

   public sendSubscriptionToTheServer(subscription: PushSubscription) {
    return this.http.post(SERVER_URL, subscription)
  }
   public enviarNotificacion(noti) {
    return this.http.post(SERVER_URL2, noti)
  }


}
