import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styles: []
})
export class DireccionComponent implements OnInit {

  leche;

  constructor(private router: Router, private storageService: StorageServiceService, private messageService: MessageService) { }

  ngOnInit() {

    

  }

  leche2(){
    this.messageService.leche().subscribe(data=>{
      console.log(data);
      this.leche = data.title;
    })
  }


  

}
