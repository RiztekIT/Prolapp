import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../../services/shared/storage-service.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  user

  constructor(public storageService: StorageServiceService) { }

  ngOnInit() {
    this.storageService.getUserAuth(this.storageService.getCurrentSession().user).subscribe(user=>{
      console.log(user);
      this.user = user;
    })
    
  }

}
