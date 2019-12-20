import { Component, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';

@Component({
  selector: 'app-direccion',
  templateUrl: './direccion.component.html',
  styles: []
})
export class DireccionComponent implements OnInit {

  constructor(private router: Router, private storageService: StorageServiceService) { }

  ngOnInit() {
  }


  

}
