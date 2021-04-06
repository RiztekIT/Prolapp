import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from 'src/app/services/shared/storage-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  constructor(public storageService: StorageServiceService) { }

  ngOnInit() {
  }

}
